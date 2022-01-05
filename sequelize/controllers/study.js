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
  async get(sid, complaintId) {
    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return null

      let v = await models.complaint_studies.findOne(
        {
          attributes: [
            'idx_t_complaint_study',
            'notes', 'simple_app_no'
          ],
          include: [
            {
              required: false,
              attributes: [
                'idx_m_disposition',
                'name'
              ],
              model: models.dispositions
            },
            {
              required: false,
              attributes: [
                'idx_t_complaint_study_event',
                'event', 'date', 'notes', 'simple_app_no'
              ],
              model: models.complaint_study_events,
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_t_complaint_study_reported',
                'name', 'identity_no', 'occupation'
              ],
              model: models.complaint_study_reported,
              include: [
                {
                  attributes: ['idx_m_work_unit', 'name'],
                  required: false,
                  model: models.work_units
                },
              ],
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: [
                'idx_t_complaint_study_incident',
                'start_date', 'end_date', 'notes',
                'office_name', 'address'
              ],
              model: models.complaint_study_incidents,
              include: [
                {
                  attributes: ['idx_m_work_unit', 'name', 'regional'],
                  required: false,
                  model: models.work_units
                },
                {
                  attributes: ['idx_m_city', 'name'],
                  required: false,
                  model: models.cities,
                  include: [
                    {
                      attributes: ['idx_m_region', 'name', 'regional'],
                      model: models.regions
                    }
                  ]
                }
              ],
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
      );

      // get data, untuk auto fill untuk events, reported dkk
      let complaint = await models.complaints.findOne({
        attributes: ['idx_m_complaint'],
        where: { idx_m_complaint: complaintId },
        include: [
          {
            required: false,
            attributes: ['event', 'date', 'notes'],
            model: models.complaint_events,
            where: { record_status: 'A' }
          },
          {
            required: false,
            attributes: [
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
        ]
      })

      return {
        item: v,
        item2: complaint
      }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * 
   * @param {*} obj 
   * @param {*} is_submit 
   * @returns 
   */
  async save(obj = {}, is_submit = false) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(obj.sid)
      if (sessions.length === 0)
        return response.failed('Your session has been expired, please relogin')

      obj.complaint['ucreate'] = sessions[0].user_id
      obj.complaint['form_status'] = is_submit ? '1' : '0'

      let v = await models.complaint_studies.create(obj.complaint)
      if (v instanceof models.complaint_studies) {
        if (obj.violations.length > 0)
          await models.complaint_study_violations.bulkCreate(obj.violations.map(e => {
            return {
              idx_m_violation: e,
              idx_t_complaint_study: v.idx_t_complaint_study,
              ucreate: sessions[0].user_id
            }
          }),
            { transaction: t, })

        if (obj.attachments.length > 0)
          await models.complaint_study_attachments.bulkCreate(obj.attachments.map(e => {
            return {
              idx_t_complaint_study: v.getDataValue('idx_t_complaint_study'),
              ucreate: sessions[0].user_id,
              description: e.description,
              filename: e.filename,
              path: e.path,
              mime_type: e.mime_type,
              filesize: e.filesize,
            }
          }), { transaction: t })

        if (obj.events.length > 0)
          await models.complaint_study_events.bulkCreate(obj.events.map(e => {
            return {
              idx_t_complaint_study: v.idx_t_complaint_study,
              ucreate: sessions[0].user_id,
              event: e.event,
              date: e.date,
              notes: e.notes,
              simple_app_no: e.simple_app_no
            }
          }),
            { transaction: t, })

        if (obj.incidents.length > 0)
          await models.complaint_study_incidents.bulkCreate(obj.incidents.map(e => {
            return {
              idx_t_complaint_study: v.idx_t_complaint_study,
              ucreate: sessions[0].user_id,
              start_date: e.start_date,
              end_date: e.end_date,
              notes: e.notes,
              idx_m_city: e.idx_m_city,
              idx_m_region: e.idx_m_region,
              office_name: e.office_name,
              address: e.address,
              idx_m_work_unit: e.idx_m_work_unit
            }
          }),
            { transaction: t, })

        if (obj.reported.length > 0)
          await models.complaint_study_reported.bulkCreate(obj.reported.map(e => {
            return {
              idx_t_complaint_study: v.idx_t_complaint_study,
              ucreate: sessions[0].user_id,
              name: e.name,
              idx_m_work_unit: e.idx_m_work_unit,
              identity_no: e.identity_no,
              occupation: e.occupation
            }
          }),
            { transaction: t, })

        await models.complaints.update(
          { idx_m_status: is_submit ? 4 : 3 },
          {
            transaction: t,
            where: { idx_m_complaint: v.getDataValue('idx_m_complaint') }
          }
        )

        // LOGS ============ get status
        await models.clogs.create({
          idx_m_complaint: v.getDataValue('idx_m_complaint'),
          action: 'I',  //insert
          flow: '3',    //pengaduan
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id
        }, { transaction: t, });
      }

      await t.commit()
      return response.success('Telaah pengaduan berhasil disimpan')
    } catch (error) {

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

      console.log(`disini cek obj ====> `, obj)

      obj.complaint['form_status'] = is_submit ? 1 : 0
      obj.complaint['umodified'] = sessions[0].user_id
      obj.complaint['dmodified'] = new Date()

      if (obj['violations'] == 0 && is_submit)
        return response.failed('Dugaan pelanggaran Tidak boleh kosong')

      let f = await models.complaint_study_violations.findAll({
        raw: true,
        attributes: ['idx_m_violation'],
        where: {
          idx_t_complaint_study: obj.complaint['idx_t_complaint_study'],
          idx_m_violation: {
            [Op.in]: obj['violations']
          }
        },
        transaction: t
      });
      console.log(`f => `, f)

      // await models.complaint_study_violations.destroy({
      //   transaction: t,
      //   where: { idx_t_complaint_study: obj.complaint['idx_t_complaint_study'] }
      // }).catch(e => { throw (e) })
      f = f.map(e => e['idx_m_violation'])
      let violations = obj['violations'].filter(e => !f.includes(e))
      violations = violations.map(e => {
        return {
          idx_m_violation: e,
          idx_t_complaint_study: obj.complaint['idx_t_complaint_study']
        }
      })

      if (violations && violations.length > 0)
        await models.complaint_study_violations.bulkCreate(violations, { transaction: t, }).catch(e => { throw (e) })

      if (is_submit) {
        let incidents = await models.complaint_study_incidents.count(
          {
            transaction: t,
            where: {
              idx_t_complaint_study: obj.complaint['idx_t_complaint_study'],
              [Op.or]: [
                { start_date: null },
                { end_date: null },
                // { idx_m_city: null },
                { idx_m_work_unit: null }
              ]
            }
          }
        )

        let reporteds = await models.complaint_study_reported.count(
          {
            transaction: t,
            where: {
              idx_t_complaint_study: obj.complaint['idx_t_complaint_study'],
              [Op.or]: [
                { name: null },
                { idx_m_work_unit: null }
              ]
            }
          }
        )

        if (incidents > 0)
          return response.failed('Tempat Kejadian Kolom Unit Kerja dan Waktu Kejadian TIDAK boleh kosong.')

        if (reporteds > 0)
          return response.failed('Teradu Kolom Perwakilan/Unit Kerja TIDAK boleh kosong.')
      }

      await models.complaint_studies.update(obj.complaint, {
        transaction: t,
        where: {
          idx_t_complaint_study: obj.complaint['idx_t_complaint_study']
        }
      })

      let studies = await models.complaint_studies.findOne(
        {
          attributes: ['idx_m_complaint'],
          where: {
            idx_t_complaint_study: obj.complaint['idx_t_complaint_study']
          },
          transaction: t
        }
      )

      if (is_submit && studies instanceof models.complaint_studies)
        await models.complaints.update(
          { idx_m_status: 4 },
          {
            transaction: t,
            where: { idx_m_complaint: studies.getDataValue('idx_m_complaint') }
          }
        )

      // LOGS ================ get status
      await models.clogs.create({
        idx_m_complaint: studies.getDataValue('idx_m_complaint'),
        action: 'U',  //insert
        flow: '3',    //pengaduan
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success(`Edit data telaah pengaduan berhasil ${is_submit ? 'di submit' : 'di simpan'}.`)
    } catch (error) {
      console.log(`error => `, error)
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
      await models.complaint_study_events.create(obj, { transaction: t, });

      await t.commit()
      return response.success('Kronologi aduan berhasil ditambah')
    } catch (error) {
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
      await models.complaint_study_events.update(
        obj,
        {
          transaction: t,
          where: { idx_t_complaint_study_event: obj['idx_t_complaint_study_event'] }
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

      await models.complaint_study_events.destroy({
        transaction: t,
        where: { idx_t_complaint_study_event: id }
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
      await models.complaint_study_incidents.create(obj, { transaction: t, });

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
      await models.complaint_study_incidents.update(obj, {
        transaction: t,
        where: { idx_t_complaint_study_incident: obj['idx_t_complaint_study_incident'] }
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

      await models.complaint_study_incidents.destroy({
        transaction: t,
        where: { idx_t_complaint_study_incident: id }
      });

      await t.commit()
      return response.success('Tempat kejadian berhasil dihapus')
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
  async saveReported(sid, obj = {}) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      obj['ucreate'] = sessions[0].user_id
      if (!obj['idx_m_work_unit'])
        return response.failed('Kolom Unit Kerja TIDAK boleh kosong.')

      await models.complaint_study_reported.create(obj, { transaction: t, });
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
      if (!obj['idx_m_work_unit'])
        return response.failed('Kolom Unit Kerja TIDAK boleh kosong.')

      await models.complaint_study_reported.update(obj, {
        transaction: t,
        where: { idx_t_complaint_study_reported: obj['idx_t_complaint_study_reported'] }
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
  async deleteReported(sid, id) {
    const t = await sequelize.transaction()

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expired, please relogin.')

      await models.complaint_study_reported.destroy({
        transaction: t,
        where: { idx_t_complaint_study_reported: id }
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
      await models.complaint_study_attachments.create(obj, { transaction: t, });

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

      await models.complaint_study_attachments.destroy({
        transaction: t,
        where: { idx_t_study_attachment: id }
      });

      await t.commit()
      return response.success('Lampiran berhasil dihapus')
    } catch (error) {

      await t.rollback()
      throw (error)
    }
  },
}