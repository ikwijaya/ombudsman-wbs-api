const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} keyword 
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

      let items = await models.usertypes.findAll(
        {
          attributes: ['idx_m_user_type', 'name', 'roles'],
          include: [
            {
              attributes: ['idx_m_user_type', 'email'],
              model: models.users
            }
          ],
          where: where
        }
      );

      return {
        items: items
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
  async update(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj['dmodified'] = new Date()
      obj['umodified'] = sessions[0].user_id
      obj['roles'] = JSON.stringify(obj['roles'])
      await models.usertypes.update(obj, {
        transaction: t,
        where: { idx_m_user_type: obj.idx_m_user_type }
      })

      await t.commit()
      return response.success('Berhasil mengubah Tipe User')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },

}