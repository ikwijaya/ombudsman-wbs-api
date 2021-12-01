const { models } = require('..');
const complaint = require('./complaint')
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core')
const sequelize = require('..');
const { response } = require('../../models/index')
const { API_URL } = require('../../config')

module.exports = {
  /**
   * @information
   * [11] => form validasi oleh kumm
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   * @returns 
   */
  async get(sid = null, complaintId = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let arranged_by, approved_by, checked_by;
      let r = await core.checkRoles(sessions[0].user_id,[92]);
      let is_void_checker = r.filter(a => a.idx_m_form == 92 && a.is_read).length > 0
      let validation = await models.validation.findOne(
        {
          attributes: [
            'idx_t_validation',
            'prevention',
            'simple_app_no',
            'product',
            'step',
            'date',
            'result_obtained',
            'conclusion',
            'action_plan',
            'checked_date',
            'checked_by',
            'approved_date',
            'approved_by',
            'arranged_by',
            'arranged_date'
          ],
          include: [
            {
              required: false,
              attributes: [
                'idx_t_validation_checklist',
                'checklist'
              ],
              model: models.validation_checklists,
            },
            {
              required: false,
              attributes: [
                'idx_t_validation_comm',
                'by', 'media', 'notes', 'date'
              ],
              model: models.validation_comm
            }
          ],
          where: { record_status: 'A', idx_m_complaint: complaintId }
        }
      )

      let studies = await models.complaint_studies.findOne(
        {
          attributes: ['idx_t_complaint_study', 'notes', 'simple_app_no'],
          include: [
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
                'name', 'identity_no', 'occupation', 'idx_m_work_unit'
              ],
              model: models.complaint_study_reported,
              include: [
                {
                  required: false,
                  attributes: ['name', 'regional'],
                  model: models.work_units
                }
              ],
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

      let decision = await models.complaint_decisions.findOne(
        {
          attributes: [
            'idx_m_complaint', 'idx_m_violation'
          ],
          where: { record_status: 'A', idx_m_complaint: complaintId }
        }
      );

      let ucreate;
      let complaint = await models.complaints.findOne({
        attributes: [
          'idx_m_complaint', 'manpower', 'description', 'ucreate', 'hopes',
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
        if (decision instanceof models.complaint_decisions) {
          let idx_m_violation = decision.getDataValue('idx_m_violation')
          complaint.setDataValue('idx_m_violation', idx_m_violation)
        }
      }

      let is_check = false;
      let is_approve = false;
      if (validation instanceof models.validation) {
        // security
        is_approve = validation.getDataValue('approved_by') == sessions[0].user_id;
        is_check = validation.getDataValue('checked_by') == sessions[0].user_id || is_void_checker;

        arranged_by = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: validation.getDataValue('arranged_by') } })
        approved_by = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: validation.getDataValue('approved_by') } })
        checked_by = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: validation.getDataValue('checked_by') } })

        validation.setDataValue('arranged_by_name', arranged_by instanceof models.users ? arranged_by.getDataValue('name') : null)
        validation.setDataValue('approved_by_name', approved_by instanceof models.users ? approved_by.getDataValue('name') : null)
        validation.setDataValue('checked_by_name', checked_by instanceof models.users ? checked_by.getDataValue('name') : null)
      }

      return {
        is_insert: !validation,
        is_update: validation instanceof models.validation && validation.getDataValue('checked_date') == null,
        is_check: is_check,
        is_approve: is_approve,
        item: validation,
        item2: studies,
        item3: complaint
      }
    } catch (err) {
      throw (err)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   * @param {*} obj (obj.validation = {}, obj.checklists = [], obj.communication = [])
   * @returns 
   */
  async save(sid = null, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      obj.validation['ucreate'] = sessions[0].user_id;
      obj.validation['arranged_by'] = sessions[0].user_id;
      obj.validation['arranged_date'] = new Date();

      let v = await models.validation.create(obj.validation, { transaction: t });
      let checklists = obj.checklists;
      let communication = obj.communication;

      let dcs = await models.complaint_decisions.findOne({
        attributes: ['idx_m_violation', 'idx_t_complaint_decision'],
        where: { idx_m_complaint: obj.validation.idx_m_complaint }
      })

      if(dcs instanceof models.complaint_decisions){
        if(obj.idx_m_violation && obj.idx_m_violation != dcs.getDataValue('idx_m_violation')){
          await models.complaint_decisions.update({
            idx_m_violation: obj.idx_m_violation,
            dmodified: new Date(),
            umodified: sessions[0].user_id
          }, {
            transaction: t,
            where: { 
              idx_m_complaint: obj.validation.idx_m_complaint,
              idx_t_complaint_decision: dcs.getDataValue('idx_t_complaint_decision')
            }
          })

          let changes = ``;
          if([5,9].includes(obj.idx_m_violation)) changes = `Merubah dari TPA ke MDP`
          else changes = `Merubah dari MDP ke TPA`
          
          // ===============> LOGS
          await models.clogs.create({
            idx_m_complaint: obj.validation.idx_m_complaint,
            action: 'I',
            flow: '7',
            changes: JSON.stringify(obj),
            notes: changes,
            ucreate: sessions[0].user_id
          }, { transaction: t, });
        }
      }

      if (v instanceof models.validation) {
        checklists.map(e => { e.idx_t_validation = v.idx_t_validation })
        communication.map(e => { e.idx_t_validation = v.idx_t_validation })

        await models.validation_checklists.bulkCreate(checklists, { transaction: t });
        await models.validation_comm.bulkCreate(communication, { transaction: t });

        //update complaint
        await models.complaints.update(
          { idx_m_status: 7 },
          { where: { idx_m_complaint: obj.validation.idx_m_complaint }, transaction: t }
        )

        // ===============> LOGS
        await models.clogs.create({
          idx_m_complaint: obj.validation.idx_m_complaint,
          action: 'I',
          flow: '7',
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id
        }, { transaction: t, });
      }

      await t.commit();
      return response.success('Validasi berhasi di simpan', []);
    } catch (err) {
      await t.rollback();
      throw err
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   *  - obj.validation = {}
   *  - obj.id: int
   *  
   * // delete dlu data existing then recreate aja
   *  - obj.checklists = [] { idx_t_complaint_validation: int, checklist: string }
   *  - obj.communication = [] { idx_t_complaint_validation: int, by: string, media: string, notes: string }
   */
  async update(sid = null, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      obj.validation['umodified'] = sessions[0].user_id;
      obj.validation['dmodified'] = new Date();

      // delete heula before create, bisa pake beforeDestroy tp belom paham cuy
      await models.validation_checklists.destroy({ transaction: t, where: { idx_t_validation: obj.validation.id } })
      await models.validation_comm.destroy({ transaction: t, where: { idx_t_validation: obj.validation.id } })

      let checklists = obj.checklists;
      let communication = obj.communication;
      checklists.map(e => { e.idx_t_validation = obj.validation.id })
      communication.map(e => { e.idx_t_validation = obj.validation.id })

      await models.validation_checklists.bulkCreate(checklists, { transaction: t })
      await models.validation_comm.bulkCreate(communication, { transaction: t })

      // update
      await models.validation.update(obj.validation, { transaction: t, where: { idx_t_validation: obj.validation.id } })

      let v = await models.validation.findOne({ attributes: ['idx_m_complaint'], where: { idx_t_validation: obj.validation.id } })
      let dcs = await models.complaint_decisions.findOne({
        attributes: ['idx_m_violation', 'idx_t_complaint_decision'],
        where: { idx_m_complaint: v.getDataValue('idx_m_complaint') }
      })

      if(dcs instanceof models.complaint_decisions){
        if(obj.idx_m_violation && obj.idx_m_violation != dcs.getDataValue('idx_m_violation')){
          await models.complaint_decisions.update({
            idx_m_violation: obj.idx_m_violation,
            dmodified: new Date(),
            umodified: sessions[0].user_id
          }, {
            transaction: t,
            where: { 
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              idx_t_complaint_decision: dcs.getDataValue('idx_t_complaint_decision')
            }
          })

          let changes = ``;
          if([5,9].includes(obj.idx_m_violation)) changes = `Merubah dari TPA ke MDP`
          else changes = `Merubah dari MDP ke TPA`
          
          // ===============> LOGS
          await models.clogs.create({
            idx_m_complaint: v.getDataValue('idx_m_complaint'),
            action: 'I',
            flow: '7',
            changes: JSON.stringify(obj),
            notes: changes,
            ucreate: sessions[0].user_id
          }, { transaction: t, });
        }
      }

      if (v instanceof models.validation) {
        // ===============> LOGS
        await models.clogs.create({
          idx_m_complaint: v.getDataValue('idx_m_complaint'),
          action: 'U',
          flow: '7',
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id
        }, { transaction: t, });
      }

      await t.commit();
      return response.success('Sukses meng-update validasi', [])
    } catch (err) {
      await t.rollback()
      console.log(err)
      throw new Error(err)
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

      obj.validation['umodified'] = sessions[0].user_id;
      obj.validation['dmodified'] = new Date();
      obj.validation['checked_by'] = sessions[0].user_id;
      obj.validation['checked_date'] = new Date();

      let is_arranged = await models.validation.count({
        where: {
          idx_t_validation: obj.validation.id,
          [Op.or]: [
            { arranged_by: null, },
            { arranged_date: null }
          ]
        },
        transaction: t
      })

      if(is_arranged > 0) return response.failed('Form belum dilakukan penyusunan, Silakan klik tombol SIMPAN untuk melakukan sign penyusunan.')
      
      // delete heula before create, bisa pake beforeDestroy tp belom paham cuy
      await models.validation_checklists.destroy({ transaction: t, where: { idx_t_validation: obj.validation.id } })
      await models.validation_comm.destroy({ transaction: t, where: { idx_t_validation: obj.validation.id } })

      let checklists = obj.checklists;
      let communication = obj.communication;
      checklists.map(e => { e.idx_t_validation = obj.validation.id })
      communication.map(e => { e.idx_t_validation = obj.validation.id })

      await models.validation_checklists.bulkCreate(checklists, { transaction: t });
      await models.validation_comm.bulkCreate(communication, { transaction: t });

      // update
      await models.validation.update(obj.validation, { transaction: t, where: { idx_t_validation: obj.validation.id } })
      let v = await models.validation.findOne({ attributes: ['idx_m_complaint'], where: { idx_t_validation: obj.validation.id } })

      let dcs = await models.complaint_decisions.findOne({
        attributes: ['idx_m_violation', 'idx_t_complaint_decision'],
        where: { idx_m_complaint: v.getDataValue('idx_m_complaint') }
      })

      if(dcs instanceof models.complaint_decisions){
        if(obj.idx_m_violation && obj.idx_m_violation != dcs.getDataValue('idx_m_violation')){
          await models.complaint_decisions.update({
            idx_m_violation: obj.idx_m_violation,
            dmodified: new Date(),
            umodified: sessions[0].user_id
          }, {
            transaction: t,
            where: { 
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              idx_t_complaint_decision: dcs.getDataValue('idx_t_complaint_decision')
            }
          })

          let changes = ``;
          if([5,9].includes(obj.idx_m_violation)) changes = `Merubah dari TPA ke MDP`
          else changes = `Merubah dari MDP ke TPA`
          
          // ===============> LOGS
          await models.clogs.create({
            idx_m_complaint: v.getDataValue('idx_m_complaint'),
            action: 'I',
            flow: '7',
            changes: JSON.stringify(obj),
            notes: changes,
            ucreate: sessions[0].user_id
          }, { transaction: t, });
        }
      }

      if (v instanceof models.validation) {
        // ===============> LOGS
        await models.clogs.create({
          idx_m_complaint: v.getDataValue('idx_m_complaint'),
          action: 'U',
          flow: '7',
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id,
          notes: 'telah melakukan pemeriksaan validasi'
        }, { transaction: t, });
      }

      await t.commit();
      return response.success('Pemeriksaan validasi berhasil disimpan', [])
    } catch (err) {
      await t.rollback()
      throw new Error(err)
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

      obj.validation['umodified'] = sessions[0].user_id;
      obj.validation['dmodified'] = new Date();
      obj.validation['approved_by'] = sessions[0].user_id;
      obj.validation['approved_date'] = new Date();

      let is_checked = await models.validation.count({
        where: {
          idx_t_validation: obj.validation.id,
          [Op.or]: [
            { checked_by: null, },
            { checked_date: null }
          ]
        },
        transaction: t
      })

      let is_approved = await models.validation.count({
        where: {
          idx_t_validation: obj.validation.id,
          approved_by: {[Op.ne]: null},
          approved_date: {[Op.ne]: null}
        },
        transaction: t
      })

      if(is_checked > 0) return response.failed('Form belum dilakukan pengecekan, Silakan klik tombol DIPERIKSA untuk melakukan sign pemeriksaan.')
      if(is_approved > 0) return response.failed(`Form sudah dilakukan penyetujuan`)

      // delete heula before create, bisa pake beforeDestroy tp belom paham cuy
      await models.validation_checklists.destroy({ transaction: t, where: { idx_t_validation: obj.validation.id } })
      await models.validation_comm.destroy({ transaction: t, where: { idx_t_validation: obj.validation.id } })

      let checklists = obj.checklists;
      let communication = obj.communication;
      checklists.map(e => { e.idx_t_validation = obj.validation.id })
      communication.map(e => { e.idx_t_validation = obj.validation.id })

      await models.validation_checklists.bulkCreate(checklists, { transaction: t })
      await models.validation_comm.bulkCreate(communication, { transaction: t })
      await models.validation.update(
        obj.validation,
        { transaction: t, where: { idx_t_validation: obj.validation.id } }
      )

      // get validation
      let v = await models.validation.findOne({ where: { idx_t_validation: obj.validation.id } })
      let dcs = await models.complaint_decisions.findOne({
        attributes: ['idx_m_violation', 'idx_t_complaint_decision'],
        where: { idx_m_complaint: v.getDataValue('idx_m_complaint') }
      })

      if(dcs instanceof models.complaint_decisions){
        if(obj.idx_m_violation && obj.idx_m_violation != dcs.getDataValue('idx_m_violation')){
          await models.complaint_decisions.update({
            idx_m_violation: obj.idx_m_violation,
            dmodified: new Date(),
            umodified: sessions[0].user_id
          }, {
            transaction: t,
            where: { 
              idx_m_complaint: v.getDataValue('idx_m_complaint'),
              idx_t_complaint_decision: dcs.getDataValue('idx_t_complaint_decision')
            }
          })

          let changes = ``;
          if([5,9].includes(obj.idx_m_violation)) changes = `Merubah dari TPA ke MDP`
          else changes = `Merubah dari MDP ke TPA`
          
          // ===============> LOGS
          await models.clogs.create({
            idx_m_complaint: v.getDataValue('idx_m_complaint'),
            action: 'I',
            flow: '7',
            changes: JSON.stringify(obj),
            notes: changes,
            ucreate: sessions[0].user_id
          }, { transaction: t, });
        }
      }

      // is_next = true adalah pengaduan dilanjutkan ke Pemeriksaan
      // is_next = false adalah pengaduan dihentikan ke form_status = '100'
      if(obj.is_next){
        let d = await models.complaint_decisions.findOne({ where: { idx_m_complaint: v.getDataValue('idx_m_complaint') } })
        let next = null;
        if (d instanceof models.complaint_decisions) {
          let idx_m_violation = d.getDataValue('idx_m_violation') ? parseInt(d.getDataValue('idx_m_violation')) : null
          next = [9].includes(idx_m_violation) ? 16 : 8

          // change complaint status
          await models.complaints.update(
            { idx_m_status: next },
            { where: { idx_m_complaint: v.getDataValue('idx_m_complaint') } }
          );
        }

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

          await models.request.bulkCreate([
            {
              idx_m_complaint: v.getDataValue('idx_m_complaint'), mode: 'TERADU',
              to: teradu.join(' , '),
              by: getPengadu,
              object: complaint.getDataValue('description'),
              address: 'tempat'
            },
            {
              idx_m_complaint: v.getDataValue('idx_m_complaint'), mode: 'PENGADU',
              by: teradu.join(' , '),
              to: getPengadu,
              object: complaint.getDataValue('description'),
              address: 'tempat'
            }
          ], { transaction: t });
        }

        // LOGS
        await models.clogs.bulkCreate([
          {
            idx_m_complaint: v.getDataValue('idx_m_complaint'),
            action: 'U',
            flow: '7',
            changes: JSON.stringify(obj),
            ucreate: sessions[0].user_id,
            notes: 'telah melakukan penyetujuan validasi'
          },
          {
            idx_m_complaint: v.getDataValue('idx_m_complaint'),
            action: 'I',
            flow: '8',
            changes: JSON.stringify({ idx_m_complaint: v.getDataValue('idx_m_complaint') }),
            ucreate: sessions[0].user_id,
            notes: 'system generated permintaan data dan dokumen flow'
          }
        ], { transaction: t, });
      } else {
        await models.complaints.update(
          { 
            form_status: '100',
            cancel_by: sessions[0].user_id,
            cancel_date: new Date()
          },
          { where: { idx_m_complaint: v.getDataValue('idx_m_complaint') } }
        );

        await models.clogs.bulkCreate([
          {
            idx_m_complaint: v.getDataValue('idx_m_complaint'),
            action: 'U',
            flow: '7',
            changes: JSON.stringify(obj),
            ucreate: sessions[0].user_id,
            notes: 'tidak melanjutkan pemeriksaan pengaduan'
          }
        ], { transaction: t, });
      }

      await t.commit();
      return response.success(`Penyetujuan validasi berhasil disimpan`, [])
    } catch (err) {
      await t.rollback()
      throw new Error(err)
    }
  }
}