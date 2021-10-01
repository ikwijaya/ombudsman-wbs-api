const { models } = require('..');
const { Sequelize, Op } = require('sequelize');

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async checkSession(sid = null) {
    try {
      if (!sid)
        return [];

      return await models.users.findAll(
        {
          raw: true,
          attributes: [
            'fullname',
            'email',
            [Sequelize.literal(`concat(users.fullname,' (',users.email,')')`), 'e_name'],
            [Sequelize.literal(`users.email`), 'email'],
            [Sequelize.literal(`users.idx_m_user`), 'user_id'],
            [Sequelize.literal(`case when usertype.name='PUBLIC' then 'PUBLIC' else 'INTERNAL' end`), 'user_type'],
            [Sequelize.literal(`sessions.sid`), 'sid'],
            'idx_m_user_type',
          ],
          where: {
            record_status: 'A',
            is_verify: true
          },
          include: [
            {
              required: false,
              model: models.usertypes,
              attributes: []
            },
            {
              model: models.sessions,
              attributes: [],
              where: {
                sid: sid,
                record_status: 'A',
                expires: {
                  [Op.gt]: new Date()
                }
              },
            }
          ]
        }
      );
    } catch (err) {
      throw (err)
    }
  },

  /**
   * 
   * @param {*} user_id 
   * @param {*} id 
   * @returns 
   */
  async checkRoles(user_id = null, id = [], showId = true) {
    try {
      let attributes = [
        [Sequelize.literal(`coalesce(case when(SUM(case when roles.role_action='R' and roles.role_value=true then 1 else 0 end))=0 then false else true end,false)`), 'is_read'],
        [Sequelize.literal(`coalesce(case when(SUM(case when roles.role_action='U' and roles.role_value=true then 1 else 0 end))=0 then false else true end,false)`), 'is_update'],
        [Sequelize.literal(`coalesce(case when(SUM(case when roles.role_action='D' and roles.role_value=true then 1 else 0 end))=0 then false else true end,false)`), 'is_delete'],
        [Sequelize.literal(`coalesce(case when(SUM(case when roles.role_action='I' and roles.role_value=true then 1 else 0 end))=0 then false else true end,false)`), 'is_insert']
      ]

      if (showId)
        attributes.push('idx_m_form')

      return await models.roles.findAll({
        raw: true,
        attributes: attributes,
        where: {
          idx_m_user: user_id,
          idx_m_form: {
            [Op.in]: id
          },
          role_value: true
        },
        group: ['roles.idx_m_form']
      });
    } catch (err) {
      throw (err)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} role_action 
   * @returns 
   */
  async getMenu(sid = null, role_action = []) {
    try {
      let sessions = await this.checkSession(sid);
      if (sessions.length === 0)
        return [];

      return await models.forms.findAll({
        attributes: ['form_name', 'form_icon', 'form_color', 'form_url', 'form_sort'],
        where: { record_status: 'A', idx_m_form_parent: { [Op.is]: null } },
        include: [
          {
            required: true,
            model: models.roles,
            attributes: [],
            where: {
              idx_m_user: sessions[0].user_id,
              record_status: 'A',
              role_value: true,
              role_action: {
                [Op.in]: role_action
              }
            }
          }
        ],
        order: [
          ['form_sort', 'ASC'],
          ['idx_m_form', 'ASC'],
        ]
      });
    } catch (err) {
      throw (err)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} role_action 
   * @param {*} parent_id 
   * @returns 
   */
  async getMenuMaster(sid = null, parent_id = null) {
    try {
      let sessions = await this.checkSession(sid);
      if (sessions.length === 0)
        return [];

      let user_id = sessions[0].user_id;
      let parents = await models.forms.findAll({
        raw: true,
        attributes: ['idx_m_form'],
        where: {
          idx_m_form_parent: parent_id,
          record_status: 'A'
        }
      });

      let menus = await models.forms.findAll({
        attributes: ['form_name', 'form_icon', 'form_color', 'form_url'],
        where: {
          record_status: 'A',
          idx_m_form: { [Op.in]: parents.map(e => e.idx_m_form) }
        },
        include: [
          {
            model: models.roles,
            attributes: [],
            where: {
              idx_m_user: user_id,
              record_status: 'A',
              role_value: true,
              role_action: 'R'
            }
          }
        ],
        order: [['form_sort', 'ASC']]
      });

      return menus;
    } catch (err) {
      throw (err)
    }
  },

  async getSecurity(sid, stepper) {

  }

}