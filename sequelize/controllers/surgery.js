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

      let users = []
      let r = await core.checkRoles(sessions[0].user_id,[92]);
      let is_void_checker = r.filter(a => a.idx_m_form == 92 && a.is_read).length > 0
      let m = await models.surgery.findOne({
        raw: true,
        attributes: [
          'idx_t_surgery', 'notes', 'pengampu_kumm', 'result',
          [Sequelize.literal(`to_char(surgery.checked_date, 'DD-MM-YYYY HH24:MI:SS')`),'checked_date'], 'checked_by', 
          [Sequelize.literal(`to_char(surgery.approved_date, 'DD-MM-YYYY HH24:MI:SS')`),'approved_date'], 'approved_by',
          [Sequelize.literal(`to_char(surgery.arranged_date, 'DD-MM-YYYY HH24:MI:SS')`),'arranged_date'], 'arranged_by'
        ],
        where: { idx_m_complaint: id, record_status: 'A' }
      })

      users = await models.users.findAll({ raw: true, attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name'], 'idx_m_user'], where: { idx_m_user_type: { [Op.ne]: -1 } } })
      m.arranged_by_name = users.filter(a => a['idx_m_user'] == m['arranged_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['arranged_by'])[0].name : null
      m.approved_by_name = users.filter(a => a['idx_m_user'] == m['approved_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['approved_by'])[0].name : null
      m.checked_by_name = users.filter(a => a['idx_m_user'] == m['checked_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['checked_by'])[0].name : null
      
      /** SECURITY */
      if(m.arranged_by == sessions[0].user_id || !m.arranged_date){
        m.is_update = !m.checked_date || !m.arranged_date
        m.is_check = false
        m.is_approve = false
      }

      if(m.checked_by == sessions[0].user_id || is_void_checker){
        m.is_update = !m.approved_date
        m.is_check = !m.approved_date
        m.is_approve = false
      }

      if(m.approved_by == sessions[0].user_id){
        m.is_update = true
        m.is_check = false
        m.is_approve = true
      }
      /** END -- SECURITY */

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
            ['source_complaint', 'source_name']
          ],
          where: { idx_m_complaint: id },
          include: [
            {
              required: false,
              attributes: ['idx_m_legal_standing', 'name'],
              model: models.legal_standing,
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
                'idx_t_lhpa',
                [Sequelize.literal(`concat('LAPORAN ', lhpas.type)`), 'type'],
                'substansi', 'procedure', 'product', 'fakta', 'head_of_kumm',
                'analisis_pemeriksaan', 'pendapat_pemeriksa', 'kesimpulan_pemeriksa', 'tindak_lanjut',
                'dcreate'
              ],
              model: models.lhpa,
              where: { record_status: 'A' }
            },
            {
              required: false,
              attributes: ['description'],
              model: models.study_lys,
              where: { record_status: 'A' }
            },
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
              [Op.in]: complaint.filter(e => e.legal_standing.idx_m_legal_standing !== -1).map(e => parseInt(e.ucreate))
            }
          }
        }
      )

      complaint = JSON.parse(JSON.stringify(complaint))
      complaint.map(async e => {
        if (e.legal_standing && e.legal_standing.idx_m_legal_standing == -1) { e.pengadu = e.manpower; }
        else {
          let filter_pengadu = users.filter(a => a.idx_m_user == parseInt(e.ucreate))
          e.pengadu = filter_pengadu.length > 0 ? filter_pengadu[0].fullname : null
        }
      })

      return {
        item: m,
        matriks: complaint
      }
    } catch (error) {
      console.log('error', error)
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

      if (!obj.surgery['result']) return response.failed('Silakan pilih Apakah akan dilanjutkan ke Tahapan Pleno atau Belum dilanjutkan')

      let form_status = 0;
      let res = obj.surgery['result']
      if (res) form_status = res == 2 ? 1 : 0;

      obj.surgery['ucreate'] = sessions[0].user_id;
      obj.surgery['form_status'] = form_status
      let v = await models.surgery.create(obj.surgery, { transaction: t, });

      if (v instanceof models.surgery) {
        let users = obj.users;
        users.map(e => {
          e.ucreate = sessions[0].user_id;
          e.idx_t_surgery = v.getDataValue('idx_t_surgery');
        })

        await models.surgery_user.bulkCreate(users, { transaction: t })
        // jika 2 = to Rapat Pleno, jika 0 = Tetap di bedah aduan
        // cek additional.surgeryAdditional().results
        if (res == 2)
          await models.complaints.update({ idx_m_status: 14 },
            { transaction: t, where: { idx_m_complaint: obj.surgery['idx_m_complaint'] } }
          )
      }

      await t.commit()
      return response.success('Bedah aduan berhasil disimpan')
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

      obj.data['umodified'] = sessions[0].user_id;
      obj.data['dmodified'] = new Date();
      obj.data['arranged_by'] = sessions[0].user_id;
      obj.data['arranged_date'] = new Date()
      
      await models.surgery.update(obj.data, {
        where: { idx_t_surgery: obj.data.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.data['idx_m_complaint'],
        action: 'U',
        flow: '13',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Update berhasil disimpan')
    } catch (error) {
      await t.rollback()
      console.log('err', error)
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
   async check(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.data['umodified'] = sessions[0].user_id;
      obj.data['dmodified'] = new Date();
      obj.data['checked_date'] = new Date();

      let is_arranged = await models.surgery.count({
        where: {
          idx_t_surgery: obj.data.id,
          [Op.or]: [
            { arranged_by: null, },
            { arranged_date: null }
          ]
        },
        transaction: t
      })

      if(is_arranged > 0) return response.failed('Form belum dilakukan penyusunan, Silakan klik tombol SIMPAN untuk melakukan sign penyusunan.')
      if(!obj.data['approved_by']) return response.failed('Kolom Disetujui Oleh TIDAK boleh kosong')

      await models.surgery.update(obj.data, {
        where: { idx_t_surgery: obj.data.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.data['idx_m_complaint'],
        action: 'U',
        flow: '13',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Pemeriksaan bedah aduan berhasil disimpan')
    } catch (error) {
      await t.rollback()
      console.log('err', error)
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
   async approve(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.data['umodified'] = sessions[0].user_id;
      obj.data['dmodified'] = new Date();
      obj.data['approved_date'] = new Date();

      let is_checked = await models.surgery.count({
        where: {
          idx_t_surgery: obj.data.id,
          [Op.or]: [
            { checked_by: null, },
            { checked_date: null }
          ]
        },
        transaction: t
      })

      let is_approved = await models.surgery.count({
        where: {
          idx_t_surgery: obj.data.id,
          approved_by: {[Op.ne]: null},
          approved_date: {[Op.ne]: null}
        },
        transaction: t
      })

      if(is_checked > 0) return response.failed('Form belum dilakukan pengecekan, Silakan klik tombol DIPERIKSA untuk melakukan sign pemeriksaan.')
      if(is_approved > 0) return response.failed(`Form sudah dilakukan penyetujuan`)
      await models.surgery.update(obj.data, { where: { idx_t_surgery: obj.data.id }, transaction: t });
      await models.complaints.update({
        umodified: sessions[0].user_id,
        dmodified: new Date(),
        idx_m_status: 14
      },{transaction:t, where: { idx_m_complaint: obj.data['idx_m_complaint'], }})

      let c = await models.complaints.findOne({
        attributes: [
          'form_no', 'idx_m_legal_standing',
          'manpower', 'ucreate'
        ],
        where: { idx_m_complaint: obj.data['idx_m_complaint'], }
      })

      if(c instanceof models.complaints && c.getDataValue('idx_m_legal_standing') != -1){
        let user = await models.users.findOne({ 
          attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name'], 'idx_m_user'],  
          where: { idx_m_user: c.getDataValue('ucreate') }
        })
        c.setDataValue('pengadu', user.getDataValue('name'))
      } else {
        c.setDataValue('pengadu', c.getDataValue('manpower'))
      }

      await models.complaint_pleno.create({
        idx_m_complaint: obj.data['idx_m_complaint'],
        pengadu: c.getDataValue('pengadu'),
        form_no: c.getDataValue('form_no'),
        ucreate: sessions[0].user_id
      }, { transaction: t })

      // to Bedah Pengaduan
      await models.clogs.bulkCreate([
        {
          idx_m_complaint: obj.data['idx_m_complaint'],
          action: 'U',
          flow: '13',
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id,
          notes: 'telah menyetujui bedah aduan'
        },
        {
          idx_m_complaint: obj.data['idx_m_complaint'],
          action: 'C',
          flow: '13',
          changes: JSON.stringify(obj),
          ucreate: 'auto',
          notes: 'telah melanjutkan ke flow selanjutnya (rapat pleno)'
        }
      ], { transaction: t, });

      await t.commit()
      return response.success('Penyetujuan bedah aduan berhasil disimpan')
    } catch (error) {
      await t.rollback()
      console.log('err', error)
      throw (error)
    }
  },
}