const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core')
const sequelize = require('..');
const { response } = require('../../models/index')

module.exports = {

  /**
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   */
  async get(sid, complaintId) {
    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return null

      let v = await models.complaint_verifications.findOne(
        {
          attributes: [
            'idx_t_complaint_verification',
            'verification_type', 'verification_by', 'verification_date',
            [Sequelize.literal(`case when verification_type='1' then 'DITERIMA' else 'DITOLAK' end`), 'verification_status'],
            [Sequelize.literal(`case when verification_type='1' then 'green' else 'red' end`), 'verification_color'],
            [Sequelize.literal(`case when verification_type='1' then true else false end`), 'is_approve'],
            'remarks',
          ],
          include: [
            {
              attributes: [
                'idx_m_complaint_rejected_type',
                'name'
              ],
              model: models.complaint_rejected_types,
            }
          ],
          where: {
            record_status: 'A', idx_m_complaint: complaintId
          }
        }
      )

      return v
    } catch (error) {
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async save(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin')

      if (obj['verification_type'] == null)
        return response.failed('Silakan pilih verifikasi pengaduan')

      if (!obj['idx_m_complaint_rejected_type'] && obj['verification_type'] == 0)
        return response.failed('Alasan ditolak pengaduan TIDAK boleh kosong')

      obj['ucreate'] = sessions[0].user_id
      obj['verification_by'] = sessions[0].e_name
      obj['verification_date'] = new Date()

      await models.complaint_verifications.create(obj, { transaction: t, })
      await models.complaints.update(
        { idx_m_status: obj['verification_type'] == 0 ? 2 : 3 },
        {
          transaction: t,
          where: { idx_m_complaint: obj['idx_m_complaint'] }
        }
      )

      // LOGS ================
      await models.clogs.create({
        idx_m_complaint: obj['idx_m_complaint'],
        action: 'V',
        flow: '2',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: 'telah mem-verifikasi pengaduan'
      }, { transaction: t, });

      await t.commit()
      return response.success(`Laporan pengaduan berhasil ${obj['verification_type'] == 1 ? 'diterima' : 'ditolak'}`)
    } catch (error) {

      await t.rollback()
      throw (error)
    }
  }

}