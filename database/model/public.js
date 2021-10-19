'use strict'

const { NODE_ENV } = require('../../config')
const opt = require('../connection')[NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')

class Public {
  getFAQ(keyword = null) {
    let db = knex(opt)
    try {
      return new Promise(async (resolve, reject) => {
        db('faq')
          .select('question','answer')
          // .andWhereRaw(`question LIKE CONCAT('%',respon,'%')`,[keyword])
          .orderBy('id', 'asc')
          .then((r) => resolve(parsed(r)))
          .catch(e => { 
            console.log('e', e)
            reject(e) 
          })
      }); 
    } catch (error) {
      console.log('err', error)
      throw(error)
    }
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
        return db('contact_us')
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

module.exports = Public