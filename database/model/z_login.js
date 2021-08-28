'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');

/**
 * Using for logon with public web
 */
class PublicLogin {
  getLogin(username = null, password = null) {
    let idx_m_user = null;
    let user_type = null;
    let sid = uuidv4() + '-' + moment().format('YYMMDDTHHmmss');
    let fullname = null
    let db = knex(opt);
    let h = 8;
    let expires = moment().add(h, 'h').format('YYYY-MM-DD HH:mm:ss');

    return new Promise((resolve, reject) => {
      db.from('m_user AS mu')
        .select(
          'mu.idx_m_user',
          'mu.fullname',
          db.raw(`case when mt.idx_m_user_type=? then 'PUBLIC' else 'INTERNAL' end as user_type`, [-1])
        )
        .leftJoin('m_user_type as mt', 'mu.idx_m_user_type', 'mt.idx_m_user_type')
        .whereRaw(`mu.email=? and mu.passwd=md5(?) and mu.record_status='A' and mu.is_verify=true`, [username, password])
        .then((rows) => {
          let parse = JSON.parse(JSON.stringify(rows))
          idx_m_user = parse.length == 0 ? null : parse[0].idx_m_user;
          fullname = parse.length == 0 ? null : parse[0].fullname;
          user_type = parse.length == 0 ? null : parse[0].user_type;
        })
        .then(() => {
          if (idx_m_user) {
            Promise.all([
              this.updateLastSession(idx_m_user, username, user_type),
              this.updateAccount(idx_m_user)
            ])
              .then(data => resolve(response.success('Sukses login', [
                {
                  sid: sid,
                  fullname: fullname,
                  user_type: user_type,
                  expires: expires,
                  hour: h * 1000
                }
              ])))
              .then(async () => await this.createSession(idx_m_user, username, sid, user_type, expires))
              .catch((e) => { reject(e) })
          } else {
            resolve(response.failed('Kesalahan pada Email, Password atau email Anda belum ter-verifikasi.'))
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  }

  /**
   * 
   * @param {*} idx_m_user 
   * @returns 
   */
  updateLastSession(idx_m_user = null, username = null, user_type = null) {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('t_session')
          .transacting(t)
          .update({
            record_status: 'N',
            dmodified: db.raw('current_timestamp'),
            umodified: username
          })
          .where({ user_id: idx_m_user, type: user_type, record_status: 'A' })
          .then(t.commit)
          .catch(t.rollback)
      })
        .then((r) => resolve(r))
        .catch(e => reject(e))
        .finally(() => { db.destroy() })
    })
  }

  /**
   * 
   * @param {*} idx_m_user 
   * @returns 
   */
  updateAccount(idx_m_user = null) {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('m_user')
          .transacting(t)
          .update({ last_login: db.raw('current_timestamp'), is_login: true })
          .where({ idx_m_user: idx_m_user })
          .then(t.commit)
          .catch(t.rollback)
      })
        .then((r) => resolve(r))
        .catch(e => reject(e))
        .finally(() => { db.destroy() })
    })
  }

  /**
   * 
   * @param {*} idx_m_user 
   * @param {*} username 
   * @param {*} sid 
   * @param {*} user_type 
   * @param {*} expires 
   * @returns 
   */
  createSession(idx_m_user = null, username = null, sid = null, user_type = null, expires = null) {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('t_session')
          .transacting(t)
          .insert({
            user_id: idx_m_user,
            type: user_type,
            sid: sid,//db.raw(`md5(random()::text || clock_timestamp()::text)::uuid`),
            expires: expires,
            ucreate: username,
            dcreate: db.raw(`current_timestamp`),
            record_status: 'A'
          })
          .then(t.commit)
          .catch(t.rollback)
      })
        .then((r) => resolve(r))
        .catch(e => reject(e))
        .finally(() => { db.destroy() })
    })
  }
}

module.exports = PublicLogin