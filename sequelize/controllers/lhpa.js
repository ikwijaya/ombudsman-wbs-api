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

      // additional
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
          where: { record_status: 'A', idx_m_complaint: id }
        }
      )

      let determination = await models.complaint_determinations.findOne({
        attributes: ['date', 'st_number'],
        where: { record_status: 'A', idx_m_complaint: id }
      })

      let ucreate;
      let complaint = await models.complaints.findOne({
        attributes: [
          'idx_m_complaint', 'manpower', 'description', 'ucreate', 'hopes', 'source_complaint', 'form_no', 'date',
          [Sequelize.literal(`case when complaints.idx_m_legal_standing = -1 then true else false end`), 'is_kuasa_pelapor']
        ],
        include: [
          {
            attributes: ['idx_m_legal_standing', 'name'],
            model: models.legal_standing
          },
          {
            attributes: ['dcreate'],
            model: models.complaint_decisions,
            include: [
              {
                required: false,
                attributes: ['name'],
                model: models.violations
              }
            ],
          }
        ],
        where: { idx_m_complaint: id }
      })

      if (complaint instanceof models.complaints) {
        ucreate = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: complaint.getDataValue('ucreate') } })

        complaint['ucreate'] = ucreate instanceof models.users ? ucreate.getDataValue('name') : null
      }

      let m = await models.lhpa.findAll({
        attributes: [
          'idx_t_lhpa',
          [Sequelize.literal(`concat('LAPORAN ', lhpa.type)`), 'type'],
          [Sequelize.literal(`lhpa.type`), 'type_name'], 'substansi',
          'procedure', 'product', 'fakta', 'head_of_kumm',
          'analisis_pemeriksaan', 'pendapat_pemeriksa',
          'kesimpulan_pemeriksa', 'tindak_lanjut', 'dcreate',
          [Sequelize.literal(`to_char(lhpa.checked_date, 'DD-MM-YYYY HH24:MI:SS')`),'checked_date'], 'checked_by', 
          [Sequelize.literal(`to_char(lhpa.approved_date, 'DD-MM-YYYY HH24:MI:SS')`),'approved_date'], 'approved_by',
          [Sequelize.literal(`to_char(lhpa.arranged_date, 'DD-MM-YYYY HH24:MI:SS')`),'arranged_date'], 'arranged_by'
        ],
        include: [
          {
            attributes: ['event', 'date', 'notes'],
            model: models.lhpa_events
          },
          {
            attributes: ['idx_t_lhpa_action', 'type', 'by', 'title'],
            model: models.lhpa_actions,
            order: [
              ['idx_t_lhpa_action', 'DESC'],
              ['dcreate', 'DESC'],
            ],
            include: [
              {
                required: false,
                attributes: ['idx_t_action_detail', 'step', 'date', 'notes', 'is_checklist', [Sequelize.literal(`true`), 'is_update'], [Sequelize.literal(`true`), 'is_delete'], 'sort'],
                model: models.lhpa_act_detail,
                order: [
                  ['sort', 'asc'],
                  // ['idx_t_action_detail', 'asc'],
                  // ['dcreate', 'asc'],
                ]
              }
            ]
          }
        ],
        where: { idx_m_complaint: id, record_status: 'A' },
        order: [['dcreate', 'asc']]
      })

      let users = await models.users.findAll({ raw: true, attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name'], 'idx_m_user'], where: { idx_m_user_type: { [Op.ne]: -1 } } })
      if (m.length > 0) {
        m = JSON.parse(JSON.stringify(m));
        m.map(async (e) => {
          let st_date = determination instanceof models.complaint_determinations ? determination.getDataValue('date') : null;
          let st_number = determination instanceof models.complaint_determinations ? determination.getDataValue('st_number') : null;
          let is_kuasa = complaint instanceof models.complaints ? complaint.getDataValue('is_kuasa_pelapor') : false;
          let form_no = complaint instanceof models.complaints ? complaint.getDataValue('form_no') : null;

          e.arranged_by_name = users.filter(a => a['idx_m_user'] == e['arranged_by']).length > 0 ? users.filter(a => a['idx_m_user'] == e['arranged_by'])[0].name : null
          e.approved_by_name = users.filter(a => a['idx_m_user'] == e['approved_by']).length > 0 ? users.filter(a => a['idx_m_user'] == e['approved_by'])[0].name : null
          e.checked_by_name = users.filter(a => a['idx_m_user'] == e['checked_by']).length > 0 ? users.filter(a => a['idx_m_user'] == e['checked_by'])[0].name : null
          e.kronologi_aduan = studies instanceof models.complaint_studies ? studies.getDataValue('complaint_study_events') : []
          
          /** SECURITY */
          if(m.arranged_by == sessions[0].user_id || !m.arranged_date){
            m.is_update = !m.checked_date || !m.arranged_date
            m.is_check = false
            m.is_approve = false
          }

          if(e.checked_by == sessions[0].user_id){
            e.is_update = !e.approved_date
            e.is_check = !e.approved_date
            e.is_approve = false
          }

          if(e.approved_by == sessions[0].user_id){
            e.is_update = true
            e.is_check = false
            e.is_approve = true
          }
          /** END -- SECURITY */

          e.form_no = form_no;
          e.date = complaint instanceof models.complaints ? complaint.getDataValue('date') : null
          e.pengadu = is_kuasa ? complaint.getDataValue('man_power') : complaint.getDataValue('ucreate')
          e.alamat_pengadu = null
          e.layanan = complaint instanceof models.complaints ? complaint.getDataValue('source_complaint') : null
          e.harapan_pengadu = complaint instanceof models.complaints ? complaint.getDataValue('hopes') : null
          e.pokok_aduan = complaint instanceof models.complaints ? complaint.getDataValue('complaint_decisions') : []
          e.teradu = studies instanceof models.complaint_studies ? studies.getDataValue('complaint_study_reporteds') : []
          e.terperiksa = null;
          e.legal_standing = complaint instanceof models.complaints ? complaint.getDataValue('legal_standing') : null
          e.source_complaint = complaint instanceof models.complaints ? complaint.getDataValue('source_complaint') : null
          e.dasar_pemeriksaan = `
          <p>
            <div class="title">A. DASAR PEMERIKSAAN</div>
            <ol>
              <li>Undang-Undang No. 37 Tahun 2008 tentang Ombudsman Republik Indonesia</li>
              <li>Undang-Undang No. 25 Tahun 2009 tentang Pelayanan Publik</li>
              <li>Peraturan Ombudsman RI No. 26 tahun 2017 tentang Tata Cara Penerimaan, Pemeriksaan, dan Penyelesaian Laporan</li>
              <li>Peraturan Ombudsman RI No. 27 tahun 2017 tentang Sistem Pelaporan dan Penanganan Pelanggaran Internal</li>
              <li>Putusan penanggung jawab WBS tanggal ${complaint.getDataValue('complaint_decision') ? moment(complaint.getDataValue('complaint_decision')['dcreate']).format('DD MMMM YYYY') : '--'}</li>
              <li>Surat Tugas Kepala Keasistenan Utama Manajemen Mutu Nomor ${st_number} Tanggal ${st_date ? moment(st_date).format('DD MMMM YYYY') : '--'} tentang Penunjukan Tim Pemeriksa Aduan Nomor ${form_no}</li>
            </ol>
          </p>
          `;
        })

        m.sort(function (a, b) { return a['dcreate'] - b['dcreate'] });
      }

      return {
        items: m,
        item: complaint,    // complaint
        item2: studies      // studies
      }
    } catch (error) {
      console.log('lhpa_get', error)
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

      if (!obj.type) return response.failed('Kolom jenis LHPA TIDAK boleh kosong')
      obj.lhpa['ucreate'] = sessions[0].user_id;
      let v = await models.lhpa.create(obj.lhpa, { transaction: t, });

      if (v instanceof models.lhpa) {
        let events = obj.events;
        events.map(e => {
          e.idx_t_lhpa = v.getDataValue('idx_t_lhpa')
        })

        await models.lhpa_events.bulkCreate(events, { transaction: t })
        await models.complaints.update(
          { idx_m_status: 13 }, // to Bedah pengaduan
          {
            transaction: t,
            where: { idx_m_complaint: obj.lhpa['idx_m_complaint'] }
          }
        )
      }

      await t.commit()
      return response.success('LHPA berhasil disimpan')
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

      obj.lhpa['umodified'] = sessions[0].user_id;
      obj.lhpa['dmodified'] = new Date();
      obj.lhpa['arranged_by'] = sessions[0].user_id;
      obj.lhpa['arranged_date'] = new Date()
      
      await models.lhpa.update(obj.lhpa, {
        where: { idx_t_lhpa: obj.lhpa.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.lhpa['idx_m_complaint'],
        action: 'U',
        flow: '12',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Update berhasi disimpan')
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

      obj.lhpa['umodified'] = sessions[0].user_id;
      obj.lhpa['dmodified'] = new Date();
      obj.lhpa['checked_date'] = new Date();
      if(!obj.lhpa['approved_by']) return response.failed('Kolom Disetujui Oleh TIDAK boleh kosong')

      await models.lhpa.update(obj.lhpa, {
        where: { idx_t_lhpa: obj.lhpa.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.lhpa['idx_m_complaint'],
        action: 'U',
        flow: '12',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Pemeriksaan lhpa berhasil disimpan')
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

      obj.lhpa['umodified'] = sessions[0].user_id;
      obj.lhpa['dmodified'] = new Date();
      obj.lhpa['approved_date'] = new Date();

      await models.lhpa.update(obj.lhpa, { where: { idx_t_lhpa: obj.lhpa.id }, transaction: t });
      await models.complaints.update({
        umodified: sessions[0].user_id,
        dmodified: new Date(),
        idx_m_status: 13
      },{transaction:t, where: { idx_m_complaint: obj.lhpa['idx_m_complaint'], }})

      await models.surgery.create({
        idx_m_complaint: obj.lhpa['idx_m_complaint'],
        ucreate: sessions[0].user_id
      }, { transaction: t })

      // to Bedah Pengaduan
      await models.clogs.bulkCreate([
        {
          idx_m_complaint: obj.lhpa['idx_m_complaint'],
          action: 'U',
          flow: '12',
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id,
          notes: 'telah menyetujui lhpa'
        },
        {
          idx_m_complaint: obj.lhpa['idx_m_complaint'],
          action: 'C',
          flow: '13',
          changes: JSON.stringify(obj),
          ucreate: 'auto',
          notes: 'telah melanjutkan ke flow selanjutnya (bedah pengaduan)'
        }
      ], { transaction: t, });

      await t.commit()
      return response.success('Penyetujuan lhpa berhasil disimpan')
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
  async next(sid, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      let where = {};
      where['idx_m_complaint'] = id;
      where['head_of_kumm'] = { [Op.eq]: null };

      let count = await models.lhpa.count({ where: where, transaction: t });
      if (count > 0) return response.failed(`<ul><li>` + ['Kolom Keasistenan Utama Manajemen Mutu TIDAK boleh kosong.'].join('</li><li>') + `</li></ul>`)

      // to Konfirmasi pengadu
      await models.complaints.update({ idx_m_status: 13 }, { transaction: t, where: { idx_m_complaint: id } })

      // LOGS
      await models.clogs.create({
        idx_m_complaint: id,
        action: 'U',
        flow: '12',
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
  async addAction(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      obj.action['ucreate'] = sessions[0].user_id;
      await models.lhpa_actions.create(obj.action, { transaction: t });

      // LOGS
      await models.clogs.create({
        idx_m_complaint: obj.idx_m_complaint,
        action: 'I',
        flow: '11',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: `menambahkan ${obj.action.type} ke lhpa`
      }, { transaction: t, });

      await t.commit()
      return response.success(`Berhasil menambahkan ${obj.action.type}`)
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
  async delAction(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      await models.lhpa_actions.destroy({ transaction: t, where: { idx_t_lhpa_action: obj.action.id } });
      await models.clogs.create({
        idx_m_complaint: obj.idx_m_complaint,
        action: 'D',
        flow: '11',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: `menambahkan ${obj.action.type} ke lhpa`
      }, { transaction: t, });

      await t.commit()
      return response.success(`Berhasil menghapus data`)
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
  async updateAction(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      obj.action['umodified'] = sessions[0].user_id;
      obj.action['dmodified'] = new Date();
      await models.lhpa_actions.update(obj.action, { transaction: t, where: { idx_t_lhpa_action: obj.action.id } })
      await models.clogs.create({
        idx_m_complaint: obj.idx_m_complaint,
        action: 'D',
        flow: '11',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: `menambahkan ${obj.action.type} ke lhpa`
      }, { transaction: t, });

      await t.commit()
      return response.success(`Berhasil menghapus data`)
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
  async addActionDetail(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      obj.action['ucreate'] = sessions[0].user_id;
      await models.lhpa_act_detail.create(obj.action, { transaction: t });

      // LOGS
      await models.clogs.create({
        idx_m_complaint: obj.idx_m_complaint,
        action: 'I',
        flow: '11',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: `menambahkan tahapan`
      }, { transaction: t, });

      await t.commit()
      return response.success(`Berhasil menambahkan tahapan`)
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
  async delActionDetail(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      obj.action['ucreate'] = sessions[0].user_id;
      await models.lhpa_act_detail.destroy({ transaction: t, where: { idx_t_action_detail: obj.action.id } });

      // LOGS
      await models.clogs.create({
        idx_m_complaint: obj.idx_m_complaint,
        action: 'D',
        flow: '11',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: `menghapus tahapan`
      }, { transaction: t, });

      await t.commit()
      return response.success(`Berhasil menghapus tahapan`)
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
  async updateActionDetail(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      obj.action['umodified'] = sessions[0].user_id;
      obj.action['dmodified'] = new Date();
      await models.lhpa_act_detail.update(obj.action, { transaction: t, where: { idx_t_action_detail: obj.action.id } });

      // LOGS
      await models.clogs.create({
        idx_m_complaint: obj.idx_m_complaint,
        action: 'D',
        flow: '11',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: `menghapus tahapan`
      }, { transaction: t, });

      await t.commit()
      return response.success(`Berhasil menghapus tahapan`)
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  },
}