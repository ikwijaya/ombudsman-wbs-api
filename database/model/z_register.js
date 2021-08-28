'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const { helper } = require('../../helper')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const APP_URL = process.env.APP_URI;
const APP_LOGO = process.env.APP_LOGO;
const APP_CODE = process.env.APP_CODE;

/**
 * Using for logout with public web
 */
class PublicRegister {
    /**
     * 
     * @param {*} email 
     * @param {*} fullname 
     * @param {*} identityNo 
     * @param {*} phoneNo 
     * @param {*} password 
     * @returns 
     */
    getRegister(email = null, fullname = null, identityNo = null, phoneNo = null, password = null) {
        let isValid = false;
        let db = knex(opt);
        let url_verify = uuidv4() + '-' + moment().format('YYMMDDTHHmmss');

        return new Promise((resolve, reject) => {
            db.from('m_user')
                .select('email')
                .where({
                    email: email,
                    is_verify: true
                })
                .then((rows) => {
                    let parse = JSON.parse(JSON.stringify(rows))
                    isValid = parse.length == 0 ? true : false;
                })
                .then(() => {
                    if (isValid) {
                        Promise.all([
                            this.insertRegister(url_verify, email, fullname, identityNo, phoneNo, password),
                            this.sendMail(email, url_verify, fullname)
                        ])
                            .then(data => {
                                console.log(data);
                                resolve(response.success('Register berhasil, silakan cek email Anda untuk melakukan verifikasi terhadap akun Anda.', []))
                            })
                            .catch((e) => { reject(e) })
                    } else {
                        resolve(response.failed('Email sudah digunakan silakan gunakan email lain.'))
                    }
                })
                .catch((e) => { reject(e) })
                .finally(() => { db.destroy() })
        })
    }

    /**
     * 
     * @param {*} to 
     * @param {*} url_verify 
     */
    sendMail(to = null, url_verify = null, fullname = null) {
        return new Promise((resolve, reject) => {
            let subject = `${APP_CODE} Verifikasi Registrasi Akun`;
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
                
                    Permintaan registrasi Anda, telah Kami terima. Untuk melanjutkan, silakan klik tautan berikut ini.
                    <br />
                    <a href="${APP_URL}/verify/${url_verify}" target="_blank" class="link">KLIK DISINI</a><br />
                
                    Atau <br />
                    Untuk pengguna ponsel (Android/iOS)
                    <ul>
                    <li>1. Tekan pada <a href="${APP_URL}/verify/${url_verify}" target="_blank">KLIK DISINI</a></li>
                    <li>2. Kemudian pilih opsi Open in Browser</li>
                    <li>3. Kemudian system akan melakukan verifikasi terhadap akun Anda</li>
                    <li>4. Setelah berhasil Anda bisa melakukan Login ke system dengan kredensial yang Kami berikan</li>
                    </ul>
                    <br />
                
                    Untuk pengguna Desktop PC/Laptop
                    <ul>
                    <li>1. Klik pada <a href="${APP_URL}/verify/${url_verify}" target="_blank">KLIK DISINI</a></li>
                    <li>2. Anda akan di arahkan pada browser, kemudian system akan melakukan verifikasi terhadap akun Anda</li>
                    <li>3. Setelah berhasil Anda bisa melakukan Login ke system dengan kredensial yang Kami berikan</li>
                    </ul>
                    <br /><br />
                
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
                        <td>Your password</td>
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
     * @param {*} email 
     * @param {*} fullname 
     * @param {*} identityNo 
     * @param {*} phoneNo 
     * @param {*} password 
     * @returns 
     */
    insertRegister(url_verify = null, email = null, fullname = null, identityNo = null, phoneNo = null, password = null) {
        var db = knex(opt)
        return new Promise(async (resolve, reject) => {

            db.transaction((t) => {
                return db('m_user')
                    .transacting(t)
                    .insert({
                        record_status: 'A',
                        idx_m_user_type: -1,
                        is_verify: false,
                        url_verify: url_verify,
                        expires: db.raw(`current_timestamp + interval '12h'`, []),
                        ucreate: email,
                        dcreate: db.raw('current_timestamp'),
                        email: email,
                        fullname: fullname,
                        identity_no: identityNo,
                        phone_no: phoneNo,
                        passwd: db.raw('md5(?)', [password])
                    })
                    .then(t.commit)
                    .catch(t.rollback)
            })
                .then((r) => resolve(r))
                .catch(e => reject(e))
                .finally(() => { db.destroy() })
        })
    }
}

module.exports = PublicRegister