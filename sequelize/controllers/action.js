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
  async load(sid, complaintId) {
    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      let roles = await core.checkRoles(sessions[0].user_id, [6]).catch(e => { throw (e) })
      let actions = await models.complaint_actions.findAll(
        {
          attributes: [
            'idx_t_complaint_action',
            'date',
            'description',
            'action_name',
            'is_close',
            [Sequelize.literal(`case when is_close=true then 'Telah ditutup' else '' end`), 'status_name']
          ],
          where: { record_status: 'A', idx_m_complaint: complaintId }
        }
      )

      let closed = await models.complaint_actions.count(
        { where: 
          { 
            is_close: true,
            idx_m_complaint: complaintId,
            record_status: 'A'
          } 
        }
      );

      return {
        is_insert: roles.filter(a => a.is_read && a.idx_m_form == 6).length > 0 && closed == 0 ? true : false,
        items: actions
      }
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
        return response.failed('Session expires')

      await models.complaint_actions.create(obj, { transaction: t, });

      await models.clogs.create({
        idx_m_complaint: obj['idx_m_complaint'],
        action: 'I',
        flow: '5',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });
      await t.commit()
      return response.success()
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  }
}