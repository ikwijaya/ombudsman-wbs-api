const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async load(sid) {
    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      let letters = await models.letters.findAll(
        {
          attributes: [
            'idx_t_letter',
            'code',
            'description'
          ],
          where: { record_status: 'A' }
        }
      )

      return {
        items: letters
      }
    } catch (error) {

      throw (error)
    }
  },
}