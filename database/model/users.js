'use strict'
const { NODE_ENV, DEFAULT_PASSWD, APP_LOGO } = require('../../config')
const opt = require('../connection')[NODE_ENV]
const knex = require('knex')
const { gen } = require('n-digit-token')
const { response } = require('../../models/index')
const { helper } = require('../../helper')
const core = require('../core')
const form_id = 200;

class Users {
  /**
   * 
   * @param {*} sid 
   * @param {*} keyword 
   * @returns 
   */
  get(sid = null, keyword = null) {
    let db = knex(opt);
    let items = [];
    let idx_m_user = null;
    let user_type = null;
    let is_delete = false;
    let is_insert = false;
    let is_update = false;
    let is_role_action = false;

    return new Promise(async (resolve, reject) => {
      await core.checkRoles(sid, form_id)
        .then((rs) => {
          is_delete = rs.length === 0 ? false : rs[0].is_delete
          is_insert = rs.length === 0 ? false : rs[0].is_insert
          is_update = rs.length === 0 ? false : rs[0].is_update
        }).catch(e => { reject(e) })

      await core.checkRolesAction(sid, 201)
        .then((rs) => is_role_action = rs.length === 0 ? false : rs[0].is_action)
        .catch(e => { reject(e) })

      console.log('ract => ', is_role_action)

      await core.checkSession(sid)
        .then(async (r) => {
          if (r.status) {
            user_type = r.user_id;
            user_type = r.user_type;

            if (user_type === 'PUBLIC') {
              resolve([])
            } else {
              db('m_user AS mu')
                .select(
                  'mu.idx_m_user',
                  'mu.fullname',
                  'mu.identity_no',
                  'mu.phone_no',
                  'mu.email',
                  'ut.name AS user_type_name',
                  db.raw(`ut.idx_m_user_type AS idx_m_user_type`, []),
                  'mu.remarks',
                  'mu.is_login',
                  'mu.is_verify',
                  'mu.verify_date',
                  db.raw(`case when mu.record_status='A' AND true=? AND mu.idx_m_user_type <> ? then true else false end AS is_disable`, [is_update, -1]),
                  db.raw(`case when mu.record_status='N' AND true=? AND mu.idx_m_user_type <> ? then true else false end AS is_enable`, [is_update, -1]),
                  db.raw(`case when mu.record_status='A' AND true=? AND mu.idx_m_user_type <> ? then true else false end AS is_update`, [is_update, -1]),
                  db.raw(`case when mu.record_status='A' AND true=? AND mu.idx_m_user_type <> ? then true else false end AS is_role_action`, [is_role_action, -1])
                )
                .leftJoin(`m_user_type AS ut`, `mu.idx_m_user_type`, `ut.idx_m_user_type`)
                .where((builder) => {
                  if (keyword) {
                    builder.whereRaw("mu.fullname LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mu.identity_no LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mu.phone_no LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("ut.name LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mu.email LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                      .orWhereRaw("mu.remarks LIKE CONCAT('%',COALESCE(?,''),'%')", [keyword])
                  }
                }).then((r) => resolve([
                  {
                    items: JSON.parse(JSON.stringify(r)),
                    is_insert: is_insert
                  }
                ]))
                .catch(e => { reject(e) })
            }
          } else {
            resolve([])
          }
        })
        .catch(e => reject(e))
    });
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  getRolesById(sid, id) {
    let db = knex(opt)
    let is_role_action = false;

    return new Promise(async (resolve, reject) => {
      await core.checkRolesAction(sid, 201)
        .then((rs) => is_role_action = rs.length === 0 ? false : rs[0].is_action)
        .catch(e => { reject(e) })

      await db('m_form AS a')
        .select(
          'a.idx_m_form',
          db.raw(`concat(
            coalesce(a3.form_name,''), 
            case when a3.form_name is null then '' else ' > ' end,
            a.form_name 
          ) AS form_name`),
          'a.is_read_only',
          db.raw(`coalesce(t1.is_read,?) AS is_read`, [false]),
          db.raw(`coalesce(t2.is_update,?) AS is_update`, [false]),
          db.raw(`coalesce(t3.is_delete,?) AS is_delete`, [false]),
          db.raw(`coalesce(t4.is_insert,?) AS is_insert`, [false]),
        )
        .innerJoin('m_form AS a2', 'a.idx_m_form', 'a2.idx_m_form')
        .leftJoin('m_form AS a3', 'a2.idx_m_form_parent', 'a3.idx_m_form')
        .leftJoin(
          db('t_roles AS tr')
            .select('tr.idx_m_form', db.raw(`true AS is_read`, []))
            .leftJoin('m_user AS mu', 'tr.idx_m_user', 'mu.idx_m_user')
            .whereRaw(`mu.idx_m_user=? AND tr.role_value=true AND tr.role_action=?`, [id, 'R'])
            .as('t1')
          , 'a.idx_m_form', 't1.idx_m_form'
        )
        .leftJoin(
          db('t_roles AS tr')
            .select('tr.idx_m_form', db.raw(`true AS is_update`, []))
            .leftJoin('m_user AS mu', 'tr.idx_m_user', 'mu.idx_m_user')
            .whereRaw(`mu.idx_m_user=? AND tr.role_value=true AND tr.role_action=?`, [id, 'U'])
            .as('t2')
          , 'a.idx_m_form', 't2.idx_m_form'
        )
        .leftJoin(
          db('t_roles AS tr')
            .select('tr.idx_m_form', db.raw(`true AS is_delete`, []))
            .leftJoin('m_user AS mu', 'tr.idx_m_user', 'mu.idx_m_user')
            .whereRaw(`mu.idx_m_user=? AND tr.role_value=true AND tr.role_action=?`, [id, 'D'])
            .as('t3')
          , 'a.idx_m_form', 't3.idx_m_form'
        )
        .leftJoin(
          db('t_roles AS tr')
            .select('tr.idx_m_form', db.raw(`true AS is_insert`, []))
            .leftJoin('m_user AS mu', 'tr.idx_m_user', 'mu.idx_m_user')
            .whereRaw(`mu.idx_m_user=? AND tr.role_value=true AND tr.role_action=?`, [id, 'I'])
            .as('t4')
          , 'a.idx_m_form', 't4.idx_m_form'
        )
        .whereRaw(`a.record_status = ?`, ['A'])
        .orderByRaw(`a.form_sort ASC`)
        .then(r => resolve([{ items: parsed(r), is_action: is_role_action }]))
        .catch(e => { reject(e) })
    })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  getAdditionalUpdate(sid, id) {
    let db = knex(opt)

    try {
      return Promise.all([
        db('m_user_type')
          .select(
            'idx_m_user_type',
            'name'
          )
          .where({ record_status: 'A' })
          .andWhereRaw(`name <> ?`, ['PUBLIC']),
        this.getRolesById(sid, id)
      ]).then(rows => rows)
    } catch (error) {
      throw error
    }
  }

  /**
   * 
   */
  getAdditional() {
    let db = knex(opt)

    try {
      return Promise.all([
        db('m_user_type')
          .select('idx_m_user_type', 'name')
          .where({ record_status: 'A' })
          .andWhereRaw(`name <> ?`, ['PUBLIC']),
        db('m_form AS a')
          .select(
            'a.idx_m_form',
            db.raw(`concat(
          coalesce(a3.form_name,''), 
          case when a3.form_name is null then '' else ' > ' end,
          a.form_name 
        ) AS form_name`),
            'a.is_read_only',
            db.raw(`false AS is_read`),
            db.raw(`false AS is_update`),
            db.raw(`false AS is_delete`),
            db.raw(`false AS is_insert`),
          )
          .innerJoin('m_form AS a2', 'a.idx_m_form', 'a2.idx_m_form')
          .leftJoin('m_form AS a3', 'a2.idx_m_form_parent', 'a3.idx_m_form')
          .whereRaw(`a.record_status = ?`, ['A'])
          .orderBy('a.form_sort', 'asc')
          .catch(e => { reject(e) })
      ]).then(rows => rows)
    } catch (error) {
      throw error
    }
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @param {*} is_disable 
   * @returns 
   */
  disableUser(sid, id, is_disable = true) {
    let db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then(r => user_id = r.status ? r.user_id : null)
        .catch(e => { reject(e) })

      if (user_id) {
        db.transaction(t => {
          return db('m_user')
            .transacting(t)
            .update({
              record_status: is_disable ? 'N' : 'A',
              umodified: user_id,
              dmodified: db.raw('current_timestamp')
            })
            .where({ idx_m_user: id })
            .then(r => resolve(response.success(`${is_disable ? "Disable" : "Enable"} user has been succeed.`)))
            .catch(e => { reject(e) })
        })
      } else {
        resolve(response.failed('Session expires, please relogin.', true))
      }
    })
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} users as object
   * @param {*} roles as [] 
   * @returns 
   */
  saveUser(sid = null, users = {}, roles = []) {
    let db = knex(opt);
    let user_id = null;
    let isEmailExists = false;
    let token = gen(6)
    let passwd = `${DEFAULT_PASSWD}_${token}`
    users.passwd = passwd

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then(r => user_id = r.status ? r.user_id : null)
        .catch(e => { reject(e) })

      if (user_id) {
        await db('m_user')
          .where({ email: users.email })
          .select('idx_m_user')
          .then((r) => {
            let parse = parsed(r);
            isEmailExists = parse.length === 0 ? false : true
          })
          .catch(e => { reject(e) })

        if (isEmailExists) {
          resolve(response.failed('Email already exists, please use another email address.'))
        } else {
          await db.transaction(t => {
            return db('m_user')
              .transacting(t)
              .insert({
                email: users.email,
                passwd: db.raw(`md5(?)`, [users.passwd]),
                fullname: users.fullname,
                identity_no: users.identity_no,
                phone_no: users.phone_no,
                idx_m_user_type: users.idx_m_user_type,
                is_verify: true
              })
              .returning('idx_m_user')
              .then(async r => Promise.all([
                db('t_roles')
                  .transacting(t)
                  .insert(await this.extractRoles(roles, r[0]))
                  .returning('idx_t_roles'),
                this.sendMail(users.email, passwd, users.fullname)
              ])
                .then(r => resolve(response.success(`User berhasil di buat, dan credential berhasil dikirim ke ${users.email}`)))
                .catch(e => { reject(e) })
              )
              .then(t.commit)
              .catch(t.rollback)
          }).catch(e => reject(e))
        }
      } else {
        resolve(response.failed('Session expires, please relogin.', true))
      }
    })
      .catch(e => { throw (e) });
  }

  /**
   * 
   * @param {*} roles 
   * @param {*} idx_m_user 
   * @returns 
   */
  extractRoles(roles = [], idx_m_user = null) {
    return new Promise(resolve => {
      let o = [];
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].is_read === true) {
          o.push({
            idx_m_form: roles[i].idx_m_form,
            idx_m_user: idx_m_user,
            role_action: 'R',
            role_value: true
          })
        }

        if (roles[i].is_update === true) {
          o.push({
            idx_m_form: roles[i].idx_m_form,
            idx_m_user: idx_m_user,
            role_action: 'U',
            role_value: true
          })
        }

        if (roles[i].is_delete === true) {
          o.push({
            idx_m_form: roles[i].idx_m_form,
            idx_m_user: idx_m_user,
            role_action: 'D',
            role_value: true
          })
        }

        if (roles[i].is_insert === true) {
          o.push({
            idx_m_form: roles[i].idx_m_form,
            idx_m_user: idx_m_user,
            role_action: 'I',
            role_value: true
          })
        }
      }

      resolve(o)
    })
  }

  /**
     * 
     * @param {*} to 
     * @param {*} token
     */
  sendMail(to = null, token = null, fullname = null) {
    return new Promise((resolve, reject) => {
      let subject = 'WBS 2.0';
      let body = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>${subject}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style type="text/css">
            #outlook a {
                padding: 0;
            }
        
            .ReadMsgBody {
                width: 100%;
            }
        
            .ExternalClass {
                width: 100%;
            }
        
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }
        
            body,
            table,
            td,
            p,
            a,
            li,
            blockquote {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
        
            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
        
            img {
                -ms-interpolation-mode: bicubic;
            }
        
            html,
            body,
            .body-wrap,
            .body-wrap-cell {
                margin: 0;
                padding: 0;
                background: #ffffff;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
                color: #464646;
                text-align: left;
            }
        
            img {
                border: 0;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }
        
            table {
                border-collapse: collapse !important;
            }
        
            td,
            th {
                text-align: left;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
                color: #464646;
                line-height: 1.5em;
            }
        
            b a,
            .footer a {
                text-decoration: none;
                color: #464646;
            }
        
            a.blue-link {
                color: blue;
                text-decoration: underline;
            }
        
            td.center {
                text-align: center;
            }
        
            .left {
                text-align: left;
            }
        
            .body-padding {
                padding: 24px 40px 40px;
            }
        
            .border-bottom {
                border-bottom: 1px solid #D8D8D8;
            }
        
            table.full-width-gmail-android {
                width: 100% !important;
            }
        
            .header {
                font-weight: bold;
                font-size: 16px;
                line-height: 16px;
                height: 16px;
                padding-top: 19px;
                padding-bottom: 7px;
            }
        
            .header a {
                color: #464646;
                text-decoration: none;
            }
        
            a:hover {
                background-color: lemonchiffon;
            }
        
            a:active {
                box-shadow: none;
                top: 5px;
            }
        
            .footer a {
                font-size: 12px;
            }
            </style>
        
            <style type="text/css" media="only screen and (max-width: 650px)">
            @media only screen and (max-width: 650px) {
                * {
                font-size: 16px !important;
                }
        
                table[class*="w320"] {
                width: 320px !important;
                }
        
                td[class="mobile-center"],
                div[class="mobile-center"] {
                text-align: center !important;
                }
        
                td[class*="body-padding"] {
                padding: 20px !important;
                }
        
                td[class="mobile"] {
                text-align: right;
                vertical-align: top;
                }
            }
            </style>
        </head>
        
        <body style="padding:0; margin:0; display:block; background: #f8f8f8; -webkit-text-size-adjust:none">
            <table class="w320 full-width-gmail-android" bgcolor="#f9f8f8"
            background="https://www.filepicker.io/api/file/al80sTOMSEi5bKdmCgp2" style="background-color:transparent"
            cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td width="100%" height="48" valign="top">
                <!--[if gte mso 9]>
                    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;height:49px;">
                    <v:fill type="tile" src="https://www.filepicker.io/api/file/al80sTOMSEi5bKdmCgp2" color="#ffffff" />
                    <v:textbox inset="0,0,0,0">
                    <![endif]-->
                <table class="full-width-gmail-android" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                    <td class="header center" width="100%">
                        ${subject}
                    </td>
                    </tr>
                </table>
                <!--[if gte mso 9]>
                    </v:textbox>
                    </v:rect>
                    <![endif]-->
                </td>
            </tr>
            </table>
        
            <p>
            Halo <b>${fullname}</b>, <br /><br />
        
            <table border="1">
            <tr>
                <td colspan="2" style="font-weight: bold;">Berikut adalah kredensial login Anda.</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Username</td>
                <td>${to}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Password</td>
                <td>${token}</td>
            </tr>
            </table>
        
            <p>
            Jangan berikan kredesial Anda pada siapapun. Kesalahan pengunaan bukan tanggung jawab Kami. <br /><br />
            </p>
        
            <table cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td class="left" style="text-align:left;">
                <b>Terima Kasih,</b>
                </td>
            </tr>
            <tr>
                <td class="left" style="text-align:left;">
                Ombudsman Republik Indonesia,
                </td>
            </tr>
            <tr>
                <td class="left" width="129" height="20" style="padding-top:10px; text-align:left;">
                <img class="left" style="margin-left: 10px;" width="64" height="64"
                    src="${APP_LOGO}">
                </td>
            </tr>
            </table>
            </p>
        </body>
        
        </html>
        `;

      resolve(helper.sendMail(to, subject, body))
    });
  }

  /**
   * 
   * @param {*} sid 
   * @param {*} idx_m_user 
   * @param {*} users 
   * @param {*} roles 
   * @returns 
   */
  updateUsers(sid, idx_m_user, users = {}, roles = []) {
    let db = knex(opt);
    let user_id = null;

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid)
        .then(r => user_id = r.status ? r.user_id : null)
        .catch(e => { reject(e) })

      if (user_id) {
        users.dmodified = new Date();
        users.umodified = user_id;

        db.transaction(t => {
          return db('t_roles')
            .transacting(t)
            .where({
              idx_m_user: idx_m_user,
              record_status: 'A',
              role_value: true
            })
            .del()
            .then(async (r) => db('t_roles')
              .transacting(t)
              .insert(await this.extractRoles(roles, idx_m_user))
              .returning('idx_t_roles')
              .catch(e => { reject(e) })
            )
            .then(async (r) => db('m_user')
              .transacting(t)
              .update(users)
              .where({ idx_m_user: idx_m_user })
              .catch(e => { reject(e) })
            )
            .then(t.commit)
            .catch(t.rollback)
        })
          .then(() => resolve(response.success('User berhasil di edit.')))
          .catch(e => { reject(e) })
      } else {
        resolve(response.failed('Session expires, please relogin.', true))
      }
    })
      .catch(e => console.log(e))
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}

module.exports = Users