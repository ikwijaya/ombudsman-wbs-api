const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const { API_URL } = require('../../config')

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   * @returns 
   */
  async get(sid, complaintId = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let m = await models.study_lys.findOne({
        attributes: [
          'idx_t_study_lys', 'manpower', 'description',
          'scope', 'simpel_app_no', 'prevention', 'procedure',
          'product', 'hopes', 'scope_clarification', 'action',
          'others_clarification', 'action', 'others_action',
          'checked', 'arranged_by', 'arranged_date',
          'head_of_reg', 'head_of_reg_date',
          'head_of_kumm', 'head_of_kumm_date'
        ],
        include: [
          {
            required: false,
            attributes: ['idx_m_legal_standing', 'name'],
            model: models.legal_standing,
          },
          {
            required: false,
            attributes: ['idx_t_study_lys_event', 'event', 'date', 'notes'],
            model: models.study_lys_event,
          },
          {
            required: false,
            attributes: ['idx_t_study_lys_violation',],
            model: models.study_lys_violation,
            include: [
              {
                attributes: ['idx_m_violation', 'name'],
                model: models.violations
              }
            ]
          }
        ],
        where: { idx_m_complaint: complaintId, record_status: 'A' }
      })

      let studies = await models.complaint_studies.findOne(
        {
          attributes: ['idx_t_complaint_study', 'notes'],
          include: [
            {
              required: false,
              attributes: [
                'idx_t_complaint_study_event',
                'event', 'date', 'notes', 'simple_app_no',
                'dcreate', 'ucreate', 'dmodified', 'umodified'
              ],
              model: models.complaint_study_events,
              where: { record_status: 'A' }
            },
            {
              required: false,
              nested: true,
              attributes: ['idx_t_complaint_study_violation'],
              model: models.complaint_study_violations,
              include: [
                {
                  required: false,
                  attributes: ['idx_m_violation', 'name'],
                  model: models.violations
                }
              ]
            },
            {
              required: false,
              attributes: [
                'idx_t_complaint_study_reported',
                'name', 'identity_no', 'occupation'
              ],
              model: models.complaint_study_reported,
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_t_study_attachment',
                'description',
                'filename',
                'path',
                'mime_type',
                'filesize',
                [Sequelize.literal(`concat('${API_URL}/others/open/',filename)`), 'url']
              ],
              model: models.complaint_study_attachments
            },
          ],
          where: { record_status: 'A', idx_m_complaint: complaintId }
        }
      )

      let ucreate;
      let complaint = await models.complaints.findOne({
        attributes: [
          'idx_m_complaint', 'manpower', 'description', 'ucreate', 'hopes', 'form_no', 'date',
          [Sequelize.literal(`case when complaints.idx_m_legal_standing = -1 then true else false end`), 'is_kuasa_pelapor']
        ],
        include: [
          {
            attributes: ['idx_m_legal_standing', 'name'],
            model: models.legal_standing
          }
        ],
        where: { idx_m_complaint: complaintId }
      })

      if (complaint instanceof models.complaints) {
        ucreate = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: complaint.getDataValue('ucreate') } })

        complaint['ucreate'] = ucreate instanceof models.users ? ucreate.getDataValue('name') : null
      }

      let head_of_kumm, head_of_reg, arranged_by;
      let is_check = false; let is_approve = false;
      if (m instanceof models.study_lys) {
        is_approve = m.getDataValue('head_of_kumm') == sessions[0].user_id;
        is_check = m.getDataValue('head_of_reg') == sessions[0].user_id;

        arranged_by = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: m.getDataValue('arranged_by') } })
        head_of_kumm = await models.users.findOne({
          attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']],
          where: { idx_m_user: m.getDataValue('head_of_kumm') }
        })
        head_of_reg = await models.users.findOne({
          attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']],
          where: { idx_m_user: m.getDataValue('head_of_reg') }
        })

        m.setDataValue('arranged_by_name', arranged_by instanceof models.users ? arranged_by.getDataValue('name') : null)
        m.setDataValue('head_of_kumm_name', head_of_kumm instanceof models.users ? head_of_kumm.getDataValue('name') : null)
        m.setDataValue('head_of_reg_name', head_of_reg instanceof models.users ? head_of_reg.getDataValue('name') : null)
      }

      return {
        is_insert: !m,
        is_update: m instanceof models.study_lys && m.getDataValue('head_of_reg_date') == null,
        is_check: is_check,
        is_approve: is_approve,
        item: m,
        item2: studies,
        item3: complaint
      }
    } catch (error) {

      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async save(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.study['ucreate'] = sessions[0].user_id;
      obj.study['arranged_by'] = sessions[0].user_id;
      obj.study['arranged_date'] = new Date();

      let v = await models.study_lys.create(obj.study, { transaction: t, });
      if (v instanceof models.study_lys) {
        // let events = obj.events;
        // let violations = obj.violations;
        // events.map(e => { e.idx_t_study_lys = v.getDataValue('idx_t_study_lys') })
        // violations.map(e => { e.idx_t_study_lys = v.getDataValue('idx_t_study_lys') })

        // await models.study_lys_event.bulkCreate(events, { transaction: t })
        // await models.study_lys_violation.bulkCreate(violations, { transaction: t })
        await models.complaints.update(
          { idx_m_status: 9 }, // to study analisis
          {
            transaction: t,
            where: { idx_m_complaint: obj.study['idx_m_complaint'] }
          }
        )

        await models.clogs.create({
          idx_m_complaint: obj.study['idx_m_complaint'],
          action: 'I',
          flow: '9',
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id
        }, { transaction: t, });
      }

      await t.commit()
      return response.success('Telaah dan analisis berhasil disimpan')
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
  async update(sid = null, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      obj.study['umodified'] = sessions[0].user_id;
      obj.study['dmodified'] = new Date();

      // delete heula
      // await models.study_lys_event.destroy({ transaction: t, where: { idx_t_study_lys: obj.study.id } })
      // await models.study_lys_violation.destroy({ transaction: t, where: { idx_t_study_lys: obj.study.id } })

      // let events = obj.events;
      // let violations = obj.violations;
      // events.map(e => { e.idx_t_study_lys = obj.study.id })
      // violations.map(e => { e.idx_t_study_lys = obj.study.id })

      // await models.study_lys_event.bulkCreate(events, { transaction: t })
      // await models.study_lys_violation.bulkCreate(violations, { transaction: t })

      await models.study_lys.update(obj.study, { where: { idx_t_study_lys: obj.study.id }, transaction: t })

      // LOGS
      await models.clogs.create({
        idx_m_complaint: obj.study['idx_m_complaint'],
        action: 'U',
        flow: '9',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });
      await t.commit();
      return response.success('Sukses meng-update kertas kerja klarifikasi', [])
    } catch (error) {

      await t.rollback()
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async check(sid = null, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      obj.study['umodified'] = sessions[0].user_id;
      obj.study['dmodified'] = new Date();
      obj.study['head_of_reg'] = sessions[0].user_id;
      obj.study['head_of_reg_date'] = new Date();

      // delete heula
      // await models.study_lys_event.destroy({ transaction: t, where: { idx_t_study_lys: obj.study.id } })
      // await models.study_lys_violation.destroy({ transaction: t, where: { idx_t_study_lys: obj.study.id } })

      // let events = obj.events;
      // let violations = obj.violations;
      // events.map(e => { e.idx_t_study_lys = obj.study.id })
      // violations.map(e => { e.idx_t_study_lys = obj.study.id })

      // await models.study_lys_event.bulkCreate(events, { transaction: t })
      // await models.study_lys_violation.bulkCreate(violations, { transaction: t })

      await models.study_lys.update(obj.study, { where: { idx_t_study_lys: obj.study.id }, transaction: t })

      // LOGS
      await models.clogs.create({
        idx_m_complaint: obj.study['idx_m_complaint'],
        action: 'U',
        flow: '9',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: 'telah melakukan pemeriksaan terhadap kertas kerja klarifikasi'
      }, { transaction: t, });
      await t.commit();
      return response.success('Sukses memeriksa kertas kerja klarifikasi', [])
    } catch (error) {

      await t.rollback()
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async approve(sid = null, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      obj.study['umodified'] = sessions[0].user_id;
      obj.study['dmodified'] = new Date();
      obj.study['head_of_kumm'] = sessions[0].user_id;
      obj.study['head_of_kumm_date'] = new Date();

      // delete heula
      // await models.study_lys_event.destroy({ transaction: t, where: { idx_t_study_lys: obj.study.id } })
      // await models.study_lys_violation.destroy({ transaction: t, where: { idx_t_study_lys: obj.study.id } })

      // let events = obj.events;
      // let violations = obj.violations;
      // events.map(e => { e.idx_t_study_lys = obj.study.id })
      // violations.map(e => { e.idx_t_study_lys = obj.study.id })

      // await models.study_lys_event.bulkCreate(events, { transaction: t })
      // await models.study_lys_violation.bulkCreate(violations, { transaction: t })
      await models.study_lys.update(obj.study, { where: { idx_t_study_lys: obj.study.id }, transaction: t })

      //get, study lys
      let v = await models.study_lys.findOne({ where: { idx_t_study_lys: obj.study.id } })
      if (v instanceof models.study_lys) {
        await models.complaints.update(
          { idx_m_status: 10 }, // to Klarifikasi terperiksa
          { where: { idx_m_complaint: v.getDataValue('idx_m_complaint') } }
        );

        // surat request pengadu | to, address, by, object | get pengadu dari m_complaint
        let pengadu; let teradu = [];
        let complaint = await models.complaints.findOne({
          attributes: ['manpower', 'description', 'ucreate', 'hopes', 'idx_m_legal_standing'],
          where: { idx_m_complaint: v.getDataValue('idx_m_complaint') }
        })
        let studies = await models.complaint_studies.findOne({
          attributes: ['idx_m_complaint'],
          include: [
            {
              attributes: ['name', 'occupation'],
              model: models.complaint_study_reported
            },
          ],
          where: { idx_m_complaint: v.getDataValue('idx_m_complaint') }
        })

        if (complaint instanceof models.complaints) {
          teradu = studies.getDataValue('complaint_study_reporteds').map(e => `${e.name} - ${e.occupation ? e.occupation : '--'}`) || [];
          pengadu = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: complaint.getDataValue('ucreate') } })
          let getPengadu = complaint.getDataValue('idx_m_legal_standing') == -1 ? complaint.getDataValue('manpower') :
            complaint['ucreate'] = pengadu instanceof models.users ? pengadu.getDataValue('name') : null

          // get tim pemeriksa
          let pemeriksa = await models.complaint_determination_users.findAll(
            {
              raw: true,
              attributes: [],
              include: [
                {
                  attributes: ['fullname', 'email', 'idx_m_user'],
                  model: models.users,
                  include: [
                    {
                      attributes: ['name'],
                      model: models.usertypes
                    }
                  ]
                },
                {
                  attributes: ['idx_m_complaint'],
                  model: models.complaint_determinations,
                  where: { idx_m_complaint: v.getDataValue('idx_m_complaint') }
                }
              ]
            }
          )
          let getPemeriksa = ``;
          for (let i = 0; i < pemeriksa.length; i++) {
            getPemeriksa += `<li>${pemeriksa[i]['user.fullname']}</li>`
          }

          await models.clarification.bulkCreate([
            {
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              to: teradu.join(' , '),
              by: getPengadu,
              object: complaint.getDataValue('description'),
              address: 'tempat',
              teams: `<ol>${getPemeriksa}</ol>`
            }
          ], { transaction: t });
        }

        // LOGS
        await models.clogs.bulkCreate([
          {
            idx_m_complaint: v.getDataValue('idx_m_complaint'),
            action: 'U',
            flow: '10',
            changes: JSON.stringify(obj),
            ucreate: sessions[0].user_id,
            notes: 'telah melakukan penyetujuan terhadap kertas kerja klarifikasi'
          },
          {
            idx_m_complaint: v.getDataValue('idx_m_complaint'),
            action: 'U',
            flow: '11',
            changes: JSON.stringify({ idx_m_complaint: v.getDataValue('idx_m_complaint') }),
            ucreate: sessions[0].user_id,
            notes: 'system generated konfirmasi pengaduan'
          }
        ], { transaction: t, });
      }

      await t.commit();
      return response.success('Sukses menyetujui kertas kerja klarifikasi', [])
    } catch (error) {

      await t.rollback()
    }
  }
}