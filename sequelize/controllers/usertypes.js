const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const form_id = 206

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

      let roles = await core.checkRoles(sessions[0].user_id, [form_id]).catch(e => { throw (e) })
      let items = await models.usertypes.findAll(
        {
          attributes: [
            'idx_m_user_type', 'name', 'roles',
            [Sequelize.literal(`case when usertypes.idx_m_user_type not in (-1,0) and ${roles.length && roles[0].is_update} then true else false end`), 'is_update']
          ],
          include: [
            {
              required: false,
              attributes: ['email'],
              model: models.users
            }
          ],
          where: where,
          order: [
            ['name', 'asc']
          ]
        }
      );

      return {
        items: items
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

      throw (error)
    }
  },

}