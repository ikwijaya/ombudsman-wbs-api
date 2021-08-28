'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')
const { helper } = require('../../helper')
const moment = require('moment')
const appCode = process.env.APP_CODE
const target_path = process.env.UPLOAD_PATH
const api_url = process.env.API_URL

/**
 * Modul Putusan Anggota Ombudsman Pengampu WBS
 */
class WBS {
  /**
   * 
   * @param {*} idx_m_complaint 
   * @returns 
   */
  getComplaintAdditional(id = 0, is_action = false) {
    let db = knex(opt);

    return Promise.all([
      db.from('t_complaint_decision_violation AS a')
        .select(
          'a.idx_t_complaint_decision_violation',
          'a.idx_t_complaint_decision',
          db.raw(`cast(a.idx_m_violation AS integer) AS idx_m_violation`)
        )
        .whereRaw(`true=case when ?=0 then true else a.idx_t_complaint_decision=? end`, [id, id])
    ])
      .then(data => data)
      .catch((e) => { console.log(e) });
  }

  /**
   * 
   * @returns Array
   */
  getAdditional() {
    let db = knex(opt);

    return Promise.all([
      db.from('m_violation')
        .select('idx_m_violation', 'name')
        .where({ record_status: 'A' })
        .catch((e) => { reject(e) }),
      db.from('m_disposition')
        .select('idx_m_disposition', 'name')
        .where({ record_status: 'A' })
        .catch((e) => { reject(e) }),
      db.from('m_work_unit')
        .select('idx_m_work_unit', 'name')
        .where({ record_status: 'A' })
        .catch((e) => { reject(e) }),
      db.from('m_city AS ct')
        .select('ct.idx_m_city', db.raw(`CONCAT(rg.name,' - ',ct.name) AS name`))
        .leftJoin('m_region AS rg', 'ct.idx_m_region', 'rg.idx_m_region')
        .whereRaw('ct.record_status = ?', ['A'])
        .catch((e) => { reject(e) }),
    ])
      .then((rows) => rows)
      .catch((e) => { reject(e) })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} complaint 
   * @param {*} event 
   * @param {*} incident 
   * @param {*} reported 
   * @param {*} violation 
   * @returns 
   */
  saveComplaint(sid = null, complaint = {}, event = [], incident = [], reported = [], violation = []) {
    var db = knex(opt)
    let idx_m_complaint = null
    let user_id = null
    let user_type = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;
          user_type = r.user_type;

          complaint['ucreate'] = user_id
          db.transaction(t => {
            return db('t_complaint_decision')
              .insert(complaint)
              .transacting(t)
              .returning('idx_t_complaint_decision')
              .then((rows) => {
                let arr = []
                idx_m_complaint = rows[0]

                // events
                for (let i = 0; i < event.length; i++) {
                  event[i]['idx_t_complaint_decision'] = idx_m_complaint
                  event[i]['ucreate'] = user_id
                }

                // incident
                for (let i = 0; i < incident.length; i++) {
                  incident[i]['idx_t_complaint_decision'] = idx_m_complaint
                  incident[i]['ucreate'] = user_id
                }

                // reported
                for (let i = 0; i < reported.length; i++) {
                  reported[i]['idx_t_complaint_decision'] = idx_m_complaint
                  reported[i]['ucreate'] = user_id
                }

                // violation
                let final_violation = [];
                for (let i = 0; i < violation.length; i++) {
                  final_violation.push({
                    idx_t_complaint_decision: idx_m_complaint,
                    idx_m_violation: violation[i],
                    ucreate: user_id
                  });
                }

                arr = [
                  db('t_complaint_decision_incident')
                    .insert(incident).transacting(t)
                    .returning('idx_t_complaint_decision_incident'),
                  db('t_complaint_decision_reported')
                    .insert(reported).transacting(t)
                    .returning('idx_t_complaint_decision_reported'),
                  db('t_complaint_decision_event')
                    .insert(event).transacting(t)
                    .returning('idx_t_complaint_decision_event'),
                  db('t_complaint_decision_violation')
                    .insert(final_violation).transacting(t)
                    .returning('t_complaint_decision_violation'),
                  db('m_complaint')
                    .update({ idx_m_status: 4 }).transacting(t) // update status to pengampu WBS
                    .where({ idx_m_complaint: complaint['idx_m_complaint'] })
                ];

                return Promise.all(arr)
                  .then((data) => console.log('data', data))
                  .catch((e) => { reject(e) })
              })
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Putusan WBS Anda berhasil di simpan.', [])))
            .catch((e) => { reject(e) })
            .finally(() => { db.destroy() })
        } else {
          resolve(response.failed('Session expires, please relogin.', true))
        }
      }).catch((e) => { reject(e) })
    })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @param {*} complaint 
   * @param {*} is_submit 
   * @returns 
   */
  updateComplaint(sid = null, id = null, complaint = {}, violation = [], is_submit = false) {
    var db = knex(opt)
    let user_id = null;
    let complaintViolation = [];

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(async (r) => {
        if (r.status) {
          user_id = r.user_id;
          complaint['umodified'] = user_id
          complaint['dmodified'] = new Date()
          complaint['form_status'] = is_submit ? 1 : 0

          db.transaction(async (t) => {
            let final_violation = [];
            for (let i = 0; i < violation.length; i++) {
              final_violation.push({
                idx_m_violation: violation[i],
                idx_t_complaint_decision: id
              });
            }

            return db('t_complaint_decision_violation')
              .whereRaw(`idx_t_complaint_decision=?`, [id])
              .del()
              .transacting(t)
              .then(res => db('t_complaint_decision_violation')
                .insert(final_violation)
                .transacting(t)
                .then(async () => {
                  await this.getComplaintAdditional(id)
                    .then((data) => complaintViolation = data[0])
                    .then(async () => {
                      if (is_submit && !complaint.idx_m_disposition) {
                        resolve(response.failed('Kolom Dugaan Pelanggaran TIDAK boleh kosong.'))
                      } else if (is_submit && complaintViolation.length === 0) {
                        resolve(response.failed('Kolom Rekomendasi Tindak Lanjut TIDAK boleh kosong.'))
                      } else {
                        return db('t_complaint_decision AS mc')
                          .transacting(t)
                          .update(complaint)
                          .whereRaw(`mc.idx_t_complaint_decision=? AND mc.form_status='0'`, [id])
                          .catch(e => reject(e))
                      }
                    })
                    .then(() => resolve(response.success(`Edit data berhasil ${is_submit ? 'di submit' : 'di simpan'}.`)))
                    .catch(e => reject(e))
                })
              )
              .then(t.commit)
              .catch(t.rollback);
          }).catch((e) => { reject(e) })
            .finally(() => { db.destroy() })
        } else {
          resolve(response.failed('Session expires, please relogin.', true))
        }
      }).catch((e) => {
        reject(e)
        console.log(e)
      })
    })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   */
  deleteComplaint(sid = null, id = null) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction((t) => {
            return db('t_complaint_decision AS a')
              .select('a.idx_t_complaint_decision')
              .transacting(t)
              .whereRaw(`a.idx_t_complaint_decision=? AND a.form_status='0' AND a.ucreate=?`, [id, user_id])
              .then(async (rows) => {
                let parse = parsed(rows);
                if (parse.length > 0) {
                  await Promise.all([
                    db('t_complaint_decision')
                      .transacting(t)
                      .where({
                        idx_t_complaint_decision: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('t_complaint_decision_incident')
                      .transacting(t)
                      .where({
                        idx_t_complaint_decision: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('t_complaint_decision_event')
                      .transacting(t)
                      .where({
                        idx_t_complaint_decision: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('t_complaint_decision_reported')
                      .transacting(t)
                      .where({
                        idx_t_complaint_decision: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('t_complaint_decision_violation')
                      .transacting(t)
                      .where({
                        idx_t_complaint_decision: id,
                        ucreate: user_id
                      })
                      .delete()
                  ])
                    .then((data) => resolve(response.success('Telaah Pengaduan Anda sudah Kami hapus dari system.')))
                    .catch(e => reject(e))
                } else {
                  resolve(response.failed('Telaah Pengaduan yang sudah di SUBMIT TIDAK bisa di hapus.'))
                }
              })
          })
            .catch((e) => { reject(e) })
            .finally(() => { db.destroy() })
        } else {
          resolve(response.failed('Session expires, please relogin.', true))
        }
      })
        .catch(e => reject(e))
    })
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}

module.exports = WBS