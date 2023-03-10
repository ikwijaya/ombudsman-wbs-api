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

      let r = await core.checkRoles(sessions[0].user_id, [11]);
      // changes from findOne -> finalAll
      let m = await models.confirmation.findAll({
        attributes: [
          'idx_t_confirmation',
          'value', 'head_of_kumm', 'via',
          [Sequelize.literal(`cast(date AS DATE)`), 'date'],
          [Sequelize.literal(`case 
            when media = 'TELEPON' then 'mdi-phone'
            when media = 'WHATSAPP' then 'mdi-whatsapp'
            when media = 'SMS' then 'mdi-chat'
            when media = 'EMAIL' then 'mdi-email'
            else 'mdi-file-document' end
          `), 'media_icon'],
          'by', 'media', 'notes',
          'response', 'to', 'address', 'by', 'object', 'desc',
          [Sequelize.literal(`case when 1=${r.filter(a => a.idx_m_form == 11 && a.is_update).length > 0 ? 1 : 0} then true else false end`), 'is_update'],
          [Sequelize.literal(`case when 1=${r.filter(a => a.idx_m_form == 11 && a.is_delete).length > 0 ? 1 : 0} then true else false end`), 'is_delete'],
        ],
        where: { idx_m_complaint: id, record_status: 'A' }
      })

      let cla = await models.clarification.findOne({
        attributes: [
          'idx_t_clarification',
          'date', 'teams', 'result',
          'to', 'address', 'by',
          'object', 'meet_date', 'approver',
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
        item2: cla,
        is_insert: r.filter(a => a.idx_m_form == 11 && a.is_insert).length > 0
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
      // await models.complaints.update(
      //   { idx_m_status: 12 }, // to Penyusunan LHPA
      //   {
      //     transaction: t,
      //     where: { idx_m_complaint: obj['idx_m_complaint'] }
      //   }
      // )
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
   * @param {*} id 
   * @returns 
   */
  async delete(sid, obj = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')
      if (!obj)
        return response.failed('Data TIDAK ditemukan')

      await models.confirmation.destroy({
        where: { idx_t_confirmation: obj.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.idx_m_complaint,
        action: 'U',
        flow: '11',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Data berhasi dihapus')
    } catch (error) {
      console.log('errr', error)
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
      const sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      //// define LAPORAN MASYARAKAT atau PENCEGAHAN
      //// 9,10 = LAPORAN MASYARAKAT/PENYELESAIAN
      //// 5 = LAPORAN PENCEGAHAN
      const vd = await models.validation.findOne({
        transaction: t,
        attributes: ['product', 'step'],
        where: { idx_m_complaint: id }
      }).catch(e => { throw(e) })

      const vProduct = !vd ? [] : JSON.parse(vd.getDataValue('product'))
      const step = !vd ? [] : JSON.parse(vd.getDataValue('step'))
      if(step.length == 0) return response.failed('Tidak dapat melakukan APPROVE karena terdapat data yang kurang sesuai pada Tahapan Validasi.')

      let where = {};
      where['idx_m_complaint'] = id;
      // where['via'] = { [Op.eq]: null };

      // let count = await models.confirmation.count({ where: where, transaction: t });
      // if (count > 0) return response.failed(`<ul><li>` + ['Setidaknya.'].join('</li><li>') + `</li></ul>`)

      await models.complaints.update(
        { idx_m_status: 12 }, // to Konfirmasi pengadu
        {
          transaction: t,
          where: { idx_m_complaint: id }
        }
      )

      const pendapat_pemeriksa = `<p><strong>Substansi</strong>, &nbsp;<br>&nbsp;</p><p><strong>Prosedur</strong><br>&nbsp;</p><p><strong>Produk</strong><br>&nbsp;</p>`
      const tindak_lanjut = `<p>Usulan tindak lanjut, sebagai berikut:</p><ol><li>Kepada Teradu:&nbsp;<ul><li>&nbsp;</li></ul></li><li>Kepada Pengadu:<ul><li>&nbsp;</li></ul></li><li>(other option)&nbsp;</li></ol>`
      const analisis_pemeriksaan = `<p>Analisis pemeriksaan aduan, sebagai berikut:</p><ol><li>Substansi:<ul><li>&nbsp;</li></ul></li><li>Prosedur:&nbsp;<ul><li>&nbsp;</li></ul></li><li>&nbsp;Produk:<ul><li>&nbsp;</li></ul></li></ol>`
      const opts = await models.options.findAll({
        raw: true,
        transaction: t,
        attributes: ['remarks'],
        where: { option_id: '4', value: { [Op.in]: step.map(e => e.value) } }
      }).catch(e => { throw(e) })

      //// remove duplicate
      const unikOpt = [...new Set(opts.map(e => e.remarks))]
      
      // AUTO CREATE LHPA 
      // 1. LAPORAN PENCEGAHAN
      if (unikOpt.includes('PENCEGAHAN')) {
        const lhpa_01 = await models.lhpa.create({
          idx_m_complaint: id, type: 'PENCEGAHAN',
          analisis_pemeriksaan: analisis_pemeriksaan,
          pendapat_pemeriksa: pendapat_pemeriksa,
          tindak_lanjut: tindak_lanjut,
          substansi: vProduct.map(e => e.value).includes('SUBSTANSI'),
          procedure: vProduct.map(e => e.value).includes('PROCEDURE'),
          product: vProduct.map(e => e.value).includes('PRODUK')
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
      }

      // 1. LAPORAN PENYELESAIAN
      if (unikOpt.includes('PENYELESAIAN')) {
        const lhpa_02 = await models.lhpa.create({
          idx_m_complaint: id, type: 'PENYELESAIAN',
          analisis_pemeriksaan: analisis_pemeriksaan,
          pendapat_pemeriksa: pendapat_pemeriksa,
          tindak_lanjut: tindak_lanjut,
          substansi: vProduct.map(e => e.value).includes('SUBSTANSI'),
          procedure: vProduct.map(e => e.value).includes('PROCEDURE'),
          product: vProduct.map(e => e.value).includes('PRODUK')
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

          //Bagian F
          let lhpa_02F = await models.lhpa_actions.bulkCreate(
            [{
              type: 'F',
              title: '1. Proses Pemeriksaan Aduan',
              by: null,
              idx_t_lhpa: lhpa_02.getDataValue('idx_t_lhpa')
            }], { transaction: t });

          // get tim pemeriksa
          let pemeriksa = await models.complaint_determination_users.findAll(
            {
              transaction: t,
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
          let getPemeriksa = ``;
          for (let i = 0; i < pemeriksa.length; i++) { getPemeriksa += `<li>${pemeriksa[i]['user.fullname']}</li>` }

          let konfirmasi = await models.confirmation.findAll({
            transaction: t,
            attributes: [[Sequelize.literal(`cast(date AS DATE)`), 'date'], 'by', 'media', 'notes',],
            where: { idx_m_complaint: id }
          })

          let konfirmasiPengadu = ``, konfirmasiTeradu = ``
          for (let i = 0; i < konfirmasi.length; i++) {
            if (konfirmasi[i].by == 'PENGADU') {
              konfirmasiPengadu += `
                <li>
                  <div>Pada ${konfirmasi[i].date}</div>
                  <div>Oleh ${konfirmasi[i].by}</div>
                  <div>Melalui ${konfirmasi[i].media}</div>
                  <div>Hasil ${konfirmasi[i].notes}</div>
                </li>
              `
            } else {
              konfirmasiTeradu += `
                <li>
                  <div>Pada ${konfirmasi[i].date}</div>
                  <div>Oleh ${konfirmasi[i].by}</div>
                  <div>Melalui ${konfirmasi[i].media}</div>
                  <div>Hasil ${konfirmasi[i].notes}</div>
                </li>
              `
            }
          }

          let validasi = await models.validation.findOne(
            {
              transaction: t,
              attributes: ['idx_t_validation',],
              include: [
                {
                  required: false,
                  attributes: ['checklist'],
                  model: models.validation_checklists,
                },
                {
                  required: false,
                  attributes: ['by', 'media', 'notes', 'date'],
                  model: models.validation_comm
                }
              ],
              where: { record_status: 'A', idx_m_complaint: id }
            }
          )

          let vc = JSON.parse(JSON.stringify(validasi.getDataValue('validation_checklists')))
          let val_docs = `Dokumen yang diperiksa yaitu: <ul>`;
          for (let i = 0; i < vc.length; i++) { val_docs += `<li>${vc[i]['checklist']}</li>` }

          lhpa_02EDetail = [
            {
              sort: 1,
              step: 'Penetapan Tim Pemeriksa',
              notes: '<ul>' + getPemeriksa + '</ul>',
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 2,
              step: 'Validasi Pengaduan - Memastikan dokumen pengaduan yang diteruskan oleh Inspektorat',
              notes: `
                <p>
                  Dokumen yang diperoleh dari Inspektorat berdasarkan Pengaduan Pelapor:
                  <ul>
                    <li>Informasi administrasi pengaduan;</li>
                    <li>Putusan PenanggungJawab WBS;</li>
                    <li>Laporan Hasil Penelaahan Pengaduan oleh Inspektorat;</li>
                    <li>Bukti pengaduan yang disampaikan oleh Pengadu dan;</li>
                    <li>Dokumen pendukung pengaduan;</li>
                  </ul>
                </p>
              `,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 3,
              step: 'Validasi Pengaduan - Komunikasi dengan Pengadu',
              notes: `<ul>${konfirmasiPengadu}</ul>`,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 4,
              step: 'Validasi Pengaduan - Komunikasi dengan Teradu',
              notes: `<ul>${konfirmasiTeradu}</ul>`,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 5,
              step: 'Validasi Pengaduan - Penelusuran data pada Sistem Informasi',
              notes: `
                Dugaan Maladministrasi: <br />
                Status Laporan: <br />
              `,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 6,
              step: 'Permintaan Data, Informasi dan Dokumen - Pengadu',
              notes: ``,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 7,
              step: 'Permintaan Data, Informasi dan Dokumen - Tanggapan Pengadu',
              notes: ``,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 8,
              step: 'Permintaan Data, Informasi dan Dokumen - Teradu',
              notes: ``,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 9,
              step: 'Permintaan Data, Informasi dan Dokumen - Tanggapan Teradu',
              notes: ``,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 10,
              step: 'Permintaan Data, Informasi dan Dokumen - Pihak Terkait',
              notes: ``,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 11,
              step: 'Permintaan Data, Informasi dan Dokumen - Tanggapan Pihak Terkait',
              notes: ``,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 12,
              step: 'Telaah dan Analisis - Pemeriksaan Dokumen Pengaduan',
              notes: `${val_docs}</ul>`,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 13,
              step: 'Telaah dan Analisis - Penyusunan Kertas Kerja Pemeriksaan',
              notes: ``,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            {
              sort: 14,
              step: 'Telaah dan Analisis - BA Hasil Klarifikasi',
              notes: ``,
              idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            },
            // {
            //   sort: 15,
            //   step: 'Pra Konsiliasi',
            //   notes: ``,
            //   idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            // },
            // {
            //   sort: 16,
            //   step: 'Konsiliasi',
            //   notes: ``,
            //   idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            // },
            // {
            //   sort: 17,
            //   step: 'BA Konsiliasi',
            //   notes: ``,
            //   idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            // },
            // {
            //   sort: 18,
            //   step: 'Ajudikasi',
            //   notes: ``,
            //   idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            // },
            // {
            //   sort: 19,
            //   step: 'Rekomendasi - Clearence oleh KUMM',
            //   notes: ``,
            //   idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            // },
            // {
            //   sort: 20,
            //   step: 'Rekomendasi - Clearance oleh Anggota',
            //   notes: ``,
            //   idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            // },
            // {
            //   sort: 21,
            //   step: 'Rekomendasi - Penandatanganan',
            //   notes: ``,
            //   idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            // },
            // {
            //   sort: 22,
            //   step: 'Monitoring',
            //   notes: ``,
            //   idx_t_lhpa_action: lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan').length > 0 ? lhpa_02F.filter(e => e.type == 'F' && e.title == '1. Proses Pemeriksaan Aduan')[0].getDataValue('idx_t_lhpa_action') : null
            // },
          ]

          await models.lhpa_act_detail.bulkCreate(lhpa_02EDetail.filter(e => e['idx_t_lhpa_action'] !== null), { transaction: t });
        }
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
      console.log('error ===> NEXT CONFIRMATION', error)
      await t.rollback()
      throw (error)
    }
  },
}