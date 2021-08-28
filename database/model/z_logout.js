'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')

/**
 * Using for logout with public web
 */
class PublicLogout {
  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  getLogout(sid = null) {
    let id = null;
    let fullname = null;
    let db = knex(opt);

    return new Promise((resolve, reject) => {
      db.from('t_session AS ts')
        .select(
          'ts.user_id',
          'mu.fullname'
        )
        .leftJoin('m_user AS mu', 'ts.user_id', 'mu.idx_m_user')
        .whereRaw(`ts.sid = ?`, [sid])
        .andWhereRaw(`ts.type = ?`, ['PUBLIC'])
        .andWhereRaw(`ts.record_status = ?`, ['A'])
        .then((rows) => {
          let parse = JSON.parse(JSON.stringify(rows))
          id = parse.length == 0 ? null : parse[0].user_id;
          fullname = parse.length == 0 ? null : parse[0].fullname;
        })
        .then(() => {
          if (id) {
            Promise.all([
              this.updateLastSession(id, fullname),
            ])
              .then(data => resolve(response.success('Logout sukses', [])))
              .catch((e) => { reject(e) })
          } else {
            resolve(response.failed('Session Anda TIDAK ditemukan, atau session Anda telah habis.', true))
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  }

  /**
   * 
   * @param {*} id 
   * @returns 
   */
  updateLastSession(id = null, fullname = null) {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('t_session')
          .transacting(t)
          .update({
            record_status: 'N',
            dmodified: db.raw('current_timestamp'),
            umodified: fullname
          })
          .where({ user_id: id, type: 'PUBLIC', record_status: 'A' })
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
   * @param {*} id 
   * @returns 
   */
  updateAccount(id = null) {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('m_user')
          .transacting(t)
          .update({ last_logout: db.raw('current_timestamp'), is_login: false })
          .where({ idx_m_user: id })
          .then(t.commit)
          .catch(t.rollback)
      })
        .then((r) => resolve(r))
        .catch(e => reject(e))
        .finally(() => { db.destroy() })
    })
  }
}

module.exports = PublicLogout