const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const crypto = require('crypto');
const core = require('./core');
const { response } = require('../../models/index');
const { helper } = require('../../helper')
const sequelize = require('..');
const { APP_URI, APP_LOGO, APP_CODE } = require('../../config')

module.exports = {
  /**
   * 
   * @param {*} obj 
   * @returns 
   */
  async register(obj = {}) {
    const t = await sequelize.transaction();
    const url_verify = await helper.token(56);

    try {
      let c = await models.users.count(
        {
          where: { email: obj.email, is_verify: true }
        }
      );

      if (c > 0) return response.failed('Email sudah digunakan silakan gunakan email lain.');
      if(!obj['filename']) return response.failed('Silakan masukan softcopy dari kartu indentitas Anda, misal KTP.');

      obj['is_verify'] = false;
      obj['url_verify'] = url_verify;
      obj['expires'] = moment(new Date()).add(12, 'h');
      obj['ucreate'] = obj['email'];
      obj['dcreate'] = new Date();
      obj['passwd'] = crypto.createHash('md5').update(obj['passwd']).digest('hex');
      obj['idx_m_user_type'] = -1;

      await models.users.create(obj, { transaction: t });
      await t.commit();

      await this.sendMail(obj['email'], url_verify, obj['fullname']);
      return response.success('Register berhasil, silakan cek email Anda untuk melakukan verifikasi terhadap akun Anda.')
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  },

  /**
   * 
   * @param {*} to 
   * @param {*} url_verify 
   * @param {*} fullname 
   * @returns 
   */
  async sendMail(to = null, url_verify = null, fullname = null) {
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
                <a href="${APP_URI}/verify/${url_verify}" target="_blank" class="link">KLIK DISINI</a><br />
            
                Atau <br />
                Untuk pengguna ponsel (Android/iOS)
                <ul>
                <li>1. Tekan pada <a href="${APP_URI}/verify/${url_verify}" target="_blank">KLIK DISINI</a></li>
                <li>2. Kemudian pilih opsi Open in Browser</li>
                <li>3. Kemudian system akan melakukan verifikasi terhadap akun Anda</li>
                <li>4. Setelah berhasil Anda bisa melakukan Login ke system dengan kredensial yang Kami berikan</li>
                </ul>
                <br />
            
                Untuk pengguna Desktop PC/Laptop
                <ul>
                <li>1. Klik pada <a href="${APP_URI}/verify/${url_verify}" target="_blank">KLIK DISINI</a></li>
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
  },
  /**
   * 
   * @param {*} url_verify 
   * @returns 
   */
  async verify(url_verify = null) {
    const t = await sequelize.transaction();

    try {
      let v = await models.users.findOne({
        attributes: ['fullname', 'idx_m_user', 'email'],
        where: {
          record_status: 'A',
          is_verify: false,
          url_verify: url_verify
        }
      });

      if (v instanceof models.users) {
        let c = await models.users.count({ where: { email: v.getDataValue('email'), is_verify: true } });
        if (c > 0) return response.failed('Email sudah digunakan silakan gunakan email lain.');
      }

      if (!v) return response.success('Url verifikasi TIDAK valid atau akun Anda sudah ter-verifikasi.');
      await models.users.update(
        {
          is_verify: true,
          verify_date: new Date(),
          dmodified: new Date(),
          umodified: v.getDataValue('fullname')
        },
        {
          where: { idx_m_user: v.getDataValue('idx_m_user') },
          transaction: t
        }
      )
      await models.roles.bulkCreate([
        {
          idx_m_form: 0,  // dashboard
          idx_m_user: v.getDataValue('idx_m_user'),
          role_value: true,
          role_action: 'R'
        },
        {
          idx_m_form: 1,  // pengaduan
          idx_m_user: v.getDataValue('idx_m_user'),
          role_value: true,
          role_action: 'R'
        },
        {
          idx_m_form: 1,  // pengaduan
          idx_m_user: v.getDataValue('idx_m_user'),
          role_value: true,
          role_action: 'U'
        },
        {
          idx_m_form: 1,  // pengaduan
          idx_m_user: v.getDataValue('idx_m_user'),
          role_value: true,
          role_action: 'D'
        },
        {
          idx_m_form: 1,  // pengaduan
          idx_m_user: v.getDataValue('idx_m_user'),
          role_value: true,
          role_action: 'I'
        },
      ], {
        transaction: t
      });

      await t.commit();
      return response.success('Verifikasi Anda berhasil, silakan login melakukan login.')
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  },

  /**
   * 
   * @param {*} email 
   * @returns 
   */
  async forget(email = null) {
    const t = await sequelize.transaction();
    const forget_expires = moment().add(1, 'day');
    const url_forget = await helper.token(56);

    try {
      let v = await models.users.findOne({
        attributes: ['idx_m_user', 'fullname'],
        where: {
          email: email,
          record_status: 'A',
          is_verify: true
        }
      })

      if (!v) return response.failed('Email Anda belum terdaftar atau Anda belum pernah melakukan verifikasi.')
      await models.users.update(
        {
          url_forget: url_forget,
          forget_expires: forget_expires,
          dmodified: new Date(),
          umodified: v.getDataValue('fullname')
        },
        {
          where: {
            idx_m_user: v.getDataValue('idx_m_user'),
            record_status: 'A'
          },
          transaction: t
        }
      )

      await this.sendMailForget(email, url_forget, v.getDataValue('fullname'), forget_expires)
      await t.commit();
      return response.success(`Permintaan perubahan password sudah Kami kirimkan ke ${email}.`)
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  },

  /**
   * 
   * @param {*} to 
   * @param {*} url 
   * @param {*} fullname 
   * @param {*} forget_expires 
   * @returns 
   */
  async sendMailForget(to = null, url = null, fullname = null, forget_expires = null) {
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
          <a href="${APP_URI}/ChangePassword/${url}" target="_blank" class="link">KLIK DISINI</a><br />
      
          Atau <br />
          Untuk pengguna ponsel (Android/iOS)
          <ul>
          <li>1. Tekan pada <a href="${APP_URI}/ChangePassword/${url}" target="_blank">KLIK DISINI</a></li>
          <li>2. Kemudian pilih opsi Open in Browser</li>
          </ul>
          <br />
      
          Untuk pengguna Desktop PC/Laptop
          <ul>
          <li>1. Klik pada <a href="${APP_URI}/ChangePassword/${url}" target="_blank">KLIK DISINI</a></li>
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
  },

  /**
   * 
   * @param {*} email 
   * @returns 
   */
  async forget_change_password(obj = null) {
    const t = await sequelize.transaction();

    try {
      let v = await models.users.findOne(
        {
          attributes: ['idx_m_user', 'fullname', 'email'],
          where: {
            email: obj['email'],
            url_forget: obj['url_forget'],
            forget_expires: {
              [Op.gte]: new Date()
            }
          }
        }
      )

      if (!v) return response.failed('Email Anda salah atau waktu Anda telah expired.')
      await models.users.update(
        {
          passwd: crypto.createHash('md5').update(obj['passwd']).digest('hex'),
          url_forget: null,
          forget_expires: new Date(),
          dmodified: new Date(),
          umodified: v.getDataValue('email')
        },
        {
          transaction: t,
          where: {
            idx_m_user: v.getDataValue('idx_m_user'),
            url_forget: obj['url_forget'],
          }
        }
      )

      await t.commit();
      return response.success('Perubahan password Anda telah dilakukan, silakan login kembali')
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  },

  /**
   * 
   * @param {*} obj 
   * @returns 
   */
  async change_password(sid = null, old_password, new_password) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0) return response.failed('Session expires')

      let c = await models.users.count({
        where: {
          idx_m_user: sessions[0].user_id,
          passwd: crypto.createHash('md5').update(old_password).digest('hex')
        }
      })

      if (c === 0) return response.failed('Password lama tidak sesuai')
      await models.users.update(
        { passwd: crypto.createHash('md5').update(new_password).digest('hex') },
        {
          transaction: t,
          where: { idx_m_user: sessions[0].user_id }
        }
      )

      await t.commit();
      return response.success('Password berhasil dirubah')
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  },
}