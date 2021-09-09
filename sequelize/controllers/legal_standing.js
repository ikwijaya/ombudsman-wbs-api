const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const form_id = 203

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
      let items = await models.legal_standing.findAll({
        attributes: [
          'idx_m_legal_standing', 'name',
          [Sequelize.literal(`${roles.length && roles[0].is_update}`), 'is_update']
        ],
        where: where
      });

      let a = await models.complaints.findAll(
        {
          attributes: [
            'idx_m_legal_standing',
            [Sequelize.literal(`count(idx_m_legal_standing)`), 'count']
          ],
          group: ['idx_m_legal_standing']
        }
      );

      let b = await models.complaint_studies.findAll(
        {
          attributes: [
            'idx_m_legal_standing',
            [Sequelize.literal(`count(idx_m_legal_standing)`), 'count']
          ],
          group: ['idx_m_legal_standing']
        }
      );

      items.map(e => {
        let count_1 = a.filter(x => e['idx_m_legal_standing'] == x['idx_m_legal_standing'])
        let count_2 = b.filter(x => e['idx_m_legal_standing'] == x['idx_m_legal_standing'])
        count_1 = count_1.length ? count_1[0].count : 0
        count_2 = count_2.length ? count_2[0].count : 0

        e['count_1'] = count_1
        e['count_2'] = count_2
        e['is_delete'] = count_1 == 0 && count_2 == 0 && roles.length && roles[0].is_delete ? true : false
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

      if (!obj.name) return response.failed(`Kolom Nama Legal Standing TIDAK boleh kosong`)

      await models.legal_standing.create(obj, { transaction: t });
      await t.commit()
      return response.success('Berhasil menambahkan Legal Standing')
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

      await models.legal_standing.update(obj, {
        transaction: t,
        where: { idx_m_legal_standing: obj.idx_m_legal_standing }
      })
      await t.commit()
      return response.success('Berhasil mengubah Legal Standing')
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

      await models.legal_standing.destroy({ transaction: t, where: { idx_m_legal_standing: id } })
      await t.commit()
      return response.success('Berhasil menghapus Legal Standing')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },

}