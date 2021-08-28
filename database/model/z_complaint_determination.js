'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')

/**
 * Using for logon with public web
 */
class ComplaintDetermination {
  /**
   * 
   * @returns 
   */
  getAdditional() {
    let db = knex(opt);

    return Promise.all([
      db.from('m_user')
        .select(
          'idx_m_user',
          db.raw(`concat(email,' - ', fullname) AS name`)
        )
        .where({
          record_status: 'A',
          idx_m_user_type: 3
        })
        .catch((e) => {
          console.log(e)
        })
    ])
      .then((rows) => rows)
      .catch((e) => { console.log(e) })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @param {*} user_determination 
   * @param {*} date 
   * @param {*} determination_by 
   * @returns 
   */
  determinationSave(sid = null, id = null, user_determination = [], date = null, notes = null) {
    let db = knex(opt);
    let user_id = null;
    let idx_t_complaint_determination = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then((r) => {
          if (r.status) {
            user_id = r.user_id
            db.transaction((t) => {
              return db('t_complaint_determination')
                .insert({
                  idx_m_complaint: id,
                  date: date,
                  determination_by: user_id,
                  ucreate: user_id,
                  dcreate: db.raw('current_timestamp'),
                  record_status: 'A',
                  notes: notes
                })
                .transacting(t)
                .returning('idx_t_complaint_determination')
                .then((rows) => {
                  idx_t_complaint_determination = rows[0]
                  let final_users = []

                  for (let i = 0; i < user_determination.length; i++) {
                    final_users.push({
                      idx_m_user: user_determination[i],
                      idx_t_complaint_determination: idx_t_complaint_determination
                    })
                  }

                  return db('t_complaint_determination_user')
                    .insert(final_users)
                    .transacting(t)
                    .returning('idx_t_complaint_determination_user')
                    .then(async (rows) => await db('m_complaint')
                      .update({ idx_m_status: 6 }) // update status to still 5, cause ehen it end all step is disabled
                      .where({ idx_m_complaint: id })
                      .transacting(t)
                    )
                    .then(() => resolve(response.success('Form penetapan berhasil disimpan.')))
                    .catch((e) => { reject(e) })
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

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @param {*} notes 
   * @param {*} users 
   * @returns 
   */
  updateDetermination(sid = null, id = null, notes = null, users = [], idx = null) {
    let db = knex(opt);
    let user_id = null;

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then(async (r) => {
          if (r.status) {
            user_id = r.user_id;

            db.transaction(async t => {
              let fuser = []
              for (let i = 0; i < users.length; i++) {
                fuser.push({
                  ucreate: user_id,
                  idx_t_complaint_determination: id,
                  idx_m_user: users[i]
                })
              }

              console.log('luar biasa', fuser)
              console.log('id', id)
              return db('t_complaint_determination_user').del()
                .whereRaw(`idx_t_complaint_determination=?`, [id])
                .transacting(t)
                .then(async () => db('t_complaint_determination_user')
                  .transacting(t)
                  .insert(fuser))
                .then(async () => db('t_complaint_determination')
                  .transacting(t)
                  .update({
                    umodified: user_id,
                    dmodified: new Date(),
                    notes: notes,
                  })
                  .whereRaw(`idx_t_complaint_determination=?`, [id]))
                .then(async () => await db('m_complaint')
                  .update({ idx_m_status: 6 }) // update status to still 5, cause ehen it end all step is disabled
                  .where({ idx_m_complaint: idx })
                  .transacting(t))
                .then(t.commit)
                .catch(t.rollback);
            })
              .then(() => resolve(response.success('Update data success disimpan.')))
              .catch(e => reject(e))
              .finally(() => db.destroy())
          } else {
            resolve(response.failed('Session expires, please relogin.', true))
          }
        })
        .catch(e => console.log(e))
    })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  getDetermination(sid = null, id = null) {
    let db = knex(opt);
    let user_id = null;
    let is_new = false;
    let is_delete = false;
    let is_insert = false;
    let is_update = false;

    return new Promise(async (resolve, reject) => {
      await core.checkRoles(sid, 7)
        .then((rs) => {
          is_delete = rs.length === 0 ? false : rs[0].is_delete
          is_insert = rs.length === 0 ? false : rs[0].is_insert
          is_update = rs.length === 0 ? false : rs[0].is_update
        }).catch(e => { reject(e) })

      return await core.checkSession(sid).then((r) => {
        if (r.status) {
          user_id = r.user_id;

          db('t_complaint_determination as tc')
            .select(
              'tc.idx_t_complaint_determination',
              'tc.date',
              'tc.notes',
              'tc.determination_by',
            )
            .where({ idx_m_complaint: id })
            .then(async (rows) => {
              let parse = parsed(rows) || []

              return await this.getAdditionalDetermination()
                .then((d) => {
                  parse.map(e => {
                    e.users = d[0].filter(a => a.idx_t_complaint_determination == e.idx_t_complaint_determination)
                  });

                  resolve([{ items: parse }])
                }).catch(e => {
                  console.log(e)
                  reject(e)
                })
            })
            .catch((e) => { reject(e) })
            .finally(() => { db.destroy() });
        } else {
          resolve([])
        }
      })
        .catch((e) => reject(e))
    });
  }

  /**
   * 
   * @param {*} id 
   * @returns 
   */
  getAdditionalDetermination() {
    let db = knex(opt);

    return Promise.all([
      db.from('t_complaint_determination_user AS a')
        .select(
          'a.idx_t_complaint_determination',
          'a.idx_t_complaint_determination_user',
          'a.idx_m_user',
          db.raw(`concat(b.email,' - ',b.fullname) AS name`)
        )
        .leftJoin(`m_user AS b`, 'a.idx_m_user', 'b.idx_m_user')
        .catch((e) => {
          console.log(e)
        })
    ])
      .then((rows) => rows)
      .catch((e) => { console.log(e) })
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}

module.exports = ComplaintDetermination