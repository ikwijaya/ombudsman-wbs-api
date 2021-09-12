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
   * @param {*} complaintId 
   * @returns 
   */
  async get(sid, id = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let m = await models.confirmation.findOne({
        attributes: [
          'idx_t_confirmation',
          'value', 'head_of_kumm', 'via',
          'response', 'to', 'address', 'by', 'object', 'desc'
        ],
        where: { idx_m_complaint: id, record_status: 'A' }
      })

      let cla = await models.clarification.findOne({
        attributes: [
          'idx_t_clarification',
          'date', 'teams', 'result',
          'to', 'address', 'by',
          'object', 'meet_date', 'approver'
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

      return {
        item: m,
        item2: cla
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
      await models.confirmation.create(obj, { transaction: t, });
      await models.complaints.update(
        { idx_m_status: 12 }, // to Penyusunan LHPA
        {
          transaction: t,
          where: { idx_m_complaint: obj['idx_m_complaint'] }
        }
      )
      await t.commit()
      return response.success('Konfirmasi pengadu berhasi disimpan')
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

      obj.confirmation['umodified'] = sessions[0].user_id;
      obj.confirmation['dmodified'] = new Date();

      await models.confirmation.update(obj.confirmation, {
        where: { idx_t_confirmation: obj.confirmation.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.confirmation['idx_m_complaint'],
        action: 'U',
        flow: '11',
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
      where['via'] = { [Op.eq]: null };

      let count = await models.confirmation.count({ where: where, transaction: t });
      if (count > 0) return response.failed(`<ul><li>` + ['Kolom Konfirmasi melalui TIDAK boleh kosong.'].join('</li><li>') + `</li></ul>`)

      await models.complaints.update(
        { idx_m_status: 12 }, // to Konfirmasi pengadu
        {
          transaction: t,
          where: { idx_m_complaint: id }
        }
      )

      let pendapat_pemeriksa = `<p><strong>Substansi</strong>, &nbsp;<br>&nbsp;</p><p><strong>Prosedur</strong><br>&nbsp;</p><p><strong>Produk</strong><br>&nbsp;</p>`
      let tindak_lanjut = `<p>Usulan tindak lanjut, sebagai berikut:</p><ol><li>Kepada Teradu:&nbsp;<ul><li>&nbsp;</li></ul></li><li>Kepada Pengadu:<ul><li>&nbsp;</li></ul></li><li>(other option)&nbsp;</li></ol>`
      let analisis_pemeriksaan = `<p>Analisis pemeriksaan aduan, sebagai berikut:</p><ol><li>Substansi:<ul><li>&nbsp;</li></ul></li><li>Prosedur:&nbsp;<ul><li>&nbsp;</li></ul></li><li>&nbsp;Produk:<ul><li>&nbsp;</li></ul></li></ol>`

      // AUTO CREATE LHPA 
      // 1. LAPORAN PENCEGAHAN
      let lhpa_01 = await models.lhpa.create({
        idx_m_complaint: id, type: 'PENCEGAHAN',
        analisis_pemeriksaan: analisis_pemeriksaan,
        pendapat_pemeriksa: pendapat_pemeriksa,
        tindak_lanjut: tindak_lanjut,
      }, { transaction: t });

      if (lhpa_01 instanceof models.lhpa) {
        // tindak lanjut
        let lhpa_01E = await models.lhpa_actions.bulkCreate([
          {
            type: 'E',
            title: '1. Deteksi',
            by: 'Keasistenan Utama Pengaduan Masyarakat/Unit PVL Ombudsman Perwakilan',
            idx_t_lhpa: lhpa_01.getDataValue('idx_t_lhpa')
          },
          {
            type: 'E',
            title: '2. Analisis',
            by: '*Keasistenan Utama .../Unit Pemeriksa Ombudsman Perwakilan',
            idx_t_lhpa: lhpa_01.getDataValue('idx_t_lhpa')
          },
          {
            type: 'E',
            title: '3. Perlakuan Pelaksanaan Saran',
            by: '',
            idx_t_lhpa: lhpa_01.getDataValue('idx_t_lhpa')
          },
        ], { transaction: t });

        let lhpa_01EDetail = [
          {
            sort: 1,
            step: 'Inventarisasi',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 2,
            step: 'Identifikasi',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 3,
            step: 'Pemuktahiran',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 4,
            step: 'Penyusunan Hasil Deteksi',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 5,
            step: 'Rapat Pleno/Perwakilan',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          // analisis
          {
            sort: 1,
            step: 'Penyusunan Rencana Tindak Lanjut Analisis',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 2,
            step: 'Pengumpulan Data',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 3,
            step: 'Penelaahan',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 4,
            step: 'Perumusan Saran',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 5,
            step: 'Konsultasi dan Koordinasi',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 6,
            step: 'Rapat Pleno/Perwakilan',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 7,
            step: 'Penyampaian Saran',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          // Perlakukan Pelaksanaan Saran
          {
            sort: 1,
            step: 'Penyusunan Rencana Tindak  Lanjut Perlakuan Pelaksanaan Saran',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 2,
            step: 'Monitoring/Pendampingan',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 3,
            step: 'Penyusunan Laporan Hasil Perlakuan Pelaksanaan Saran',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 4,
            step: 'Rapat Pleno/Perwakilan',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 5,
            step: 'Tindak Lanjut (Tanpa Publikasi/Publikasi/Laporan)',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
        ];
        await models.lhpa_act_detail.bulkCreate(lhpa_01EDetail.filter(e => e['idx_t_lhpa_action'] !== null), { transaction: t });

        // pemeriksaan aduan
        let lhpa_01F = await models.lhpa_actions.bulkCreate(
          [{
            type: 'F',
            title: '1. Proses Pemeriksaan Aduan',
            by: null,
            idx_t_lhpa: lhpa_01.getDataValue('idx_t_lhpa')
          }], { transaction: t });

        let lhpa_01FDetail = [
          {
            sort: 1,
            step: 'Surat Tugas/Disposisi KKU',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 2,
            step: 'Validasi Pengaduan',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 3,
            step: 'Permintaan Data, Informasi, dan Dokumen ke Pengadu',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 4,
            step: 'Tanggapan Pengadu',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 5,
            step: 'Permintaan Data, Informasi, dan Dokumen ke Teradu',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 6,
            step: 'Tanggapan Teradu',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 7,
            step: 'Permintaan Data, Informasi, dan Dokumen ke Pihak Terkait',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 8,
            step: 'Tanggapan Pihak Terkait',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 9,
            step: 'Pemeriksaan Dokumen Pengaduan',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 10,
            step: 'Pokok Aduan Klarifikasi',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 11,
            step: 'Penyampaian Pemberitahuan Permintaan Klarifikasi Kepada Terperiksa',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 12,
            step: 'Hasil Klarifikasi Kepada Terperiksa',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 13,
            step: 'Penyampaian BA Klarifikasi Kepada Terperiksa',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 14,
            step: 'Konfirmasi Kepada Pengadu',
            idx_t_lhpa_action: lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_01F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
          },
        ]
        await models.lhpa_act_detail.bulkCreate(lhpa_01FDetail.filter(e => e['idx_t_lhpa_action'] !== null), { transaction: t });
      }

      // 1. LAPORAN PENYELESAIAN
      let lhpa_02 = await models.lhpa.create({
        idx_m_complaint: id, type: 'PENYELESAIAN',
        analisis_pemeriksaan: analisis_pemeriksaan,
        pendapat_pemeriksa: pendapat_pemeriksa,
        tindak_lanjut: tindak_lanjut,
      }, { transaction: t });

      if (lhpa_02 instanceof models.lhpa) {
        let lhpa_02E = await models.lhpa_actions.bulkCreate(
          [
            {
              type: 'E',
              title: '1. Penerimaan dan Verifikasi Laporan',
              by: '',
              idx_t_lhpa: lhpa_02.getDataValue('idx_t_lhpa')
            },
            {
              type: 'E',
              title: '2. Pemeriksaan Laporan',
              by: '',
              idx_t_lhpa: lhpa_02.getDataValue('idx_t_lhpa')
            },
            {
              type: 'E',
              title: '3. Resolusi dan Monitoring',
              by: '',
              idx_t_lhpa: lhpa_02.getDataValue('idx_t_lhpa')
            },
            {
              type: 'E',
              title: '4. Penutupan Laporan',
              by: '',
              idx_t_lhpa: lhpa_02.getDataValue('idx_t_lhpa')
            }
          ], { transaction: t });

        let lhpa_02EDetail = [
          {
            sort: 1,
            step: 'Penerimaan dan Laporan',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '1. Penerimaan dan Verifikasi Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '1. Penerimaan dan Verifikasi Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 2,
            step: 'Verifikasi Formil',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '1. Penerimaan dan Verifikasi Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '1. Penerimaan dan Verifikasi Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 3,
            step: 'Verifikasi Materiil',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '1. Penerimaan dan Verifikasi Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '1. Penerimaan dan Verifikasi Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 4,
            step: 'Rapat Pleno/Rapat Perwakilan',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '1. Penerimaan dan Verifikasi Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '1. Penerimaan dan Verifikasi Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          // 2. Pemeriksaan Laporan
          {
            sort: 1,
            step: 'Diterima oleh Keasistenan Pemeriksa',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 2,
            step: 'Pemeriksaan Dokumen/LHPD',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 3,
            step: 'Permintaan Klarifikasi Tertulis',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 4,
            step: 'Permintaan Klarifikasi Langsung',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 5,
            step: 'Permintaan Klarifikasi Lapangan',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 6,
            step: 'Pemanggilan',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 7,
            step: 'Konsiliasi',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 8,
            step: 'Gelar Laporan',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 9,
            step: 'Laporan Akhir Hasil Pemeriksaan',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 10,
            step: 'Monitoring LAHP',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '2. Pemeriksaan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },

          //3. Resolusi dan Monitoring
          {
            sort: 1,
            step: 'Penelaahan LAHP',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '3. Resolusi dan Monitoring').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '3. Resolusi dan Monitoring')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 2,
            step: 'Pra Konsiliasi/Mediasi',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '3. Resolusi dan Monitoring').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '3. Resolusi dan Monitoring')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 3,
            step: 'Konsiliasi/Mediasi',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '3. Resolusi dan Monitoring').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '3. Resolusi dan Monitoring')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 4,
            step: 'Rekomendasi',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '3. Resolusi dan Monitoring').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '3. Resolusi dan Monitoring')[0].getDataValue('idx_t_lhpa_action') : null
          },

          // 4. Penutupan Laporan
          {
            sort: 1,
            step: 'Pemberitahuan Kepada Pelapor',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '4. Penutupan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '4. Penutupan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            sort: 2,
            step: 'Berita Acara Penutupan Laporan',
            idx_t_lhpa_action: lhpa_02E.filter(e => e.type == 'E' && e.title == '4. Penutupan Laporan').length > 0 ? lhpa_02E.filter(e => e.type == 'E' && e.title == '4. Penutupan Laporan')[0].getDataValue('idx_t_lhpa_action') : null
          },
        ]
        await models.lhpa_act_detail.bulkCreate(lhpa_02EDetail.filter(e => e['idx_t_lhpa_action'] !== null), { transaction: t });
      }

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
}