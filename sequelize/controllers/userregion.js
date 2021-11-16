const { models } = require('..');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async get(sid, id) {
    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      let items = await models.userregion.findAll(
        {
          attributes: ['idx_m_user_region', 'idx_m_user', 'regional'],
          where: { idx_m_user: id }
        }
      );

      return {
        items: items
      }
    } catch (error) {

      throw (error)
    }
  },

  async additional() {
    try {
      let regional = await models.regions.findAll(
        {
          attributes: ['regional'],
          group: ['regional']
        }
      );

      return {
        regional: regional
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

      if (!obj.regional) return response.failed(`Kolom regional TIDAK boleh kosong`)
      let count = await models.userregion.count({ where: { regional: obj.regional, idx_m_user: obj.idx_m_user } })
      if (count > 0) return response.failed(`Regional ${obj.regional} sudah tersedia`)

      obj['dcreate'] = new Date()
      obj['ucreate'] = sessions[0].user_id;
      await models.userregion.create(obj, { transaction: t });
      await t.commit()
      return response.success('Berhasil menambahkan regional')
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

      obj['dmodified'] = new Date();
      obj['umodified'] = sessions[0].user_id;

      await models.userregion.update(obj, { transaction: t, where: { idx_m_user_region: obj.idx_m_user_region } })
      await t.commit()
      return response.success('Berhasil mengubah data regional')
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async delete(sid, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      await models.userregion.destroy({
        where: { idx_m_user_region: id },
        transaction: t
      })

      await t.commit()
      return response.success('Berhasil meng-hapus data regional')
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  }

}