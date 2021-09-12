const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const form_id = 207

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
          { 'name': { [Op.like]: `%${keyword.toUpperCase()}%` } }
        ]

      let roles = await core.checkRoles(sessions[0].user_id, [form_id]).catch(e => { throw (e) })
      let items = await models.cities.findAll({
        attributes: [
          'idx_m_city', 'name',
          [Sequelize.literal(`${roles.length && roles[0].is_update}`), 'is_update']
        ],
        include: [
          {
            attributes: ['name', 'idx_m_region'],
            model: models.regions
          }
        ],
        where: where
      });

      let a = await models.complaint_incidents.findAll(
        {
          raw: true,
          attributes: [
            'idx_m_city',
            [Sequelize.literal(`count(idx_m_city)`), 'count']
          ],
          group: ['idx_m_city']
        }
      );

      let b = await models.complaint_study_incidents.findAll(
        {
          raw: true,
          attributes: [
            'idx_m_city',
            [Sequelize.literal(`count(idx_m_city)`), 'count']
          ],
          group: ['idx_m_city']
        }
      );

      items.map(e => {
        let idx_m_city = e.getDataValue('idx_m_city');
        let count_1 = a.filter(x => idx_m_city == x['idx_m_city'])
        let count_2 = b.filter(x => idx_m_city == x['idx_m_city'])
        count_1 = count_1.length ? count_1[0].count : 0
        count_2 = count_2.length ? count_2[0].count : 0

        e.setDataValue('count_1', count_1)
        e.setDataValue('count_2', count_2)
        e.setDataValue('is_delete', count_1 == 0 && count_2 == 0 && roles.length && roles[0].is_delete ? true : false)
      })

      return {
        items: items,
        is_insert: roles.length && roles[0].is_insert
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

      if (!obj.name) return response.failed(`Kolom Nama Kota TIDAK boleh kosong`)
      if (!obj.idx_m_region) return response.failed(`Kolom Provinsi TIDAK boleh kosong`)
      obj.name = obj.name.toUpperCase();

      obj['dcreate'] = new Date()
      obj['ucreate'] = sessions[0].user_id;
      await models.cities.create(obj, { transaction: t });
      await t.commit()
      return response.success('Berhasil menambahkan Kota')
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
  async update(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      if (!obj.name) return response.failed(`Kolom Nama Kota TIDAK boleh kosong`)
      if (!obj.idx_m_region) return response.failed(`Kolom Provinsi TIDAK boleh kosong`)
      obj.name = obj.name.toUpperCase();

      obj['dmodified'] = new Date()
      obj['umodified'] = sessions[0].user_id;
      await models.cities.update(obj, {
        transaction: t,
        where: { idx_m_city: obj.idx_m_city }
      })
      await t.commit()
      return response.success('Berhasil mengubah Kota')
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
  async delete(sid, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      await models.cities.destroy({ transaction: t, where: { idx_m_city: id } })
      await t.commit()
      return response.success('Berhasil menghapus Kota')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

}