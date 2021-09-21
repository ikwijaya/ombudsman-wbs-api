const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const crypto = require('crypto');
const moment = require('moment');
const sequelize = require('..');
const core = require('./core')
const { response } = require('../../models/index')
const { helper } = require('../../helper')
const { EXPIRES_IN } = require('../../config')
const h = EXPIRES_IN || 12;

module.exports = {
  /**
   * 
   * @param {*} username 
   * @param {*} password 
   * @returns 
   */
  async login(username, password) {
    const t = await sequelize.transaction();

    try {
      let sid = await helper.token();
      let expires = moment().add(h, 'h').format('YYYY-MM-DD HH:mm:ss');
      let md5 = crypto.createHash('md5').update(password).digest('hex');

      let users = await models.users.findOne(
        {
          raw: true,
          attributes: [
            'idx_m_user',
            'fullname',
            'email',
            [Sequelize.literal(`case when usertype.name='PUBLIC' then 'PUBLIC' else 'INTERNAL' end`), 'user_type'],
            [Sequelize.literal(`usertype.idx_m_user_type`), 'idx_m_user_type']
          ],
          where: {
            email: username,
            passwd: md5,
            is_verify: true,
            record_status: 'A'
          },
          include: [
            {
              required: false,
              model: models.usertypes,
              attributes: []
            }
          ]
        }
      );

      if (!users) return response.failed('Kesalahan pada username atau password.');
      let update = await models.sessions.update(
        {
          record_status: 'N',
          dmodified: Sequelize.literal('CURRENT_TIMESTAMP'),
          umodified: username
        }, {
        transaction: t,
        where: {
          user_id: users.idx_m_user,
          record_status: 'A',
          type: users.user_type
        },
      });

      if (!update || (update.length === 0 && update[0] > 0))
        await models.users.update(
          { is_login: true },
          {
            transaction: t,
            where: { idx_m_user: users.idx_m_user }
          }
        );

      await models.sessions.create(
        {
          sid: sid,
          expires: expires,
          user_id: users.idx_m_user,
          type: users.user_type,
          ucreate: username,
        },
        {
          transaction: t
        });

      await t.commit();
      return response.success('Sukses login', [{
        sid: sid,
        fullname: users.fullname,
        user_type: users.user_type,
        expires: expires,
        hour: h * 1000
      }]);
    } catch (err) {
      console.log('err', err)
      await t.rollback()
    }
  },

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async logout(sid = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      // update
      await models.sessions.update(
        {
          record_status: 'N',
          dmodified: Sequelize.literal('CURRENT_TIMESTAMP'),
          umodified: sessions[0].email
        }, {
        transaction: t,
        where: {
          user_id: sessions[0].user_id,
          record_status: 'A',
          type: sessions[0].user_type,
        },
      });

      await models.users.update(
        {
          is_login: false,
          last_logout: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {
          transaction: t,
          where: { idx_m_user: sessions[0].user_id, }
        }
      );

      await t.commit;
      return response.success('Logout berhasil.', []);
    } catch (err) {

      await t.rollback();
    }
  },
}