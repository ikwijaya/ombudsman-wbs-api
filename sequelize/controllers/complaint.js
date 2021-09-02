const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const status = require('./status');
const { response } = require('../../models/index');
const { helper } = require('../../helper')
const sequelize = require('..');
const { APP_CODE, PRODUCT_MODE, API_URL } = require('../../config')
const appCode = APP_CODE

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   * 
   * stepper for unit inspektorat (pengaduan - penetapan tim)
   * m_status 1-6
   */
  async stepper(sid = null, id = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      /**
       * Form ID
       * 1 => pengaduan
       * 2 => verifikasi persyaratan 
       * 3 => telaah pengaduan
       * 4 => putusan pengampu WBS
       * 5 => penanganan pengaduan
       * 6 => penerimaan penugasan
       * 7 => Penyetujuan oleh KUMM
       */
      let r = await core.checkRoles(sessions[0].user_id, [1, 2, 3, 4, 5, 6]);
      let s = await status.load([`1`, `2`, `3`, `4`, `5`, `6`]);
      let c = await models.complaints.findOne(
        {
          where: {
            form_status: { [Op.in]: ['1', '99'] },
            idx_m_complaint: id,
            record_status: 'A'
          },
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            [Sequelize.literal(`status.code`), 'status_code'],
            [Sequelize.literal(`status.name`), 'status_name'],
            [Sequelize.literal(`case when complaints.form_status = '99' then true else false end`), 'has_cancel']
          ],
          include: [
            {
              required: false,
              attributes: ['idx_m_status', 'code', 'name'],
              model: models.status,
            },
          ]
        }
      );

      let is_verify = await models.complaint_verifications.count({ where: { idx_m_complaint: id, verification_type: '1', record_status: 'A' } })
      let is_studies = await models.complaint_studies.count({ where: { record_status: 'A', idx_m_complaint: id, form_status: '0' } })
      let is_decision = await models.complaint_decisions.count({ where: { record_status: 'A', idx_m_complaint: id, form_status: '0' } })
      let is_determination = await models.complaint_determinations.count({ where: { record_status: 'A', idx_m_complaint: id } })
      let violationNo = await models.complaint_decisions.findOne(
        {
          attributes: ['idx_m_complaint'],
          where: {
            record_status: 'A',
            idx_m_complaint: id,
            idx_m_violation: { [Op.in]: PRODUCT_MODE }
          }
        }
      )

      // masuk ke penetapan tim pemeriksa apa kga?
      // violation 1 - 8 => tindak lanjut
      // violation 9 => ke kumm (validasi)
      let is_kumm = false;
      if (violationNo instanceof models.complaint_decisions) is_kumm = true

      if (!c) return null;
      let has_cancel = c.getDataValue('has_cancel');
      s.map(async e => {
        let code = c.getDataValue('status_code')
        let value = e.value
        e.is_active = code === value
        e.is_verification = is_verify > 0
        e.idx_m_complaint = id
        e.is_complete = parseInt(c.getDataValue('status_code')) > parseInt(e.value)
        e.is_alert = is_verify == 0 && code == value ? false : true
        e.is_editable = is_verify > 0 && code === value;
        e.verify_color = is_verify > 0 ? 'green' : 'red'
        e.name = value === 2 && is_verify > 0 ? `${e.name} DITERIMA`
          : value === 2 && is_verify === 0 ? `${e.name} DITOLAK` : `${e.name}`
        e.name_color = value === 2 && is_verify > 0 ? 'green'
          : value === 2 && is_verify === 0 ? 'red' : 'black'

        e.value = parseInt(value)
        e.next_color = r.filter(a => a.idx_m_form == value && (a.is_insert || a.is_update)).length > 0 ? 'blue' : 'red';
        e.next_status = r.filter(a => a.idx_m_form == value && (a.is_insert || a.is_update)).length > 0 ? 'SELANJUTNYA' : 'TIDAK DI IZINKAN'

        switch (parseInt(value)) {
          case 1: // pengaduan
            e.data = {
              is_read: r.filter(a => a.idx_m_form == 1 && a.is_read).length > 0,
              is_update: false,
              is_delete: false,
              is_insert: false,
            };
            break;
          case 2: // verifikasi
            e.data = {
              // items: verifications,
              is_read: r.filter(a => a.idx_m_form == 2 && a.is_read).length > 0,
              is_update: false,
              is_delete: false,
              is_insert: false,
            };
            break;
          case 3: // telaah pengaduan
            e.data = {
              is_read: r.filter(a => a.idx_m_form == 3 && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == 3 && a.is_update).length > 0 && is_studies > 0,
              is_delete: r.filter(a => a.idx_m_form == 3 && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == 3 && a.is_insert).length > 0 && is_studies == 0 && !has_cancel
            };
            break;
          case 4: // wbs
            e.data = {
              // items: r.filter(a => a.idx_m_form == 4 && a.is_read).length == 0 ? [] : fdecisions,
              is_read: r.filter(a => a.idx_m_form == 4 && a.is_read).length > 0 ? true : false,
              is_update: r.filter(a => a.idx_m_form == 4 && a.is_update).length > 0 && is_decision > 0,
              is_delete: r.filter(a => a.idx_m_form == 4 && a.is_delete).length > 0 ? true : false,
              is_insert: r.filter(a => a.idx_m_form == 4 && a.is_insert).length > 0 ? true : false,
              is_determination: is_kumm
            };
            break;
          case 5: // penyetujuan / tindak lanjut inspektorat
            e.data = {
              // items: decisions,
              is_read: r.filter(a => a.idx_m_form == 5 && a.is_read).length > 0 ? true : false,
              is_update: r.filter(a => a.idx_m_form == 5 && a.is_update).length > 0 ? true : false,
              is_delete: r.filter(a => a.idx_m_form == 5 && a.is_delete).length > 0 ? true : false,
              is_insert: r.filter(a => a.idx_m_form == 5 && a.is_read).length > 0 ? true : false,
              is_determination: is_kumm
            };
            break;
          case 6: // penetapan tim pemeriksa
            e.data = {
              // items: fdetermination,
              is_read: r.filter(a => a.idx_m_form == 6 && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == 6 && a.is_update).length > 0 && is_determination > 0 && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == 6 && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == 6 && a.is_insert).length > 0 && !has_cancel,
            };
            break;
          default:
            break;
        }
      })

      return {
        items: c instanceof models.complaints ? s : [],
        e1: parseInt(c.getDataValue('status_code')),
        is_kumm: is_kumm,
        form_no: c.getDataValue('form_no'),
        date: c.getDataValue('date'),
        is_authorized: c instanceof models.complaints ? true : false,
        // status_name: c instanceof models.complaints ? 'AUTHORIZED' : 'UNAUTHORIZED',
        has_cancel: has_cancel,
        status_name: c.getDataValue('status_name'),
        status_color: c instanceof models.complaints ? 'green' : 'red',
      };
    } catch (err) {
      throw (err)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * 
   * stepper for kumm (validaasi - penutupan pengaduan)
   * m_status 7-xx
   * form: [6, 7, 8, 9]
   */
  async stepper_kumm(sid = null, id = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let r = await core.checkRoles(
        sessions[0].user_id,
        [91, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
      );
      let s = [];
      let c = await models.complaints.findOne(
        {
          nest: true,
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            [Sequelize.literal(`status.code`), 'status_code'],
            [Sequelize.literal(`status.name`), 'status_name'],
            [Sequelize.literal(`case when complaints.form_status = '99' then true else false end`), 'has_cancel']
          ],
          include: [
            {
              required: false,
              attributes: ['idx_m_status', 'code', 'name'],
              model: models.status,
            },
          ],
          where: {
            form_status: { [Op.in]: ['1', '99'] },
            idx_m_status: { [Op.gte]: 6 }, // 7 -> validasi, dll
            idx_m_complaint: id,
            record_status: 'A'
          },
        }
      )
      let violationNo = await models.complaint_decisions.findOne(
        {
          attributes: [['idx_m_violation', 'violation']],
          where: { record_status: 'A', idx_m_complaint: id, idx_m_violation: { [Op.in]: PRODUCT_MODE } }
        }
      );

      if (
        violationNo instanceof models.complaint_decisions
        && [9].includes(parseInt(violationNo.getDataValue('violation')))
      ) {
        s = await status.load([`6`, `7`, `16`, `17`])
      } else {
        s = await status.load([`6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`])
      }

      // cek ketika validasi belom di periksa oleh kepala kumm
      let val = await models.validation.findOne({
        attributes: ['checked_date'],
        where: {
          idx_m_complaint: id,
          record_status: 'A'
        }
      })

      let lys = await models.study_lys.findOne({
        attributes: ['head_of_reg_date'],
        where: {
          idx_m_complaint: id,
          record_status: 'A'
        }
      })

      // cek ke bedah pengaduan
      let sug = await models.surgery.findOne({
        attributes: ['form_status'],
        where: {
          idx_m_complaint: id,
          form_status: '0',
          record_status: 'A'
        }
      });

      let mon = await models.monitoring.findOne({
        where: {
          idx_m_complaint: id,
          record_status: 'A',
          form_status: '0'
        }
      });

      let clo = await models.closing.findOne({ where: { idx_m_complaint: id, record_status: 'A', form_status: '1' } })

      if (!c) return null;
      let has_cancel = c.getDataValue('has_cancel');

      s.map(async e => {
        let code = c.getDataValue('status_code')
        let value = e.value

        if (code == '6') code = '7';
        e.is_active = code === value
        e.value = parseInt(value)
        e.idx_m_complaint = id
        e.is_complete = parseInt(code) > parseInt(e.value)
        e.is_editable = code === value;
        e.name = `${e.name}`;
        e.name_color = 'black';
        e.next_color = r.filter(a => a.idx_m_form == value && (a.is_insert || a.is_update)).length > 0 ? 'blue' : 'red';
        e.next_status = r.filter(a => a.idx_m_form == value && (a.is_insert || a.is_update)).length > 0 ? 'SELANJUTNYA' : 'TIDAK DI IZINKAN'

        switch (parseInt(value)) {
          case 6: //penetapan tim pemeriksa
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: false,
              is_delete: false,
              is_insert: false,
            };
            break;
          case 7: // validasi kumm
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 &&
                (val instanceof models.validation) && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !val && !has_cancel
            };
            break;
          case 8: // permintaan data dan dokumen
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: false,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !has_cancel
            };
            break;
          case 9: // telaah dan analysis
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 &&
                (lys instanceof models.study_lys) && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !lys && !has_cancel
            };
            break;
          case 10: // klarifikasi terperiksa
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !has_cancel
            };
            break;
          case 11: // konfirmasi pengadu
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !has_cancel
            };
            break;
          case 12: // penyusunan LHPA
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !has_cancel
            };
            break;
          case 13: // bedah pengaduan
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 && (sug instanceof models.surgery) && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !sug && !has_cancel
            };
            break;
          case 14: // rapat pleno
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !has_cancel
            };
            break;
          case 15: // penyampaian tindak lanjut
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !has_cancel
            };
            break;
          case 16: //monitoring
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !has_cancel
            };
            break;
          case 17: // penutupan
            e.data = {
              is_read: r.filter(a => a.idx_m_form == value && a.is_read).length > 0,
              is_update: r.filter(a => a.idx_m_form == value && a.is_update).length > 0 && !has_cancel,
              is_delete: r.filter(a => a.idx_m_form == value && a.is_delete).length > 0 && !has_cancel,
              is_insert: r.filter(a => a.idx_m_form == value && a.is_insert).length > 0 && !clo && !has_cancel
            };
            break;
          default:
            break;
        }
      })

      return {
        items: c instanceof models.complaints ? s : [],
        e1: c.getDataValue('status_code') == '6' // penetapan tim pemeriksa
          ? '7' //maka paksa ke validasi
          : c.getDataValue('status_code'), // else yaa pake yg ada aja valuenya
        form_no: c.getDataValue('form_no'),
        date: c.getDataValue('date'),
        is_authorized: c instanceof models.complaints ? true : false,
        // status_name: c instanceof models.complaints ? 'AUTHORIZED' : 'UNAUTHORIZED',
        has_cancel: has_cancel,
        status_name: c.getDataValue('status_name'),
        status_color: c instanceof models.complaints ? 'green' : 'red',
      }
    } catch (error) {
      console.log(error)
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} keyword 
   * @param {*} status_code 
   * @param {*} id 
   * @returns 
   */
  async load(sid = null, keyword = null, status_code = [], others = null, id = null) {
    try {
      let where = {}; let whereCode = {};
      let sessions = await core.checkSession(sid)
      let users = [];
      let typeId = null;

      if (sessions.length === 0)
        return [];

      typeId = parseInt(sessions[0].idx_m_user_type);
      if (id)
        where['idx_m_complaint'] = id

      if (status_code.length > 0)
        where['idx_m_status'] = { [Op.in]: status_code }

      // as public
      if (typeId == -1) {
        where['ucreate'] = sessions[0].user_id.toString()
        where['source_complaint'] = 'WEB'
      }

      // as user kumm
      if (typeId == 2 && !id) {
        users = await models.complaint_determination_users.findAll(
          {
            raw: true,
            attributes: [
              [Sequelize.literal(`complaint_determination.idx_m_complaint`), 'idx_m_complaint']
            ],
            where: { idx_m_user: sessions[0].user_id },
            include: [
              {
                attributes: [],
                model: models.complaint_determinations
              }
            ],
            group: ['complaint_determination.idx_m_complaint']
          }
        )

        if (users.length > 0) where['idx_m_complaint'] = { [Op.in]: users.map(e => e.idx_m_complaint) }
        else where['idx_m_complaint'] = null
        whereCode['code'] = { [Op.in]: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'] }
      }

      if (keyword)
        where[Op.or] = [
          { 'manpower': { [Op.like]: `%${keyword}%` } },
          { 'description': { [Op.like]: `%${keyword}%` } },
          { 'form_no': { [Op.like]: `%${keyword}%` } },
          { 'hopes': { [Op.like]: `%${keyword}%` } }
        ]

      /**
       * RoleId     Name
       *   1     [Pengaduan]
       *   2     [Verifikasi Pengaduan]
       */
      let roles = await core.checkRoles(sessions[0].user_id, [1, 2]);
      let complaint = await models.complaints.findAll(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'ucreate',
            'hopes',
            'cancel_reason',
            'cancel_by',
            ['source_complaint', 'source_name'],
            [Sequelize.literal(`true`), 'is_view'],
            [Sequelize.literal(`status.code`), 'status_code'],
            [Sequelize.literal(`case 
              when complaints.form_status='99' then 'Pengaduan - Telah dicabut'
              when status.code='1' and complaints.form_status='0' then concat('edit - ', status.name)
              when status.code='3' and complaint_study.form_status='0' then concat('edit - ', status.name)
              when status.code='4' and complaint_decision.form_status='0' then concat('edit - ', status.name)
              when status.code='4' and complaint_actions.idx_t_complaint_action is not null then 'Tindak Lanjut oleh Inspektorat'
            else status.name end`), 'status_name'],
            [Sequelize.literal(`case 
              when complaints.form_status='99' then 'grey lighten-2'
              when status.code='1' and complaints.form_status='0' then 'yellow lighten-3'
              when status.code='3' and complaint_study.form_status='0' then 'yellow lighten-3'
              when status.code='4' and complaint_decision.form_status='0' then 'yellow lighten-3'
              when status.code='2' and complaint_verification.verification_type='0' then 'red lighten-2'
            else status.color end`), 'status_color'],
            [Sequelize.literal(`case when 
                complaints.form_status='0' 
                and 1=${roles.filter(e => e.idx_m_form == 1 && e.is_delete == true).length > 0 ? 1 : 0}
              then true else false 
            end`), 'is_delete'],
            [Sequelize.literal(`case when 
                complaints.form_status='0' 
                and 1=${roles.filter(e => e.idx_m_form == 1 && e.is_update == true).length > 0 ? 1 : 0}
              then true else false 
            end`), 'is_update'],
            [Sequelize.literal(`case when 
                complaints.form_status IN ('1','99')
                and complaint_verification.idx_m_complaint is null 
                and 1=${roles.filter(e => e.idx_m_form == 2 && e.is_read == true).length > 0 ? 1 : 0}
              then true else false 
            end`), 'is_verification'],
            [Sequelize.literal(`case when 
                complaints.form_status IN ('1','99') 
                and complaint_verification.idx_m_complaint is not null 
                and 1=${[0, 1, 3, 4, 5].includes(typeId) ? 1 : 0}
              then true 
              else false 
            end`), 'is_inspektorat'],
            [Sequelize.literal(`case when 
                complaints.form_status IN ('1','99')
                and complaint_verification.idx_m_complaint is not null 
                and 1=${[0, 2, 3, 4, 5].includes(typeId) ? 1 : 0}
                and complaint_decision.idx_m_violation IN (5,9,10)
              then true 
              else false 
            end`), 'is_kku'],
            [Sequelize.literal(`case when 
                1=${[1, 2].includes(typeId) ? 1 : 0}
                and cast(status.code AS integer) BETWEEN 6 AND 12
                and complaints.form_status <> '99'
              then true 
              else false 
            end`), 'is_cancel'],
            [Sequelize.literal(`case when 
                cast(status.code AS integer) IN (13,14)
                and complaint_decision.idx_m_violation = 10
              then false 
              else true 
            end`), 'isSelectable'],
            // [Sequelize.literal(`case when 1=${[-1].includes(typeId) ? 1 : 0} then false else true end`), 'is_letter']
          ],
          where: where,
          include: [
            {
              required: false,
              attributes: ['idx_m_legal_standing', 'name'],
              model: models.legal_standing,
            },
            {
              required: false,
              attributes: ['idx_m_status', 'code', 'name'],
              model: models.status,
              where: whereCode
            },
            {
              required: false,
              attributes: ['idx_m_complaint_violation'],
              model: models.complaint_violations,
              include: [
                {
                  attributes: [
                    'idx_m_violation',
                    'name'
                  ],
                  model: models.violations
                }
              ],
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: ['idx_m_complaint_event', 'event', 'date', 'notes'],
              model: models.complaint_events,
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_m_complaint_reported',
                'name',
                'identity_no',
                'occupation'
              ],
              model: models.complaint_reported,
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_m_complaint_incident',
                'idx_m_complaint',
                'start_date',
                'end_date',
                'notes',
                'office_name',
                'address',
                [Sequelize.literal(`complaint_incidents.idx_m_work_unit`), 'idx_m_work_unit'],
                [Sequelize.literal(`complaint_incidents.idx_m_city`), 'idx_m_city'],
              ],
              model: models.complaint_incidents,
              include: [
                {
                  attributes: ['name'],
                  model: models.work_units
                },
                {
                  attributes: ['name'],
                  include: [
                    {
                      attributes: ['name'],
                      model: models.regions
                    }
                  ],
                  model: models.cities
                }
              ],
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_m_complaint_attachment',
                'description',
                'filename',
                'path',
                'mime_type',
                'filesize',
                [Sequelize.literal(`concat('${API_URL}/others/open/',filename)`), 'url']
              ],
              model: models.complaint_attachments
            },

            //other stuff
            {
              required: false,
              attributes: [
                'idx_t_complaint_verification',
                'verification_type',
                [Sequelize.literal(`case when verification_type='1' then 'green' else 'red' end`), 'verification_color'],
                [Sequelize.literal(`case when verification_type='1' then 'DITERIMA' else 'DITOLAK' end`), 'verification_name'],
                [Sequelize.literal(`case when verification_type='1' then true else false end`), 'is_approve'],
              ],
              model: models.complaint_verifications,
              include: [
                {
                  attributes: ['idx_m_complaint_rejected_type', 'name'],
                  model: models.complaint_rejected_types
                }
              ],
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_t_complaint_study',
                'form_status'
              ],
              model: models.complaint_studies,
              include: [
                {
                  attributes: ['name'],
                  required: false,
                  model: models.complaint_study_reported,
                  where: { name: { [Op.in]: others && others.teradu ? others.teradu : [] } }
                }
              ],
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_t_complaint_decision',
                [Sequelize.literal(`complaint_decision.idx_m_violation`), 'idx_m_violation'],
                [Sequelize.literal(`
                  case 
                    when complaint_decision.idx_m_violation = '9' then 'mdi-letter-9' 
                    when complaint_decision.idx_m_violation = '10' then 'mdi-letter-10' 
                    else 'mdi-letter-0' 
                  end
                `), 'violation_icon'],
                'form_status'
              ],
              model: models.complaint_decisions,
              include: [
                {
                  required: false,
                  attributes: ['name'],
                  model: models.violations
                }
              ],
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_t_complaint_action'
              ],
              model: models.complaint_actions,
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: ['description'],
              model: models.study_lys,
              where: { record_status: 'A' }
            },
            // {
            //   required: false,
            //   attributes: ['type'],
            //   model: models.lhpa,
            //   where: { record_status: 'A' }
            // },
            // confirmation
            {
              required: false,
              attributes: ['idx_t_clarification'],
              model: models.clarification,
              include: [
                {
                  attributes: ['name'],
                  model: models.clarification_detail,
                  where: { name: { [Op.in]: others && others.terperiksa ? others.terperiksa : [] } }
                }
              ]
            },
            {
              required: false,
              attributes: ['idx_t_closing', 'form_status'],
              model: models.closing
            }
          ],
          order: [
            ['dcreate', 'DESC']
          ]
        }
      );

      users = await models.users.findAll(
        {
          attributes: ['fullname', 'idx_m_user'],
          where: {
            idx_m_user: {
              [Op.in]: complaint.filter(e => e.legal_standing ? e.legal_standing.idx_m_legal_standing !== -1 : false).map(e => parseInt(e.ucreate))
            }
          }
        }
      )

      complaint = JSON.parse(JSON.stringify(complaint))
      complaint.map(async e => {
        e.is_delete = e.is_delete && e.ucreate == sessions[0].user_id
        e.is_update = e.is_update && e.ucreate == sessions[0].user_id
        if (e.legal_standing && e.legal_standing.idx_m_legal_standing == -1) { e.pengadu = e.manpower; }
        else {
          let filter_pengadu = users.filter(a => a.idx_m_user == parseInt(e.ucreate))
          e.pengadu = filter_pengadu.length > 0 ? filter_pengadu[0].fullname : null
        }
      })

      return {
        items: complaint,
        is_insert: roles.filter(e => e.idx_m_form == 1 && e.is_insert == true).length > 0 ? true : false
      };
    } catch (err) {
      console.log(err)
      throw (err)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj
   * @returns 
   */
  async save(obj = {}, is_submit = false) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(obj.sid)
      if (sessions.length === 0)
        return response.failed('Your session has been expired, please relogin')

      let formNo = null;
      if (is_submit)
        formNo = await this.reg().catch(e => { throw (e) })

      obj.complaints['ucreate'] = sessions[0].user_id
      obj.complaints['idx_m_status'] = 1
      obj.complaints['form_status'] = is_submit ? '1' : '0'
      obj.complaints['form_no'] = is_submit ? formNo : null
      obj.complaints['date'] = is_submit ? new Date() : null

      if (sessions[0].idx_m_user_type == -1)
        obj.complaints['source_complaint'] = 'WEB'

      let v = await models.complaints.create(obj.complaints, { transaction: t })
      console.log('v => ', v.getDataValue('idx_m_complaint'))
      if (v instanceof models.complaints) {
        if (obj.violations.length > 0)
          await models.complaint_violations.bulkCreate(obj.violations.map(e => {
            return {
              idx_m_violation: e,
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              ucreate: sessions[0].user_id
            }
          }), { transaction: t })

        if (obj.attachments.length > 0)
          await models.complaint_attachments.bulkCreate(obj.attachments.map(e => {
            return {
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              ucreate: sessions[0].user_id,
              description: e.description,
              filename: e.filename,
              path: e.path,
              mime_type: e.mime_type,
              filesize: e.filesize,
            }
          }), { transaction: t })

        if (obj.events.length > 0)
          await models.complaint_events.bulkCreate(obj.events.map(e => {
            return {
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              ucreate: sessions[0].user_id,
              event: e.event,
              date: e.date,
              notes: e.notes,
            }
          }), { transaction: t })

        if (obj.incidents.length > 0)
          await models.complaint_incidents.bulkCreate(obj.incidents.map(e => {
            return {
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              ucreate: sessions[0].user_id,
              start_date: e.start_date,
              end_date: e.end_date,
              notes: e.notes,
              idx_m_city: e.idx_m_city,
              office_name: e.office_name,
              address: e.address,
              idx_m_work_unit: e.idx_m_work_unit
            }
          }), { transaction: t })

        if (obj.reported.length > 0)
          await models.complaint_reported.bulkCreate(obj.reported.map(e => {
            return {
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              ucreate: sessions[0].user_id,
              name: e.name,
              identity_no: e.identity_no,
              occupation: e.occupation
            }
          }), { transaction: t })

        // added history
        await models.clogs.create({
          idx_m_complaint: v.getDataValue('idx_m_complaint'),
          action: 'I',  //insert
          flow: '1',    //pengaduan
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id
        }, { transaction: t, });
      }

      await t.commit()
      return response.success('Pengaduan Anda berhasil disimpan')
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @returns 
   */
  async reg() {
    try {
      let ym = moment().format('YYMM');
      let lastNo = 0;
      let finalNo = 0;
      let regNo = null;

      let v = await models.complaints.findOne(
        {
          attributes: ['form_no'],
          where: { form_status: { [Op.in]: ['1', '99'] } },
          order: [
            ['dcreate', 'DESC']
          ]
        }
      )

      if (!v) {
        regNo = `${appCode}-${ym}-0000${lastNo + 1}`
      } else {
        let formNo = v.getDataValue('form_no') || ''
        let befNo = formNo.substring(formNo.length - 5, formNo.length)
        befNo = parseInt(befNo) + 1
        finalNo = `00000${befNo}`.substr(`00000${befNo}`.length - 5, `00000${befNo}`.length)
        regNo = `${appCode}-${ym}-${finalNo}`
      }

      return regNo;
    } catch (error) {
      console.log(error)
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async delete(sid, id) {
    const t = await sequelize.transaction()
    try {
      let form_no;
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires, please relogin')

      let v = await models.complaints.findOne(
        {
          transaction: t,
          attributes: ['form_no'],
          where: { idx_m_complaint: id }
        },
      )

      if (v instanceof models.complaints) {
        form_no = v.getDataValue('form_no')
        idx_m_status = v.getDataValue('idx_m_status');

        // added history
        await models.clogs.create({
          idx_m_complaint: id,
          action: 'D',  //insert
          flow: '1',    //pengaduan
          changes: JSON.stringify({}),
          ucreate: sessions[0].user_id
        }, { transaction: t, });

        await models.complaints.destroy({
          where: { idx_m_complaint: id },
          transaction: t,
          cascade: true
        })
      } else {
        return response.failed('Pengaduan tidak ditemukan')
      }

      await t.commit()
      return response.success(`Berhasil menghapus pengaduan dengan nomor: ${form_no ? form_no : '<b>TIDAK ADA </b>'}`)
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async cancel(sid, obj = {}) {
    const t = await sequelize.transaction()
    try {
      let form_no;
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires, please relogin')

      let v = await models.complaints.findOne(
        {
          transaction: t,
          attributes: ['form_no'],
          where: { idx_m_complaint: obj.id }
        },
      )

      if (v instanceof models.complaints) {
        obj.form_status = '99';
        obj.cancel_date = new Date();
        obj.cancel_by = sessions[0].user_id;

        form_no = v.getDataValue('form_no')
        await models.clogs.create({
          idx_m_complaint: obj.id,
          action: 'U',  //insert
          flow: '1',    //pengaduan
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id,
          notes: `melakukan pencabutan aduan nomor: ${form_no}`
        }, { transaction: t, });

        await models.complaints.update(obj, { where: { idx_m_complaint: obj.id }, transaction: t })
      } else {
        return response.failed('Pengaduan tidak ditemukan')
      }

      await t.commit()
      return response.success(`Berhasil mencabut aduan nomor: ${form_no ? form_no : '<b>TIDAK ADA </b>'}`)
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @param {*} is_submit 
   * @returns 
   */
  async update(sid, obj = {}, is_submit = false) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Your session has been expired, please relogin')

      let form_no = null;
      if (is_submit)
        form_no = await this.reg()

      obj.complaint['form_no'] = form_no
      obj.complaint['form_status'] = is_submit ? 1 : 0
      obj.complaint['date'] = is_submit ? new Date() : null
      obj.complaint['umodified'] = sessions[0].user_id
      obj.complaint['dmodified'] = new Date()

      if (obj['violations'] == 0 && is_submit)
        return response.failed('Dugaan pelanggaran Tidak boleh kosong')

      await models.complaint_violations.destroy({
        transaction: t,
        where: { idx_m_complaint: obj.complaint['idx_m_complaint'] }
      })
      let violations = obj['violations'].map(e => {
        return {
          idx_m_violation: e,
          idx_m_complaint: obj.complaint['idx_m_complaint']
        }
      })
      await models.complaint_violations.bulkCreate(violations, { transaction: t, })

      if (is_submit) {
        let incidents = await models.complaint_incidents.count(
          {
            where: {
              idx_m_complaint: obj.complaint['idx_m_complaint'],
              [Op.or]: [
                { start_date: null },
                { end_date: null },
                { idx_m_city: null },
                { idx_m_work_unit: null }
              ]
            }
          }
        )

        let reporteds = await models.complaint_reported.count(
          {
            where: {
              idx_m_complaint: obj.complaint['idx_m_complaint'],
              name: null
            }
          }
        )

        if (incidents > 0)
          return response.failed('Tempat Kejadian Kolom Unit Kerja, Kota dan Waktu Kejadian TIDAK boleh kosong.')

        if (reporteds > 0)
          return response.failed('Terlapor Kolom Nama Terlapor TIDAK boleh kosong.')
      }

      await models.complaints.update(obj.complaint, {
        transaction: t,
        where: {
          idx_m_complaint: obj.complaint['idx_m_complaint'], ucreate: sessions[0].user_id
        }
      })

      // added history
      await models.clogs.create({
        idx_m_complaint: obj.complaint['idx_m_complaint'],
        action: 'U',  //insert
        flow: '1',    //pengaduan
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success(`Edit data pengaduan berhasil ${is_submit ? 'di submit' : 'di simpan'}.`)
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async saveEvent(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      obj['ucreate'] = sessions[0].user_id
      await models.complaint_events.create(obj, { transaction: t, });

      await t.commit()
      return response.success('Kronologi aduan berhasil ditambah')
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   */
  async updateEvent(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      obj['umodified'] = sessions[0].user_id
      obj['dmodified'] = new Date()
      await models.complaint_events.update(
        obj,
        {
          transaction: t,
          where: { idx_m_complaint_event: obj['idx_m_complaint_event'] }
        }
      );

      await t.commit()
      return response.success('Kronologi aduan berhasil diubah')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async deleteEvent(sid, id) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      await models.complaint_events.destroy({
        transaction: t,
        where: { idx_m_complaint_event: id }
      });

      await t.commit()
      return response.success('Kronologi aduan berhasil dihapus')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async saveIncident(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      obj['ucreate'] = sessions[0].user_id
      await models.complaint_incidents.create(obj, { transaction: t, });

      await t.commit()
      return response.success('Tempat kejadian berhasil ditambah')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async updateIncident(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      obj['umodified'] = sessions[0].user_id
      obj['dmodified'] = new Date()
      await models.complaint_incidents.update(obj, {
        transaction: t,
        where: { idx_m_complaint_incident: obj['idx_m_complaint_incident'] }
      });

      await t.commit()
      return response.success('Tempat kejadian berhasil diubah')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async deleteIncident(sid, id) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      await models.complaint_incidents.destroy({
        transaction: t,
        where: { idx_m_complaint_incident: id }
      });

      await t.commit()
      return response.success('Tempat kejadian berhasil dihapus')
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async saveReported(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      obj['ucreate'] = sessions[0].user_id
      await models.complaint_reported.create(obj, { transaction: t, });

      await t.commit()
      return response.success('Teradu berhasil ditambah')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async updateReported(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      obj['umodified'] = sessions[0].user_id
      obj['dmodified'] = new Date()
      await models.complaint_reported.update(obj, {
        transaction: t,
        where: { idx_m_complaint_reported: obj['idx_m_complaint_reported'] }
      });

      await t.commit()
      return response.success('Tempat kejadian berhasil diubah')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async deleteReported(sid, id) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      await models.complaint_reported.destroy({
        transaction: t,
        where: { idx_m_complaint_reported: id }
      });

      await t.commit()
      return response.success('Teradu berhasil dihapus')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async saveAttachment(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      obj['ucreate'] = sessions[0].user_id
      await models.complaint_attachments.create(obj, { transaction: t, });

      await t.commit()
      return response.success('Lampiran berhasil ditambah')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async deleteAttachment(sid, id) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      await models.complaint_attachments.destroy({
        transaction: t,
        where: { idx_m_complaint_attachment: id }
      });

      await t.commit()
      return response.success('Lampiran berhasil dihapus')
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw (error)
    }
  },
}