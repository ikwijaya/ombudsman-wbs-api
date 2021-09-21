
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
const email_auth = EMAIL_AUTH
const email_pass = EMAIL_PASS
const email_host = EMAIL_HOST
const email_port = EMAIL_PORT
const email_secure = EMAIL_SECURE
const email_debug = EMAIL_DEBUG
const email_logger = EMAIL_LOGGER

module.exports = {
  /**
   * 
   * @param {*} n 
   * @returns 
   */
  token: (n=48) => {
    return new Promise((o,x) => {
      let format = 'MMmmYYHHDDmmss.SSS'
      require('crypto').randomBytes(n, function(e, buff){
        if(e) x(e)
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