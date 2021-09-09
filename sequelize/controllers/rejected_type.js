const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const form_id = 204

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
      let items = await models.complaint_rejected_types.findAll({
        raw: true,
        attributes: [
          'idx_m_complaint_rejected_type', 'name',
          [Sequelize.literal(`${roles.length && roles[0].is_update}`), 'is_update']
        ],
        where: where
      });

      let a = await models.complaint_verifications.findAll(
        {
          raw: true,
          attributes: [
            'idx_m_complaint_rejected_type',
            [Sequelize.literal(`count(idx_m_complaint_rejected_type)`), 'count']
          ],
          group: ['idx_m_complaint_rejected_type']
        }
      );

      items.map(e => {
        let count = a.filter(x => e['idx_m_complaint_rejected_type'] == x['idx_m_complaint_rejected_type'])
        count = count.length ? count[0].count : 0

        e['count'] = count
        e['is_delete'] = count == 0 && roles.length && roles[0].is_delete ? true : false
      })

      return {
        items: items,
        is_insert: roles.length && roles[0].is_insert
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

      if (!obj.name) return response.failed(`Kolom Nama Rejected Type TIDAK boleh kosong`)

      await models.complaint_rejected_types.create(obj, { transaction: t });
      await t.commit()
      return response.success('Berhasil menambahkan Rejected Type')
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

      await models.complaint_rejected_types.update(obj, {
        transaction: t,
        where: { idx_m_complaint_rejected_type: obj.idx_m_complaint_rejected_type }
      })
      await t.commit()
      return response.success('Berhasil mengubah Rejected Type')
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
  async delete(sid, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      await models.complaint_rejected_types.destroy({ transaction: t, where: { idx_m_complaint_rejected_type: id } })
      await t.commit()
      return response.success('Berhasil menghapus Rejected Type')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },

}