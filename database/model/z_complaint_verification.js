'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')

/**
 * Modul Verifikasi Persyaratan
 */
class ComplaintVerification {
  /**
   * 
   * @returns 
   */
  getAdditional() {
    let db = knex(opt);

    return Promise.all([
      db.from('m_complaint_rejected_type')
        .select('idx_m_complaint_rejected_type', 'name')
        .where({ record_status: 'A' })
        .catch((e) => { reject(e) })
    ])
      .then((rows) => rows)
      .catch((e) => { reject(e) })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @param {*} reject_type 
   * @param {*} verification_type 
   * @returns 
   */
  verificationSave(sid = null, id = null, reject_type = null, verification_type = 0) {
    let db = knex(opt);
    let user_id = null;

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then((r) => {
          if (r.status) {
            user_id = r.user_id

            console.log('payload', {
              idx_m_complaint: id,
              idx_m_complaint_rejected_type: reject_type,
              verification_type: verification_type,
              ucreate: user_id,
              dcreate: new Date(),
              record_status: 'A'
            })

            db.transaction((t) => {
              return db('t_complaint_verification')
                .transacting(t)
                .insert({
                  idx_m_complaint: id,
                  idx_m_complaint_rejected_type: reject_type,
                  verification_type: verification_type,
                  ucreate: user_id,
                  dcreate: db.raw('current_timestamp'),
                  record_status: 'A'
                })
                .returning('idx_t_complaint_verification')
                .then(async (rows) => await db('m_complaint')
                  .update({ idx_m_status: 2 }) // update status to laporan verifikasi
                  .where({ idx_m_complaint: id })
                  .transacting(t)
                ).then(() => {
                  resolve(response.success(`${verification_type ? 'Verifikasi pengaduan telah berhasil diterima.' : 'Verifikasi pengaduan telah berhasil ditolak.'}`))
                })
                .catch((e) => { reject(e) })
                .finally(() => { db.destroy() })
            }).catch((e) => { reject(e) });
          } else {
            resolve(response.failed('Session expires, please relogin.', true))
          }
        })
        .catch((e) => { reject(e) })
    });
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}

module.exports = ComplaintVerification