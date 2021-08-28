const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   * @returns 
   */
  async get(sid, complaintId = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let m = await models.surgery.findOne({
        attributes: ['idx_t_surgery', 'notes', 'pengampu_kumm', 'result'],
        where: { idx_m_complaint: complaintId, record_status: 'A' }
      })

      if (m instanceof models.surgery) {
        let u = await models.surgery_user.findAll({
          attributes: [
            'idx_t_surgery_user',
            [Sequelize.literal(`idx_t_surgery`), 'idx_t_surgery'],
          ],
          include: [
            {
              required: false,
              attributes: [
                'idx_m_user',
                [Sequelize.literal(`concat('(',email,') ',fullname)`), 'fullname']
              ],
              model: models.users
            }
          ],
          where: { idx_t_surgery: m.getDataValue('idx_t_surgery') }
        })

        m.setDataValue('surgery_users', u)
      }

      return {
        item: m
      }
    } catch (error) {
      console.log(error)
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
        return response.failed('Session expires')

      console.log('obj', obj);
      if (!obj.surgery['result']) return response.failed('Silakan pilih Apakah akan dilanjutkan ke Tahapan Pleno atau Belum dilanjutkan')

      let form_status = 0;
      let res = obj.surgery['result']
      if (res) form_status = res == 2 ? 1 : 0;

      obj.surgery['ucreate'] = sessions[0].user_id;
      obj.surgery['form_status'] = form_status
      let v = await models.surgery.create(obj.surgery, { transaction: t, });

      if (v instanceof models.surgery) {
        let users = obj.users;
        users.map(e => {
          e.ucreate = sessions[0].user_id;
          e.idx_t_surgery = v.getDataValue('idx_t_surgery');
        })

        await models.surgery_user.bulkCreate(users, { transaction: t })
        // jika 2 = to Rapat Pleno, jika 0 = Tetap di bedah aduan
        // cek additional.surgeryAdditional().results
        if (res == 2)
          await models.complaints.update({ idx_m_status: 14 },
            { transaction: t, where: { idx_m_complaint: obj.surgery['idx_m_complaint'] } }
          )
      }

      await t.commit()
      return response.success('LHPA berhasil disimpan')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async update(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      if (!obj.surgery['result']) return response.failed('Silakan pilih Apakah akan dilanjutkan ke Tahapan Pleno atau Belum dilanjutkan')
      if (!obj.users || obj.users.length == 0) return response.failed('Silakan pilih Tim Pemeriksa')
      if (!obj.surgery['pengampu_kumm']) return response.failed('Silakan pilih Pengampu Keasistenan Manajemen Mutu')

      console.log('obj', obj);
      let id = obj.surgery['idx_t_surgery']
      let form_status = 0;
      let res = obj.surgery['result']
      if (res) form_status = res == 2 ? 1 : 0;

      obj.surgery['ucreate'] = sessions[0].user_id;
      obj.surgery['form_status'] = form_status

      await models.surgery.update(obj.surgery, {
        transaction: t,
        where: { idx_t_surgery: id }
      })

      let users = obj.users;
      users.map(e => {
        e.ucreate = sessions[0].user_id;
        e.idx_t_surgery = id;
      })

      // remove last users
      await models.surgery_user.destroy({ transaction: t, where: { idx_t_surgery: id } })
      await models.surgery_user.bulkCreate(users, { transaction: t })
      // jika 2 = to Rapat Pleno, jika 0 = Tetap di bedah aduan
      // cek additional.surgeryAdditional().results
      if (res == 2)
        await models.complaints.update({ idx_m_status: 14 },
          { transaction: t, where: { idx_m_complaint: obj.surgery['idx_m_complaint'] } }
        )

      await t.commit()
      return response.success('Bedah Aduan berhasil disimpan')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  }
}