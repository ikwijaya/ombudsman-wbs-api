'use strict'
const { NODE_ENV } = require('../../config')
const opt = require('../connection')[NODE_ENV]
const knex = require('knex')
const { response } = require('../../models/index')
// const core = require('../core')
const { core } = require('../../sequelize/controllers')
const { helper } = require('../../helper')
const moment = require('moment')

class Dashboard {

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async getCountByStatus(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS c')
        .select(
          db.raw(`COUNT(s.name) AS value`),
          db.raw(`s.name AS text`),
        )
        .innerJoin(`m_status AS s`, `c.idx_m_status`, `s.idx_m_status`)
        .whereRaw(`c.form_status='1'`)
        .andWhereRaw(`true=CASE WHEN 'PUBLIC'=? THEN c.ucreate=? ELSE true END`, [sessions[0].user_type, sessions[0].user_id])
        .groupBy('s.name');
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async getCountByType(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS mc')
        .select(
          db.raw(`count(mo.text) AS value`),
          db.raw(`mo.text AS text`),
          db.raw(`
            case 
              when mo.value = '0' then '#f06954' 
              when mo.value = '1' then '#d1fa78'
              when mo.value = '2' then '#ed2daa'
              when mo.value = '3' then '#58f57f'
              when mo.value = '4' then '#f5b958'
              when mo.value = '5' then '#8554f0'
              else '#855fff'
            end as color
          `)
        )
        .innerJoin('m_option AS mo', function () {
          this.on('mo.value', '=', 'mc.source_complaint')
            .andOn('mo.option_id', '=', db.raw(`?`, ['1']))
        })
        .whereRaw(`true=CASE WHEN 'PUBLIC'=? THEN mc.ucreate=? ELSE true END`, [sessions[0].user_type, sessions[0].user_id])
        .andWhereRaw(`mc.form_status='1'`)
        .groupByRaw(`mo.text, mo.value`)
    } catch (error) {
      throw (error)
    }
  }


  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async getToYou(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS c')
        .select(
          'c.idx_m_complaint',
          'c.form_no',
          's.name AS status_name',
          db.raw(`case 
            when 
              (cast(v.checked_by as integer) = ? AND v.approved_date is null) OR
              (cast(l.head_of_reg as integer) = ? AND l.head_of_kumm_date is null) 
              then true
              else false end 
            AS is_need_check`, [sessions[0].user_id, sessions[0].user_id]),
          db.raw(`case 
            when 
              (v.checked_by is not null AND cast(v.approved_by as integer) = ?) OR  
              (l.head_of_reg is not null AND cast(l.head_of_kumm as integer) = ?)
              then true
              else false end 
            AS is_need_approve`, [sessions[0].user_id, sessions[0].user_id]),
          db.raw(`case 
            when 
              (cast(v.checked_by as integer) = ? AND v.approved_date is null) OR
              (cast(l.head_of_reg as integer) = ? AND l.head_of_kumm_date is null) 
            then 'Membutuhkan pemeriksaan dari Anda'
            when 
              (v.checked_by is not null AND cast(v.approved_by as integer) = ?) OR  
              (l.head_of_reg is not null AND cast(l.head_of_kumm as integer) = ?)
            then 'Membutuhkan Approval Anda' 
            else '' end 
            AS informasi`, [sessions[0].user_id, sessions[0].user_id, sessions[0].user_id, sessions[0].user_id])
        )
        .leftJoin('t_validation as v', 'v.idx_m_complaint', 'c.idx_m_complaint')
        .leftJoin('t_study_lys AS l', 'l.idx_m_complaint', 'c.idx_m_complaint')
        .leftJoin('m_status AS s', 'c.idx_m_status', 's.idx_m_status')
        .whereRaw(`s.code IN ('7','9')`)
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param { } sid 
   * @returns 
   */
  async getTotal(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS c')
        .select(db.raw(`COUNT(c.idx_m_complaint) AS count`, []))
        .andWhereRaw(`true=CASE WHEN 'PUBLIC'=? THEN c.ucreate=? ELSE true END`, [sessions[0].user_type, sessions[0].user_id])
        .groupBy('c.idx_m_complaint');
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async getComplaintByRegion(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS c')
        .select(
          'c.form_no',
          db.raw(`concat('Regional ',mr.regional) AS regional`),
          'mr.name AS region_name',
          'ct.name AS city_name',
          'sr.address'
        )
        .innerJoin('t_complaint_study AS s', 'c.idx_m_complaint', 's.idx_m_complaint')
        .leftJoin('t_complaint_study_incident AS sr', 'sr.idx_t_complaint_study', 's.idx_t_complaint_study')
        .leftJoin('m_city AS ct', 'sr.idx_m_city', 'ct.idx_m_city')
        .leftJoin('m_region AS mr', 'mr.idx_m_region', 'ct.idx_m_region')
        .andWhereRaw(`true=CASE WHEN 'PUBLIC'=? THEN c.ucreate=? ELSE true END`, [sessions[0].user_type, sessions[0].user_id])
        .andWhereRaw(`c.form_status = '1'`)
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async getCountByRegion(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS c')
        .select(
          db.raw(`count(mr.regional) AS value`),
          db.raw(`concat('Regional ',mr.regional) AS text`),
        )
        .innerJoin('t_complaint_study AS s', 'c.idx_m_complaint', 's.idx_m_complaint')
        .leftJoin('t_complaint_study_incident AS sr', 'sr.idx_t_complaint_study', 's.idx_t_complaint_study')
        .leftJoin('m_city AS ct', 'sr.idx_m_city', 'ct.idx_m_city')
        .leftJoin('m_region AS mr', 'mr.idx_m_region', 'ct.idx_m_region')
        .whereRaw(`true=CASE WHEN 'PUBLIC'=? THEN c.ucreate=? ELSE true END`, [sessions[0].user_type, sessions[0].user_id])
        .andWhereRaw(`c.form_status = '1'`)
        .groupByRaw(`mr.regional`)
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async getCountByRegionName(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS c')
        .select(
          db.raw(`count(mr.regional) AS value`),
          db.raw(`concat(mr.name) AS text`),
        )
        .innerJoin('t_complaint_study AS s', 'c.idx_m_complaint', 's.idx_m_complaint')
        .leftJoin('t_complaint_study_incident AS sr', 'sr.idx_t_complaint_study', 's.idx_t_complaint_study')
        .leftJoin('m_city AS ct', 'sr.idx_m_city', 'ct.idx_m_city')
        .leftJoin('m_region AS mr', 'mr.idx_m_region', 'ct.idx_m_region')
        .whereRaw(`true=CASE WHEN 'PUBLIC'=? THEN c.ucreate=? ELSE true END`, [sessions[0].user_type, sessions[0].user_id])
        .andWhereRaw(`c.form_status = '1'`)
        .groupByRaw(`mr.regional, mr.name`)
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param {*} sid 
   */
  async getComplaintByViolation(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      if (sessions[0].user_type == 'PUBLIC') return []
      return await db
        .raw(`
          select 	count (1) as value
              ,'Oleh Inspektorat' as text
          from 	m_violation mv 
          left join t_complaint_decision tcd ON mv.idx_m_violation=tcd.idx_m_violation
          inner join m_complaint mc on mc.idx_m_complaint=tcd.idx_m_complaint
          inner join m_status ms on mc.idx_m_status=ms.idx_m_status 
          where 	mv.idx_m_violation not in (5,9,10) and cast(ms.code as integer) <= 6  
          union all
          select 	count (1) as value
              ,'Oleh KUMM - Jenis Masih dalam Proses' as text
          from 	m_violation mv 
          left join t_complaint_decision tcd ON mv.idx_m_violation=tcd.idx_m_violation
          inner join m_complaint mc on mc.idx_m_complaint=tcd.idx_m_complaint 
          inner join t_complaint_determination tcd2 on tcd2.idx_m_complaint=mc.idx_m_complaint 
          inner join m_status ms on mc.idx_m_status=ms.idx_m_status 
          where 	mv.idx_m_violation in (5,9) and cast(ms.code as integer) >= 6
          union all 
          select 	count (1) as value
              ,'Oleh KUMM - Jenis Telah Terbit Produk Akhir' as text
          from 	m_violation mv 
          left join t_complaint_decision tcd ON mv.idx_m_violation=tcd.idx_m_violation
          inner join m_complaint mc on mc.idx_m_complaint=tcd.idx_m_complaint 
          inner join t_complaint_determination tcd2 on tcd2.idx_m_complaint=mc.idx_m_complaint 
          inner join m_status ms on mc.idx_m_status=ms.idx_m_status 
          where 	mv.idx_m_violation in (10) and cast(ms.code as integer) >= 6
        `)
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param {*} sid 
   */
  async getComplaintByProcess(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      if (sessions[0].user_type == 'PUBLIC') return []
      return await db
        .raw(`
          select 	count(1) as value
              , 'Telah dilakukan Penutupan' as text
          from 	m_complaint mc 
          inner join m_status ms on mc.idx_m_status=ms.idx_m_status 
          inner join t_closing tc on mc.idx_m_complaint=tc.idx_m_complaint
          where 	cast(ms.code as integer)=17 and mc.form_status = '1' and tc.form_status='1'
          union all
          select 	count(1) as value
              , concat('Masih dalam Pengerjaan') as text
          from 	m_complaint mc 
          inner join m_status ms on mc.idx_m_status=ms.idx_m_status 
          where 	cast(ms.code as integer) between 2 and 16 and mc.form_status = '1'
          union all
          select 	count(1) as value
              , concat('(!) Telah dilakukan Pencabutan') as text
          from 	m_complaint mc
          where mc.form_status = '99'
          union all
          select 	count(1) as value
              , concat('Penutupan (kembali ke Inspektorat)') as text
          from 	m_complaint mc
          where mc.form_status = '100'
        `)
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async getCountByWorkUnit(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS a')
        .select(
          'd.name AS text',
          db.raw(`COUNT(d.idx_m_work_unit) AS value`, [])
        )
        .innerJoin(`t_complaint_study AS b`, 'a.idx_m_complaint', 'b.idx_m_complaint')
        .innerJoin(`t_complaint_study_reported AS c`, 'b.idx_t_complaint_study', 'c.idx_t_complaint_study')
        .innerJoin(`m_work_unit AS d`, `c.idx_m_work_unit`, `d.idx_m_work_unit`)
        .andWhereRaw(`true=CASE WHEN 'PUBLIC'=? THEN a.ucreate=? ELSE true END`, [sessions[0].user_type, sessions[0].user_id])
        .groupBy('d.idx_m_work_unit');
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  async getCountByPerson(sid) {
    try {
      let db = knex(opt);
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return []

      return await db('m_complaint AS a')
        .select(
          'd.fullname AS text',
          db.raw(`COUNT(d.idx_m_user) AS value`, [])
        )
        .innerJoin(`t_complaint_determination AS b`, 'a.idx_m_complaint', 'b.idx_m_complaint')
        .innerJoin(`t_complaint_determination_user AS c`, 'b.idx_t_complaint_determination', 'c.idx_t_complaint_determination')
        .innerJoin(`m_user AS d`, `c.idx_m_user`, `d.idx_m_user`)
        .whereRaw(`true=CASE WHEN 'PUBLIC'=? THEN a.ucreate=? ELSE true END`, [sessions[0].user_type, sessions[0].user_id])
        .groupBy('d.idx_m_user');
    } catch (error) {
      throw (error)
    }
  }
}

module.exports = Dashboard