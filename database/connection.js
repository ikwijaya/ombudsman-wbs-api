/**
 * Connection for knex instance
 * Digunakan untuk user dan master yg querynya ga standar (raw query)
 */

const { DB_SCHEMA, DB_CLIENT, DB_URL, DB_SSL } = require('../config')
const parse = require('pg-connection-string').parse;
const pg = parse(DB_URL);
const _DB_SSL = DB_SSL == '1' ? true : false
if (_DB_SSL) pg.ssl = { rejectUnauthorized: false }

const development = {
  client: DB_CLIENT,
  connection: pg,
  searchPath: ['knex', DB_SCHEMA],
  acquireConnectionTimeout: 10000,
  useNullAsDefault: true,
  debug: false,
  pool: {
    min: 0,
    max: 500,
  }
}

const production = {
  client: DB_CLIENT,
  connection: pg,
  searchPath: ['knex', DB_SCHEMA],
  acquireConnectionTimeout: 10000,
  useNullAsDefault: true,
  debug: true,
  pool: {
    min: 0,
    max: 500,
  }
}

module.exports = {
  development,
  production
}
