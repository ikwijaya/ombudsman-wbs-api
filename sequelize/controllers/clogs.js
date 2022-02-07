const { models } = require('..');
const { Sequelize, Op } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   * @returns 
   */
  async load(sid, id = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let user_type = sessions[0].user_type;
      let ucreate = null; let flow;
      let m = await models.clogs.findAll({
        attributes: [
          'idx_m_complaint',
          'action',
          'flow',
          'changes',
          'dcreate',
          'ucreate',
          'notes',
          [Sequelize.literal(`
            case 
              when action = 'R' then 'Melihat'
              when action = 'U' then 'Mengedit'
              when action = 'D' then 'Menghapus'
              when action = 'I' then 'Membuat'
              when action = 'V' then 'Memverifikasi'
              else '-' end
          `), 'action_name'],
          [Sequelize.literal(`
            case 
              when action = 'R' then 'grey'
              when action = 'U' then 'green'
              when action = 'D' then 'red'
              when action = 'I' then 'black'
              else 'grey' end
          `), 'action_color']
        ],
        where: { idx_m_complaint: id, record_status: 'A' },
        order: [['dcreate', 'desc']]
      })

      if (m.length > 0) {
        ucreate = m.filter(e => typeof (e.ucreate) == 'number').map(e => e.ucreate ? parseInt(e.ucreate) : null)
        let getUsers = await models.users.findAll({
          attributes: [
            'idx_m_user',
            [Sequelize.literal(`concat(' oleh ', users.fullname,' - ', users.email)`), 'name']
          ],
          where: { idx_m_user: { [Op.in]: ucreate } }
        })

        flow = m.map(e => e.flow);
        let getFlow = await models.status.findAll({
          attributes: ['name', 'code'],
          where: { idx_m_status: { [Op.in]: flow } }
        })

        m.map(e => { e.ucreate = user_type == 'PUBLIC' ? [{ name: '' }] : getUsers.filter(a => a.idx_m_user == e.ucreate) })
        m.map(e => { e.flow = getFlow.filter(a => a.code == e.flow) })
      }

      return m
    } catch (error) {
      throw (error)
    }
  },
}