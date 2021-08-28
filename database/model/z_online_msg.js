'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')

/**
 * Using for logout with public web
 */
class PublicOM {
  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  get(sid = null) {
    let db = knex(opt);
    let user_id = null;
    let messages = []

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then((r) => {
          if (r.status) {
            user_id = r.user_id

            db('t_online_msg AS tm')
              .select(
                'tm.idx_t_online_msg',
                'tm.receiver',
                'tm.subject',
                'tm.body',
                'mu.fullname'
              )
              .leftJoin('m_user AS mu', 'mu.idx_m_user', 'tm.receiver')
              .whereRaw(`tm.sender=? AND tm.parent_id is null`, [user_id])
              .then((rows) => messages = parsed(rows))
              .then(() =>
                db('t_online_msg AS tm')
                  .select(
                    'tm.idx_t_online_msg',
                    'tm.receiver',
                    'tm.subject',
                    'tm.body',
                    'mu.fullname',
                    'tm.parent_id'
                  )
                  .leftJoin('m_user AS mu', 'mu.idx_m_user', 'tm.receiver')
                  .then((rows) => {
                    let parse = parsed(rows)
                    messages.map((e) => {
                      e.child = parse.filter((a) => a.parent_id == e.idx_t_online_msg);
                    })
                    resolve(messages)
                  })
                  .catch(e => reject(e))
              )
              .catch(e => reject(e))
              .finally(() => { db.destroy() })
          } else {
            resolve([])
          }
        })
    })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} receiver 
   * @param {*} body 
   * @param {*} subject 
   * @param {*} parent_id 
   * @returns 
   */
  sendMsg(sid = null, receiver = null, body = null, subject = null, parent_id = null) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then((r) => {
          if (r.status) {
            user_id = r.user_id

            db.transaction((t) => {
              return db('t_online_msg')
                .transacting(t)
                .insert({
                  sender: user_id,
                  receiver: receiver,
                  subject: subject,
                  body: body,
                  parent_id: parent_id
                })
                .then(t.commit)
                .catch(t.rollback)
            })
              .then((r) => resolve(response.success('Message Anda berhasil dikirim.')))
              .catch(e => reject(e))
              .finally(() => { db.destroy() })
          } else {
            resolve(response.failed('Session expires, please relogin.', true))
          }
        })
        .catch(e => reject(e))
    })
  }


  /**
   * 
   * @returns 
   */
  getOMAdditional() {
    var db = knex(opt)

    return new Promise(async (resolve, reject) => {
      db('m_user')
        .select(
          'idx_m_user',
          'fullname'
        )
        .where({
          idx_m_user_type: 1, // ADMIN_INSPEKTORAT
          record_status: 'A'
        })
        .then((rows) => {
          let parse = parsed(rows)
          resolve(parse)
        })
        .catch(e => reject(e))
        .finally(() => { db.destroy() })
    })
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}

module.exports = PublicOM