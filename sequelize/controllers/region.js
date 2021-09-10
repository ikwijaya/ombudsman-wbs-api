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
   * @param {*} regional 
   * @returns 
   */
  async load_by_region(sid, regional = null) {
    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      let where = null;
      if (id) where['regional'] = regional

      let items = await models.regions.findAll(
        {
          attributes: ['idx_m_region', 'name', 'regional'],
          include: [
            {
              model: models.cities
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
   * @param {*} regional 
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
          { 'city.name': { [Op.like]: `%${keyword}%` } },
          { 'region.name': { [Op.like]: `%${keyword}%` } }
        ]

      let roles = await core.checkRoles(sessions[0].user_id, [form_id]).catch(e => { throw (e) })
      let items = await models.regions.findAll(
        {
          attributes: [
            'idx_m_region', 'name', 'regional',
            [Sequelize.literal(`${roles.length && roles[0].is_update}`), 'is_update']
          ],
          include: [
            {
              attributes: ['name'],
              model: models.cities
            }
          ],
          where: where
        }
      );

      const a = await models.cities.findAll({
        raw: true,
        attributes: ['idx_m_region'],
        group: ['idx_m_region']
      })

      items = JSON.stringify(JSON.parse(items))
      console.log('items', items)
      items.map(e => {
        let count = a.filter(a => a['idx_m_region'] == e['idx_m_region'])
        count = count.length ? count[0]['count'] : 0;
        console.log('count', count)

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

      if (!obj.name) return response.failed(`Kolom Nama Provinsi TIDAK boleh kosong`)

      await models.regions.create(obj, { transaction: t });
      await t.commit()
      return response.success('Berhasil menambahkan Provinsi')
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

      await models.regions.update(obj, {
        transaction: t,
        where: { idx_m_region: obj.idx_m_region }
      })
      await t.commit()
      return response.success('Berhasil mengubah Provinsi')
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

      await models.regions.destroy({ transaction: t, where: { idx_m_region: id } })
      await t.commit()
      return response.success('Berhasil menghapus Provinsi')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },
}