const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async get(sid = null, id = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let r = await core.checkRoles(sessions[0].user_id,[16]);
      let m = await models.monitoring.findAll(
        {
          attributes: [
            'idx_t_monitoring',
            'title',
            'by',
            'validation_date',
            'notes',
            'is_did',
            'form_status',
            [Sequelize.literal(`${r.filter(a => a.is_update && a.idx_m_form == 16).length > 0}`), 'is_update'],
            [Sequelize.literal(`${r.filter(a => a.is_delete && a.idx_m_form == 16).length > 0}`), 'is_delete']
          ],
          include: [
            {
              required: false,
              attributes: [
                'idx_t_monitoring_detail',
                'date', 'is_did', 'notes', 'by',
                [Sequelize.literal(`${r.filter(a => a.is_update && a.idx_m_form == 16).length > 0}`), 'is_update'],
                [Sequelize.literal(`${r.filter(a => a.is_delete && a.idx_m_form == 16).length > 0}`), 'is_delete']
              ],
              model: models.monitoring_detail,
            },
          ],
          where: { record_status: 'A', idx_m_complaint: id }
        }
      )

      return { 
        items: m, 
        is_insert: r.filter(a => a.is_insert && a.idx_m_form == 16).length > 0
      }
    } catch (err) {
      throw (err)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async save(sid = null, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      obj.monitoring['ucreate'] = sessions[0].user_id;
      await models.monitoring.create(obj.monitoring, { transaction: t });
      
      await t.commit();
      return response.success('Monitoring berhasi di simpan', []);
    } catch (err) {

      await t.rollback();
      throw (err)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async delete(sid = null, id) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      await models.monitoring.destroy({ transaction: t, where: { idx_t_monitoring: id } });
      await t.commit();
      return response.success('Monitoring berhasi di simpan', []);
    } catch (err) {

      await t.rollback();
      throw (err)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async addDetail(sid = null, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      if (!obj.details.date) return response.failed('Kolom Tanggal Monitoring TIDAK boleh Kosong');
      await models.monitoring_detail.create(obj.details, { transaction: t });
      await t.commit();
      return response.success('Detail monitoring berhasil di simpan', []);
    } catch (err) {

      await t.rollback();
      throw (err)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async updateDetail(sid = null, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      if (!obj.details.date) return response.failed('Kolom Tanggal Monitoring TIDAK boleh Kosong');
      await models.monitoring_detail.update(obj.details, { transaction: t, where: { idx_t_monitoring_detail: obj.details.idx_t_monitoring_detail } });
      await t.commit();
      return response.success('Detail monitoring berhasil di ubah', []);
    } catch (err) {

      await t.rollback();
      throw (err)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async deleteDetail(sid = null, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid);
      if (sessions.length === 0)
        return response.failed('Session TIDAK ditemukan');

      await models.monitoring_detail.destroy({ transaction: t, where: { idx_t_monitoring_detail: id } });
      await t.commit();
      return response.success('Detail monitoring berhasil di ubah', []);
    } catch (err) {

      await t.rollback();
      throw (err)
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

      obj.monitoring['umodified'] = sessions[0].user_id;
      obj.monitoring['dmodified'] = new Date();

      await models.monitoring.update(obj.monitoring, {
        where: { idx_t_monitoring: obj.monitoring.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.monitoring['idx_m_complaint'],
        action: 'U',
        flow: '16',
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

      let count = await models.monitoring.count({ where: where, transaction: t });
      if (count == 0) return response.failed(`<ul><li>` + ['Monitoring TIDAK boleh Kosong'].join('</li><li>') + `</li></ul>`)

      await models.complaints.update(
        { idx_m_status: 17 }, // to Penutupan
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

      let decision = await models.complaint_decisions.findOne({
        attributes: ['idx_m_violation'],
        where: { idx_m_complaint: id }
      });

      if (complaint instanceof models.complaints) {
        teradu = complaint.getDataValue('complaint_study')['complaint_study_reporteds'].map(e => e.name) || [];
        pengadu = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: complaint.getDataValue('ucreate') } })
        let getPengadu = complaint.getDataValue('idx_m_legal_standing') == -1 ? complaint.getDataValue('manpower') :
          complaint['ucreate'] = pengadu instanceof models.users ? pengadu.getDataValue('name') : null

        let reason = ``
        if (decision instanceof models.complaint_decisions) {
          let violation = decision.getDataValue('idx_m_violation') || null
          if (['10'].includes(violation)) { // proses produk akhir
            reason = ``
            // reason += `
            //   <ol>
            //     <li>
            //       Berdasarkan hasil validasi yang telah dilakukan, bahwa terhadap Laporan masyarakat/kajian dimaksud, sedang dalam proses tindak lanjut oleh Keasistenan .../Perwakilan ...
            //     </li>
            //     <li>
            //       Terhadap aduan dimaksud, melalui surat Ombudsman RI Nomor: ..... tanggal .... telah disampaikan kepada Teradu dan meminta Teradu untuk segera menyampaikan informasi perkembangan laporan kepada Pengadu dan ditembuskan kepada Keasistenan Utama Manajemen Mutu.
            //     </li>
            //     <li>
            //       Selanjutnya berdasarkan surat Teradu Nomor: ..... tanggal ..... diinformasikan bahwa terhadap poin Nomor 3 telah dilaksanakan tindaklanjut dimaksud.
            //     </li>
            //     <li>
            //       Mengingat Teradu telah menindaklanjuti surat Nomor ....., maka aduan Pengadu Nomor ditutup di Keasistenan Utama Manajemen Mutu.
            //     </li>
            //   </ol>
            // `
          }
        }

        await models.closing.create({
          idx_m_complaint: id,
          to: teradu.join(' , '),
          by: getPengadu,
          object: complaint.getDataValue('description'),
          reason: reason
        }, { transaction: t });
      }

      // LOGS
      await models.clogs.bulkCreate([
        {
          idx_m_complaint: id,
          action: 'U',
          flow: '16',
          changes: JSON.stringify({}),
          ucreate: sessions[0].user_id,
          notes: 'telah melanjutkan ke flow selanjutnya (penutupan)'
        },
        {
          idx_m_complaint: id,
          action: 'I',
          flow: '17',
          changes: JSON.stringify({}),
          ucreate: 'auto-wbs',
          notes: 'penutupan flow auto generate by system'
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