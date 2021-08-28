'use strict'

const { NODE_ENV } = require('../../config')
const opt = require('../connection')[NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')

class WBS {
  getFAQ(keyword = null) {
    let db = knex(opt)

    return new Promise(async (resolve, reject) => {
      db('t_faq')
        .select(
          'question',
          'answer'
        )
        .then((r) => resolve(parsed(r)))
        .catch(e => { reject(e) })
    });
  }

  /**
   * 
   * @param {*} obj 
   * @returns 
   */
  saveContactUs(obj = {}) {
    let db = knex(opt)

    return new Promise(async (resolve, reject) => {
      db.transaction(t => {
        return db('t_contact_us')
          .insert(obj)
          .transacting(t)
          .then(t.commit)
          .catch(t.rollback)
      })
        .then(r => resolve(response.success('Pesan Anda telah Kami terima')))
        .catch(e => { reject(e) })
    });
  }
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}

module.exports = WBS