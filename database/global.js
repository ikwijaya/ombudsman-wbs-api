/**
 * Global function
 */
const { NODE_ENV } = require('../config')
const opt = require('./connection')[NODE_ENV]
const knex = require('knex')
const { logger } = require('../helper')

module.exports = {
  /**
   * @param table_name
   * @param data {any}
   */
  insert: (table_name = null, data) => {
    var db = knex(opt)
    return new Promise((resolve, reject) => {
      db.transaction(t => {
        return db(table_name)
          .transacting(t)
          .insert(data)
          .then(t.commit)
          .catch(t.rollback)
      })
        .then((r) => resolve(r))
        .catch(e => reject(e))
        .finally(() => { db.destroy() })
    })
  },

  /**
   * @param table_name
   * @param param as {} object
   * @param orderCol default created_at
   * @param isSort default true
   */
  get: (table_name = null, params = {}, orderCol = 'dcreate', isSort = true) => {
    var db = knex(opt)
    return new Promise((resolve, reject) => {
      db.from(table_name)
        .where(params)
        .orderBy(orderCol, isSort ? 'asc' : 'desc')
        .then((rows) => { resolve(JSON.parse(JSON.stringify(rows))) })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  },

  /**
   * 
   * @param {*} sql 
   * @param {*} params 
   * @returns 
   */
  raw: (sql = null, params = []) => {
    var db = knex(opt)
    return new Promise((resolve, reject) => {
      db.raw('select 1+1 as result')
        .then((rows) => { resolve(JSON.parse(JSON.stringify(rows))) })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  },


  /**
   * @param table_name
   * @param data as {} object
   * @param param as {} object
   */
  update: (table_name = null, data, params = {}) => {
    var db = knex(opt)
    return new Promise(async (resolve, reject) => {
      db.transaction((t) => {
        return db(table_name)
          .transacting(t)
          .where(params)
          .update(data)
          .then(t.commit)
          .catch(t.rollback)
      })
        .then((r) => resolve(r))
        .catch(e => reject(e))
        .finally(() => { db.destroy() })
    })
  },

  /**
   * 
   * @param {*} name 
   * @param {*} in_args 
   */
  call: (name = null, in_args = [], isFull = false) => {
    var db = knex(opt)
    var query = '';
    var stringify = [];
    var params = [];

    return new Promise((resolve, reject) => {
      if (!name || typeof (in_args) !== 'object') {
        reject('Cannot access procedure !!!')
      } else {
        params = in_args.map(e => '?');
        stringify = in_args.map(e => typeof (e) === 'object' || Array.isArray(e)
          ? e !== null ? JSON.stringify(e) : e : e)
        query += `CALL ${name}(${params.join(',')})`;

        console.log({
          query: NODE_ENV === 'uat' ? query : `${NODE_ENV} mode ON`,
          params: NODE_ENV === 'uat' ? params : `${NODE_ENV} mode ON`,
          stringify: NODE_ENV === 'uat' ? stringify : `${NODE_ENV} mode ON`,
        })

        let p = NODE_ENV === 'uat' ?
          db.raw(query, stringify).debug() : db.raw(query, stringify);
        p.then(r => {
          let final = []
          let o = r.length > 0 ? r[0] : []

          if (isFull) { final = o; }
          else {
            final = Array.isArray(o) ? o.filter((e) => Array.isArray(e)) : [];
          }

          resolve(final);
        })
          .catch(e => reject(e))
          .finally(() => { db.destroy() })
      }
    })
  },

  /**
   * 
   * @param {*} procedure_name 
   * @param {*} params 
   */
  execProcedure(procedure_name = null, params = [], isFull = false) {
    return new Promise(async (o, x) => {
      if (!procedure_name)
        x('Cannot find procedure !!!');

      await this.call(procedure_name, params, isFull)
        .then((r) => o(r))
        .catch(e => { x(e) })
    })
  },
}

function parsed(rows) {
  return JSON.parse(JSON.stringify(rows));
}