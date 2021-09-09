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
      let items = await models.work_units.findAll({
        raw: true,
        attributes: [
          'idx_m_work_unit', 'name', 'record_status',
          [Sequelize.literal(`${roles.length && roles[0].is_update}`), 'is_update']
        ],
        where: where,
        order: [
          ['name', 'ASC'],
          ['dcreate', 'ASC'],
        ]
      });

      let a = await models.complaint_incidents.findAll(
        {
          raw: true,
          attributes: [
            'idx_m_work_unit',
            [Sequelize.literal(`count(idx_m_work_unit)`), 'count']
          ],
          group: ['idx_m_work_unit']
        }
      );

      let b = await models.complaint_study_incidents.findAll(
        {
          raw: true,
          attributes: [
            'idx_m_work_unit',
            [Sequelize.literal(`count(idx_m_work_unit)`), 'count']
          ],
          group: ['idx_m_work_unit']
        }
      );

      items.map(e => {
        let count_1 = a.filter(x => e['idx_m_work_unit'] == x['idx_m_work_unit'])
        let count_2 = b.filter(x => e['idx_m_work_unit'] == x['idx_m_work_unit'])
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

      await models.work_units.create(obj, { transaction: t });
      await t.commit()
      return response.success('Berhasil menambahkan Unit Kerja')
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

      await models.work_units.update(obj, {
        transaction: t,
        where: { idx_m_work_unit: obj.idx_m_work_unit }
      })
      await t.commit()
      return response.success('Berhasil mengubah Unit Kerja')
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

      await models.work_units.destroy({ transaction: t, where: { idx_m_work_unit: id } })
      await t.commit()
      return response.success('Berhasil menghapus Unit Kerja')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },

}