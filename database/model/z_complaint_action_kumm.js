'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')

/**
 * Modul Pemeriksaan Pengaduan Atas Pelaksanaan Tugas Pengawasan Pelayanan Publik
oleh KUMM
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
    let is_verification = false; // id: 5, check di m_form | Verifikasi Pengaduan
    let fixed_status_code = ['2A', '3', '4', '5', '6'];
    let complaintDecision = [];
    let complaintAction = [];

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(async (r) => {
        if (r.status) {
          user_id = r.user_id;
          user_type = r.user_type;

          return await core.checkRoles(sid, 7)
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
                  db.raw(`case when tcd.approved_by is null AND tcd.approved_date is null then 'Telah diterima' else null end AS approve_status`, []),
                  db.raw(`case when tcd.approved_by is null AND tcd.approved_date is null AND true=? then true else false end AS is_submit`, [is_insert]),
                  db.raw(`case when tcd.approved_by is not null AND tcd.approved_date is not null AND true=? then true else false end AS is_determination`, [is_insert]),
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
                .andWhereRaw(`true=case when 'PUBLIC'=? then true else mc.form_status='1' end`, [user_type]) // hanya menampilkan data yg telah di submit, jika user_type <> PUBLIC
                .andWhereRaw(`true=case when 'PUBLIC'<>? then true else mc.source_complaint='0' end`, [user_type])
                .andWhereRaw(`mc.form_status=? AND tcv.verification_type=? AND tcs.form_status=? AND tcd.form_status=?`, [1, 1, 1, 1])
                .andWhereRaw(`tcd.idx_m_disposition in (2,3)`, [])
                .orderBy('mc.dcreate', 'desc')
                .then((rows) => items = JSON.parse(JSON.stringify(rows)))
                .then(() => {
                  let filter = []
                  filter = items.filter((e) => fixed_status_code.includes(e.status_code));
                  filter = filter.filter((e) => status_code.includes(e.status_code));

                  resolve([{
                    items: filter.length > 0 ? filter : items,
                    is_insert: is_insert
                  }])
                })
                .catch((e) => {
                  console.log(e)
                  reject(e)
                })
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
   * @param {*} sid 
   * @param {*} id 
   * @param {*} reject_type 
   * @returns 
   */
  approveByKUMM(sid = null, id = null, idx = null, attachment = []) {
    let db = knex(opt);
    let user_id = null;

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then((r) => {
          if (r.status) {
            user_id = r.user_id
            db.transaction((t) => {
              return db('t_complaint_decision')
                .update({
                  umodified: user_id,
                  dmodified: db.raw('current_timestamp'),
                  approved_by: user_id,
                  approved_date: db.raw('current_timestamp'),
                })
                .where({
                  idx_t_complaint_decision: id,
                  form_status: 1
                })
                .transacting(t)
                .returning('idx_t_complaint_decision')
                .then(async (rows) => {
                  return await db('m_complaint')
                    .update({ idx_m_status: 5 }) // update status to pengampu wbs (approve)
                    .where({ idx_m_complaint: idx })
                    .transacting(t)
                })
                .then(async () => {
                  return await db('t_complaint_decision_attachment')
                    .insert(attachment)
                    .transacting(t)
                })
                .then(() => resolve(response.success('Pengaduan sudah diterima KUMM.')))
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