/**
 * Global function
 */
const { NODE_ENV } = require('../../config')
const opt = require('../connection')[NODE_ENV]
const knex = require('knex')

module.exports = {
  /**
   * 
   * @param {*} sessionId 
   * @returns boolean
   * {"command":"SELECT","rowCount":1,"oid":null,"rows":[{"result":true}],"fields":[{"name":"result","tableID":0,"columnID":0,"dataTypeID":16,"dataTypeSize":1,"dataTypeModifier":-1,"format":"text"}],"_parsers":[null],"_types":{"_types":{"arrayParser":{},"builtins":{"BOOL":16,"BYTEA":17,"CHAR":18,"INT8":20,"INT2":21,"INT4":23,"REGPROC":24,"TEXT":25,"OID":26,"TID":27,"XID":28,"CID":29,"JSON":114,"XML":142,"PG_NODE_TREE":194,"SMGR":210,"PATH":602,"POLYGON":604,"CIDR":650,"FLOAT4":700,"FLOAT8":701,"ABSTIME":702,"RELTIME":703,"TINTERVAL":704,"CIRCLE":718,"MACADDR8":774,"MONEY":790,"MACADDR":829,"INET":869,"ACLITEM":1033,"BPCHAR":1042,"VARCHAR":1043,"DATE":1082,"TIME":1083,"TIMESTAMP":1114,"TIMESTAMPTZ":1184,"INTERVAL":1186,"TIMETZ":1266,"BIT":1560,"VARBIT":1562,"NUMERIC":1700,"REFCURSOR":1790,"REGPROCEDURE":2202,"REGOPER":2203,"REGOPERATOR":2204,"REGCLASS":2205,"REGTYPE":2206,"UUID":2950,"TXID_SNAPSHOT":2970,"PG_LSN":3220,"PG_NDISTINCT":3361,"PG_DEPENDENCIES":3402,"TSVECTOR":3614,"TSQUERY":3615,"GTSVECTOR":3642,"REGCONFIG":3734,"REGDICTIONARY":3769,"JSONB":3802,"REGNAMESPACE":4089,"REGROLE":4096}},"text":{},"binary":{}},"RowCtor":null,"rowAsArray":false}
   * 
   */
  checkSession: (sid = null, type = 'PUBLIC') => {
    var db = knex(opt)
    return new Promise((resolve, reject) => {
      db('t_session AS ts')
        .select(
          'ts.user_id',
          'mt.name as user_type',
          'mt.idx_m_user_type'
        )
        .leftJoin('m_user as mu', 'mu.idx_m_user', 'ts.user_id')
        .leftJoin('m_user_type as mt', 'mu.idx_m_user_type', 'mt.idx_m_user_type')
        .whereRaw(`ts.sid=? and ts.record_status='A'`, [sid])
        .andWhereRaw('ts.expires >= CURRENT_TIMESTAMP')
        .then((rows) => {
          let parse = JSON.parse(JSON.stringify(rows))
          let o = parse.length == 0 ? {
            status: false,
            user_id: null,
            user_type: null,
            idx_m_user_type: null
          } : {
            status: true,
            user_id: parse[0].user_id,
            user_type: parse[0].user_type,
            idx_m_user_type: parse[0].idx_m_user_type
          };

          resolve(o)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => { db.destroy() })
    })
  },
  /**
   * 
   * @param {*} id 
   * @returns 
   */
  checkUser: (id) => {
    var db = knex(opt)
    return new Promise((resolve, reject) => {
      db('m_user AS mu')
        .select(
          'ts.user_id',
          'mt.name as user_type',
          'mt.idx_m_user_type'
        )
        .leftJoin('m_user_type as mt', 'mu.idx_m_user_type', 'mt.idx_m_user_type')
        .whereRaw(`mu.idx_m_user=?`, [id])
        .then((rows) => {
          let parse = JSON.parse(JSON.stringify(rows))
          let o = parse.length == 0 ? {
            status: false,
            user_id: null,
            user_type: null,
            idx_m_user_type: null
          } : {
            status: true,
            user_id: parse[0].user_id,
            user_type: parse[0].user_type,
            idx_m_user_type: parse[0].idx_m_user_type
          };

          resolve(o)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => { db.destroy() })
    })
  },

  /**
   * 
   * @param {*} sessionId 
   * @param {*} id 
   * @returns 
   * [{"is_update":false,"is_delete":false,"is_insert":false}]
   * 
   */
  checkRoles: (sid = null, id = null) => {
    var db = knex(opt)
    let user_id = null

    return new Promise((resolve, reject) => {
      db('t_session AS ts')
        .select('ts.user_id')
        .whereRaw(`ts.sid=? and ts.record_status='A'`, [sid])
        .andWhereRaw('ts.expires >= CURRENT_TIMESTAMP')
        .then((rows) => {
          let parse = parsed(rows)
          user_id = parse.length === 0 ? null : parse[0].user_id;
          if (user_id) {
            return db
              .select(
                db.raw(`coalesce(case when a.is_read=0 then false else true end,false) as is_read`),
                db.raw(`coalesce(case when a.is_update=0 then false else true end,false) as is_update`),
                db.raw(`coalesce(case when a.is_delete=0 then false else true end,false) as is_delete`),
                db.raw(`coalesce(case when a.is_insert=0 then false else true end,false) as is_insert`),
                'a.idx_m_form'
              )
              .from(
                db('t_roles AS tr')
                  .select(
                    db.raw(`sum(case when tr.role_action='R' and tr.role_value=true then 1 else 0 end) as is_read`),
                    db.raw(`sum(case when tr.role_action='U' and tr.role_value=true then 1 else 0 end) as is_update`),
                    db.raw(`sum(case when tr.role_action='D' and tr.role_value=true then 1 else 0 end) as is_delete`),
                    db.raw(`sum(case when tr.role_action='I' and tr.role_value=true then 1 else 0 end) as is_insert`),
                    'tr.idx_m_form'
                  )
                  .whereRaw(`tr.idx_m_user=? AND tr.idx_m_form=?`, [user_id, id])
                  .groupBy('tr.idx_m_form')
                  .as('a')
              )
              .then((rows) => resolve(parsed(rows)))
              .catch((e) => { reject(e) })
          } else {
            resolve([])
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  },

  /**
   * 
   * @param {*} sessionId 
   * @param {*} id 
   * @returns 
   * [{"is_action":false}]
   * 
   */
  checkRolesAction: (sid = null, id = null) => {
    var db = knex(opt)
    let user_id = null
    let user_type = null

    return new Promise((resolve, reject) => {
      db('t_session AS ts')
        .select('ts.user_id')
        .whereRaw(`ts.sid=? and ts.record_status='A'`, [sid])
        .andWhereRaw('ts.expires >= CURRENT_TIMESTAMP')
        .then((rows) => {
          let parse = parsed(rows)
          user_id = parse.length === 0 ? null : parse[0].user_id;
          user_type = parse.length === 0 ? null : parse[0].user_type;

          if (user_id && user_type !== 'PUBLIC') {
            return db
              .select(
                db.raw(`coalesce(case when a.is_action=1 then true else false end,false) as is_action`),
                'a.idx_m_form'
              )
              .from(
                db('t_roles AS tr')
                  .select(
                    db.raw(`sum(case when tr.role_action='R' and tr.role_value=true then 1 else 0 end) as is_action`),
                    'tr.idx_m_form'
                  )
                  .whereRaw(`tr.idx_m_user=? AND tr.idx_m_form=?`, [user_id, id])
                  .groupBy('tr.idx_m_form')
                  .as('a')
              )
              .then((rows) => {
                resolve(parsed(rows))
              })
              .catch((e) => { reject(e) })
          } else {
            resolve([])
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    })
  },

  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  getMenu: (sid = null) => {
    var db = knex(opt)
    let user_id = null;

    return new Promise(async (resolve, reject) => {
      db('t_session AS ts')
        .select('ts.user_id')
        .whereRaw(`ts.sid=? and ts.record_status='A'`, [sid])
        .andWhereRaw('ts.expires >= CURRENT_TIMESTAMP')
        .then((rows) => {
          let parse = parsed(rows)
          user_id = parse.length === 0 ? null : parse[0].user_id;
          if (user_id) {
            return db('t_roles AS tr')
              .select(
                'mf.form_name',
                'mf.form_icon',
                'mf.form_color',
                'mf.form_url'
              )
              .innerJoin('m_form AS mf', 'tr.idx_m_form', 'mf.idx_m_form')
              .whereRaw(`
                tr.record_status='A'
                AND tr.role_action='R'
                AND tr.role_value=true
                AND tr.idx_m_user=?
                AND mf.idx_m_form_parent is null
              `, [user_id])
              .orderBy('mf.form_sort', 'asc')
              .then((rows) => resolve(parsed(rows)))
          } else {
            resolve([])
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    });
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} parent_id 
   * @returns 
   */
  getMenuMaster: (sid = null, parent_id = null) => {
    var db = knex(opt)
    let user_id = null;

    return new Promise(async (resolve, reject) => {
      db('t_session AS ts')
        .select('ts.user_id')
        .whereRaw(`ts.sid=? and ts.record_status='A'`, [sid])
        .andWhereRaw('ts.expires >= CURRENT_TIMESTAMP')
        .then((rows) => {
          let parse = parsed(rows)
          user_id = parse.length === 0 ? null : parse[0].user_id;
          if (user_id) {
            return db('t_roles AS tr')
              .select(
                'mf.form_name',
                'mf.form_icon',
                'mf.form_color',
                'mf.form_url'
              )
              .innerJoin('m_form AS mf', 'tr.idx_m_form', 'mf.idx_m_form')
              .whereRaw(`
                tr.record_status='A'
                AND tr.role_action='R'
                AND tr.role_value=true
                AND tr.idx_m_user=?
              `, [user_id])
              .andWhereRaw(`
                tr.idx_m_form IN (
                  SELECT  r.idx_m_form
                  FROM    m_form AS r
                  WHERE   r.idx_m_form_parent=?
                )
              `, [parent_id])
              .orderBy('mf.form_sort', 'asc')
              .then((rows) => resolve(parsed(rows)))
              .catch((e) => {
                reject(e);
              })
          } else {
            resolve([])
          }
        })
        .catch((e) => { reject(e) })
        .finally(() => { db.destroy() })
    });
  },
}

function parsed(rows) {
  return rows ? JSON.parse(JSON.stringify(rows)) : []
}