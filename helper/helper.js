
/**
 * Author: ikwijaya
 * History:
 * -  12 May 2020 - ikwijaya - initial coding
 */

const {
  EMAIL_AUTH, EMAIL_PASS, EMAIL_HOST,
  EMAIL_PORT, EMAIL_SECURE, EMAIL_DEBUG, EMAIL_LOGGER
} = require('../config')
const moment = require('moment')
const { response, ext } = require('../models')
const mailer = require('nodemailer')
const fs = require('fs')
const mv = require('mv')
const git = require('git-last-commit')
const email_auth = EMAIL_AUTH
const email_pass = EMAIL_PASS
const email_host = EMAIL_HOST
const email_port = EMAIL_PORT
const email_secure = EMAIL_SECURE
const email_debug = EMAIL_DEBUG
const email_logger = EMAIL_LOGGER

module.exports = {
  dayToIndo(key) {
    let day = null;
    if (key) key = key.toLowerCase();

    switch (key) {
      case 'monday':
        day = 'Senin';
        break;
      case 'tuesday':
        day = 'Selasa';
        break;
      case 'wednesday':
        day = 'Rabu';
        break;
      case 'thursday':
        day = 'Kamis';
        break;
      case 'friday':
        day = 'Jum`at';
        break;
      case 'saturday':
        day = 'Sabtu';
        break;
      case 'sunday':
        day = 'Minggu';
        break;

      default:
        break;
    }

    return day;
  },

  async getGitCommit() {
    return new Promise(async (res) => {
      git.getLastCommit(function (e, c) { res(c) })
    })
  },

  /**
   * 
   * @param {*} n 
   * @returns 
   */
  token: (n = 48) => {
    return new Promise((o, x) => {
      let format = 'MMmmYYHHDDmmss.SSS'
      require('crypto').randomBytes(n, function (e, buff) {
        if (e) x(e)
        let t = buff.toString('hex')
        let m = moment().format(format);
        o(`${t}${m}`)
      })
    })
  },

  /**
   * @url
   */
  getFilename: (url = '') => {
    return new Promise(resolve => {
      let split = [];
      let max = null;
      let filename = null;

      if (url.indexOf('/') > -1) {
        // get filename
        split = url ? url.split('/') : [];
        max = split.length > 0 ? Math.max(split.length) : null;
        filename = max ? split[max - 1] : null;
        resolve(filename);
      } else {
        resolve(null)
      }
    })
  },

  /**
   * 
   * @param {*} filename 
   */
  createRouteName(filename = '') {
    return new Promise((resolve) => {
      let split = filename.indexOf('.') > -1 ? filename.split('.') : [];
      resolve(split.length > 0 ? split[0] : null)
    })
  },

  /**
   * 
   * @param {*} subject 
   * @param {*} body_msg 
   * @param {*} arr = [No WBS, Update, Oleh]
   * @returns 
   */
  mailTemplate(subject = 'WBS Updates', body_msg = ``, arr = []) {
    return new Promise(async (resolve) => {
      let tables = ``;
      for (let i = 0; i < arr.length; i++) {
        tables += `<tr>
          <td>${arr[i].wbs}</td>
          <td>${arr[i].update}</td>
          <td>${arr[i].by}</td>
        </tr>`
      }

      let html = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>${subject}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style type="text/css">
            #outlook a { padding: 0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div { line-height: 100%; }
        
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
        
            img { -ms-interpolation-mode: bicubic; }
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
        
            table { border-collapse: collapse !important; }
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
        
            td.center { text-align: center; }
            .left { text-align: left; }
            .body-padding { padding: 24px 40px 40px; }
            .border-bottom { border-bottom: 1px solid #D8D8D8; }
            table.full-width-gmail-android { width: 100% !important; }
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
        
            a:hover { background-color: lemonchiffon; }
            a:active {
                box-shadow: none;
                top: 5px;
            }
        
            .footer a { font-size: 12px; }
            </style>
        
            <style type="text/css" media="only screen and (max-width: 650px)">
            @media only screen and (max-width: 650px) {
                * { font-size: 16px !important; }
                table[class*="w320"] { width: 320px !important; }
        
                td[class="mobile-center"],
                div[class="mobile-center"] {
                  text-align: center !important;
                }
        
                td[class*="body-padding"] { padding: 20px !important; }
                td[class="mobile"] {
                  text-align: right;
                  vertical-align: top;
                }
            }
            </style>
        </head>
        
        <body style="padding:0; margin:0; display:block; background: #f8f8f8; -webkit-text-size-adjust:none">
            <table class="w320 full-width-gmail-android" bgcolor="#f9f8f8" background="https://www.filepicker.io/api/file/al80sTOMSEi5bKdmCgp2" style="background-color:transparent" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                  <td width="100%" height="48" valign="top">
                    <!--[if gte mso 9]>
                      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;height:49px;">
                      <v:fill type="tile" src="https://www.filepicker.io/api/file/al80sTOMSEi5bKdmCgp2" color="#ffffff" />
                      <v:textbox inset="0,0,0,0">
                    <![endif]-->
                    <table class="full-width-gmail-android" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr><td class="header center" width="100%">${subject}</td></tr>
                    </table>
                    <!--[if gte mso 9]>
                      </v:textbox>
                      </v:rect>
                    <![endif]-->
                  </td>
              </tr>
            </table>
            <p>${body_msg}</p>
            <p>
              <table>
                <thead>
                  <tr>
                    <td>No WBS</td>
                    <td>Update</td>
                    <td>Oleh</td>
                  </tr>
                </thead>
                <tbody>${tables}</tbody>
              </table>
            </p>
        </body>
      </html>`;
      resolve(html)
    })
  },

  /**
   * 
   * @param {*} to 
   * @param {*} subject 
   * @param {*} html 
   * @returns 
   */
  sendMail(to = null, subject = null, html = null) {
    return new Promise((resolve) => {
      let o = null
      let transporter = mailer.createTransport({
        host: email_host,
        port: email_port,
        secure: email_secure == '0' ? false : true,
        debug: email_debug == '0' ? false : true,
        logger: email_logger == '0' ? false : true,
        auth: {
          user: email_auth,
          pass: email_pass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let mailOptions = {
        from: email_auth,
        to: to,
        subject: subject,
        html: html
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          o = response.failed(`Error: ${err}`)
        } else {
          o = response.success(`Email sent: ${info.response}`)
        }

        resolve(o)
      });
    })
  },

  /**
   * @obj
   * @tmp_path
   * @path
   */
  uploadFile: (obj = {}, tmp_path, path) => {
    return new Promise((resolve, reject) => {
      try {
        obj['target_path'] = path;

        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
          mv(tmp_path, path + obj.originalFilename, function (err) {
            if (err) reject(err)
            fs.unlink(tmp_path, function () {
              if (err) reject(err)
              resolve(response.success('File has been uploaded', obj))
            })
          })
        } else {
          mv(tmp_path, path + obj.originalFilename, function (err) {
            if (err) reject(err)
            fs.unlink(tmp_path, function () {
              if (err) reject(err)
              resolve(response.success('File has been uploaded', obj))
            })
          })
        }
      } catch (error) {
        reject(error)
      }
    });
  },

  /**
   * 
   * @param {*} name 
   * @param {*} path 
   * @returns 
   */
  deleteFile(path) {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(path)) {
          fs.mkdirSync(path);
          fs.unlink(path, function () {
            if (err) reject(err)
            resolve(response.success('File has been deleted', obj))
          })
        }
      } catch (error) {
        reject(error)
      }
    });
  },

  /**
   * 
   * @param {*} path 
   * @returns 
   */
  readFile(path) {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(path)) {
          let o = fs.readFileSync(path)
          resolve(o)
        }
      } catch (err) {
        reject(e)
      }
    })
  },

  /**
   * 
   * @param {*} value 
   * @returns 
   */
  getExt: (value) => {
    return new Promise(resolve => {
      let arr = ext.supportFile() || [];
      let split = [];
      let found = [];
      let max = null;
      let extension = null;

      // get extension
      split = value ? value.split('.') : [];
      max = split.length > 0 ? Math.max(split.length) : null;
      extension = max ? split[max - 1] : null;

      found = arr.filter(e => {
        let regexMatch = e.lists.join('|');
        if (extension && extension.match(new RegExp(regexMatch))) { return e }
      }) || [];

      resolve(found.length > 0 ? `${found[0].type}/${extension}` : null);
    })
  },

  /**
   * 
   * @param {*} arr 
   * @param {*} keys 
   * @returns 
   */
  validateArrayVal(arr = [], keys = []) {
    return new Promise((resolve) => {
      let validArr = [];
      let filter = [];

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < keys.length; j++) {
          validArr.push(arr[i][keys[j]] ? true : false)
        }
      }

      filter = validArr.filter((e) => e === false)
      resolve(filter.length === 0 ? false : true);
    });
  },

  /**
   * 
   * @param {*} arr 
   * @param {*} object 
   * @param {*} matchKey 
   * @returns 
  */
  mapping(arr = [], object = null, matchKey = null, deepKey = null) {
    return new Promise((resolve) => {
      if (!object || !matchKey)
        return [];

      // console.log('before =>', matchKey)
      // console.log('before =>', arr)
      // console.log('before =>', object)

      arr.map(async e => {
        for (const key in object) {
          if (Object.hasOwnProperty.call(object, key)) {
            if (!deepKey) {
              e[key] = object[key].filter(a => a[matchKey] == e[matchKey])
            } else {
              let f = object[key].filter(a => a[matchKey] == e[matchKey])
              e[key] = f.length == 0 ? null : f[0][deepKey]
            }
          }
        }
      })
      // console.log('after =>', arr)
      resolve(arr)
    });
  },
}