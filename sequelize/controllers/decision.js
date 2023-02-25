const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const { helper } = require('../../helper')
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const { API_URL } = require('../../config')

module.exports = {

  /**
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   * @returns 
   */
  async get(sid, complaintId) {
    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return null

      let v = await models.complaint_decisions.findOne(
        {
          attributes: [
            'idx_t_complaint_decision', 'idx_m_violation',
            'notes', 'approved_by', 'approved_date',
            [Sequelize.literal(`case when approved_by is not null then true else false end`), 'is_approve']
          ],
          include: [
            {
              attributes: ['idx_m_disposition', 'name'],
              required: false,
              model: models.dispositions
            },
            {
              attributes: ['idx_m_violation', 'name'],
              required: false,
              model: models.violations
            },
            {
              required: false,
              attributes: [
                'idx_t_decision_attachment',
                'description',
                'filename',
                'path',
                'mime_type',
                'filesize',
                [Sequelize.literal(`concat('${API_URL}/others/open/',filename)`), 'url']
              ],
              model: models.complaint_decision_attachments
            },
          ],
          where: { record_status: 'A', idx_m_complaint: complaintId }
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
   * @param {*} is_submit 
   * @returns 
   */
  async save(obj = {}, is_submit = false) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(obj.sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired')

      obj.complaint['form_status'] = is_submit ? 1 : 0
      obj.complaint['ucreate'] = sessions[0].user_id

      let v = await models.complaint_decisions.create(obj.complaint, { transaction: t, })
      if (v instanceof models.complaint_decisions) {
        await models.complaints.update(
          { idx_m_status: is_submit ? 5 : 4 },
          {
            transaction: t,
            where: { idx_m_complaint: v.getDataValue('idx_m_complaint') }
          }
        )

        // LOGS ============ get status
        await models.clogs.create({
          idx_m_complaint: v.getDataValue('idx_m_complaint'),
          action: 'I',  //insert
          flow: '4',    //pengaduan
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id
        }, { transaction: t, });
      }

      await t.commit()
      return response.success('Pengampu WBS berhasil disimpan')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @param {*} is_submit 
   * @returns 
   */
  async update(sid, obj = {}, is_submit = false) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Your session has been expired, please relogin')

      obj.complaint['form_status'] = is_submit ? 1 : 0
      obj.complaint['umodified'] = sessions[0].user_id
      obj.complaint['dmodified'] = new Date()

      await models.complaint_decisions.update(obj.complaint, {
        transaction: t,
        where: {
          idx_t_complaint_decision: obj.complaint['idx_t_complaint_decision']
        }
      })

      if (is_submit) {
        await models.complaints.update(
          { idx_m_status: 5 },
          {
            transaction: t,
            where: { idx_m_complaint: obj.complaint['idx_m_complaint'] }
          }
        )
      }

      // LOGS ============ get status
      await models.clogs.create({
        idx_m_complaint: obj.complaint['idx_m_complaint'],
        action: 'U',  //insert
        flow: '4',    //pengaduan
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success(`Edit data pengampu wbs berhasil ${is_submit ? 'di submit' : 'di simpan'}.`)
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async approve(sid, obj) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Your session has been expired, please relogin')

      obj.attachment.map(e => e['ucreate'] = sessions[0].user_id);
      let dc = await models.complaint_decisions.findOne({
        attributes: ['idx_t_complaint_decision'],
        where: { idx_m_complaint: obj.approval['idx_m_complaint'] }
      }).catch(e => { throw(e) })

      if (dc instanceof models.complaint_decisions) {
        let attchment = obj.attachment.map(e => {
          return {
            idx_t_complaint_decision: dc.getDataValue('idx_t_complaint_decision'),
            filename: e.filename,
            path: this.path,
            mime_type: e.mime_type,
            filesize: e.filesize,
          };
        })

        await models.complaint_decision_attachments.bulkCreate(attchment, { transaction: t, })
          .catch(e => { throw(e) })
        await models.complaint_decisions.update(
          {
            approved_by: sessions[0].e_name,
            approved_date: new Date()
          },
          {
            where: {
              idx_t_complaint_decision: dc.getDataValue('idx_t_complaint_decision'),
              form_status: 1
            }
          }
        ).catch(e => { throw(e) });

        /// destroy last determination id belongs to compalint
        await models.complaint_determinations.destroy({
          transaction: t,
          where: {idx_m_complaint: obj.approval['idx_m_complaint']}
        }).catch(e => { throw(e) })

        /// update complaints forms
        await models.complaints.update(
          { idx_m_status: 6 },
          {
            transaction: t,
            where: { idx_m_complaint: obj.approval['idx_m_complaint'] }
          }
        ).catch(e => { throw(e) });
      }

      // ===============> LOGS
      await models.clogs.create({
        idx_m_complaint: obj.approval['idx_m_complaint'],
        action: 'I',
        flow: '6',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: 'telaah meng-upload Surat Tugas pengaduan'
      }, { transaction: t, })
      .catch(e => { throw(e) });

      await t.commit();
      return response.success('Penyetujuan telah dilakukan')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  }
}