const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
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
  async load(sid, regional = null) {
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

}