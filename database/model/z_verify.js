'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')


/**
 * Using for logout with public web
 */
class PublicVerify {
  /**
   * 
   * @param {*} url_verify 
   * @returns 
   */
  getVerify(url_verify = null) {
    let db = knex(opt);
    let fullname = null
    let idx_m_user = null

    return new Promise((resolve, reject) => {
      db('m_user')
        .select('idx_m_user', 'fullname')
        .where({
          record_status: 'A',
          url_verify: url_verify,
          is_verify: false
        })
        .then(async (rows) => {
          let parse = parsed(rows)
          if (parse.length !== 0) {
            idx_m_user = parse.length === 0 ? null : parse[0].idx_m_user
            fullname = parse.length === 0 ? null : parse[0].fullname

            Promise.all([
              this.updateVerify(idx_m_user, fullname),
              this.autoAddRoles(idx_m_user)
            ])
              .then((data) => resolve(response.success('Verifikasi Anda berhasil, silakan login melakukan login.')))
              .catch((e) => { reject(e) });
          } else {
            resolve(response.failed('Url verifikasi TIDAK valid atau akun Anda sudah ter-verifikasi.'))
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  }

  /**
   * 
   * @param {*} id 
   * @param {*} fullname 
   * @returns 
   */
  updateVerify(id = null, fullname = null) {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('m_user')
          .transacting(t)
          .update({
            is_verify: true,
            verify_date: db.raw('current_timestamp'),
            dmodified: db.raw('current_timestamp'),
            umodified: fullname
          })
          .where({ idx_m_user: id })
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
   */
  autoAddRoles(idx_m_user = null) {
    var db = knex(opt)

    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('t_roles')
          .transacting(t)
          .insert([
            {
              idx_m_form: 1,  // dashboard
              idx_m_user: idx_m_user,
              role_value: true,
              role_action: 'R'
            },
            {
              idx_m_form: 2,  // pengaduan
              idx_m_user: idx_m_user,
              role_value: true,
              role_action: 'R'
            },
            {
              idx_m_form: 2,  // pengaduan
              idx_m_user: idx_m_user,
              role_value: true,
              role_action: 'U'
            },
            {
              idx_m_form: 2,  // pengaduan
              idx_m_user: idx_m_user,
              role_value: true,
              role_action: 'D'
            },
            {
              idx_m_form: 2,  // pengaduan
              idx_m_user: idx_m_user,
              role_value: true,
              role_action: 'I'
            },
            {
              idx_m_form: 9999,  // messaging
              idx_m_user: idx_m_user,
              role_value: true,
              role_action: 'R'
            },
          ])
          .then(t.commit)
          .catch(t.rollback)
      })
        .then((r) => resolve(r))
        .catch(e => reject(e))
        .finally(() => { db.destroy() })
    })
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}


module.exports = PublicVerify