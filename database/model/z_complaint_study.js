'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')
const { helper } = require('../../helper')
const moment = require('moment')
const APP_CODE = process.env.APP_CODE
const UPLOAD_PATH = process.env.UPLOAD_PATH
const API_URL = process.env.API_URL

/**
 * Modul Telaah Pengaduan
 */
class PublicComplaintStudy {
  /**
   * 
   * @param {*} keyword 
   * @param {*} sid 
   * @returns 
   */
  getInquiry(keyword = null, sid = null, status_code = null) {
    let db = knex(opt);
    let user_id = null;
    let user_type = null;
    let is_insert = false;
    let is_update = false;
    let is_verification = false;

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(async (r) => {
        if (r.status) {
          user_id = r.user_id;
          user_type = r.user_type;

          is_verification = await core.checkRolesAction(sid, 5).catch(e => reject(e));
          is_verification = is_verification[0].is_action;

          return await core.checkRoles(sid, 3)
            .then((rs) => {
              is_delete = rs.length === 0 ? false : rs[0].is_delete
              is_insert = rs.length === 0 ? false : rs[0].is_insert
              is_update = rs.length === 0 ? false : rs[0].is_update

              return db.from('m_complaint AS mc')
                .select(
                  'mc.idx_m_complaint',
                  'tcs.idx_t_complaint_study',
                  'mc.form_no',
                  'mc.date',
                  'mv.name AS violation_name',
                  'mc.description',
                  'mc.manpower',
                  'mo.text AS source_name',
                  'mo.option_id',
                  db.raw(`case when tcs.form_status=? then 'EDIT' else null end as edit_info`, [0]),
                  db.raw(`
                    case 
                      when mc.form_status = '0' 
                        AND tcv.idx_m_complaint is null AND COALESCE(tcv.verification_type,'0') = '0'
                        AND tcs.idx_m_complaint is null AND COALESCE(tcs.form_status,'0') = '0' 
                        AND tcd.idx_m_complaint is null AND COALESCE(tcd.form_status,'0') = '0' then 'EDIT' 
                      when mc.form_status = '1' 
                        AND tcv.idx_m_complaint is null AND COALESCE(tcv.verification_type,'0') = '0'
                        AND tcs.idx_m_complaint is null AND COALESCE(tcs.form_status,'0') = '0' 
                        AND tcd.idx_m_complaint is null AND COALESCE(tcd.form_status,'0') = '0' then 'SUBMIT'
                      when mc.form_status = '1' 
                        AND tcv.idx_m_complaint is not null AND COALESCE(tcv.verification_type,'0') = '1'
                        AND tcs.idx_m_complaint is null AND COALESCE(tcs.form_status,'0') = '0' 
                        AND tcd.idx_m_complaint is null AND COALESCE(tcd.form_status,'0') = '0' then 'Laporan Diterima Verifikasi'
                      when mc.form_status = '1' 
                        AND tcv.idx_m_complaint is not null AND COALESCE(tcv.verification_type,'0') = '0'
                        AND tcs.idx_m_complaint is null AND COALESCE(tcs.form_status,'0') = '0' 
                        AND tcd.idx_m_complaint is null AND COALESCE(tcd.form_status,'0') = '0' then 'Laporan Ditolak Verifikasi'
                      when mc.form_status = '1' 
                        AND tcv.idx_m_complaint is not null AND COALESCE(tcv.verification_type,'0') = '1'
                        AND tcs.idx_m_complaint is not null AND COALESCE(tcs.form_status,'0') = '1' 
                        AND tcd.idx_m_complaint is null AND COALESCE(tcd.form_status,'0') = '0' then 'Sudah Ditelaah Inspektorat'
                      when mc.form_status = '1' 
                        AND tcv.idx_m_complaint is not null AND COALESCE(tcv.verification_type,'0') = '1'
                        AND tcs.idx_m_complaint is not null AND COALESCE(tcs.form_status,'0') = '1' 
                        AND tcd.idx_m_complaint is not null AND COALESCE(tcd.form_status,'0') = '1' 
                        AND tcd.approved_by is null then 'Sudah Putusan Pengampu WBS'
                      when mc.form_status = '1' 
                        AND tcv.idx_m_complaint is not null AND COALESCE(tcv.verification_type,'0') = '1'
                        AND tcs.idx_m_complaint is not null AND COALESCE(tcs.form_status,'0') = '1' 
                        AND tcd.idx_m_complaint is not null AND COALESCE(tcd.form_status,'0') = '1' 
                        AND tcd.approved_by is not null 
                        AND tcd2.idx_t_complaint_determination is null then 'Sudah Diterima KUMM'
                      when mc.form_status = '1' 
                        AND tcv.idx_m_complaint is not null AND COALESCE(tcv.verification_type,'0') = '1'
                        AND tcs.idx_m_complaint is not null AND COALESCE(tcs.form_status,'0') = '1' 
                        AND tcd.idx_m_complaint is not null AND COALESCE(tcd.form_status,'0') = '1' 
                        AND tcd.approved_by is not null 
                        AND tcd2.idx_t_complaint_determination is not null then 'Sudah Ditetapkan Tim Pemeriksa KUMM'
                    END AS status_name
                  `),
                  db.raw(`case  when 
                      mc.form_status='1' 
                      AND COALESCE(tcv.verification_type,'0') = '1'
                      AND tcv.idx_m_complaint is not null
                      AND tcs.idx_m_complaint is not null
                      AND COALESCE(tcs.form_status,'0') = '0'
                      AND COALESCE(tcd.form_status,'0') = '0'
                      AND true=? 
                      AND tcs.ucreate=? 
                    then true 
                    else false end is_update
                  `, [is_update, user_id]),
                  db.raw(`case  when tcs.idx_m_complaint is not null then true else false end is_view`, []),
                )
                .leftJoin('m_violation AS mv', 'mc.idx_m_violation', 'mv.idx_m_violation')
                .leftJoin('t_complaint_verification AS tcv', 'mc.idx_m_complaint', 'tcv.idx_m_complaint')
                .leftJoin('t_complaint_study AS tcs', 'mc.idx_m_complaint', 'tcs.idx_m_complaint')
                .leftJoin('t_complaint_decision AS tcd', 'mc.idx_m_complaint', 'tcd.idx_m_complaint')
                .leftJoin('t_complaint_determination AS tcd2', 'mc.idx_m_complaint', 'tcd2.idx_m_complaint')
                .leftJoin('m_option AS mo', function () {
                  this.on('mo.value', '=', 'mc.source_complaint')
                    .andOn('mo.option_id', '=', db.raw(`?`, ['1']))
                })
                .where((builder) => {
                  if (keyword) {
                    builder.whereRaw("mc.description LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mc.manpower LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mc.hopes LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mc.form_no LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mv.name LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mw.name LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                  }
                })
                .andWhereRaw(`true=case when 'PUBLIC'<>? then true else mc.ucreate=? end`, [user_type, user_id])
                .andWhereRaw(`true=case when 'PUBLIC'=? then true else mc.form_status='1' end`, [user_type])
                .andWhereRaw(`true=case when 'PUBLIC'<>? then true else mc.source_complaint='0' end`, [user_type])
                // telaah di lock untuk code 3, form_status=0 (DRAFT), dan form_status=1 (SUBMIT/Sudah ditelaah inspektorat)
                .andWhereRaw(`mc.form_status=? AND tcv.verification_type=?`, [1, 1])
                .andWhereRaw(`
                  CASE 
                    WHEN '2A'=? THEN tcs.idx_m_complaint is null AND tcs.form_status is null   
                    WHEN '3'=? THEN tcs.idx_m_complaint is not null AND tcs.form_status='1' 
                    ELSE true=true
                  END`, [status_code, status_code])
                .orderBy('mc.dcreate', 'desc')
                .then((rows) => resolve([
                  {
                    items: parsed(rows),
                    is_insert: is_insert
                  }
                ]))
                .catch((e) => { reject(e) })
                .finally(() => { db.destroy() })
            })
            .catch(e => {
              console.log(e)
              reject(e)
            });
        } else {
          resolve([])
        }
      })
        .catch((e) => {
          console.log(e)
          reject(e)
        })
    })
  }

  /**
   * 
   * @param {*} id 
   * @param {*} sid 
   * @returns 
   */
  getInquiryById(id = null, sid = null) {
    let db = knex(opt);
    let user_id = null;
    let user_type = null;
    let is_delete = false;
    let is_insert = false;
    let is_update = false;
    let is_action_detail = false;
    let complaintLists = [];
    let complaintEvent = [];
    let complaintIncident = [];
    let complaintReported = [];
    let complaintViolation = [];

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(async (r) => {
        if (r.status) {
          user_id = r.user_id
          user_type = r.user_type

          return await core.checkRoles(sid, 3).then((rs) => {
            is_delete = rs.length === 0 ? false : rs[0].is_delete
            is_insert = rs.length === 0 ? false : rs[0].is_insert
            is_update = rs.length === 0 ? false : rs[0].is_update

            return db.from('t_complaint_study AS mc')
              .select(
                'mc.idx_m_complaint',
                'mc.idx_t_complaint_study',
                'mv.idx_m_violation',
                'mv.name AS violation_name',
                'mc.notes',
                'md.idx_m_disposition',
                'md.name AS disposition_name',
                db.raw(`case when mc.form_status = '0' then 'Belum ditelaah' else 'Sudah ditelaah' end AS status_name`),
                db.raw(`case when mc.form_status = '0' AND mc.ucreate=? then true else false end AS is_submit`, [user_id]),
                db.raw(`case when mc.form_status='0' AND true=? AND mc.ucreate=? then true else false end is_delete`, [is_delete, user_id]),
                db.raw(`case  when mc.form_status='0' AND true=? AND mc.ucreate=? then true else false end is_update`, [is_delete, user_id]),
              )
              .leftJoin('m_violation AS mv', 'mc.idx_m_violation', 'mv.idx_m_violation')
              .leftJoin('m_disposition AS md', 'mc.idx_m_disposition', 'md.idx_m_disposition')
              .whereRaw("mc.idx_t_complaint_study = ?", [id])
              .then((rows) => {
                let parse = JSON.parse(JSON.stringify(rows))
                complaintLists = parse;
                is_action_detail = complaintLists.length === 0 ? false : complaintLists[0].is_update;
              })
              .then(() =>
                this.getComplaintAdditional(id, is_action_detail)
                  .then(data => {
                    complaintEvent = data[0];
                    complaintIncident = data[1];
                    complaintReported = data[2];
                    complaintViolation = data[3];
                  }).catch((e) => { reject(e) })
              )
              .then(() => {
                complaintLists.map(e => {
                  e.event = complaintEvent.filter(a => a.idx_t_complaint_study == e.idx_t_complaint_study);
                  e.incident = complaintIncident.filter(a => a.idx_t_complaint_study == e.idx_t_complaint_study);
                  e.reported = complaintReported.filter(a => a.idx_t_complaint_study == e.idx_t_complaint_study);
                  e.violation = complaintViolation.filter(a => a.idx_t_complaint_study == e.idx_t_complaint_study).map(e => e.idx_m_violation);
                });

                resolve([{
                  items: complaintLists,
                  is_action: is_action_detail
                }])
              })
              .finally(() => { db.destroy() })
              .catch((e) => { reject(e) });
          })
            .catch(e => reject(e));
        } else {
          resolve([]);
        }
      }).catch((e) => {
        console.log(e)
        reject(e)
      });
    });
  }

  /**
   * 
   * @param {*} idx_m_complaint 
   * @returns 
   */
  getComplaintAdditional(id = 0, is_action = false) {
    let db = knex(opt);

    return Promise.all([
      db.from('t_complaint_study_event')
        .select(
          'idx_t_complaint_study_event',
          'idx_t_complaint_study',
          'event',
          'date',
          'notes',
          db.raw(`case when true=? then true else false end AS is_action`, [is_action])
        ).whereRaw(`true=case when ?=0 then true else idx_t_complaint_study=? end`, [id, id])
        .catch((e) => { console.log(e) }),
      db.from('t_complaint_study_incident AS ci')
        .select(
          'ci.idx_t_complaint_study_incident',
          'ci.idx_t_complaint_study',
          'ci.start_date',
          'ci.end_date',
          'ci.notes',
          'ci.office_name',
          'ci.address',
          'ci.idx_m_work_unit',
          'mw.name AS work_unit_name',
          'ci.idx_m_city',
          'mr.idx_m_region',
          db.raw(`concat(coalesce(mr.name,'-'),' - ',coalesce(mc.name,'-')) AS region_city_name`),
          db.raw(`case when true=? then true else false end AS is_action`, [is_action])
        )
        .leftJoin('m_work_unit AS mw', 'mw.idx_m_work_unit', 'ci.idx_m_work_unit')
        .leftJoin('m_city AS mc', 'mc.idx_m_city', 'ci.idx_m_city')
        .leftJoin('m_region AS mr', 'mr.idx_m_region', 'mc.idx_m_region')
        .whereRaw(`true=case when ?=0 then true else ci.idx_t_complaint_study=? end`, [id, id])
        .catch((e) => { console.log(e) }),
      db.from('t_complaint_study_reported')
        .select(
          'idx_t_complaint_study_reported',
          'idx_t_complaint_study',
          'name',
          'identity_no',
          'occupation',
          db.raw(`case when true=? then true else false end AS is_action`, [is_action])
        ).whereRaw(`true=case when ?=0 then true else idx_t_complaint_study=? end`, [id, id])
        .catch((e) => { console.log(e) }),
      db.from('t_complaint_study_violation AS a')
        .select(
          'a.idx_t_complaint_study_violation',
          'a.idx_t_complaint_study',
          db.raw(`cast(a.idx_m_violation AS integer) AS idx_m_violation`)
        )
        .whereRaw(`true=case when ?=0 then true else a.idx_t_complaint_study=? end`, [id, id])
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
            return db('t_complaint_study')
              .insert(complaint)
              .transacting(t)
              .returning('idx_t_complaint_study')
              .then((rows) => {
                let arr = []
                idx_m_complaint = rows[0]

                // events
                for (let i = 0; i < event.length; i++) {
                  event[i]['idx_t_complaint_study'] = idx_m_complaint
                  event[i]['ucreate'] = user_id
                }

                // incident
                for (let i = 0; i < incident.length; i++) {
                  incident[i]['idx_t_complaint_study'] = idx_m_complaint
                  incident[i]['ucreate'] = user_id
                }

                // reported
                for (let i = 0; i < reported.length; i++) {
                  reported[i]['idx_t_complaint_study'] = idx_m_complaint
                  reported[i]['ucreate'] = user_id
                }

                // violation
                let final_violation = [];
                for (let i = 0; i < violation.length; i++) {
                  final_violation.push({
                    idx_t_complaint_study: idx_m_complaint,
                    idx_m_violation: violation[i],
                    ucreate: user_id
                  });
                }

                arr = [
                  db('t_complaint_study_incident')
                    .insert(incident).transacting(t)
                    .returning('idx_t_complaint_study_incident'),
                  db('t_complaint_study_reported')
                    .insert(reported).transacting(t)
                    .returning('idx_t_complaint_study_reported'),
                  db('t_complaint_study_event')
                    .insert(event).transacting(t)
                    .returning('idx_t_complaint_study_event'),
                  db('t_complaint_study_violation')
                    .insert(final_violation).transacting(t)
                    .returning('t_complaint_study_violation'),
                  db('m_complaint')
                    .update({ idx_m_status: 3 }).transacting(t) // update status to telaah pengaduan
                    .where({ idx_m_complaint: complaint['idx_m_complaint'] })
                ];

                return Promise.all(arr)
                  .then((data) => console.log('data', data))
                  .catch((e) => { reject(e) })
              })
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Telaah Pengaduan Anda berhasil di simpan.', [])))
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
   * @param {*} violation 
   * @param {*} is_submit 
   * @returns 
   */
  updateComplaint(sid = null, id = null, complaint = {}, violation = [], is_submit = false) {
    var db = knex(opt)
    let user_id = null;
    let complaintAttachment = [];
    let complaintEvent = [];
    let complaintIncident = [];
    let complaintReported = [];
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
                idx_t_complaint_study: id
              });
            }

            return db('t_complaint_study_violation')
              .whereRaw(`idx_t_complaint_study=?`, [id])
              .del()
              .transacting(t)
              .then(res => db('t_complaint_study_violation')
                .insert(final_violation)
                .transacting(t))
              .then(async () => {
                return await this.getComplaintAdditional(id)
                  .then((data) => {
                    complaintEvent = data[0];
                    complaintIncident = data[1];
                    complaintReported = data[2];
                    complaintViolation = data[3];
                  })
                  .then(async () => {
                    if (is_submit && (await helper.validateArrayVal(complaintIncident, ['start_date', 'end_date', 'idx_m_work_unit', 'idx_m_city']) || complaintIncident.length === 0)) {
                      resolve(response.failed('Tempat Kejadian Kolom Unit Kerja, Kota dan Waktu Kejadian TIDAK boleh kosong.'))
                    } else if (is_submit && (await helper.validateArrayVal(complaintReported, ['name']) || complaintReported === 0)) {
                      resolve(response.failed('Terlapor Kolom Nama Terlapor TIDAK boleh kosong.'))
                    } else if (is_submit && (await helper.validateArrayVal(complaintViolation, ['idx_m_violation']) || complaintViolation === 0)) {
                      resolve(response.failed('Terlapor Kolom Nama Terlapor TIDAK boleh kosong.'))
                    } else {
                      return db('t_complaint_study AS mc')
                        .transacting(t)
                        .update(complaint)
                        .whereRaw(`mc.idx_t_complaint_study=? AND mc.form_status='0'`, [id])
                    }
                  })
                  .then(() => db('m_complaint')
                    .update({ idx_m_status: 3 }).transacting(t) // update status to telaah pengaduan
                    .where({ idx_m_complaint: complaint['idx_m_complaint'] }))
                  .then(() => resolve(response.success(`Edit data telaah pengaduan berhasil ${is_submit ? 'di submit' : 'di simpan'}.`)))
                  .catch(e => reject(e))
              })
              .then(t.commit)
              .catch(t.rollback)
          }).catch((e) => { reject(e) })
            .finally(() => { db.destroy() });
        } else {
          resolve(response.failed('Session expires, please relogin.', true))
        }
      }).catch((e) => { reject(e) })
    })
  }

  /** ============================================== EVENT
   * 
   * @param {*} sid 
   * @param {*} event 
   * @returns 
   */
  updateComplaintEvent(sid = null, event = {}) {
    var db = knex(opt)
    let user_id = null
    let arr = []

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            event.data['umodified'] = user_id
            event.data['dmodified'] = new Date()

            arr.push(db('t_complaint_study_event')
              .update(event.data)
              .where(event.where)
              .transacting(t))

            return Promise.all(arr)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Kronologi aduan berhasil di edit.')))
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
   * @param {*} event 
   * @returns 
   */
  insertComplaintEvent(sid = null, event = {}) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            return db('t_complaint_study_event')
              .insert(event)
              .transacting(t)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Kronologi aduan berhasil di simpan.')))
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
   * @param {*} event 
   * @returns 
   */
  deleteComplaintEvent(sid = null, id = null) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          // fill umodified as user_id
          user_id = r.user_id;

          db.transaction(t => {
            return db('t_complaint_study_event')
              .delete()
              .where({ idx_t_complaint_study_event: id })
              .transacting(t)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Kronologi aduan berhasil di hapus.')))
            .catch((e) => { reject(e) })
            .finally(() => { db.destroy() })
        } else {
          resolve(response.failed('Session expires, please relogin.', true))
        }
      }).catch((e) => { reject(e) })
    })
  }

  /** ============================================== EVENT
   * 
   * @param {*} sid 
   * @param {*} incident 
   * @returns 
   */
  updateComplaintIncident(sid = null, incident = {}) {
    var db = knex(opt)
    let user_id = null
    let arr = []

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            incident.data['umodified'] = user_id
            incident.data['dmodified'] = new Date()

            arr.push(db('t_complaint_study_incident')
              .update(incident.data)
              .where(incident.where)
              .transacting(t))

            return Promise.all(arr)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Tempat kejadian berhasil di edit.')))
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
   * @param {*} incident 
   * @returns 
   */
  insertComplaintIncident(sid = null, incident = {}) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            return db('t_complaint_study_incident')
              .insert(incident)
              .transacting(t)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Tempat kejadian berhasil di simpan.')))
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
   * @returns 
   */
  deleteComplaintIncident(sid = null, id = null) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            return db('t_complaint_study_incident')
              .delete()
              .where({ idx_t_complaint_study_incident: id })
              .transacting(t)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Tempat kejadian berhasil di hapus.')))
            .catch((e) => { reject(e) })
            .finally(() => { db.destroy() })
        } else {
          resolve(response.failed('Session expires, please relogin.', true))
        }
      }).catch((e) => { reject(e) })
    })
  }

  /** ============================================== EVENT
   * 
   * @param {*} sid 
   * @param {*} reported 
   * @returns 
   */
  updateComplaintReported(sid = null, reported = {}) {
    var db = knex(opt)
    let user_id = null
    let arr = []

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            reported.data['umodified'] = user_id
            reported.data['dmodified'] = new Date()

            arr.push(db('t_complaint_study_reported')
              .update(reported.data)
              .where(reported.where)
              .transacting(t))

            return Promise.all(arr)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Terlapor berhasil di edit.')))
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
   * @param {*} reported 
   * @returns 
   */
  insertComplaintReported(sid = null, reported = {}) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            return db('t_complaint_study_reported')
              .insert(reported)
              .transacting(t)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Terlapor berhasil di simpan.')))
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
   * @returns 
   */
  deleteComplaintReported(sid = null, id = null) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            return db('t_complaint_study_reported')
              .delete()
              .where({ idx_t_complaint_study_reported: id })
              .transacting(t)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Terlapor berhasil di hapus.')))
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
   */
  deleteComplaint(sid = null, id = null) {
    var db = knex(opt)
    let user_id = null
    let items = []

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction((t) => {
            return db('t_complaint_study AS a')
              .select('a.idx_t_complaint_study')
              .transacting(t)
              .whereRaw(`a.idx_t_complaint_study=? AND a.form_status='0' AND a.ucreate=?`, [id, user_id])
              .then(async (rows) => {
                let parse = parsed(rows);
                if (parse.length > 0) {
                  await Promise.all([
                    db('t_complaint_study')
                      .transacting(t)
                      .where({
                        idx_t_complaint_study: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('t_complaint_study_incident')
                      .transacting(t)
                      .where({
                        idx_t_complaint_study: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('t_complaint_study_event')
                      .transacting(t)
                      .where({
                        idx_t_complaint_study: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('t_complaint_study_reported')
                      .transacting(t)
                      .where({
                        idx_t_complaint_study: id,
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

module.exports = PublicComplaintStudy