const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const form_id = 205

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async load(sid, keyword = null) {
    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      let where = {}
      if (keyword)
        where[Op.or] = [
          { 'name': { [Op.like]: `%${keyword}%` } }
        ]

      let roles = await core.checkRoles(sessions[0].user_id, [form_id]).catch(e => { throw (e) })
      let items = await models.violations.findAll({
        attributes: [
          'idx_m_violation',
          [Sequelize.literal(`concat('(',cast(idx_m_violation AS varchar),') ', name)`), 'name'],
          [Sequelize.literal(`${roles.length && roles[0].is_update}`), 'is_update']
        ],
        where: where
      });

      return {
        items: items,
        is_insert: false
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
  async update(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj['dmodified'] = new Date()
      obj['umodified'] = sessions[0].user_id;
      await models.violations.update(obj, {
        transaction: t,
        where: { idx_m_violation: obj.idx_m_violation }
      })
      await t.commit()
      return response.success('Berhasil mengubah Violation')
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  },

}