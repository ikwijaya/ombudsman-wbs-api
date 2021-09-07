const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const form_id = null

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
      let items = await models.dispositions.findAll({
        attributes: [
          'idx_m_disposition', 'name', 'flag_name', 'flag',
          [Sequelize.literal(`${roles.length && roles[0].is_update}`), 'is_update']
        ],
        where: where
      });

      let a = await models.complaints.findAll(
        {
          attributes: [
            'idx_m_disposition',
            [Sequelize.literal(`count(idx_m_disposition)`), 'count']
          ],
          group: ['idx_m_disposition']
        }
      );

      let b = await models.complaint_studies.findAll(
        {
          attributes: [
            'idx_m_disposition',
            [Sequelize.literal(`count(idx_m_disposition)`), 'count']
          ],
          group: ['idx_m_disposition']
        }
      );

      items.map(e => {
        let count_1 = a.filter(x => e['idx_m_disposition'] == x['idx_m_disposition'])
        let count_2 = b.filter(x => e['idx_m_disposition'] == x['idx_m_disposition'])
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

      if (!obj.name) return response.failed(`Kolom Nama Unit Kerja TIDAK boleh kosong`)
      if (!obj.flag) return response.failed(`Kolom Form Flag TIDAK boleh kosong`)

      await models.dispositions.create(obj, { transaction: t });
      await t.commit()
      return response.success('Berhasil menambahkan Disposisi')
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

      await models.dispositions.update(obj, {
        transaction: t,
        where: { idx_m_disposition: obj.idx_m_disposition }
      })
      await t.commit()
      return response.success('Berhasil mengubah Disposisi')
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

      await models.dispositions.destroy({ transaction: t, where: { idx_m_disposition: id } })
      await t.commit()
      return response.success('Berhasil menghapus Disposisi')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },

}