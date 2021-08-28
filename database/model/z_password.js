'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')
const { helper, hmac } = require('../../helper')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const appUrl = process.env.APP_URI;
const appLogo = process.env.APP_LOGO;

/**
 * Using for
 */
class PublicPassword {
  forgetPassword(email = null) {
    let idx_m_user = null;
    let fullname = null;
    let url_forget = uuidv4() + '-' + moment().format('YYMMDDTHHmmss');
    let forget_expires = moment().add(1, 'day')
    let db = knex(opt);

    return new Promise((resolve, reject) => {
      db.from('m_user')
        .select(
          'idx_m_user',
          'fullname'
        )
        .where({
          email: email,
          record_status: 'A',
          is_verify: true
        })
        .then((rows) => {
          let parse = JSON.parse(JSON.stringify(rows))
          idx_m_user = parse.length == 0 ? null : parse[0].idx_m_user;
          fullname = parse.length == 0 ? null : parse[0].fullname;
        })
        .then(() => {
          if (idx_m_user) {
            Promise.all([
              this.updateForgetPassword(idx_m_user, fullname, url_forget, forget_expires),
              this.sendMail(email, hmac.encryptText(url_forget), fullname, forget_expires)
            ])
              .then(data => resolve(response.success(`Permintaan perubahan password sudah Kami kirimkan ke ${email}.`)))
              .catch((e) => { reject(e) })
          } else {
            resolve(response.failed('Email Anda belum terdaftar atau Anda belum pernah melakukan verifikasi.'))
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  }

  /**
   * 
   * @param {*} to 
   * @param {*} url 
   * @param {*} fullname 
   * @param {*} forget_expires 
   * @returns 
   */
  sendMail(to = null, url = null, fullname = null, forget_expires = null) {
    return new Promise((resolve, reject) => {
      let subject = 'WBSRI change password';
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
  
      Permintaan perubahan password Anda sudah Kami terima, perubahan hanya valid sampai dengan waktu berikut ini ${forget_expires}, Silakan klik link di bawah ini untuk mengubah password Anda.
      <br />
      <a href="${appUrl}/change_password/${url}" target="_blank" class="link">KLIK DISINI</a><br />
  
      Atau <br />
      Untuk pengguna ponsel (Android/iOS)
      <ul>
      <li>1. Tekan pada <a href="${appUrl}/change_password/${url}" target="_blank">KLIK DISINI</a></li>
      <li>2. Kemudian pilih opsi Open in Browser</li>
      </ul>
      <br />
  
      Untuk pengguna Desktop PC/Laptop
      <ul>
      <li>1. Klik pada <a href="${appUrl}/change_password/${url}" target="_blank">KLIK DISINI</a></li>
      <li>2. Anda akan di arahkan pada browser, kemudian silakan merubah password Anda</li>
      </ul>
      <br /><br />
  
      <p>
      Jangan berikan email ini pada siapapun. Kesalahan pengunaan bukan tanggung jawab Kami. <br /><br />
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
              src="${appLogo}">
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
   * @param {*} idx_m_user 
   * @param {*} username 
   * @param {*} url_forget 
   * @param {*} forget_expires 
   * @returns 
   */
  updateForgetPassword(idx_m_user = null, fullname = null, url_forget = null, forget_expires = null) {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('m_user')
          .transacting(t)
          .update({
            url_forget: url_forget,
            forget_expires: forget_expires,
            dmodified: db.raw('current_timestamp'),
            umodified: fullname
          })
          .where({ idx_m_user: idx_m_user, record_status: 'A' })
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
   * @param {*} email 
   * @param {*} url_forget 
   * @param {*} forget_expires 
   * @param {*} password 
   * @returns 
   */
  changePassword(email = null, url_forget = null, password = null) {
    let db = knex(opt);
    let idx_m_user = null

    return new Promise((resolve, reject) => {
      db('m_user')
        .select('idx_m_user')
        .whereRaw(`email=? AND url_forget=? AND forget_expires >= current_timestamp`, [email, url_forget])
        .then((rows) => {
          let parse = JSON.parse(JSON.stringify(rows))
          idx_m_user = parse.length == 0 ? null : parse[0].idx_m_user;
        })
        .then(() => {
          if (idx_m_user) {
            Promise.all([
              this.updateAccount(idx_m_user, url_forget, password, email)
            ])
              .then(data => resolve(response.success(`Perubahan password Anda telah dilakukan, silakan login kembali`)))
              .catch((e) => { reject(e) })
          } else {
            resolve(response.failed('Email Anda salah atau waktu Anda telah expired.'))
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    });
  }

  /**
   * 
   * @param {*} idx_m_user 
   * @param {*} url_forget 
   * @param {*} password 
   * @param {*} username 
   * @returns 
   */
  updateAccount(idx_m_user = null, url_forget = null, password = null, username = null) {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db('m_user')
          .transacting(t)
          .update({
            passwd: db.raw('md5(?)', [password]),
            url_forget: null,
            forget_expires: db.raw('current_timestamp'),
            dmodified: db.raw('current_timestamp'),
            umodified: username
          })
          .where({
            idx_m_user: idx_m_user,
            url_forget: url_forget
          })
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
   * @param {*} sid 
   * @param {*} old_password 
   * @param {*} new_password 
   * @returns 
   */
  normalChangePassword(sid, old_password, new_password) {
    var db = knex(opt)
    let user_id = null

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then(r => {
        if (r.status) {
          user_id = r.user_id;

          db('m_user')
            .count()
            .where({
              idx_m_user: user_id,
              passwd: db.raw(`md5(?)`, [old_password])
            }).then(async r => {
              if (r.length > 0 && r[0].count > 0) {
                return db.transaction(t => {
                  return db('m_user')
                    .transacting(t)
                    .update({
                      passwd: db.raw(`md5(?)`, [new_password]),
                    })
                    .where({
                      idx_m_user: user_id,
                      passwd: db.raw(`md5(?)`, [old_password])
                    })
                    .then(t.commit)
                    .catch(t.rollback)
                })
                  .then((r) => resolve(response.success('Change password has been succeed')))
                  .catch(e => reject(e))
                  .finally(() => { db.destroy() })
              } else {
                resolve(response.failed('Old password isn`t match.'))
              }
            })
            .catch(e => reject(e))
        } else {
          resolve(response.failed('Session expires, please relogin.', true))
        }
      }).catch(e => reject(e))
    })
  }
}

module.exports = PublicPassword