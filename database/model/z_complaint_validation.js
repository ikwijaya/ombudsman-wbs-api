'use strict'

const opt = require('../connection')[process.env.NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
const core = require('../core')
const { helper } = require('../../helper')
const moment = require('moment')
const appCode = process.env.APP_CODE
const target_path = process.env.UPLOAD_PATH
const api_url = process.env.API_URL

class WBS {
  loadValidation() {
    let db = knex(opt);

    return new Promise(async (resolve, reject) => {
      /**
       * 1. cek session
       * 2. get complaint (master,study), berdasarkan id
       */
    })
  }

  saveValidation() {
    let db = knex(opt);

    return new Promise(async (resolve, reject) => {
      /**
       * 1. cek session
       * 2. save validation oleh penyusun
       */
    })
  }

  updateValidation() {
    let db = knex(opt);

    return new Promise(async (resolve, reject) => {
      /**
       * 1. cek session
       * 2. save validation oleh penyusun
       */
    })
  }

  checkValidationByChecker() {
    let db = knex(opt);

    return new Promise(async (resolve, reject) => {
      /**
       * 1. cek session
       * 2. save validation oleh pemeriksa, update checked_date, checked_by
       */
    })
  }

  approveValidationByHeadOf() {
    let db = knex(opt);

    return new Promise(async (resolve, reject) => {
      /**
       * 1. cek session
       * 2. save validation oleh kepala kumm, update approved_date, approved_by
       */
    })
  }

}

module.exports = WBS;