'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')

/**
 * Modul Penanganan Pengaduan Oleh Inspektorat / Unit Kerja Terkait 
 */
class ComplaintAction {
  /**
   * 
   * @param {*} keyword 
   * @param {*} sid 
   * @returns 
   */
  getInquiry(keyword = null, sid = null, status_code) {
    let db = knex(opt);
    let user_id = null;
    let user_type = null;
    let items = [];
    let is_delete = false;
    let is_insert = false;
    let is_update = false;

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(async (r) => {
        if (r.status) {
          user_id = r.user_id;
          user_type = r.user_type;

          return await core.checkRoles(sid, 6)
            .then((rs) => {
              is_delete = rs.length === 0 ? false : rs[0].is_delete
              is_insert = rs.length === 0 ? false : rs[0].is_insert
              is_update = rs.length === 0 ? false : rs[0].is_update

              return db.from('m_complaint AS mc')
                .select(
                  'mc.idx_m_complaint',
                  'tcs.idx_t_complaint_study',
                  'tcd.idx_t_complaint_decision',
                  'mc.form_no',
                  'mc.date',
                  'mv.name AS violation_name',
                  'mc.description',
                  'mc.manpower',
                  'mo.text AS source_name',
                  'mo.option_id',
                  db.raw(`concat('Terdapat <b>',coalesce(tca.count,0),'</b> tindak lanjut') AS action_status`),
                  db.raw(`case when coalesce(tca2.count,0)>0 then ' dan telah <b>ditutup</b>' else '' end AS is_action_info`),
                  db.raw(`case when tcd.form_status=? then 'EDIT' else null end as edit_info`, [0]),
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
                  db.raw(`
                    case 
                      when mc.form_status = '1' 
                        AND COALESCE(tcv.verification_type,'0') = '1'
                        AND tcv.idx_m_complaint is not null
                        AND COALESCE(tcs.form_status,'0') = '1' 
                        AND COALESCE(tcd.form_status,'0') = '1'
                        AND COALESCE(tca.count,0) = 0
                        AND true=? 
                      then true else false end AS is_add_action
                  `, [is_insert]),
                )
                .leftJoin('m_violation AS mv', 'mc.idx_m_violation', 'mv.idx_m_violation')
                .leftJoin('t_complaint_verification AS tcv', 'mc.idx_m_complaint', 'tcv.idx_m_complaint')
                .leftJoin('t_complaint_study AS tcs', 'mc.idx_m_complaint', 'tcs.idx_m_complaint')
                .leftJoin('t_complaint_decision AS tcd', 'mc.idx_m_complaint', 'tcd.idx_m_complaint')
                .leftJoin('t_complaint_determination AS tcd2', 'mc.idx_m_complaint', 'tcd2.idx_m_complaint')
                .leftJoin(db
                  .select('ca.idx_m_complaint', db.raw(`count(ca.idx_m_complaint) AS count`))
                  .from('t_complaint_action AS ca')
                  .groupByRaw(`ca.idx_m_complaint`)
                  .as('tca')
                  , 'mc.idx_m_complaint', 'tca.idx_m_complaint')
                .leftJoin(db
                  .select('ca.idx_m_complaint', db.raw(`count(ca.idx_m_complaint) AS count`))
                  .from('t_complaint_action AS ca')
                  .whereRaw(`ca.is_close = ?`, [true])
                  .groupByRaw(`ca.idx_m_complaint`)
                  .as('tca2')
                  , 'mc.idx_m_complaint', 'tca2.idx_m_complaint')
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
                // sudah diterima kumm, dari pengampu WBS code 4
                .andWhereRaw(`mc.form_status=? AND tcv.verification_type=? AND tcs.form_status=? AND tcd.form_status=?`, [1, 1, 1, 1])
                .andWhereRaw(`tcd.idx_m_disposition not in (2,3)`, [])
                .orderBy('mc.dcreate', 'desc')
                .then((rows) => resolve([{ items: parsed(rows), is_insert: is_insert }]))
                .catch((e) => { reject(e) })
                .finally(() => { db.destroy() })
            })
            .catch(e => { reject(e) });
        } else {
          resolve([])
        }
      })
        .catch((e) => { reject(e) })
    })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  getAction(sid = null, id = null) {
    let db = knex(opt);
    let user_id = null;
    let is_new = false;
    let is_delete = false;
    let is_insert = false;
    let is_update = false;

    return new Promise(async (resolve, reject) => {
      await core.checkRoles(sid, 6)
        .then((rs) => {
          is_delete = rs.length === 0 ? false : rs[0].is_delete
          is_insert = rs.length === 0 ? false : rs[0].is_insert
          is_update = rs.length === 0 ? false : rs[0].is_update
        }).catch(e => { reject(e) })

      return await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db('t_complaint_action as tc')
            .select(
              'tc.idx_t_complaint_action',
              'tc.date',
              'tc.description',
              'tc.action_name',
              'tc.is_close',
              db.raw(`case when tc.is_close=true then 'Telah ditutup' else '' end AS status_name`)
            )
            .where({ idx_m_complaint: id })
            .then((rows) => {
              let parse = parsed(rows)
              let filter = parse.filter((e) => e.is_close === true) || [];
              is_new = filter.length > 0 ? false : true;

              parse.map(e => { e.is_delete = is_new && is_delete ? true : false; }) || [];
              resolve([{ items: parse, is_insert: is_new && is_insert ? true : false }])
            })
            .catch((e) => { reject(e) })
            .finally(() => { db.destroy() });
        } else {
          resolve([])
        }
      })
        .catch((e) => reject(e))
    })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @param {*} reject_type 
   * @returns 
   */
  actionSave(sid = null, id = null, date = null, action = null, description = null, is_close = false) {
    let db = knex(opt);
    let user_id = null;

    console.log('is_close', is_close)
    console.log('action', action)
    console.log('description', description)
    console.log('date', date)

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then((r) => {
          if (r.status) {
            user_id = r.user_id
            db.transaction((t) => {
              return db('t_complaint_action')
                .insert({
                  idx_m_complaint: id,
                  date: date,
                  description: description,
                  action_name: action,
                  is_close: is_close,
                  ucreate: user_id,
                  dcreate: db.raw('current_timestamp'),
                  record_status: 'A'
                })
                .transacting(t)
                .returning('idx_t_complaint_action')
                .then((rows) => resolve(response.success('Tindak lanjut berhasil disimpan.')))
                .catch((e) => {
                  console.log(e)
                  reject(e)
                })
                .finally(() => { db.destroy() })
            }).catch((e) => { reject(e) });
          } else {
            resolve(response.failed('Session expires, please relogin.', true))
          }
        })
        .catch((e) => {
          console.log(e)
          reject(e)
        })
    });
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}

module.exports = ComplaintAction