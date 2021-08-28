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

      console.log('lhpa_01', lhpa_01);
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
            title: '3. Survei',
            by: null,
            idx_t_lhpa: lhpa_01.getDataValue('idx_t_lhpa')
          },
          {
            type: 'E',
            title: '4. Perlakuan Pelaksanaan Saran',
            by: null,
            idx_t_lhpa: lhpa_01.getDataValue('idx_t_lhpa')
          },
        ], { transaction: t });
        console.log('lhpa_01E', lhpa_01E);

        let lhpa_01EDetail = [
          {
            step: 'Pemetaan Data Laporan',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Identifikasi',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Pemuktahiran',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Penyusunan Laporan Hasil Deteksi',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '1. Deteksi')[0].getDataValue('idx_t_lhpa_action') : null
          },
          // analisis
          {
            step: 'Penyusunan Rencana Tindak Lanjut',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Pengumpulan Data',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Penelaahan',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Perumusan Saran',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Penyusunan Laporan Hasil Analisis',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Pengendalian Kualitas Perumusan Saran Kantor-Kantor Perwakilan*',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Penyampaian Laporan Hasil Analisis',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '2. Analisis')[0].getDataValue('idx_t_lhpa_action') : null
          },
          // survey
          {
            step: 'Penyusunan Rencana Tindak Lanjut',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Pengumpulan Data Survei',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Penelaahan Hasil Survei',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Perumusan Hasil Survei',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Penyampaian Laporan Hasil Survei',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '3. Survei')[0].getDataValue('idx_t_lhpa_action') : null
          },
          // Perlakukan Pelaksanaan Saran
          {
            step: 'Monitoring',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '4. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '4. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Pendampingan',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '4. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '4. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Publikasi',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '4. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '4. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
          {
            step: 'Tahapan Perlakuan Lain',
            idx_t_lhpa_action: lhpa_01E.filter(e => e.type == 'E' && e.title == '4. Perlakuan Pelaksanaan Saran').length > 0 ? lhpa_01E.filter(e => e.type == 'E' && e.title == '4. Perlakuan Pelaksanaan Saran')[0].getDataValue('idx_t_lhpa_action') : null
          },
        ];
        await models.lhpa_act_detail.bulkCreate(lhpa_01EDetail, { transaction: t });

        // pemeriksaan aduan
        let lhpa_01F = await models.lhpa_actions.create(
          {
            type: 'F',
            title: '1. Proses Pemeriksaan Aduan',
            by: null,
            idx_t_lhpa: lhpa_01.getDataValue('idx_t_lhpa')
          }, { transaction: t });

        let lhpa_01FDetail = [
          {
            step: 'Penetapan Tim Pemeriksa',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Validasi Pengaduan - Memastikan dokumen pengaduan yang diteruskan oleh Inspektorat',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Validasi Pengaduan - Komunikasi dengan Pengadu',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Validasi Pengaduan - Komunikasi dengan Teradu',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Validasi Pengaduan - Penelusuran data pada Sistem Informasi',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Permintaan Data, Informasi, dan Dokumen - Pengadu',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Permintaan Data, Informasi, dan Dokumen - Tanggapan Pengadu',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Permintaan Data, Informasi, dan Dokumen - Teradu',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Permintaan Data, Informasi, dan Dokumen - Tanggapan Teradu',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Permintaan Data, Informasi, dan Dokumen - Pihak Terkait',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Permintaan Data, Informasi, dan Dokumen - Tanggapan Pihak Terkait',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Telaah dan Analisis - Pemeriksaan Dokumen Pengaduan',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Telaah dan Analisis - Penyusunan Kertas Kerja Pemeriksaan',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Klarifikasi kepada Terperiksa - Penyampaian pemberitahuan permintaan klarifikasi kepada Terperiksa',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Klarifikasi kepada Terperiksa - Permintaan Klarifikasi kepada Terperiksa',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Klarifikasi kepada Terperiksa - Penyampaian Berita Acara Klarifikasi Kepada Terperiksa',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Konfirmasi kepada Pengadu',
            idx_t_lhpa_action: lhpa_01F.getDataValue('idx_t_lhpa_action')
          },
        ]
        await models.lhpa_act_detail.bulkCreate(lhpa_01FDetail, { transaction: t });
      }

      // 1. LAPORAN PENYELESAIAN
      let lhpa_02 = await models.lhpa.create({
        idx_m_complaint: id, type: 'PENYELESAIAN',
        analisis_pemeriksaan: analisis_pemeriksaan,
        pendapat_pemeriksa: pendapat_pemeriksa,
        tindak_lanjut: tindak_lanjut,
      }, { transaction: t });

      if (lhpa_02 instanceof models.lhpa) {
        let lhpa_02E = await models.lhpa_actions.create(
          {
            type: 'E',
            title: '1. Penerimaan dan Verifikasi Laporan',
            by: 'Keasistenan Utama Pengaduan Masyarakat/Unit PVL Ombudsman Perwakilan',
            idx_t_lhpa: lhpa_02.getDataValue('idx_t_lhpa')
          }, { transaction: t });

        let lhpa_02EDetail = [
          {
            step: 'Penerimaan Laporan',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Pencatatan Laporan',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Verifikasi Formil',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Tindak Lanjut Verifikasi Formil - Surat Permintaan Kelengkapan Data',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Tindak Lanjut Verifikasi Formil - Surat Pemberitahuan Kepada Pelapor (Penolakan Laporan di Formil)',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Tindak Lanjut Verifikasi Formil - Berita Acara Penutupan Laporan Tidak Memenuhi Syarat Formil',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Verifikasi Formil',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Verifikasi Materiil',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
          {
            step: 'Rapat Pleno/Rapat Perwakilan',
            idx_t_lhpa_action: lhpa_02E.getDataValue('idx_t_lhpa_action')
          },
        ]
        await models.lhpa_act_detail.bulkCreate(lhpa_02EDetail, { transaction: t });

        // pemeriksaan aduan
        // let lhpa_02F = await models.lhpa_actions.create(
        //   {
        //     type: 'F',
        //     title: '1. Proses Pemeriksaan Aduan',
        //     by: null
        //   }, { transaction: t });

        // let lhpa_02FDetail = [
        //   {
        //     step: 'Penetapan Tim Pemeriksa',
        //     idx_t_lhpa_action: lhpa_02F.getDataValue('idx_t_lhpa_action')
        //   },
        // ]
        // await models.lhpa_act_detail.bulkCreate(lhpa_02FDetail, { transaction: t });
      }

      // await models.lhpa.bulkCreate([
      //   {
      //     idx_m_complaint: id, type: 'PENCEGAHAN',
      //     tindak_lanjut_laporan: null,
      //     pemeriksaan_kumm: null,
      //     analisis_pemeriksaan: analisis_pemeriksaan,
      //     pendapat_pemeriksa: pendapat_pemeriksa,
      //     kesimpulan_pemeriksa: null,
      //     tindak_lanjut: tindak_lanjut,
      //   },
      //   {
      //     idx_m_complaint: id, type: 'PENYELESAIAN',
      //     tindak_lanjut_laporan: null,
      //     pemeriksaan_kumm: null,
      //     analisis_pemeriksaan: null,
      //     pendapat_pemeriksa: pendapat_pemeriksa,
      //     kesimpulan_pemeriksa: null,
      //     tindak_lanjut: tindak_lanjut,
      //   }
      // ], { transaction: t });

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
      console.log(error)
      throw (error)
    }
  },
}