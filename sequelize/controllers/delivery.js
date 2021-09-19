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
   * @param {*} id 
   * @returns 
   */
  async get(sid, id = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let complaint = await models.complaints.findOne({
        attributes: ['form_no', 'date'],
        where: { idx_m_complaint: id }
      })

      let pleno = await models.complaint_pleno.findOne({
        attributes: ['date', 'notes'],
        where: { idx_m_complaint: id, date: { [Op.ne]: null } }
      });

      let province = await models.complaint_study_incidents.findAll({
        raw: true,
        attributes: ['idx_t_complaint_study'],
        include: [
          {
            attributes: ['name'],
            model: models.cities,
            include: [
              {
                attributes: ['name', [Sequelize.literal(`concat('Regional ',regional)`), 'regional']],
                model: models.regions
              }
            ]
          },
          {
            attributes: [],
            model: models.complaint_studies,
            where: { idx_m_complaint: id }
          }
        ]
      });

      let m = await models.delivery.findAll({
        raw: true,
        attributes: [
          'idx_t_delivery', 'idx_m_complaint', 'action', 'type', 'isWithFact',
          'to', 'address', 'by', 'object', 'desc', 'letter_no', 'letter_date',
          'filename', 'path', 'mime_type', 'filesize'
        ],
        where: { idx_m_complaint: id, record_status: 'A' },
        order: [['dcreate', 'asc']]
      })

      m.map(e => {
        e['pleno_date'] = pleno instanceof models.complaint_pleno ? moment(pleno.getDataValue('date')).format('DD MMMM YYYY') : null;
        e['province'] = province.map(e => `${e['city.region.name']} (${e['city.region.regional']})`).join(' , ');
        e['form_date'] = complaint instanceof models.complaints ? moment(complaint.getDataValue('date')).format('DD MMMM YYYY') : null;
        e['form_no'] = complaint instanceof models.complaints ? complaint.getDataValue('form_no') : null;
      })

      return {
        items: m
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

      obj['ucreate'] = sessions[0].user_id;
      await models.delivery.create(obj, { transaction: t, });

      await models.complaints.update(
        { idx_m_status: 16 }, // to Monitoring
        {
          transaction: t,
          where: { idx_m_complaint: obj['idx_m_complaint'] }
        }
      )

      await t.commit()
      return response.success('Penyampaian Tindak Lanjut berhasil disimpan')
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

      obj.delivery['umodified'] = sessions[0].user_id;
      obj.delivery['dmodified'] = new Date();

      await models.delivery.update(obj.delivery, {
        where: { idx_t_delivery: obj.delivery.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.delivery['idx_m_complaint'],
        action: 'U',
        flow: '15',
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
  async next(sid, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      let where = {};
      where['idx_m_complaint'] = id;
      where[Op.or] = {
        'letter_no': { [Op.eq]: null },
        'letter_date': { [Op.eq]: null },
        'filename': { [Op.eq]: null }
      }

      let count = await models.delivery.count({
        where: where,
        transaction: t
      })

      if(count > 0) return response.failed(`<ul><li>` + ['Kolom Nomor Surat, Tanggal Surat dan Upload Dokumen Surat TIDAK boleh kosong.'].join('</li><li>') + `</li></ul>`)
      await models.complaints.update(
        { idx_m_status: 16 }, // to Monitoring
        {
          transaction: t,
          where: { idx_m_complaint: id }
        }
      )

      await models.monitoring.create({
        idx_m_complaint: id,
        title: 'Default',
        by: '(auto) system wbs',
        dcreate: new Date(),
        ucreate: 'wbs-auto'
      }, { transaction: t })

      // LOGS
      await models.clogs.bulkCreate([
        {
          idx_m_complaint: id,
          action: 'U',
          flow: '16',
          changes: JSON.stringify({}),
          ucreate: sessions[0].user_id,
          notes: 'telah melanjutkan ke flow selanjutnya (monitoring)'
        },
        {
          idx_m_complaint: id,
          action: 'I',
          flow: '17',
          changes: JSON.stringify({}),
          ucreate: sessions[0].user_id,
          notes: 'system auto generate default monitoring'
        }
      ], { transaction: t, });

      await t.commit()
      return response.success('Berhasil ke proses selanjutnya')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },
}