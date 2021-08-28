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
 * Pengaduan
 */
class PublicComplaint {

  async getStatus() {
    let db = knex(opt);

    return new Promise(async (resolve, reject) => {
      await db('m_status')
        .select('name', 'code AS value', 'color')
        .where({ record_status: 'A' })
        .orderBy('code', 'asc')
        .then((r) => resolve(r))
        .catch(e => reject(e));
    });
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  getProcess(sid = null, id = null) {
    let db = knex(opt);
    let violationType = [9, 10];
    let user_id = null;
    let user_type = null;
    let is_insert_2 = false; let is_update_2 = false; let is_read_2 = false;
    let is_insert_3 = false; let is_update_3 = false; let is_read_3 = false;
    let is_insert_4 = false; let is_update_4 = false; let is_read_4 = false;
    let is_insert_5 = false;
    let is_insert_6 = false; let is_update_6 = false; let is_read_6 = false;
    let is_insert_7 = false; let is_update_7 = false; let is_read_7 = false;
    let is_insert_10 = false;
    let items = [];

    /**
     * Form ID
     * 2 => pengaduan
     * 3 => telaah pengaduan
     * 4 => putusan pengampu WBS
     * 5 => verifikasi persyaratan
     * 6 => penanganan pengaduan
     * 7 => penerimaan penugasan
     * 10 => Penyetujuan oleh KUMM
     */
    return new Promise(async (resolve, reject) => {
      await Promise.all([
        core.checkRoles(sid, 2),
        core.checkRoles(sid, 3),
        core.checkRoles(sid, 4),
        core.checkRolesAction(sid, 5),
        core.checkRoles(sid, 6),
        core.checkRoles(sid, 7),
        core.checkRolesAction(sid, 10),
      ]).then((data => {
        console.log('data', data);

        // pengaduan
        is_insert_2 = data[0].length > 0 ? data[0][0].is_insert : false;
        is_update_2 = data[0].length > 0 ? data[0][0].is_update : false;
        is_read_2 = data[0].length > 0 ? data[0][0].is_read : false;
        // telaah pengaduan
        is_insert_3 = data[1].length > 0 ? data[1][0].is_insert : false;
        is_update_3 = data[1].length > 0 ? data[1][0].is_update : false;
        is_read_3 = data[1].length > 0 ? data[1][0].is_read : false;
        // pengampu wbs
        is_insert_4 = data[2].length > 0 ? data[2][0].is_insert : false;
        is_update_4 = data[2].length > 0 ? data[2][0].is_update : false;
        is_read_4 = data[2].length > 0 ? data[2][0].is_read : false;
        // verifikasi persyaratan
        is_insert_5 = data[3].length > 0 ? data[3][0].is_action : false;
        // penanganan pengaduan
        is_insert_6 = data[4].length > 0 ? data[4][0].is_insert : false;
        is_update_6 = data[4].length > 0 ? data[4][0].is_update : false;
        is_read_6 = data[4].length > 0 ? data[4][0].is_read : false;
        // penerimaan penugasan
        is_insert_7 = data[5].length > 0 ? data[5][0].is_insert : false;
        is_update_7 = data[5].length > 0 ? data[5][0].is_update : false;
        is_read_7 = data[5].length > 0 ? data[5][0].is_read : false;
        // penyetujuan penerimaan penugasan
        is_insert_10 = data[6].length > 0 ? data[6][0].is_action : false;
      })).catch(e => { reject(e) })

      await core.checkSession(sid).then(async (r) => {
        if (r.status && r.user_type !== 'PUBLIC') {
          user_id = r.user_id;
          user_type = r.user_type;

          let complaint_verification = [];
          let complaint_study = [];
          let complaint_decision = [];
          let is_determination = false;
          let complaint_determination = [];
          let complaint_validation = [];

          return db.from('m_complaint AS mc')
            .select(
              'mc.idx_m_complaint',
              'tcv.idx_t_complaint_verification',
              'tcs.idx_t_complaint_study',
              'tcd.idx_t_complaint_decision',
              'mc.form_no',
              'mc.date',
              'mls.name AS legal_standing_name',
              'mc.manpower',
              'mc.description',
              'mc.hopes',
              'mo.value AS source_complaint_name',
              'ms.code AS status_code'
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
            .leftJoin('m_legal_standing AS mls', 'mc.idx_m_legal_standing', 'mls.idx_m_legal_standing')
            .leftJoin('m_status AS ms', 'ms.idx_m_status', 'mc.idx_m_status')
            .whereRaw(`mc.form_status=? AND mc.idx_m_complaint=? AND mc.record_status='A'`, [1, id])
            .then((rows) => items = parsed(rows))
            .then(async () => {
              // get complaint verification
              await db('t_complaint_verification AS a')
                .select(
                  'a.idx_t_complaint_verification',
                  'a.idx_m_complaint',
                  'a.remarks',
                  'b.name AS rejected_type_name',
                  db.raw(`concat(u.fullname, ' (',u.email,')') AS approved_name`),
                  'a.dcreate',
                  db.raw(`case when a.verification_type='0' then 'DITOLAK' else 'DITERIMA' end AS status_name`),
                  db.raw(`case when a.verification_type='0' then 'red' else 'green' end AS status_color`),
                  db.raw(`case when a.verification_type='0' then false else true end AS is_approve`),
                )
                .leftJoin('m_complaint_rejected_type AS b', 'a.idx_m_complaint_rejected_type', 'b.idx_m_complaint_rejected_type')
                .leftJoin('m_user AS u', db.raw(`cast(a.ucreate AS integer)`), 'u.idx_m_user')
                .whereRaw(`a.idx_m_complaint=? AND a.record_status='A'`, [id])
                .then((r) => complaint_verification = parsed(r))
                .catch(e => { console.log(e) }) || [];

              // get complaint study, formId = 3
              await db('t_complaint_study AS a')
                .select(
                  'a.idx_m_complaint',
                  'a.idx_t_complaint_study',
                  'a.notes',
                  'b.idx_m_violation',
                  'c.idx_m_disposition',
                  db.raw(`case when a.form_status='0' then true else false end as is_update`)
                )
                .leftJoin('m_violation AS b', 'a.idx_m_violation', 'b.idx_m_violation')
                .leftJoin('m_disposition AS c', 'a.idx_m_disposition', 'c.idx_m_disposition')
                .whereRaw(`a.idx_m_complaint=? AND a.record_status='A'`, [id])
                .then(async (r) => {
                  complaint_study = parsed(r);
                  console.log('study', complaint_study)
                  let study_event = [];
                  let study_incident = [];
                  let study_reported = [];
                  let study_violation = [];
                  let idx_study = complaint_study.map(e => e.idx_t_complaint_study);
                  let study_update = complaint_study.filter(e => e.is_update) || [];
                  is_update_3 = study_update.length > 0 && is_update_3 ? true : false;

                  await Promise.all([
                    db('t_complaint_study_event')
                      .select(
                        'idx_t_complaint_study',
                        'idx_t_complaint_study_event',
                        'event',
                        'date',
                        'notes',
                        'simple_app_no'
                      )
                      .whereIn('idx_t_complaint_study', idx_study)
                      .catch(e => { console.log(e) }),
                    db('t_complaint_study_incident AS a')
                      .select(
                        'a.idx_t_complaint_study',
                        'a.idx_t_complaint_study_incident',
                        'a.idx_m_work_unit',
                        'a.idx_m_city',
                        'a.start_date',
                        'a.end_date',
                        'a.notes',
                        'a.office_name',
                        'a.address',
                        'b.name AS work_unit_name',
                        db.raw(`concat(d.name,' - ',c.name) AS region_city_name`)
                      )
                      .leftJoin('m_work_unit AS b', 'a.idx_m_work_unit', 'b.idx_m_work_unit')
                      .leftJoin('m_city AS c', 'a.idx_m_city', 'c.idx_m_city')
                      .leftJoin('m_region AS d', 'c.idx_m_region', 'd.idx_m_region')
                      .whereIn('a.idx_t_complaint_study', idx_study)
                      .catch(e => { console.log(e) }),
                    db('t_complaint_study_reported')
                      .select(
                        'idx_t_complaint_study',
                        'idx_t_complaint_study_reported',
                        'name',
                        'identity_no',
                        'occupation'
                      )
                      .whereIn('idx_t_complaint_study', idx_study)
                      .catch(e => { console.log(e) }),
                    db('t_complaint_study_violation')
                      .select(
                        'idx_t_complaint_study',
                        'idx_t_complaint_study_violation',
                        db.raw(`cast(idx_m_violation AS integer) AS idx_m_violation`)
                      )
                      .whereIn('idx_t_complaint_study', idx_study)
                      .catch(e => { console.log(e) }),
                  ]).then(dt => {
                    study_event = dt[0];
                    study_incident = dt[1];
                    study_reported = dt[2];
                    study_violation = dt[3];

                    complaint_study.map(e => {
                      e.event = study_event.filter(a => a.idx_t_complaint_study == e.idx_t_complaint_study);
                      e.incident = study_incident.filter(a => a.idx_t_complaint_study == e.idx_t_complaint_study);
                      e.reported = study_reported.filter(a => a.idx_t_complaint_study == e.idx_t_complaint_study);
                      e.violation = study_violation.filter(a => a.idx_t_complaint_study == e.idx_t_complaint_study);
                    });
                  }).catch(e => { console.log(e) });
                }).catch(e => { console.log(e) }) || [];

              // get decision
              await db('t_complaint_decision AS a')
                .select(
                  'a.idx_t_complaint_decision',
                  'b.idx_m_disposition',
                  'c.idx_m_violation',
                  'a.notes',
                  'a.approved_by',
                  'a.approved_date',
                  db.raw(`concat(u.fullname,' (',u.email,')') AS approved_name`),
                  db.raw(`case when a.approved_by is not null then true else false end as is_approve`),
                  db.raw(`case when a.form_status='0' then true else false end as is_update`)
                )
                .leftJoin('m_disposition AS b', 'a.idx_m_disposition', 'b.idx_m_disposition')
                .leftJoin('m_violation AS c', 'a.idx_m_violation', 'c.idx_m_violation')
                .leftJoin('m_user AS u', 'a.approved_by', 'u.idx_m_user')
                .whereRaw(`a.idx_m_complaint=? AND a.record_status='A'`, [id])
                .then(async (r) => {
                  complaint_decision = parsed(r);
                  let decision_update = complaint_decision.filter(e => e.is_update) || [];
                  let decision_violation = []; let decision_attachment = [];
                  let idx_decision = complaint_decision.map(e => e.idx_t_complaint_decision);
                  is_update_4 = decision_update.length > 0 && is_update_4 ? true : false;

                  await Promise.all([
                    db('t_complaint_decision_violation')
                      .select(
                        'idx_t_complaint_decision',
                        'idx_t_complaint_decision_violation',
                        db.raw(`cast(idx_m_violation AS integer) AS idx_m_violation`)
                      )
                      .whereIn('idx_t_complaint_decision', idx_decision)
                      .catch(e => { console.log(e) }),
                    db('t_complaint_decision_attachment')
                      .select(
                        'idx_t_complaint_decision',
                        'idx_t_complaint_decision_attachment',
                        'description',
                        db.raw(`concat('${api_url}/others/open/', filename) AS url`),
                        'filename',
                        'mime_type',
                        'filesize'
                      )
                      .whereIn('idx_t_complaint_decision', idx_decision)
                  ]).then(dt => {
                    decision_violation = dt[0];
                    decision_attachment = dt[1];

                    let m = decision_violation.filter(a => violationType.includes(a.idx_m_violation)) || [];
                    is_determination = m.length > 0 ? true : false;

                    complaint_decision.map(e => {
                      e.violation = decision_violation.filter(a => a.idx_t_complaint_decision == e.idx_t_complaint_decision);
                      e.attachment = decision_attachment.filter(a => a.idx_t_complaint_decision == e.idx_t_complaint_decision);
                    })
                  }).catch(e => { console.log(e) });
                }).catch(e => { console.log(e) });

              // get data complaint determination
              await db('t_complaint_determination AS a')
                .select(
                  'a.idx_t_complaint_determination',
                  'a.date',
                  'a.notes',
                  db.raw(`concat(u.fullname,' (',u.email,')') AS name`),
                  db.raw(`true AS is_update`)
                )
                .leftJoin('m_user AS u', `a.determination_by`, 'u.idx_m_user')
                .whereRaw(`a.idx_m_complaint=? AND a.record_status='A'`, [id])
                .then(async (r) => {
                  complaint_determination = parsed(r);
                  let determination_update = complaint_determination.filter(e => e.is_update) || [];
                  let idx_determination = complaint_determination.map(e => e.idx_t_complaint_determination);
                  is_update_7 = determination_update.length > 0 && is_update_7 ? true : false;

                  await db('t_complaint_determination_user AS a')
                    .select(
                      'a.idx_t_complaint_determination',
                      'a.idx_t_complaint_determination_user',
                      'u.idx_m_user',
                      db.raw(`concat(u.fullname,' (',u.email,')') AS name`),
                    )
                    .leftJoin('m_user AS u', 'u.idx_m_user', 'a.idx_m_user')
                    .whereIn('a.idx_t_complaint_determination', idx_determination)
                    .then((r) => {
                      let cduser = parsed(r);

                      complaint_determination.map(e => {
                        e.users = cduser.filter(a => a.idx_t_complaint_determination == e.idx_t_complaint_determination)
                      });
                    }).catch(e => { console.log(e) })
                }).catch(e => { console.log(e) });

              // final mapping
              items.map(async (e) => {
                e.complaint = {
                  is_read: is_read_2,
                  is_update: is_update_2,
                  is_insert: is_insert_2,
                };

                e.complaint_verification = {
                  is_read: is_insert_5,
                  is_update: false,
                  is_insert: false,
                  items: complaint_verification
                };

                e.complaint_study = {
                  items: is_read_3 ? complaint_study : [],
                  is_read: is_read_3,
                  is_update: is_update_3,
                  is_insert: is_insert_3
                };

                e.complaint_decision = {
                  items: is_read_4 ? complaint_decision : [],
                  is_read: is_read_4,
                  is_update: is_update_4,
                  is_insert: is_insert_4,
                  is_determination: is_determination
                };

                e.complaint_decision_kumm = {
                  items: complaint_decision,
                  is_read: is_insert_10,
                  is_update: false,
                  is_insert: is_insert_10,
                  is_determination: is_determination
                };

                e.complaint_determination = {
                  items: is_read_7 ? complaint_determination : [],
                  is_read: is_read_7,
                  is_update: is_update_7,
                  is_insert: is_insert_7
                };

                e.validation = {
                  is_read: true,
                  is_update: true,
                  is_insert: true
                };
              });

              resolve(user_type == 'PUBLIC' ? [] : items)
            }).catch(e => { reject(e) })
        } else {
          resolve([])
        }
      });
    });
  }

  /**
   * 
   * @param {*} keyword 
   * @param {*} sid 
   * @returns 
   */
  getInquiry(keyword = null, sid = null, status_code = []) {
    let db = knex(opt);
    let user_id = null;
    let user_type = null;
    let idx_m_user_type = null;
    let items = [];
    let is_delete = false;
    let is_insert = false;
    let is_update = false;
    let is_verification = false; // id: 5, check di m_form | Verifikasi Pengaduan

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(async (r) => {
        if (r.status) {
          let users = [];
          user_id = r.user_id;
          user_type = r.user_type;
          idx_m_user_type = r.idx_m_user_type;

          console.log('r', r);

          if (idx_m_user_type == 3) {
            users = await db('t_complaint_determination_user AS a')
              .select('c.idx_m_complaint')
              .innerJoin('t_complaint_determination AS b', 'a.idx_t_complaint_determination', 'b.idx_t_complaint_determination')
              .innerJoin('m_complaint AS c', 'b.idx_m_complaint', 'c.idx_m_complaint')
              .whereRaw(`a.idx_m_user=?`, [user_id])
              .catch(e => console.log(e));

            users = users.map(e => e.idx_m_complaint);
          }

          is_verification = await core.checkRolesAction(sid, 5).catch(e => reject(e));
          is_verification = is_verification.length > 0 ? is_verification[0].is_action : false;

          return await core.checkRoles(sid, 2)
            .then((rs) => {
              is_delete = rs.length === 0 ? false : rs[0].is_delete
              is_insert = rs.length === 0 ? false : rs[0].is_insert
              is_update = rs.length === 0 ? false : rs[0].is_update

              return db.from('m_complaint AS mc')
                .select(
                  'mc.idx_m_complaint',
                  'mc.form_no',
                  'mc.date',
                  'mv.name AS violation_name',
                  'mc.description',
                  'mc.manpower',
                  'mo.text AS source_name',
                  'mo.option_id',
                  db.raw(`case when mc.ucreate=? then 'YOU' else null end as created_by`, [user_id]),
                  'ms.code AS status_code',
                  db.raw(`
                    case 
                      when mc.form_status='0' and ms.code=1 then concat('EDIT - ',ms.name)
                      when tcs.form_status='0' and ms.code=3 then concat('EDIT - ',ms.name)
                      when tcd.form_status='0' and ms.code=4 then concat('EDIT - ',ms.name)
                      when ms.code=4 and tca.count > 0 then concat('Tindak Lanjut oleh Inspektorat')
                    else ms.name end AS status_name
                  `),
                  db.raw(`
                    case 
                      when mc.form_status='0' and ms.code=1 then 'yellow darken-1'
                      when tcs.form_status='0' and ms.code=3 then 'yellow darken-1'
                      when tcd.form_status='0' and ms.code=4 then 'yellow darken-1'
                      when ms.code=2 and tcv.verification_type='0' then 'red darken-1'
                      else ms.color
                    end AS status_color
                  `),
                  db.raw(`case when mc.form_status = '1' AND tcv.idx_m_complaint is not null AND 1=? then true else false end AS is_process`, [user_type == 'PUBLIC' ? 0 : 1]),
                  db.raw(`case when mc.form_status='0' AND true=? AND mc.ucreate=? then true else false end is_delete`, [is_delete, user_id]),
                  db.raw(`case  when mc.form_status='0' AND true=? AND mc.ucreate=? then true else false end is_update`, [is_update, user_id]),
                  db.raw(`
                    case  when mc.form_status='1' AND tcv.idx_m_complaint is null 
                          AND tcv.verification_type is null AND true=?
                    then true else false end is_verification`, [is_verification]),
                )
                .leftJoin('m_violation AS mv', 'mc.idx_m_violation', 'mv.idx_m_violation')
                .leftJoin('t_complaint_verification AS tcv', 'mc.idx_m_complaint', 'tcv.idx_m_complaint')
                .leftJoin('t_complaint_study AS tcs', 'mc.idx_m_complaint', 'tcs.idx_m_complaint')
                .leftJoin('t_complaint_decision AS tcd', 'mc.idx_m_complaint', 'tcd.idx_m_complaint')
                .leftJoin('t_complaint_determination AS tcd2', 'mc.idx_m_complaint', 'tcd2.idx_m_complaint')
                .leftJoin('t_complaint_determination_user AS tcds', function () {
                  this.on('tcd2.idx_t_complaint_determination', '=', 'tcds.idx_t_complaint_determination')
                    .andOn(db.raw(`true=case when ?=3 then tcds.idx_m_user is not null AND tcds.idx_m_user=? else true end`, [user_id, idx_m_user_type])) // user_type (user_kumm)
                })
                .leftJoin('m_status AS ms', 'ms.idx_m_status', 'mc.idx_m_status')
                .leftJoin(
                  db('t_complaint_action')
                    .select(
                      'idx_m_complaint',
                      db.raw(`count(idx_m_complaint) AS count`)
                    )
                    .groupBy('idx_m_complaint')
                    .as('tca')
                  , 'mc.idx_m_complaint', 'tca.idx_m_complaint'
                )
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
                .andWhereRaw(`
                  CASE 
                    when 'PUBLIC'<>? THEN (mc.ucreate=? AND mc.form_status='0') OR (mc.ucreate=? AND mc.form_status='1') OR (mc.ucreate<>? AND mc.form_status='1')
                    ELSE mc.ucreate=? END
                `, [user_type, user_id, user_id, user_type, user_id])
                // hanya menampilkan data yg dia buat (submit atau draft), dan jika public maka data dia aja
                .andWhereRaw(`true=case when 'PUBLIC'<>? then true else mc.source_complaint='0' end`, [user_type])
                // by request cek di https://docs.google.com/spreadsheets/d/1F_fx_76FjK-jPK-gEvdWcB_gbS74hgfkTkaQFFLSRwo/edit#gid=2016917338
                .orderBy('mc.dcreate', 'desc')
                .debug()
                .then((rows) => items = JSON.parse(JSON.stringify(rows)))
                .then(async () => {
                  let incident = [];
                  let violation = [];

                  await db('m_complaint_incident AS a')
                    .select('a.idx_m_complaint', 'b.name AS work_unit_name')
                    .leftJoin('m_work_unit AS b', 'a.idx_m_work_unit', 'b.idx_m_work_unit')
                    .then((rows) => incident = parsed(rows))
                    .catch((e) => { reject(e) });

                  await db('m_complaint_violation AS a')
                    .select(
                      'a.idx_m_complaint_violation',
                      'b.idx_m_violation',
                      'b.name AS violation_name',
                      db.raw(`cast(a.idx_m_complaint as integer) AS idx_m_complaint`)
                    )
                    .leftJoin('m_violation AS b', 'a.idx_m_violation', 'b.idx_m_violation')
                    .then((rows) => violation = parsed(rows))
                    .catch((e) => { reject(e) });

                  items.map((e) => {
                    e.is_view = true;
                    e.incidents = incident.filter((a) => a.idx_m_complaint == e.idx_m_complaint)
                    e.violations = violation.filter((a) => a.idx_m_complaint == e.idx_m_complaint)
                  })

                  let filter = []
                  if (idx_m_user_type == 3) {
                    items = items.filter(e => users.includes(e.idx_m_complaint));  //for user kumm
                  }

                  filter = items.filter((e) => status_code.includes(e.status_code));

                  resolve([{
                    items: status_code.length > 0 ? filter : items,
                    is_insert: is_insert
                  }]);
                })
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
    let is_update = false;
    let is_action = false;
    let is_insert = false;
    let is_verification = false; // id: 5, check di m_form | Verifikasi Pengaduan
    let is_action_detail = false;
    let complaintLists = [];
    let complaintAttachment = [];
    let complaintEvent = [];
    let complaintIncident = [];
    let complaintReported = [];
    let complaintViolation = [];
    let complaintVerification = [];

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(async (r) => {
        if (r.status) {
          user_id = r.user_id
          user_type = r.user_type

          is_verification = await core.checkRolesAction(sid, 5).catch(e => reject(e));
          is_verification = is_verification.length > 0 ? is_verification[0].is_action : false;

          return await core.checkRoles(sid, 2).then((rs) => {
            is_delete = rs.length === 0 ? false : rs[0].is_delete
            is_insert = rs.length === 0 ? false : rs[0].is_insert
            is_update = rs.length === 0 ? false : rs[0].is_update

            return db.from('m_complaint AS mc')
              .select(
                'mc.idx_m_complaint',
                'mc.form_no',
                'mc.date',
                'mv.idx_m_violation',
                'mv.name AS violation_name',
                'mc.description',
                'mc.manpower',
                'mc.hopes',
                'ml.idx_m_legal_standing',
                'ml.name AS legal_standing_name',
                'mo.text AS source_name',
                'mc.source_complaint',
                db.raw(`case when mc.ucreate=? then 'YOU' else null end as created_by`, [user_id]),
                'ms.code AS status_code',
                db.raw(`
                    case 
                      when mc.form_status='0' and ms.code=1 then concat('EDIT - ',ms.name)
                      when tcs.form_status='0' and ms.code=3 then concat('EDIT - ',ms.name)
                      when tcd.form_status='0' and ms.code=4 then concat('EDIT - ',ms.name)
                      when ms.code=4 and tca.count > 0 then concat('Tindak Lanjut oleh Inspektorat')
                      else ms.name
                    end AS status_name
                  `),
                db.raw(`
                  case 
                    when mc.form_status='0' and ms.code=1 then 'yellow darken-1'
                    when ms.code=2 and tcv.verification_type='0' then 'red darken-1'
                    when tcs.form_status='0' and ms.code=3 then 'yellow darken-1'
                    when tcd.form_status='0' and ms.code=4 then 'yellow darken-1'
                    else ms.color
                  end AS status_color
                `),
                db.raw(`case when mc.form_status='0' AND true=? AND mc.ucreate=? then true else false end is_delete`, [is_delete, user_id]),
                db.raw(`case  when mc.form_status='0' AND true=? AND mc.ucreate=? then true else false end is_update`, [is_update, user_id]),
              )
              .leftJoin('m_violation AS mv', 'mc.idx_m_violation', 'mv.idx_m_violation')
              .leftJoin('m_legal_standing AS ml', 'mc.idx_m_legal_standing', 'ml.idx_m_legal_standing')
              .leftJoin('t_complaint_verification AS tcv', 'mc.idx_m_complaint', 'tcv.idx_m_complaint')
              .leftJoin('t_complaint_study AS tcs', 'mc.idx_m_complaint', 'tcs.idx_m_complaint')
              .leftJoin('t_complaint_decision AS tcd', 'mc.idx_m_complaint', 'tcd.idx_m_complaint')
              .leftJoin('t_complaint_determination AS tcd2', 'mc.idx_m_complaint', 'tcd2.idx_m_complaint')
              .leftJoin('m_status AS ms', 'ms.idx_m_status', 'mc.idx_m_status')
              .leftJoin(
                db('t_complaint_action')
                  .select(
                    'idx_m_complaint',
                    db.raw(`count(idx_m_complaint) AS count`)
                  )
                  .groupBy('idx_m_complaint')
                  .as('tca')
                , 'mc.idx_m_complaint', 'tca.idx_m_complaint'
              )
              .leftJoin('m_option AS mo', function () {
                this.on('mo.value', '=', 'mc.source_complaint')
                  .andOn('mo.option_id', '=', db.raw(`?`, ['1']))
              })
              .whereRaw("mc.idx_m_complaint = ?", [id])
              .andWhereRaw(`case when 'PUBLIC'<>? then 
                     (mc.ucreate=? AND mc.form_status='0')
                     OR (mc.ucreate=? AND mc.form_status='1')
                     OR (mc.ucreate<>? AND mc.form_status='1')
                  else mc.ucreate=? end`, [user_type, user_id, user_id, user_type, user_id])
              // hanya menampilkan data yg dia buat (submit atau draft), dan jika public maka data dia aja
              .andWhereRaw(`true=case when 'PUBLIC'<>? then true else mc.source_complaint='0' end`, [user_type])
              .then((rows) => {
                let parse = JSON.parse(JSON.stringify(rows))
                complaintLists = parse;
                is_action_detail = complaintLists.length === 0 ? false : complaintLists[0].is_update;
              })
              .then(() =>
                this.getComplaintAdditional(id, is_action_detail)
                  .then(data => {
                    complaintAttachment = data[0];
                    complaintEvent = data[1];
                    complaintIncident = data[2];
                    complaintReported = data[3];
                    complaintViolation = data[4];
                    complaintVerification = data[5];
                  }).catch((e) => { reject(e) })
              )
              .then(() => {
                complaintLists.map(e => {
                  e.attachment = complaintAttachment.filter(a => a.idx_m_complaint == e.idx_m_complaint);
                  e.event = complaintEvent.filter(a => a.idx_m_complaint == e.idx_m_complaint);
                  e.incident = complaintIncident.filter(a => a.idx_m_complaint == e.idx_m_complaint);
                  e.reported = complaintReported.filter(a => a.idx_m_complaint == e.idx_m_complaint);
                  e.violation = complaintViolation.filter(a => a.idx_m_complaint == e.idx_m_complaint);
                  e.verification = complaintVerification.filter(a => a.idx_m_complaint == e.idx_m_complaint);
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
  getComplaintAdditional(idx_m_complaint = 0, is_action = false) {
    let db = knex(opt);

    return Promise.all([
      db.from('m_complaint_attachment')
        .select(
          'idx_m_complaint_attachment',
          'idx_m_complaint',
          'description',
          db.raw(`concat('${api_url}/others/open/', filename) AS url`),
          'filename',
          'mime_type',
          'filesize',
          db.raw(`case when true=? then true else false end AS is_action`, [is_action])
        )
        .whereRaw(`true=case when ?=0 then true else idx_m_complaint=? end`, [idx_m_complaint, idx_m_complaint])
        .catch((e) => { console.log(e) }),
      db.from('m_complaint_event')
        .select(
          'idx_m_complaint_event',
          'idx_m_complaint',
          'event',
          'date',
          'notes',
          db.raw(`case when true=? then true else false end AS is_action`, [is_action])
        ).whereRaw(`true=case when ?=0 then true else idx_m_complaint=? end`, [idx_m_complaint, idx_m_complaint])
        .catch((e) => { console.log(e) }),
      db.from('m_complaint_incident AS ci')
        .select(
          'ci.idx_m_complaint_incident',
          'ci.idx_m_complaint',
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
        .whereRaw(`true=case when ?=0 then true else ci.idx_m_complaint=? end`, [idx_m_complaint, idx_m_complaint])
        .catch((e) => { console.log(e) }),
      db.from('m_complaint_reported')
        .select(
          'idx_m_complaint_reported',
          'idx_m_complaint',
          'name',
          'identity_no',
          'occupation',
          db.raw(`case when true=? then true else false end AS is_action`, [is_action])
        ).whereRaw(`true=case when ?=0 then true else idx_m_complaint=? end`, [idx_m_complaint, idx_m_complaint])
        .catch((e) => { console.log(e) }),
      db.from('m_complaint_violation AS a')
        .select(
          'a.idx_m_complaint_violation',
          'a.idx_m_complaint',
          'b.name AS violation_name',
          db.raw(`cast(a.idx_m_violation AS integer) AS idx_m_violation`)
        )
        .leftJoin('m_violation AS b', 'a.idx_m_violation', 'b.idx_m_violation')
        .whereRaw(`true=case when ?=0 then true else a.idx_m_complaint=? end`, [idx_m_complaint, idx_m_complaint]),
      db.from('t_complaint_verification AS a')
        .select(
          'a.idx_m_complaint',
          'a.idx_t_complaint_verification',
          db.raw(`case when a.verification_type='0' then 'DITOLAK' else 'DITERIMA' end AS verification_status`),
          db.raw(`case when a.verification_type='0' then false else true end AS is_verification`),
          'b.name AS rejected_type_name',
          'a.dcreate'
        )
        .leftJoin('m_complaint_rejected_type AS b', 'a.idx_m_complaint_rejected_type', 'b.idx_m_complaint_rejected_type')
        .whereRaw(`a.idx_m_complaint=? AND a.record_status='A'`, [idx_m_complaint])
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
      db.from('m_legal_standing')
        .select('idx_m_legal_standing', 'name')
        .where({ record_status: 'A' })
        .catch((e) => { reject(e) }),
      db.from('m_violation')
        .select('idx_m_violation', 'name')
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
      db.from('m_option')
        .select('text', 'value')
        .where({ option_id: '1' })
        .catch((e) => { reject(e) }),
    ])
      .then((rows) => rows)
      .catch((e) => { reject(e) })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} complaint 
   * @param {*} attachment 
   * @param {*} event 
   * @param {*} incident 
   * @param {*} reported 
   */
  saveComplaint(sid = null, complaint = {}, attachment = [], event = [], incident = [], reported = [], violation = []) {
    var db = knex(opt)
    let idx_m_complaint = null
    let user_id = null
    let user_type = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;
          user_type = r.user_type;

          complaint['idx_m_account'] = user_id
          complaint['ucreate'] = user_id
          complaint['idx_m_status'] = 1
          if (user_type == 'PUBLIC') { complaint['source_complaint'] = '0' }

          db.transaction(t => {
            return db('m_complaint')
              .insert(complaint)
              .transacting(t)
              .returning('idx_m_complaint')
              .then((rows) => {
                let arr = []
                idx_m_complaint = rows[0]

                // events
                for (let i = 0; i < event.length; i++) {
                  event[i]['idx_m_complaint'] = idx_m_complaint
                  event[i]['ucreate'] = user_id
                }

                // attachment
                for (let i = 0; i < attachment.length; i++) {
                  attachment[i]['idx_m_complaint'] = idx_m_complaint
                  attachment[i]['ucreate'] = user_id
                  attachment[i]['path'] = target_path
                }

                // incident
                for (let i = 0; i < incident.length; i++) {
                  incident[i]['idx_m_complaint'] = idx_m_complaint
                  incident[i]['ucreate'] = user_id
                }

                // reported
                for (let i = 0; i < reported.length; i++) {
                  reported[i]['idx_m_complaint'] = idx_m_complaint
                  reported[i]['ucreate'] = user_id
                }

                // violation
                let final_violation = [];
                for (let i = 0; i < violation.length; i++) {
                  final_violation.push({
                    idx_m_complaint: idx_m_complaint,
                    idx_m_violation: violation[i]
                  });
                }

                arr = [
                  db('m_complaint_attachment')
                    .insert(attachment).transacting(t)
                    .returning('idx_m_complaint_attachment'),
                  db('m_complaint_incident')
                    .insert(incident).transacting(t)
                    .returning('idx_m_complaint_incident'),
                  db('m_complaint_reported')
                    .insert(reported).transacting(t)
                    .returning('idx_m_complaint_reported'),
                  db('m_complaint_event')
                    .insert(event).transacting(t)
                    .returning('idx_m_complaint_event'),
                  db('m_complaint_violation')
                    .insert(final_violation).transacting(t)
                    .returning('idx_m_complaint_violation'),
                ];

                return Promise.all(arr)
                  .then((data) => console.log('data', data))
                  .catch((e) => { reject(e) })
              })
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(
              response.success('Pengaduan Anda berhasil di simpan.',
                [
                  {
                    form_no: complaint.form_no,
                    form_date: complaint.date
                  }
                ]
              )
            ))
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
    let complaintAttachment = [];
    let complaintEvent = [];
    let complaintIncident = [];
    let complaintReported = [];
    let complaintViolation = [];
    let formNo = null;
    let date = new Date();

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(async (r) => {
        if (r.status) {
          user_id = r.user_id;
          formNo = await this.buildRegNumber().catch((e) => { reject(e) });
          complaint['umodified'] = user_id
          complaint['dmodified'] = new Date()
          complaint['form_no'] = is_submit ? formNo : null
          complaint['date'] = is_submit ? date : null
          complaint['form_status'] = is_submit ? 1 : 0

          db.transaction(async (t) => {
            let final_violation = [];
            for (let i = 0; i < violation.length; i++) {
              final_violation.push({
                idx_m_violation: violation[i],
                idx_m_complaint: id
              });
            }

            return db('m_complaint_violation')
              .whereRaw(`idx_m_complaint=?`, [id])
              .del()
              .transacting(t)
              .then(res => db('m_complaint_violation')
                .insert(final_violation)
                .transacting(t)
                .then(async () => {
                  await this.getComplaintAdditional(id)
                    .then((data) => {
                      complaintAttachment = data[0];
                      complaintEvent = data[1];
                      complaintIncident = data[2];
                      complaintReported = data[3];
                      complaintViolation = data[4];
                    })
                    .then(async () => {
                      if (is_submit && (await helper.validateArrayVal(complaintIncident, ['start_date', 'end_date', 'idx_m_work_unit', 'idx_m_city']) || complaintIncident.length === 0)) {
                        resolve(response.failed('Tempat Kejadian Kolom Unit Kerja, Kota dan Waktu Kejadian TIDAK boleh kosong.'))
                      } else if (is_submit && (await helper.validateArrayVal(complaintReported, ['name']) || complaintReported === 0)) {
                        resolve(response.failed('Terlapor Kolom Nama Terlapor TIDAK boleh kosong.'))
                      } else if (is_submit && (await helper.validateArrayVal(complaintViolation, ['idx_m_violation']) || complaintViolation === 0)) {
                        resolve(response.failed('Terlapor Kolom Nama Terlapor TIDAK boleh kosong.'))
                      } else {
                        return db('m_complaint AS mc')
                          .transacting(t)
                          .update(complaint)
                          .whereRaw(`mc.idx_m_complaint=? AND mc.ucreate=? AND mc.form_status='0'`, [id, user_id])
                          .catch(e => reject(e))
                      }
                    })
                    .then(() => resolve(response.success(`Edit data pengaduan berhasil ${is_submit ? 'di submit' : 'di simpan'}.`)))
                    .catch(e => reject(e))
                })
              ).then(t.commit)
              .catch(t.rollback);
          }).catch((e) => { reject(e) })
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

            arr.push(db('m_complaint_event')
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
            return db('m_complaint_event')
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
            db('m_complaint_event')
              .delete()
              .where({ idx_m_complaint_event: id })
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

            arr.push(db('m_complaint_incident')
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
            db('m_complaint_incident')
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
            return db('m_complaint_incident')
              .delete()
              .where({ idx_m_complaint_incident: id })
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
          console.log(r)
          user_id = r.user_id;
          reported.data['umodified'] = r.user_id || null
          reported.data['dmodified'] = new Date()

          console.log(reported)

          db.transaction(t => {
            arr.push(db('m_complaint_reported')
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
            return db('m_complaint_reported')
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
            return db('m_complaint_reported')
              .delete()
              .where({ idx_m_complaint_reported: id })
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

  /** ============================================== ATTACHMENT
   * 
   * @param {*} sid 
   * @param {*} event 
   * @returns 
   */
  insertComplaintAttachment(sid = null, attachment = {}) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;
          attachment['path'] = target_path

          db.transaction(t => {
            return db('m_complaint_attachment')
              .insert(attachment)
              .transacting(t)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Lampiran file berhasil di simpan.')))
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
   * @param {*} attachment
   * @returns 
   */
  deleteComplaintAttachment(sid = null, id = null) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db.transaction(t => {
            return db('m_complaint_attachment')
              .delete()
              .where({ idx_m_complaint_attachment: id })
              .transacting(t)
              .then(t.commit)
              .catch(t.rollback)
          })
            .then(() => resolve(response.success('Lampiran berhasil di hapus.')))
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
            return db('m_complaint AS a')
              .select('a.idx_m_complaint')
              .transacting(t)
              .whereRaw(`a.idx_m_complaint=? AND a.form_status='0' AND a.ucreate=?`, [id, user_id])
              .then(async (rows) => {
                let parse = parsed(rows);
                if (parse.length > 0) {
                  await Promise.all([
                    db('m_complaint')
                      .transacting(t)
                      .where({
                        idx_m_complaint: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('m_complaint_attachment')
                      .transacting(t)
                      .where({
                        idx_m_complaint: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('m_complaint_incident')
                      .transacting(t)
                      .where({
                        idx_m_complaint: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('m_complaint_event')
                      .transacting(t)
                      .where({
                        idx_m_complaint: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('m_complaint_reported')
                      .transacting(t)
                      .where({
                        idx_m_complaint: id,
                        ucreate: user_id
                      })
                      .delete(),
                    db('m_complaint_violation')
                      .transacting(t)
                      .where({
                        idx_m_complaint: id,
                      })
                      .delete(),
                  ])
                    .then((data) => resolve(response.success('Pengaduan Anda sudah Kami hapus dari system.')))
                    .catch(e => reject(e))
                } else {
                  resolve(response.failed('Pengaduan yang sudah di SUBMIT TIDAK bisa di hapus.'))
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

  /**
   * 
   * REGNUMBER FORMAT
   * {WBSRI-2105-00001}
   */
  buildRegNumber() {
    let db = knex(opt);
    let lastNo = 0;
    let finalNo = 0;
    let regNo = null;
    let ym = moment().format('YYMM');

    return new Promise((resolve, reject) => {
      db('m_complaint')
        .select('form_no')
        .where((builder) => {
          builder.where({ form_status: 1 })
            .andWhereRaw(`form_no is not null`)
        })
        .orderBy('dcreate', 'desc')
        .limit(1)
        .then((rows) => {
          console.log(this.buildRegNumber.name, rows)
          let parse = parsed(rows);
          if (parse.length === 0) {
            regNo = `${appCode}-${ym}-0000${lastNo + 1}`;
          } else {
            let formNo = parse[0].form_no || ''
            let befNo = parse[0].form_no.substring(formNo.length - 5, formNo.length);
            befNo = parseInt(befNo) + 1;
            finalNo = `00000${befNo}`.substr(`00000${befNo}`.length - 5, `00000${befNo}`.length);
            regNo = `${appCode}-${ym}-${finalNo}`;
          }
          resolve(regNo)
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}

module.exports = PublicComplaint