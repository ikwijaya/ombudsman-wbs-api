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
  async get(sid, id = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let m = await models.clarification.findOne({
        attributes: [
          'idx_t_clarification',
          'date', 'teams', 'result',
          'to', 'address', 'by',
          'object', 'meet_date', 'approver',
          'letter_no', 'letter_date', 'filename',
          'path', 'mime_type', 'filesize'
        ],
        include: [
          {
            required: false,
            attributes: [
              'idx_t_clarification_detail',
              'name', 'occupation'
            ],
            model: models.clarification_detail,
          }
        ],
        where: { idx_m_complaint: id, record_status: 'A' }
      })

      // get determination
      let det = await models.complaint_determinations.findOne({
        attributes: ['st_number', 'date'],
        where: { idx_m_complaint: id }
      });

      let teams = await models.complaint_determination_users.findAll(
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
              where: { idx_m_complaint: id }
            }
          ]
        }
      )

      if (m instanceof models.clarification) m.setDataValue('teams_arr', teams);
      return {
        item: m,
        item2: det
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

      obj.clarification['ucreate'] = sessions[0].user_id;
      let v = await models.clarification.create(obj.clarification, { transaction: t, });

      if (v instanceof models.clarification) {
        let detail = obj.detail;
        detail.map(e => { e.idx_t_clarification = v.getDataValue('idx_t_clarification') })

        await models.clarification_detail.bulkCreate(detail, { transaction: t })
        await models.complaints.update(
          { idx_m_status: 11 }, // to Konfirmasi Pengadu
          {
            transaction: t,
            where: { idx_m_complaint: obj.clarification['idx_m_complaint'] }
          }
        )
      }

      await t.commit()
      return response.success('Klarifikasi terperiksa berhasil disimpan')
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
  async next(sid, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      let where = {};
      where['idx_m_complaint'] = id;
      where[Op.or] = {
        'approver': { [Op.eq]: null },
        'letter_no': { [Op.eq]: null },
        'letter_date': { [Op.eq]: null },
        'filename': { [Op.eq]: null }
      }

      let count = await models.clarification.count({ where: where, transaction: t });
      if (count > 0) return response.failed(`<ul><li>` + ['Kolom Nomor Surat, Tanggal Surat dan Upload Dokumen Surat TIDAK boleh kosong.'].join('</li><li>') + `</li></ul>`)

      await models.complaints.update(
        { idx_m_status: 11 }, // to Konfirmasi pengadu
        {
          transaction: t,
          where: { idx_m_complaint: id }
        }
      )

      // surat request pengadu | to, address, by, object | get pengadu dari m_complaint
      let pengadu; let teradu = [];
      let complaint = await models.complaints.findOne({
        attributes: ['manpower', 'description', 'ucreate', 'hopes', 'idx_m_legal_standing'],
        include: [
          {
            required: false,
            attributes: [
              'idx_t_complaint_study'
            ],
            model: models.complaint_studies,
            include: [{
              required: false,
              attributes: ['name', 'occupation'],
              model: models.complaint_study_reported,
              include: [
                {
                  required: false,
                  attributes: ['name'],
                  model: models.work_units
                }
              ]
            }],
            where: { record_status: 'A' }
          },
        ],
        where: { idx_m_complaint: id }
      })

      if (complaint instanceof models.complaints) {
        teradu = complaint.getDataValue('complaint_study')['complaint_study_reporteds'].map(e => e.name) || [];
        pengadu = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: complaint.getDataValue('ucreate') } })
        let getPengadu = complaint.getDataValue('idx_m_legal_standing') == -1 ? complaint.getDataValue('manpower') :
          complaint['ucreate'] = pengadu instanceof models.users ? pengadu.getDataValue('name') : null

        await models.confirmation.create({
          idx_m_complaint: id,
          to: teradu.join(' , '),
          by: getPengadu,
          object: complaint.getDataValue('description'),
          address: 'tempat',
        }, { transaction: t });
      }

      // LOGS
      await models.clogs.create({
        idx_m_complaint: id,
        action: 'U',
        flow: '11',
        changes: JSON.stringify({}),
        ucreate: sessions[0].user_id,
        notes: 'telah melanjutkan ke flow selanjutnya (konfirmasi pengadu)'
      }, { transaction: t, });

      await t.commit()
      return response.success('Berhasil ke proses selanjutnya')
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
  async update(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.clarification['umodified'] = sessions[0].user_id;
      obj.clarification['dmodified'] = new Date();

      await models.clarification.update(obj.clarification, {
        where: { idx_t_clarification: obj.clarification.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.clarification['idx_m_complaint'],
        action: 'U',
        flow: '8',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Update berhasi disimpan')
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
  async add(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.clarification['ucreate'] = sessions[0].user_id;
      obj.clarification['dcreate'] = new Date();
      await models.clarification_detail.create(obj.clarification, { transaction: t })

      await t.commit()
      return response.success('Terperiksa berhasi disimpan')
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
  async deleteDetail(sid, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      await models.clarification_detail.destroy({ where: { idx_t_clarification_detail: id }, transaction: t })
      await t.commit()
      return response.success('Terperiksa berhasi disimpan')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },
}