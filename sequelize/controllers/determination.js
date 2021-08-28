const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
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

      let determination_by;
      let v = await models.complaint_determinations.findOne(
        {
          attributes: [
            'idx_t_complaint_determination',
            'date', 'notes', 'determination_by',
            'st_number'
          ],
          include: [
            {
              attributes: [
                'idx_t_determination_user',
                'idx_t_complaint_determination',

              ],
              required: false,
              model: models.complaint_determination_users,
              include: [
                {
                  required: false,
                  attributes: [
                    'idx_m_user',
                    'email',
                    'fullname'
                  ],
                  model: models.users,
                }
              ],
              where: { record_status: 'A' }
            }
          ],
          where: { record_status: 'A', idx_m_complaint: complaintId }
        }
      );

      // attachment
      let d = await models.complaint_decisions.findOne(
        {
          attributes: [
            'idx_t_complaint_decision',
            'notes', 'approved_by', 'approved_date',
            [Sequelize.literal(`case when approved_by is not null then true else false end`), 'is_approve']
          ],
          include: [
            {
              attributes: [
                'idx_t_complaint_decision',
                'idx_t_decision_attachment',
                'description',
                'filename',
                'path',
                'mime_type',
                'filesize',
                [Sequelize.literal(`concat('${API_URL}/others/open/',filename)`), 'url']
              ],
              model: models.complaint_decision_attachments
            }
          ],
          where: { record_status: 'A', idx_m_complaint: complaintId }
        }
      )

      if (v instanceof models.complaint_determinations) {
        determination_by = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: v.getDataValue('determination_by') } })

        v['determination_by'] = determination_by instanceof models.users ? determination_by.getDataValue('name') : null
      }

      return {
        item: v,
        item2: d
      };
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
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Your session has been expired, please relogin')

      obj.determination['ucreate'] = sessions[0].user_id;
      // obj.determination['determination_by'] = sessions[0].e_name;
      obj.users['ucreate'] = sessions[0].user_id;

      if (obj.users.length == 0)
        return response.failed('Daftar Tim TIDAK boleh kosong.')

      let v = await models.complaint_determinations.create(obj.determination)
      if (v instanceof models.complaint_determinations) {
        let users = obj.users.map(e => {
          return {
            idx_m_user: e,
            idx_t_complaint_determination: v.getDataValue('idx_t_complaint_determination'),
            ucreate: sessions[0].user_id
          }
        })
        await models.complaint_determination_users.bulkCreate(users)
        await models.clogs.create({
          idx_m_complaint: obj.determination['idx_m_complaint'],
          action: 'I',
          flow: '6',
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id
        }, { transaction: t, });
      }

      await t.commit()
      return response.success('Form penetapan berhasil disimpan')
    } catch (error) {
      console.log(error)
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
  async update(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Your session has been expired, please relogin')

      obj.determination['umodified'] = sessions[0].user_id;
      await models.complaint_determinations.update(
        obj.determination,
        {
          transaction: t,
          where: { idx_t_complaint_determination: obj.determination['idx_t_complaint_determination'] }
        }
      );

      await models.complaint_determination_users.destroy(
        {
          transaction: t, where: { idx_t_complaint_determination: obj.determination['idx_t_complaint_determination'] }
        }
      )

      let users = obj.users.map(e => {
        return {
          idx_m_user: e,
          idx_t_complaint_determination: obj.determination['idx_t_complaint_determination'],
          ucreate: sessions[0].user_id
        }
      })
      await models.complaint_determination_users.bulkCreate(users, { transaction: t, })
      await models.clogs.create({
        idx_m_complaint: obj.determination['idx_m_complaint'],
        action: 'U',
        flow: '6',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Form penetapan berhasil di ubah')
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw (error)
    }
  },

}