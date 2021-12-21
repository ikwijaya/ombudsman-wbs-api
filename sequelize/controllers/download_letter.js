const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const { helper } = require('../../helper')
const { API_URL } = require('../../config')

module.exports = {
  /**
   *  Lampiran 1 : FORMAT LAPORAN HASIL PENELAAHAN ADUAN – OLEH INSPEKTORAT OMBUDSMAN
   * @param {*} id 
   * @returns 
   */
  async letter_01(id, flag = null) {
    try {
      let html = ``;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
                'filesize'
              ],
              model: models.complaint_attachments
            },
          ],
        }
      );

      let s = await models.complaint_studies.findOne(
        {
          attributes: [
            'idx_t_complaint_study',
            'notes',
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
          ],
          where: { record_status: 'A', idx_m_complaint: c instanceof models.complaints ? c.getDataValue('idx_m_complaint') : null }
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = `
          <table border="1" class="letter">
            <tr>
              <td>Nama Teradu</td>
              <td>Identitas</td>
              <td>Jabatan</td>
            </tr>
        `;
        for (let i = 0; i < c.getDataValue('complaint_reporteds').length; i++) {
          let report = c.getDataValue('complaint_reporteds')
          reported += `
          <tr>
            <td>${report[i].name}</td>
            <td>${report[i].identity_no}</td>
            <td>${report[i].occupation}</td>
          </tr>
          `
        }
        reported += `</table>`

        let events = `
          <table border="1" class="letter">
            <tr>
              <td>Tanggal</td>
              <td>Peristiwa</td>
              <td>Catatan</td>
            </tr>
          `;
        for (let i = 0; i < c.getDataValue('complaint_events').length; i++) {
          let event = c.getDataValue('complaint_events')
          events += `
            <tr>
              <td>${moment(event[i].date).format('DD MMM YY')}</td>
              <td>${event[i].event}</td>
              <td>${event[i].notes}</td>
            </tr>
        `
        }
        events += `</table>`

        let incidents = `
          <table border="1" class="letter">
            <tr>
              <td>Tanggal</td>
              <td>Kantor</td>
              <td>Alamat</td>
              <td>Unit Kerja</td>
              <td>Provinsi - Kota</td>
              <td>Catatan</td>
            </tr>
          `;
        for (let i = 0; i < c.getDataValue('complaint_incidents').length; i++) {
          let incident = c.getDataValue('complaint_incidents')
          incidents += `
            <tr>
              <td>
                ${moment(incident[i].start_date).format('DD MMM YY')} s/d 
                ${moment(incident[i].end_date).format('DD MMM YY')}
              </td>
              <td>${incident[i].office_name}</td>
              <td>${incident[i].address}</td>
              <td>${incident[i].work_unit.name}</td>
              <td>${incident[i].city.region.name} - ${incident[i].city.name}</td>
              <td>${incident[i].notes}</td>
            </tr>
        `
        }
        incidents += `</table>`

        let attachments = `
          <table border="1" class="letter">
            <tr>
              <td>Uraian</td>
              <td>Nama File</td>
              <td>Tipe File</td>
              <td>Ukuran</td>
            </tr>
          `;
        for (let i = 0; i < c.getDataValue('complaint_incidents').length; i++) {
          let attach = c.getDataValue('complaint_incidents')
          attachments += `
            <tr>
              <td>${attach[i].description}</td>
              <td>${attach[i].filename}</td>
              <td>${attach[i].mime_type}</td>
              <td>${attach[i].file_size}</td>
            </tr>
        `
        }
        attachments += `</table>`

        var violations = `<ul>`;
        let vv = c.toJSON()['complaint_violations'] || []
        for (let i = 0; i < vv.length; i++) {
          violations += `<li>${vv[i].violation.name}</li>`
        }
        violations += `</ul>`

        let rekom_tindaklanjut = ``;
        if (s instanceof models.complaint_studies) {
          rekom_tindaklanjut = s.getDataValue('disposition')['name']
        }

        html += `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div>
              <span class="title">
                <br />INSPEKTORAT <br />
                OMBUDSMAN REPUBLIK INDONESIA <br />
                LAPORAN HASIL PENELAAHAN ADUAN
              </span>
            </div>
          </center>
          <table border="1" class="letter"> 
            <tr style="padding: 5px;">
              <td style="font-weight: bold;">No Register</td>
              <td>${c.getDataValue('form_no')}</td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>${moment(c.getDataValue('date')).format('DD MMM YY | HH:mm:ss')}</td>
            </tr>
            <tr>
              <td>Pengadu</td>
              <td>${pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null}</td>
            </tr>
            <tr>
              <td>Legal Standing Pengadu</td>
              <td>${c.getDataValue('legal_standing')['name']}</td>
            </tr>
            <tr>
              <td>Teradu</td>
              <td>${reported}</td>
            </tr>
            <tr>
              <td>Sumber Aduan</td>
              <td>${c.getDataValue('source_name')}</td>
            </tr>
            <tr>
              <td>Kronologis</td>
              <td>${events}</td>
            </tr>
            <tr>
              <td>Waktu Terjadinya Aduan</td>
              <td>${incidents}</td>
            </tr>
            <tr>
              <td>Harapan Pengadu</td>
              <td>${c.getDataValue('hopes')}</td>
            </tr>
            <tr>
              <td>Bukti Pendukung</td>
              <td>${attachments}</td>
            </tr>
            <tr>
              <td>Jenis Dugaan Pelanggaran</td>
              <td>${violations}</td>
            </tr>
            <tr>
              <td>Rekomendasi Tindak Lanjut</td>
              <td>${rekom_tindaklanjut}</td>
            </tr>
            <tr>
              <td colspan="2">
                Jakarta,
                <center>
                  <table style="width: 100%;">
                    <tr>
                      <td>${moment().format('DD MMM YYYY')}</td>
                      <td>${moment().format('MMM YYYY')}</td>
                      <td>${moment().format('MMM YYYY')}</td>
                    </tr>
                    <tr>
                      <td>Disusun oleh,</td>
                      <td>Direview oleh,</td>
                      <td>Disetujui oleh,</td>
                    </tr>
                    <tr>
                      <td height="138">(.........................)</td>
                      <td height="138">(.........................)</td>
                      <td height="138">(.........................)</td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>
        </div>`;
      }

      return {
        html: html,
        c: c
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   *  Lampiran 2 : FORMAT DISPOSISI HASIL TELAAH WBS – OLEH ANGGOTA PENGAMPU WBS
   * @param {*} id 
   * @returns 
   */
  async letter_02(id, flag = null) {
    try {
      let html = ``;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
          ],
          where: { idx_m_complaint: id },
          include: [],
        }
      );

      let s = await models.complaint_studies.findOne(
        {
          attributes: [
            'idx_t_complaint_study',
            'notes',
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
              attributes: ['idx_t_complaint_study_violation'],
              model: models.complaint_study_violations,
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
              attributes: [
                'idx_t_complaint_study_reported',
                'name', 'identity_no', 'occupation'
              ],
              model: models.complaint_study_reported,
              where: { record_status: 'A' }
            },
          ],
          where: { record_status: 'A', idx_m_complaint: c instanceof models.complaints ? c.getDataValue('idx_m_complaint') : null }
        }
      );

      let d = await models.complaint_decisions.findOne({
        attributes: [
          'idx_t_complaint_decision',
          'notes',
          [Sequelize.literal(`coalesce(umodified, ucreate)`), 'created_by'],
          [Sequelize.literal(`coalesce(dmodified, dcreate)`), 'created_date'],
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
            attributes: [
              'idx_t_complaint_decision_violation',
              'idx_t_complaint_decision'
            ],
            model: models.complaint_decision_violations,
            include: [
              {
                required: true,
                attributes: ['idx_m_violation', 'name'],
                model: models.violations
              }
            ],
          }
        ],
        where: { record_status: 'A', idx_m_complaint: c instanceof models.complaints ? c.getDataValue('idx_m_complaint') : null }
      })

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = `
          <table border="1" class="letter">
            <tr>
              <td>Nama Teradu</td>
              <td>Identitas</td>
              <td>Jabatan</td>
            </tr>
        `;
        for (let i = 0; i < s.getDataValue('complaint_study_reporteds').length; i++) {
          let report = s.getDataValue('complaint_study_reporteds')
          reported += `
            <tr>
              <td>${report[i].name}</td>
              <td>${report[i].identity_no}</td>
              <td>${report[i].occupation}</td>
            </tr>
          `
        }
        reported += `</table>`

        let violations = `<ul>`;
        for (let i = 0; i < d.getDataValue('complaint_decision_violations').length; i++) {
          let violation = d.getDataValue('complaint_decision_violations')
          violations += `<li>${violation[i].violation.name}</li>`
        }
        violations += `</ul>`

        let rekom_tindaklanjut = ``;
        if (d instanceof models.complaint_decisions) {
          rekom_tindaklanjut = s.getDataValue('disposition')['name']
        }

        let created_by;
        if (d instanceof models.complaint_decisions) {
          created_by = await models.users.findOne({
            attributes: [
              [Sequelize.literal(`concat('(<b>',fullname,'</b>) <br />', email)`), 'fullname']
            ],
            where: {
              idx_m_user: parseInt(d.getDataValue('created_by'))
            }
          })
        }

        html += `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">DISPOSISI HASIL TELAAH WBS</span></div>
          </center>
          <table border="1" class="letter"> 
            <tr style="padding: 5px;">
              <td style="font-weight: bold;">No Register</td>
              <td>${c.getDataValue('form_no')}</td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>${moment(c.getDataValue('date')).format('DD MMM YY | HH:mm:ss')}</td>
            </tr>
            <tr>
              <td>Pengadu</td>
              <td>${pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null}</td>
            </tr>
            <tr>
              <td>Teradu</td>
              <td>${reported}</td>
            </tr>
            <tr>
              <td>Ringkasan Aduan</td>
              <td>${c.getDataValue('description')}</td>
            </tr>
            <tr>
              <td>Jenis Dugaan Pelanggaran</td>
              <td>${violations}</td>
            </tr>
            <tr>
              <td>Disposisi</td>
              <td>${rekom_tindaklanjut}</td>
            </tr>
            <tr>
              <td colspan="2">
                Catatan: <br />
                ${d.getDataValue('notes')}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <center>
                  <div style="font-weight: bold;">Jakarta, ${moment(d.getDataValue('created_date')).format('DD MMMM YYYY')}</div>
                  <div>Wakil Ketua,</div>
                  <br /><br /><br />
                  <div><u>${created_by.getDataValue('fullname')}</u></div>
                </center>
              </td>
            </tr>
          </table>
        </div>`;
      }

      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   * Lampiran 3 : FORMAT 14a LHPA - LAPORAN HASIL PEMERIKSAAN ADUAN
   * @param {*} id 
   */
  async letter_03F14A(id, flag = null) {
    try {
      let html = `<div>
        <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
          <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
          <div><span class="title">LAPORAN HASIL PEMERIKSAAN ADUAN</span></div>
          <div><span class="title">KEGIATAN: PENYELESAIAN LAPORAN</span></div>
        </center>
      `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            },
            {
              required: false,
              attributes: [
                [Sequelize.literal(`coalesce(complaint_decision.dmodified,complaint_decision.dcreate)`), 'dcreate']
              ],
              model: models.complaint_decisions
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname', 'phone_no'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        let clarification = await models.clarification.findOne({
          attributes: [
            'idx_t_clarification',
            'date', 'teams', 'result'
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
        let cladet = clarification instanceof models.clarification ? clarification.getDataValue('clarification_details') : [];
        cladet = cladet.map(e => e.name);
        html += `
          <table border="1" class="letter" width="100%">
            <tr>
              <td width="20%">Nomor Registrasi WBS</td>
              <td width="2%">:</td>
              <td>${c.getDataValue('form_no')}</td>
            </tr>
            <tr>
              <td width="20%">Tanggal Aduan</td>
              <td width="2%">:</td>
              <td>${moment(c.getDataValue('form_date')).format('DD MMM YYYY | HH:mm:ss')}</td>
            </tr>
            <tr>
              <td width="20%">Pengadu</td>
              <td width="2%">:</td>
              <td>${pengadu.getDataValue('fullname')}</td>
            </tr>
            <tr>
              <td width="20%">Kontak Pengadu</td>
              <td width="2%">:</td>
              <td>${pengadu.getDataValue('phone_no')}</td>
            </tr>
            <tr>
              <td width="20%">Teradu</td>
              <td width="2%">:</td>
              <td>${reported}</td>
            </tr>
            <tr>
              <td width="20%">Terperiksa</td>
              <td width="2%">:</td>
              <td>${cladet.join(', ')}</td>
            </tr>
          </table>
        `
        html += `
        <p>
          <div class="title">A. DASAR PEMERIKSAAN</div>
          <ol>
            <li>Undang-Undang No. 37 Tahun 2008 tentang Ombudsman Republik Indonesia</li>
            <li>Undang-Undang No. 25 Tahun 2009 tentang Pelayanan Publik</li>
            <li>Peraturan Ombudsman RI No. 26 tahun 2017 tentang Tata Cara Penerimaan, Pemeriksaan, dan Penyelesaian Laporan</li>
            <li>Peraturan Ombudsman RI No. 27 tahun 2017 tentang Sistem Pelaporan dan Penanganan Pelanggaran Internal</li>
            <li>Putusan penanggung jawab WBS tanggal ${c.getDataValue('complaint_decisions') ? moment(c.getDataValue('complaint_decisions')['dcreate']).format('DD MMM YYYY | HH:mm:ss') : ''}</li>
            <li>Surat Tugas Kepala Keasistenan Utama Manajemen Mutu Nomor .... Tanggal .... tentang Penunjukan Tim Pemeriksa Aduan Nomor ....</li>
          </ol>
        </p>
        `
        let lhpa = await models.lhpa.findOne({
          attributes: [
            'idx_t_lhpa',
            'type', 'substansi', 'procedure',
            'product', 'complaint_mapping', 'action_report',
            'checked_by_kumm', 'complaint_analysis', 'opinion',
            'conclusion', 'action'
          ],
          include: [
            {
              attributes: ['event', 'date', 'notes'],
              model: models.lhpa_events
            }
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        })

        html += `
          <p>
            <div class="title">B. RUANG LINGKUP PEMERIKSAAN ADUAN</div>
            <div>Pemeriksaan Laporan Masyarakat</div>
            <div>Nomor:</div>
            <div>
              <ol>
                <li>
                  <div>SUBSTANSI</div>
                  <div>${lhpa.getDataValue('substansi')}</div>
                </li>
                <li>
                  <div>PROSEDUR</div>
                  <div>${lhpa.getDataValue('procedure')}</div>
                </li>
                <li>
                  <div>PRODUK</div>
                  <div>${lhpa.getDataValue('product')}</div>
                </li>
              </ol>
            </div>
          </p>
        `
        let levent = lhpa.getDataValue('lhpa_events')
        let hlevent = `
          <table border="1" class="letter" width="100%">
            <tr>
              <td width="2%">No</td>
              <td width="20%">Tanggal</td>
              <td>Peristiwa</td>
              <td>Catatan/Bukti</td>
            </tr>
        `
        for (let i in levent) {
          hlevent += `
            <tr>
              <td width="2%">${(i + 1)}</td>
              <td width="20%">${moment(levent[i].date).format('DD MMM YYYY')}</td>
              <td>${levent[i].event}</td>
              <td>${levent[i].notes}</td>
            </tr>
          `
        }

        hlevent += `</table>`
        html += `
          <p>
            <div class="title">C. KRONOLOGI ADUAN</div>
            <div>${hlevent}</div>
          </p>
        `
        html += `
          <p>
            <div class="title">D. PEMETAAN ADUAN</div>
            <div>
              <table border="1" class="letter" width="100%">
                <thead>
                  <tr>
                    <td width="20%">Unsur Pemeriksaan</td>
                    <td>Keterangan</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Legal Standing Pengadu</td>
                    <td>${c.getDataValue('legal_standing') ? c.getDataValue('legal_standing')['name'] : ''}</td>
                  </tr>
                  <tr>
                    <td>Layanan yang diadukan</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Pokok Aduan</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Harapan Pengadu</td>
                    <td>${c.getDataValue('hopes')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </p>
        `
        html += `
          <p>
            <div class="title">E. TINDAK LANJUT LAPORAN MASYARAKAT</div>
            <div>
              <ol>
                <li>
                  <div>Penerimaan dan Verifikasi Laporan</div>
                  <div>Dilakukan oleh: Keasistenan Utama Pengaduan Masyarakat/Unit PVL Ombudsman Perwakilan...</div>
                  <div>
                    <table border="1" class="letter" width="100%">
                      <tr>
                        <td width="2%">No</td>
                        <td>Tahap</td>
                        <td>Tanggal</td>
                        <td>Hasil/Keterangan</td>
                        <td>Checklist Dokumen</td>
                      </tr>
                      <tr>
                        <td width="2%">1a</td>
                        <td>Penerimaan Laporan</td>
                        <td></td>
                        <td>
                          Melalui:
                          Surat/Datang
                          Langsung/Email/...
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%">1b</td>
                        <td>Pencatatan Laporan</td>
                        <td></td>
                        <td>
                          Nomor Agenda:
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%">2a</td>
                        <td>Verifikasi formil</td>
                        <td></td>
                        <td>
                          Status:
                          *Lengkap/Belum Lengkap
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%" rowspan="4">2b</td>
                        <td colspan="4">Tindak Lanjut Verifikasi Formil</td>
                      </tr>
                      <tr>
                        <td>Surat Permintaan Kelengkapan Data</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Surat Pemberitahuan kepada Pelapor (penolakan Laporan di Formil)</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Berita Acara Penutupan Laporan Tidak Memenuhi Syarat Formil</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%">2c</td>
                        <td>Verifikasi Formil</td>
                        <td></td>
                        <td>Status: Lengkap</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%">3</td>
                        <td>Verifikasi Materil</td>
                        <td></td>
                        <td>
                          Berdasarkan verifikasi materiil yang dilakukan, disimpulkan bahwa Laporan merupakan :
                          <ol>
                            <li>Kewenangan Ombudsman</li>
                            <li>Bukan Kewenangan Ombudsman</li>
                          </ol>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%">4</td>
                        <td>*Rapat Pleno/Rapat Perwakilan</td>
                        <td></td>
                        <td>
                          Terhadap Laporan disetujui untuk :
                          <ol>
                            <li>Dilanjutkan ke tahap pemeriksaan oleh...</li>
                            <li>Tidak dilanjutkan ke tahap pemeriksaan</li>
                          </ol>
                        </td>
                        <td></td>
                      </tr>
                    </table>
                  </div>
                  <li>
                    <div>Pemeriksaan Laporan</div>
                    <div>
                      Dilakukan oleh: *Keasistenan Utama ..../ Unit Pemeriksaan Ombudsman Perwakilan ....
                    </div>
                    <div>
                      <table border="1" class="letter" width="100%">
                        <tr>
                          <td width="2%">No</td>
                          <td>Tahap</td>
                          <td>Tanggal</td>
                          <td>Hasil/Keterangan</td>
                          <td>Checklist Dokumen</td>
                        </tr>
                        <tr>
                          <td width="2%">1</td>
                          <td>Registrasi SIMPeL</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">2</td>
                          <td>LHPD</td>
                          <td></td>
                          <td>Dugaan Maladministrasi:</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">3</td>
                          <td>Pemeriksaan Klarifikasi</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%"></td>
                          <td>a. Klarifikasi Langsung</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%"></td>
                          <td>b. Klarifikasi Tertulis</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%"></td>
                          <td>c.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">4</td>
                          <td>Riksa Lapangan (LHPL)</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">5</td>
                          <td>Pemanggilan</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%"></td>
                          <td>BA Pemanggilan</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">6</td>
                          <td>Konsiliasi/Mediasi</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%"></td>
                          <td>BA Konsiliasi</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">7</td>
                          <td>Penyampaian Perkembangan Laporan</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">8</td>
                          <td>Gelar Laporan</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">9</td>
                          <td>Laporan Akhir Hasil Pemeriksaan (LAHP)</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">10</td>
                          <td>Monitoring LAHP</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </table>
                    </div>
                  </li>
                  <li>
                    <div>Resolusi dan Monitoring</div>
                    <div>
                      <table border="1" class="letter" width="100%">
                        <tr>
                          <td width="2%">No</td>
                          <td>Tahap</td>
                          <td>Tanggal</td>
                          <td>Hasil</td>
                        </tr>
                        <tr>
                          <td width="2%">1</td>
                          <td>Pra resolusi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">2</td>
                          <td>Pra mediasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">3</td>
                          <td>Mediasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">4</td>
                          <td>BA Hasil Mediasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">5</td>
                          <td>Pra Konsiliasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">6</td>
                          <td>Konsiliasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">7</td>
                          <td>BA Konsiliasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">8</td>
                          <td>Adjukasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">9</td>
                          <td>Rekomendasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%"></td>
                          <td>a. <i>Clearence</i> oleh KUMM</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%"></td>
                          <td>b. <i>Clearence</i> oleh Anggota</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%"></td>
                          <td>c. Penandatanganan</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">10</td>
                          <td>Monitoring</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </table>
                    </div>
                  </li>
                  <li>
                    <div>Penutupan/Penyelesaian Laporan</div>
                    <div>
                      <table border="1" class="letter" width="100%">
                        <tr>
                          <td width="2%">No</td>
                          <td>Tahap</td>
                          <td>Tanggal</td>
                          <td>Hasil</td>
                        </tr>
                        <tr>
                          <td width="2%">1</td>
                          <td>Pemberitahuan ke Pelapor</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">2</td>
                          <td>BA Penutupan Laporan</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </table>
                    </div>
                  </li>
                </li>
              </ol>
            </div>
          </p>
        `
        // get users
        let users = await models.complaint_determination_users.findAll(
          {
            raw: true,
            attributes: [],
            include: [
              {
                attributes: ['fullname', 'email'],
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
        let huser = users.map(e => e['user.fullname'])

        // request
        let req = await models.request.findAll({
          attributes: [
            'idx_t_request',
            'date', 'media', 'notes'
          ],
          include: [
            {
              required: false,
              attributes: [
                'idx_t_request_attachment',
                'description',
                'filename',
                'path',
                'mime_type',
                'filesize'
              ],
              model: models.request_attachment
            }
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        });

        let treq = `<table border="1" class="letter" width="100%">
          <tr>
            <td>Tanggal</td>
            <td>Oleh</td>
            <td>Media</td>
            <td>Uraian</td>
            <td>Lampiran</td>
          </tr>`

        for (let i in req) {
          let attc = req[i].request_attachments.map(e => e.filename)
          treq += `<tr><td>${moment(req[i].date).format('DD MMM YYYY')}</td><td>${req[i].by}</td><td>${req[i].media}</td><td>${req[i].notes}</td><td>${attc.join(', ')}</td></tr>`
        }
        treq += `</table>`

        let confirmation = await models.confirmation.findOne({
          attributes: [
            'idx_t_confirmation',
            'value',
            'head_of_kumm',
            'response'
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        })

        html += `
          <p>
            <div class="title">F. PEMERIKSAAN ADUAN OLEH TIM PEMERIKSA KUMM</div>
            <ol>
              <li>
                <div>Proses Pemeriksaan Aduan</div>
                <div>
                  <table border="1" class="letter" width="100%">
                    <tr>
                      <td width="2%">No</td>
                      <td>Tahap Pemeriksaan Aduan</td>
                      <td>Tanggal</td>
                      <td>Hasil</td>
                      <td>Checklist Dokumen</td>
                    </tr>
                    <tr>
                      <td width="2%">1</td>
                      <td>Penetapan Tim Pemeriksa</td>
                      <td></td>
                      <td>
                        <div>Surat Tugas Kepala Keasistenan Utama Manajemen Mutu Nomor... , menugaskan Tim Pemeriksa a.n 
                          <ol><li>${huser.join('</li><li>')}</li></ol>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td width="2%" rowspan="5">2</td>
                      <td colspan="4">Validasi Pengaduan</td>
                    </tr>
                    <tr>
                      <td>a. Memastikan dokumen pengaduan yang diteruskan oleh Inspektorat</td>
                      <td></td>
                      <td>Dokumen yang diperoleh dari Inspektorat berdasarkan Pengaduan Pelapor:
                        <ul>
                          <li>Informasi administrasi pengaduan</li>
                          <li>Putusan Penanggungjawab WBS</li>
                          <li>Laporan Hasil Penelaahan Pengaduan oleh Inspektorat</li>
                          <li>Bukti pengaduan yang disampaikan oleh Pengadu dan</li>
                          <li>Dokumen pendukung pengaduan</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>b. Komunikasi dengan Pengadu</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>c. Komunikasi dengan Teradu</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>d. Penelusuran data pada Sistem Informasi</td>
                      <td></td>
                      <td>
                        <div>Dugaan Maladministrasi: <br /><br /><br /></div>
                        <div>Status Laporan: <br /><br /><br /></div>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td width="2%">3</td>
                      <td>Permintaan Data, Informasi, dan Dokumen</td>
                      <td colspan="3">${treq}</td>
                    </tr>
                    <tr>
                      <td width="2%">4</td>
                      <td>Telaah dan Analisis</td>
                      <td colspan="3"></td>
                    </tr>
                    <tr>
                      <td width="2%">5</td>
                      <td>Klarifikasi Terperiksa</td>
                      <td>${moment(clarification.getDataValue('date')).format('DD MMM YYYY')}</td>
                      <td>
                        <div>${clarification.getDataValue('result')}</div>
                        <div>${cladet}</div>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td width="2%">6</td>
                      <td>Konfirmasi Pengadu</td>
                      <td></td>
                      <td>
                        <div><b>Tanggapan Pengadu:</b> ${confirmation.getDataValue('response')}</div>
                        <div><b>Isi Konfirmasi:</b> ${confirmation.getDataValue('value')}</div>
                        <div><b>Kepala KUMM:</b> ${confirmation.getDataValue('head_of_kumm')}</div>
                      </td>
                      <td></td>
                    </tr>
                  </table>
                </div>
              </li>
              <li>
                <div>Fakta yang terungkap</div>
                <br /><br /><br />
              </li>
            </ol>
          </p>
        `

        html += `
          <p>
            <div class="title">G. Analisis Pemeriksaan Aduan</div>
            <div>${lhpa.getDataValue('complaint_analysis')}</div>
          </p>
          <p>
            <div class="title">H. Pendapat Pemeriksa</div>
            <div>${lhpa.getDataValue('opinion')}</div>
          </p>
          <p>
            <div class="title">I. Kesimpulan Pemeriksa</div>
            <div>${lhpa.getDataValue('conclusion')}</div>
          </p>
          <p>
            <div class="title">J. Tindak Lanjut</div>
            <div>${lhpa.getDataValue('action')}</div>
          </p>
        `

        html += `<p>Demikian Laporan Hasil Pemeriksaan Aduan Internal ini dibuat sebagai proses tindak lanjut Aduan masyarakat</p>`;

        // validation
        let arranged_by, approved_by, checked_by;
        let v = await models.validation.findOne(
          {
            attributes: [
              'idx_t_validation',
              'prevention',
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
            where: { record_status: 'A', idx_m_complaint: id }
          }
        )
        arranged_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('arranged_by') } })
        approved_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('approved_by') } })
        checked_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('checked_by') } })

        v['arranged_by'] = arranged_by instanceof models.users ? arranged_by.getDataValue('email') : null
        v['approved_by'] = approved_by instanceof models.users ? approved_by.getDataValue('email') : null
        v['checked_by'] = checked_by instanceof models.users ? checked_by.getDataValue('email') : null

        html += `
          <table border="1" class="letter" width="100%">
            <tr>
              <td>Tanggal: <i>${moment(v.getDataValue('arranged_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
              <td>Tanggal: <i>${moment(v.getDataValue('checked_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
              <td>Tanggal: <i>${moment(v.getDataValue('approve_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
            </tr>
            <tr>
              <td>Disusun oleh:</td>
              <td>Diperiksa: Kepala Keasistenan Regional</td>
              <td>Disetujui: Kepala Keasistenan Utama Manajement Mutu</td>
            </tr>
            <tr>
              <td><br /><br /><br /><br /></td>
              <td><br /><br /><br /><br /></td>
              <td><br /><br /><br /><br /></td>
            </tr>
            <tr style="text-align: center; font-weight: bold;">
              <td>${v.getDataValue('arranged_by')}</td>
              <td>${v.getDataValue('checked_by')}</td>
              <td>${v.getDataValue('approved_by')}</td>
            </tr>
          </table>`;
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   * Lampiran 4 : FORMAT 14b LHPA - LAPORAN HASIL PEMERIKSAAN ADUAN
   * @param {*} id 
   */
  async letter_04F14B(id, flag = null) {
    try {
      let html = `<div>
        <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
          <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
          <div><span class="title">LAPORAN HASIL PEMERIKSAAN ADUAN</span></div>
          <div><span class="title">KEGIATAN: PENCEGAHAN</span></div>
        </center>
      `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            },
            {
              required: false,
              attributes: [
                [Sequelize.literal(`coalesce(complaint_decision.dmodified,complaint_decision.dcreate)`), 'dcreate']
              ],
              model: models.complaint_decisions
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname', 'phone_no'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        let clarification = await models.clarification.findOne({
          attributes: [
            'idx_t_clarification',
            'date', 'teams', 'result'
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
        let cladet = clarification instanceof models.clarification ? clarification.getDataValue('clarification_details') : [];
        cladet = cladet.map(e => e.name);
        html += `
          <table border="1" class="letter" width="100%">
            <tr>
              <td width="20%">Nomor Registrasi WBS</td>
              <td width="2%">:</td>
              <td>${c.getDataValue('form_no')}</td>
            </tr>
            <tr>
              <td width="20%">Tanggal Aduan</td>
              <td width="2%">:</td>
              <td>${moment(c.getDataValue('form_date')).format('DD MMM YYYY | HH:mm:ss')}</td>
            </tr>
            <tr>
              <td width="20%">Pengadu</td>
              <td width="2%">:</td>
              <td>${pengadu.getDataValue('fullname')}</td>
            </tr>
            <tr>
              <td width="20%">Kontak Pengadu</td>
              <td width="2%">:</td>
              <td>${pengadu.getDataValue('phone_no')}</td>
            </tr>
            <tr>
              <td width="20%">Teradu</td>
              <td width="2%">:</td>
              <td>${reported}</td>
            </tr>
            <tr>
              <td width="20%">Terperiksa</td>
              <td width="2%">:</td>
              <td>${cladet.join(', ')}</td>
            </tr>
          </table>
        `
        html += `
        <p>
          <div class="title">A. DASAR PEMERIKSAAN</div>
          <ol>
            <li>Undang-Undang No. 37 Tahun 2008 tentang Ombudsman Republik Indonesia</li>
            <li>Undang-Undang No. 25 Tahun 2009 tentang Pelayanan Publik</li>
            <li>Peraturan Ombudsman RI No. 26 tahun 2017 tentang Tata Cara Penerimaan, Pemeriksaan, dan Penyelesaian Laporan</li>
            <li>Peraturan Ombudsman RI No. 27 tahun 2017 tentang Sistem Pelaporan dan Penanganan Pelanggaran Internal</li>
            <li>Putusan penanggung jawab WBS tanggal ${c.getDataValue('complaint_decisions') ? moment(c.getDataValue('complaint_decisions')['dcreate']).format('DD MMM YYYY | HH:mm:ss') : ''}</li>
            <li>Surat Tugas Kepala Keasistenan Utama Manajemen Mutu Nomor .... Tanggal .... tentang Penunjukan Tim Pemeriksa Aduan Nomor ....</li>
          </ol>
        </p>
        `
        let lhpa = await models.lhpa.findOne({
          attributes: [
            'idx_t_lhpa',
            'type', 'substansi', 'procedure',
            'product', 'complaint_mapping', 'action_report',
            'checked_by_kumm', 'complaint_analysis', 'opinion',
            'conclusion', 'action'
          ],
          include: [
            {
              attributes: ['event', 'date', 'notes'],
              model: models.lhpa_events
            }
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        })

        html += `
          <p>
            <div class="title">B. RUANG LINGKUP PEMERIKSAAN ADUAN</div>
            <div>Pemeriksaan Laporan Masyarakat</div>
            <div>Nomor:</div>
            <div>
              <ol>
                <li>
                  <div>SUBSTANSI</div>
                  <div>${lhpa.getDataValue('substansi')}</div>
                </li>
                <li>
                  <div>PROSEDUR</div>
                  <div>${lhpa.getDataValue('procedure')}</div>
                </li>
                <li>
                  <div>PRODUK</div>
                  <div>${lhpa.getDataValue('product')}</div>
                </li>
              </ol>
            </div>
          </p>
        `
        let levent = lhpa.getDataValue('lhpa_events')
        let hlevent = `
          <table border="1" class="letter" width="100%">
            <tr>
              <td width="2%">No</td>
              <td width="20%">Tanggal</td>
              <td>Peristiwa</td>
              <td>Catatan/Bukti</td>
            </tr>
        `
        for (let i in levent) {
          hlevent += `
            <tr>
              <td width="2%">${(i + 1)}</td>
              <td width="20%">${moment(levent[i].date).format('DD MMM YYYY')}</td>
              <td>${levent[i].event}</td>
              <td>${levent[i].notes}</td>
            </tr>
          `
        }

        hlevent += `</table>`
        html += `
          <p>
            <div class="title">C. KRONOLOGI ADUAN</div>
            <div>${hlevent}</div>
          </p>
        `
        html += `
          <p>
            <div class="title">D. PEMETAAN ADUAN</div>
            <div>
              <table border="1" class="letter" width="100%">
                <thead>
                  <tr>
                    <td width="20%">Unsur Pemeriksaan</td>
                    <td>Keterangan</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Legal Standing Pengadu</td>
                    <td>${c.getDataValue('legal_standing') ? c.getDataValue('legal_standing')['name'] : ''}</td>
                  </tr>
                  <tr>
                    <td>Layanan yang diadukan</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Pokok Aduan</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Harapan Pengadu</td>
                    <td>${c.getDataValue('hopes')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </p>
        `
        html += `
          <p>
            <div class="title">E. TINDAK LANJUT KAJIAN</div>
            <div>
              <ol>
                <li>
                  <div>Deteksi</div>
                  <div>Dilakukan oleh: Keasistenan Utama Pengaduan Masyarakat/Unit PVL Ombudsman Perwakilan...</div>
                  <div>
                    <table border="1" class="letter" width="100%">
                      <tr>
                        <td width="2%">No</td>
                        <td>Tahap</td>
                        <td>Tanggal</td>
                        <td>Hasil/Keterangan</td>
                        <td>Checklist Dokumen</td>
                      </tr>
                      <tr>
                        <td width="2%">1</td>
                        <td>Pemetaan Data Laporan</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%">2</td>
                        <td>Identifikasi</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%">3</td>
                        <td>Pemuktahiran</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="2%">4</td>
                        <td>Penyusunan Laporan Hasil Deteksi</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </table>
                  </div>
                  <li>
                    <div>Analisis</div>
                    <div>
                      Dilakukan oleh: *Keasistenan Utama ..../ Unit Pemeriksaan Ombudsman Perwakilan ....
                    </div>
                    <div>
                      <table border="1" class="letter" width="100%">
                        <tr>
                          <td width="2%">No</td>
                          <td>Tahap</td>
                          <td>Tanggal</td>
                          <td>Hasil/Keterangan</td>
                          <td>Checklist Dokumen</td>
                        </tr>
                        <tr>
                          <td width="2%">1</td>
                          <td>Penyusunan Rencana Tindak Lanjut</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">2</td>
                          <td>Pengumpulan Data</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">3</td>
                          <td>Penelaahan</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">4</td>
                          <td>Perumusan Saran</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">5</td>
                          <td>Penyusunan Laporan Hasil Analisis</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">6</td>
                          <td>Pengendalian Kualitas Perumusan Saran Kantor-Kantor Perwakilan*</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">7</td>
                          <td>Penyampaian Laporan Hasil Analisis</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </table>
                    </div>
                  </li>
                  <li>
                    <div>Survei</div>
                    <div>
                      <table border="1" class="letter" width="100%">
                        <tr>
                          <td width="2%">No</td>
                          <td>Tahap</td>
                          <td>Tanggal</td>
                          <td>Hasil</td>
                        </tr>
                        <tr>
                          <td width="2%">1</td>
                          <td>Penyusunan Rencana Tindak Lanjut</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">2</td>
                          <td>Pengumpulan Data Survei</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">3</td>
                          <td>Penelaahan Hasil Survei</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">4</td>
                          <td>Perumusan Saran Survey</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">5</td>
                          <td>Penyampaian Laporan Hasil Survei</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </table>
                    </div>
                  </li>
                  <li>
                    <div>Perlakuan Pelaksanaan Saran</div>
                    <div>
                      <table border="1" class="letter" width="100%">
                        <tr>
                          <td width="2%">No</td>
                          <td>Tahap</td>
                          <td>Tanggal</td>
                          <td>Hasil</td>
                        </tr>
                        <tr>
                          <td width="2%">1</td>
                          <td>Monitoring</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">2</td>
                          <td>Pendampingan</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">2</td>
                          <td>Publikasi</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td width="2%">2</td>
                          <td>Tahapan Perlakuan Lain</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </table>
                    </div>
                  </li>
                </li>
              </ol>
            </div>
          </p>
        `
        // get users
        let users = await models.complaint_determination_users.findAll(
          {
            raw: true,
            attributes: [],
            include: [
              {
                attributes: ['fullname', 'email'],
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
        let huser = users.map(e => e['user.fullname'])

        // request
        let req = await models.request.findAll({
          attributes: [
            'idx_t_request',
            'date', 'media', 'notes'
          ],
          include: [
            {
              required: false,
              attributes: [
                'idx_t_request_attachment',
                'description',
                'filename',
                'path',
                'mime_type',
                'filesize'
              ],
              model: models.request_attachment
            }
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        });

        let treq = `<table border="1" class="letter" width="100%">
          <tr>
            <td>Tanggal</td>
            <td>Oleh</td>
            <td>Media</td>
            <td>Uraian</td>
            <td>Lampiran</td>
          </tr>`

        for (let i in req) {
          let attc = req[i].request_attachments.map(e => e.filename)
          treq += `<tr><td>${moment(req[i].date).format('DD MMM YYYY')}</td><td>${req[i].by}</td><td>${req[i].media}</td><td>${req[i].notes}</td><td>${attc.join(', ')}</td></tr>`
        }
        treq += `</table>`

        let confirmation = await models.confirmation.findOne({
          attributes: [
            'idx_t_confirmation',
            'value',
            'head_of_kumm',
            'response'
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        })

        html += `
          <p>
            <div class="title">F. PEMERIKSAAN ADUAN OLEH TIM PEMERIKSA KUMM</div>
            <ol>
              <li>
                <div>Proses Pemeriksaan Aduan</div>
                <div>
                  <table border="1" class="letter" width="100%">
                    <tr>
                      <td width="2%">No</td>
                      <td>Tahap Pemeriksaan Aduan</td>
                      <td>Tanggal</td>
                      <td>Hasil</td>
                      <td>Checklist Dokumen</td>
                    </tr>
                    <tr>
                      <td width="2%">1</td>
                      <td>Penetapan Tim Pemeriksa</td>
                      <td></td>
                      <td>
                        <div>Surat Tugas Kepala Keasistenan Utama Manajemen Mutu Nomor... , menugaskan Tim Pemeriksa a.n 
                          <ol><li>${huser.join('</li><li>')}</li></ol>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td width="2%" rowspan="5">2</td>
                      <td colspan="4">Validasi Pengaduan</td>
                    </tr>
                    <tr>
                      <td>a. Memastikan dokumen pengaduan yang diteruskan oleh Inspektorat</td>
                      <td></td>
                      <td>Dokumen yang diperoleh dari Inspektorat berdasarkan Pengaduan Pelapor:
                        <ul>
                          <li>Informasi administrasi pengaduan</li>
                          <li>Putusan Penanggungjawab WBS</li>
                          <li>Laporan Hasil Penelaahan Pengaduan oleh Inspektorat</li>
                          <li>Bukti pengaduan yang disampaikan oleh Pengadu dan</li>
                          <li>Dokumen pendukung pengaduan</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>b. Komunikasi dengan Pengadu</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>c. Komunikasi dengan Teradu</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>d. Penelusuran data pada Sistem Informasi</td>
                      <td></td>
                      <td>
                        <div>Dugaan Maladministrasi: <br /><br /><br /></div>
                        <div>Status Laporan: <br /><br /><br /></div>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td width="2%">3</td>
                      <td>Permintaan Data, Informasi, dan Dokumen</td>
                      <td colspan="3">${treq}</td>
                    </tr>
                    <tr>
                      <td width="2%">4</td>
                      <td>Telaah dan Analisis</td>
                      <td colspan="3"></td>
                    </tr>
                    <tr>
                      <td width="2%">5</td>
                      <td>Klarifikasi Terperiksa</td>
                      <td>${moment(clarification.getDataValue('date')).format('DD MMM YYYY')}</td>
                      <td>
                        <div>${clarification.getDataValue('result')}</div>
                        <div>${cladet}</div>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td width="2%">6</td>
                      <td>Konfirmasi Pengadu</td>
                      <td></td>
                      <td>
                        <div><b>Tanggapan Pengadu:</b> ${confirmation.getDataValue('response')}</div>
                        <div><b>Isi Konfirmasi:</b> ${confirmation.getDataValue('value')}</div>
                        <div><b>Kepala KUMM:</b> ${confirmation.getDataValue('head_of_kumm')}</div>
                      </td>
                      <td></td>
                    </tr>
                  </table>
                </div>
              </li>
              <li>
                <div>Fakta yang terungkap</div>
                <br /><br /><br />
              </li>
            </ol>
          </p>
        `

        html += `
          <p>
            <div class="title">G. Analisis Pemeriksaan Aduan</div>
            <div>${lhpa.getDataValue('complaint_analysis')}</div>
          </p>
          <p>
            <div class="title">H. Pendapat Pemeriksa</div>
            <div>${lhpa.getDataValue('opinion')}</div>
          </p>
          <p>
            <div class="title">I. Kesimpulan Pemeriksa</div>
            <div>${lhpa.getDataValue('conclusion')}</div>
          </p>
          <p>
            <div class="title">J. Tindak Lanjut</div>
            <div>${lhpa.getDataValue('action')}</div>
          </p>
        `

        html += `<p>Demikian Laporan Hasil Pemeriksaan Aduan Internal ini dibuat sebagai proses tindak lanjut Aduan masyarakat</p>`;

        // validation
        let arranged_by, approved_by, checked_by;
        let v = await models.validation.findOne(
          {
            attributes: [
              'idx_t_validation',
              'prevention',
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
            where: { record_status: 'A', idx_m_complaint: id }
          }
        )
        arranged_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('arranged_by') } })
        approved_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('approved_by') } })
        checked_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('checked_by') } })

        v['arranged_by'] = arranged_by instanceof models.users ? arranged_by.getDataValue('email') : null
        v['approved_by'] = approved_by instanceof models.users ? approved_by.getDataValue('email') : null
        v['checked_by'] = checked_by instanceof models.users ? checked_by.getDataValue('email') : null

        html += `
          <table border="1" class="letter" width="100%">
            <tr>
              <td>Tanggal: <i>${moment(v.getDataValue('arranged_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
              <td>Tanggal: <i>${moment(v.getDataValue('checked_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
              <td>Tanggal: <i>${moment(v.getDataValue('approve_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
            </tr>
            <tr>
              <td>Disusun oleh:</td>
              <td>Diperiksa: Kepala Keasistenan Regional</td>
              <td>Disetujui: Kepala Keasistenan Utama Manajement Mutu</td>
            </tr>
            <tr>
              <td><br /><br /><br /><br /></td>
              <td><br /><br /><br /><br /></td>
              <td><br /><br /><br /><br /></td>
            </tr>
            <tr style="text-align: center; font-weight: bold;">
              <td>${v.getDataValue('arranged_by')}</td>
              <td>${v.getDataValue('checked_by')}</td>
              <td>${v.getDataValue('approved_by')}</td>
            </tr>
          </table>`;
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   * Lampiran 5 : FORMAT 1 SURAT TUGAS KEPADA TIM PEMERIKSA KUMM
   * @param {*} id 
   */
  async letter_05F1(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">KEASISTENAN UTAMA MANAJEMEN MUTU</span></div>
            <div style="margin-top: 20px;">SURAT TUGAS</div>
            <div>NOMOR: -</div>
          </center>
        `;

      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['idx_t_complaint_determination'],
              model: models.complaint_determinations
            }
          ],
        }
      );

      let du = await models.complaint_determination_users.findAll({
        raw: true,
        attributes: [],
        include: [
          {
            required: true,
            attributes: ['email', 'fullname'],
            model: models.users
          }
        ],
        where: { idx_t_complaint_determination: c instanceof models.complaints ? c.getDataValue('complaint_determination')['idx_t_complaint_determination'] : null }
      })

      let users = `<ol> `;
      for (let i in du) { users += `<li> ${du[i]['user.email']} /${du[i]['user.fullname']}</li>` }
      users += `</ol> `

      html += `
          <table border = "1" class="letter" width = "100%">
          <tr>
            <td>Menimbang</td>
            <td>
              <div>a. bahwa : ........................</div>
              <div>b. bahwa : ........................</div>
            </td>
          </tr>
          <tr>
            <td>Dasar</td>
            <td>
              <div>1. ................................</div>
              <div>2. ................................</div>
            </td>
          </tr>
        </table >
        <p>
          <center class="title">MEMBERIKAN TUGAS</center>
        </p>
        <table border="1" class="letter" width="100%">
          <tr>
            <td>Kepada</td>
            <td>${users}</td>
          </tr>
          <tr>
            <td>Untuk</td>
            <td>
              <ol>
                <li>Melakukan pemeriksaan terhadap aduan Nomor <b>${c instanceof models.complaints ? c.getDataValue('form_no') : '-'}</b> tanggal ${c instanceof models.complaints ? moment(c.getDataValue('form_date')).format('DD MMM YYYY | HH:mm:ss') : '-'} tentang <i>${c instanceof models.complaints ? c.getDataValue('description') : '-'}</i></li>
                <li>...</li>
                <li>Dst</li>
              </ol>
            </td>
          </tr>
        </table>
        <p>
          <div style="text-align: right;">Nama tempat, <i>${moment().format('DD MMM YYYY')}</i></div>
          <div style="text-align: right; font-weight: bold;">Kepala Keasistenan Utama Manajemen Mutu</div>
          <div style="height: 80px; text-align: right;"></div>
          <div style="text-align: right;">Nama Lengkap</div>
        </p>
        `



      html += `</div > `
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   * Lampiran 6 : FORMAT 2 KERTAS KERJA VALIDASI
   * @param {*} id 
   */
  async letter_06F2(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">KERTAS KERJA VALIDASI</span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
          ],
          where: { idx_m_complaint: id },
          include: [
            {
              required: false,
              attributes: ['idx_m_legal_standing', 'name'],
              model: models.legal_standing,
            },
          ],
        }
      );

      let s = await models.complaint_studies.findOne(
        {
          attributes: [
            'idx_t_complaint_study',
            'notes',
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
              attributes: ['idx_t_complaint_study_violation'],
              model: models.complaint_study_violations,
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
              attributes: [
                'idx_t_complaint_study_reported',
                'name', 'identity_no', 'occupation'
              ],
              model: models.complaint_study_reported,
              where: { record_status: 'A' }
            },
          ],
          where: { record_status: 'A', idx_m_complaint: c instanceof models.complaints ? c.getDataValue('idx_m_complaint') : null }
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = ``;
        for (let i = 0; i < s.getDataValue('complaint_study_reporteds').length; i++) {
          let report = s.getDataValue('complaint_study_reporteds')
          reported += `${report[i].name}`
        }

        // validation
        let arranged_by, approved_by, checked_by;
        let v = await models.validation.findOne(
          {
            attributes: [
              'idx_t_validation',
              'prevention',
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
            where: { record_status: 'A', idx_m_complaint: id }
          }
        )

        let comms = v.getDataValue('validation_comms') || [];
        let terlapor = comms.filter(e => e.by == 'TERLAPOR');
        let teradu = comms.filter(e => e.by == 'TERADU');
        let hterlapor = `
          <table border="1" class="letter" width = "100%">
            <tr>
              <td width="20%">Tanggal</td>
              <td>Media</td>
              <td>Keterangan</td>
            </tr>
        `
        let hteradu = `
          <table border="1" class="letter" width = "100%">
            <tr>
              <td width="20%">Tanggal</td>
              <td>Media</td>
              <td>Keterangan</td>
            </tr>
        `
        for (let i in terlapor) {
          hterlapor += `
          <tr>
              <td>${moment(terlapor[i].date).format('DD MMM YYYY | HH:mm:ss')}</td>
              <td>${terlapor[i].media}</td>
              <td>${terlapor[i].notes}</td>  
            </tr>
          `
        }
        hterlapor += `</table> `

        for (let i in teradu) {
          hteradu += `
          <tr>
              <td>${moment(teradu[i].date).format('DD MMM YYYY | HH:mm:ss')}</td>
              <td>${teradu[i].media}</td>
              <td>${teradu[i].notes}</td>  
            </tr>
          `
        }
        hteradu += `</table> `
        arranged_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('arranged_by') } })
        approved_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('approved_by') } })
        checked_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('checked_by') } })

        v['arranged_by'] = arranged_by instanceof models.users ? arranged_by.getDataValue('email') : null
        v['approved_by'] = approved_by instanceof models.users ? approved_by.getDataValue('email') : null
        v['checked_by'] = checked_by instanceof models.users ? checked_by.getDataValue('email') : null

        let vstep = v.getDataValue('step') ? JSON.parse(v.getDataValue('step')) : [];
        let hstep = `<ul> `;
        for (let i in vstep) { hstep += `<li> ${vstep[i].value}</li> `; }
        hstep += `</ul>`;

        // study_lys
        let sl = await models.study_lys.findOne({
          attributes: [
            'idx_t_study_lys', 'manpower', 'description',
            'scope', 'simpel_app_no', 'prevention', 'procedure',
            'product', 'hopes', 'scope_clarification', 'action',
            'others_clarification', 'action', 'others_action',
            'checked', 'arranged_by', 'head_of_reg', 'head_of_kumm'
          ],
          include: [
            {
              required: false,
              attributes: ['idx_m_legal_standing', 'name'],
              model: models.legal_standing,
            },
            {
              required: false,
              attributes: ['idx_t_study_lys_event', 'event', 'date', 'notes'],
              model: models.study_lys_event,
            }
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        })

        html += `
          <p style = "font-weight: bold;" > A.Informasi Aduan</p>
            <table border="1" class="letter" width="100%">
              <tr style="padding: 5px;">
                <td width="20%" style="font-weight: bold;">Nomor WBS | Tanggal</td>
                <td>${c.getDataValue('form_no')} | ${moment(c.getDataValue('date')).format('DD MMM YY')}</td>
              </tr>
              <tr>
                <td>Pengadu</td>
                <td>${pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null}</td>
              </tr>
              <tr>
                <td>Legal Standing Pengadu</td>
                <td>${c.getDataValue('legal_standing')['name']}</td>
              </tr>
              <tr>
                <td>Teradu</td>
                <td>${reported}</td>
              </tr>
              <tr>
                <td>Pokok Aduan</td>
                <td>${sl instanceof models.study_lys ? sl.getDataValue('description') : ''}</td>
              </tr>
              <tr>
                <td>Ruang Lingkup Aduan</td>
                <td>${sl instanceof models.study_lys ? sl.getDataValue('scope') : ''}</td>
              </tr>
              <tr>
                <td>Tahapan</td>
                <td>${hstep}</td>
              </tr>
              <tr>
                <td>Harapan Pengadu</td>
                <td>${c.getDataValue('hopes')}</td>
              </tr>
            </table>`

        html += `
              <p style="font-weight: bold; margin-top: 40px">B.Validasi</p>
                <table border="1" class="letter" width="100%">
                  <thead>
                    <tr style="padding: 5px;">
                      <td width="20%">Kegiatan</td>
                      <td>Tanggal</td>
                      <td>Hasil</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="padding: 5px;">
                      <td>a. Memastikan dokumen pengaduan yang diteruskan oleh inspektorat</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr style="padding: 5px;">
                      <td>b. Komunikasi dengan Pengadu</td>
                      <td colspan="2">${hteradu}</td>
                    </tr>
                    <tr style="padding: 5px;">
                      <td>c. Komunikasi dengan Teradu</td>
                      <td colspan="2">${hterlapor}</td>
                    </tr>
                    <tr style="padding: 5px;">
                      <td>d. Penelusuran data pada sistem informasi</td>
                      <td colspan="2">
                        <div>Dugaan Maladministrasi: </div>
                        <div style="height: 80px;"></div>
                        <div>Status laporan: </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
        `;

        html += `
          <p style = "font-weight: bold; margin-top: 40px">C.Kesimpulan Validasi</p>
            <div>${v.getDataValue('result_obtained')}</div>
        `

        html += `
          <p style = "font-weight: bold; margin-top: 40px">D.Rencana Tindak Lanjut</p>
          <div>${v.getDataValue('action_plan')}</div>
          <br /><br />
        `

        html += `
          <table border = "1" class="letter" width = "100%">
            <tr>
              <td>Tanggal: <i>${moment(v.getDataValue('arranged_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
              <td>Tanggal: <i>${moment(v.getDataValue('checked_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
              <td>Tanggal: <i>${moment(v.getDataValue('approve_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
            </tr>
            <tr>
              <td>Disusun oleh:</td>
              <td>Diperiksa: Kepala Keasistenan Regional</td>
              <td>Disetujui: Kepala Keasistenan Utama Manajement Mutu</td>
            </tr>
            <tr style="text-align: center; font-weight: bold;">
              <td>${v.getDataValue('arranged_by')}</td>
              <td>${v.getDataValue('checked_by')}</td>
              <td>${v.getDataValue('approved_by')}</td>
            </tr>
          </table>
          `
      }

      html += `</div>`;
      return { html: html.replace(/(null)/gm, '') }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * Lampiran 7 : FORMAT 3A SURAT PEMBERITAHUAN HASIL VALIDASI KEPADA TERADU
   * @param {*} id /(null)/gm
   * @returns 
   */
  async letter_07F3A(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
          <table border = "0" class="letter" width = "100%">
            <tr>
              <td width="20%">Nomor</td>
              <td width="2%">:</td>
              <td>
                <div style="text-align: right;">
                  Tanggal ${moment().format('DD MMM YYYY')}
                </div>
              </td>
            </tr>
            <tr>
              <td width="20%">Sifat</td>
              <td width="2%">:</td>
              <td>TERBATAS</td>
            </tr>
            <tr>
              <td width="20%">Lampiran</td>
              <td width="2%">:</td>
              <td>-</td>
            </tr>
            <tr>
              <td width="20%">Hal</td>
              <td width="2%">:</td>
              <td>Pemberitahuan Hasil Validasi Pengaduan</td>
            </tr>
            <tr>  
              <td colspan="3">
                <div>Yth.</div>
                <div>${reported}</div>
                <br />
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Bersama ini diberitahukan bahwa Keasistenan Utama Manajemen Mutu telah menerima Pengaduan dari <i>${pengadu.getDataValue('fullname')}</i> mengenai <i>${c.getDataValue('description')}</i> terkait penanganan laporan masyarakat Nomor Register .... tentang ...</p>
                <br />
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Berkenaan dengan hasil validasi Pengaduan yang telah dilakukan oleh Keasistenan Utama Manajemen Mutu, disimpulkan bahwa Laporan Masyarakat Nomor ... saat ini masih dalam proses tindak lanjut pemeriksaan oleh ...</p>
                <p>
                  Sehubungan dengan hal tersebut, kepada Saudara dan Keasistenan yang menangani laporan dimaksud, diminta untuk segera meyampaikan perkembangan tindak lanjut dan rencana tindak lanjut pemeriksaan atas pengaduan dimaksud kepada Pengadu dan menembuskannya kepada Kepala Keasistenan Utama Manajemen Mutu paling lambat 14 (empat belas) hari setelah diterimanya surat ini.
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="3">Demikian, untuk dilaksanakan.<br /></td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">
                <div><b>Wakil Ketua/Anggota Ombudsman/<br />Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="font-size: 10px;">
                <div>Tembusan Yth,:</div>
                <ol>
                  <li>............., Anggota Ombudsman Pengampu..........</li>
                  <li>${pengadu.getDataValue('fullname')}</li>
                </ol>
              </td>
            </tr>
          </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   *  Lampiran 8 : FORMAT 3B SURAT PEMBERITAHUAN HASIL VALIDASI KEPADA PENGADU
   * @param {*} id 
   * @returns 
   */
  async letter_08F3B(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
          <table border = "0" class="letter" width = "100%">
            <tr>
              <td width="20%">Nomor</td>
              <td width="2%">:</td>
              <td>
                <div style="text-align: right;">
                  Tanggal ${moment().format('DD MMM YYYY')}
                </div>
              </td>
            </tr>
            <tr>
              <td width="20%">Sifat</td>
              <td width="2%">:</td>
              <td>TERBATAS</td>
            </tr>
            <tr>
              <td width="20%">Lampiran</td>
              <td width="2%">:</td>
              <td>-</td>
            </tr>
            <tr>
              <td width="20%">Hal</td>
              <td width="2%">:</td>
              <td>Pemberitahuan Hasil Validasi Pengaduan</td>
            </tr>
            <tr>  
              <td colspan="3">
                <div>Yth.</div>
                <div>${pengadu.getDataValue('fullname')}</div>
                <br />
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Bersama ini diberitahukan bahwa Keasistenan Utama Manajemen Mutu telah menerima Pengaduan dari Saudara mengenai <i>${c.getDataValue('description')}</i> </p>
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Berkenaan dengan aduan dimaksud, Ombudsman RI sedang melakukan tindak lanjut dan akan menyampaikan perkembangannya kepada Saudara. Atas hal tersebut, Saudara diharapkan dapat menunggu pemberitahuan selanjutnya</p>
              </td>
            </tr>
            <tr>
              <td colspan="3">Demikian, atas perhatiannya disampaikan terima kasih.<br /></td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">
                <div><b>Wakil Ketua/Anggota Ombudsman/<br />Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="font-size: 10px;">
                <div>Tembusan Yth,:</div>
                <ol>
                  <li>............., Anggota Ombudsman Pengampu..........</li>
                  <li>${reported}</li>
                </ol>
              </td>
            </tr>
          </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   *  Lampiran 9 : FORMAT 4 NOTA DINAS DAN FORMAT 5 SURAT PERINTAH PELAKSANAAN SURAT PEMBERITAHUAN HASIL VALIDASI
   * @param {*} id 
   * @returns 
   */
  async letter_09F4(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">NOTA DINAS</span></div>
            <div><span>Nomor </span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
          <table border = "0" class="letter" width = "100%">
            <tr>
              <td width="20%">Kepada Yth</td>
              <td width="2%">:</td>
              <td>
                Anggota Ombudsman Pengampu Keasistenan Utama .../Perwakilan...
              </td>
            </tr>
            <tr>
              <td width="20%">Dari</td>
              <td width="2%">:</td>
              <td>Anggota Ombudsman Pengampu Keasistenan Utama Manajemen Mutu</td>
            </tr>
            <tr>
              <td width="20%">Sifat</td>
              <td width="2%">:</td>
              <td>Biasa</td>
            </tr>
            <tr>
              <td width="20%">Tanggal</td>
              <td width="2%">:</td>
              <td></td>
            </tr>
            <tr>
              <td width="20%">Hal</td>
              <td width="2%">:</td>
              <td>Pelaksanaan Hasil Validasi</td>
            </tr>
            <tr>  
              <td colspan="3">
                <div>Dengan Hormat,</div>
                <br /><br /><br />
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Sehubungan dengan Surat Pemberitahuan Hasil Validasi Nomor ... Tanggal ... yang ditujukan kepada ... Yang pada pokoknya meminta agar ..., maka dengan ini diminta kepada Saudara dan Keasistenan Utama.../Perwakilan... untuk dapat menindaklanjuti hal dimaksud dan melaporkannya kepada Keasistenan Utama Manajemen Mutu.</p>
              </td>
            </tr>
            <tr>
              <td colspan="3">Demikian, atas perhatian Saudara Kami ucapkan terima kasih.<br /></td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">
                <div><b>Wakil Ketua/Anggota Ombudsman/<br />Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
            </tr>
          </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   *  Lampiran 9 : FORMAT 5 SURAT PERINTAH PELAKSANAAN SURAT PEMBERITAHUAN HASIL VALIDASI
   * @param {*} id 
   * @returns 
   */
  async letter_09F5(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
          <table border = "0" class="letter" width = "100%">
            <tr>
              <td width="20%">Nomor</td>
              <td width="2%">:</td>
              <td>
                <div style="text-align: right;">
                  Tanggal ${moment().format('DD MMM YYYY')}
                </div>
              </td>
            </tr>
            <tr>
              <td width="20%">Sifat</td>
              <td width="2%">:</td>
              <td>TERBATAS</td>
            </tr>
            <tr>
              <td width="20%">Lampiran</td>
              <td width="2%">:</td>
              <td>-</td>
            </tr>
            <tr>
              <td width="20%">Hal</td>
              <td width="2%">:</td>
              <td>Perintah Pelaksanaan Validasi Aduan</td>
            </tr>
            <tr>  
              <td colspan="3">
                <div>Yth.</div>
                <div>${reported}</div>
                <br />
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Bersama ini diberitahukan bahwa Keasistenan Utama Manajemen Mutu telah menerima Pengaduan dari <i>${c.getDataValue('fullname')}</i> mengenai <i>${c.getDataValue('description')}</i> terkait penanganan laporan masyarakat Nomor Register .... tentang .... dengan status laporan sedang dalam proses pemeriksaan</p>
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Berkenaan dengan aduan dimaksud, Anggota Pengampu Keasistenan Utama Manajemen Mutu telah menyampaikan surat Nomor ... tanggal ... perihal kepada Saudara dan Saudara diminta untuk segera menyampaikan perkembangan tindak lanjut dan rencana tindak lanjut pemeriksaan atas pengaduan dimaksud kepada Pengadu dan menembuskannya kepada Kepala Keasistenan Utama Manajemen Mutu paling lambat 14 (empat belas) hari setelah diterimanya surat dimaksud, namun sampai saat ini tindak lanjut atas validasi dimaksud belum Saudara laksanakan</p>
                <p>
                  Sehubungan dengan hal itu, maka diperintahkan kepada Saudara untuk segera melaksanakan hasil validasi dimaksud. Apabila Saudara tetap tidak melaksanakan tanpa alasan yang patut, maka Saudara dianggap melakukan pelanggaran dan akan ditindak sesuai dengan peraturan perundang-undangan yang berlaku.
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="3">Demikian, untuk dilaksanakan.<br /></td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">
                <div><b>Wakil Ketua/Anggota Ombudsman/<br />Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="font-size: 10px;">
                <div>Tembusan Yth,:</div>
                <ol>
                  <li>............., Anggota Ombudsman Pengampu..........</li>
                  <li>${c.getDataValue('fullname')}</li>
                </ol>
              </td>
            </tr>
          </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   *  Lampiran 10 : FORMAT 6 BERITA ACARA PENUTUPAN PENGADUAN KEGIATAN MASIH DALAM PROSES
   * @param {*} id 
   * @returns 
   */
  async letter_10F6(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
            <div><span>BERITA ACARA</span></div>
            <div><span>PENUTUPAN PENGADUAN UNTUK KEGIATAN MASIH DALAM PROSES</span></div>
            <div><span>NOMOR</span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
          <table border = "0" class="letter" width = "100%">
            <tr>  
              <td colspan="3">
                <p>
                  Pada hari ini ${moment().format('dddd')} tanggal ${moment().format('DD')} bulan ${moment().format('MMM')} tahun ${moment().format('YYYY')}, Keasistenan Utama Manajemen Mutu menutup Pengaduan yang terdaftar dengan Nomor WBS: ${c.getDataValue('form_no')} Tahun ...., dengan Pengaduan atas nama ${pengadu.getDataValue('fullname')} mengenai ${c.getDataValue('description')}
                </p>
                <p>
                  <div>Adapun alasan penutupan pengaduannya adalah:</div>
                  <ol>
                    <li>
                      Berdasarkan hasil validasi yang telah dilakukan, bahwa terhadap Laporan Masyarakat/Kajian dimaksud, sedang dalam proses tindak lanjut oleh Keasistenan.../Perwakilan...
                    </li>
                    <li>
                      Terhadap Aduan dimaksud, melalui surat Ombudsman RI Nomor:.... tanggal.... telah disampaikan kepada Teradu dan meminta Teradu untuk segera menyampaikan informasi perkembangan laporan kepada Pengadu dan ditembuskan kepada Keasistenan Utama Manajemen Mutu
                    </li>
                    <li>
                      Selanjutnya berdasarkan surat Teradu Nomor:... tanggal... diinformasikan bahwa terhadap poin Nomor 3 telah dilaksanakan tindak lanjut dimaksud.
                    </li>
                    <li>
                      Mengingat Teradu telah menindaklanjuti surat Nomor:...., maka Aduan Pengadu Nomor ${c.getDataValue('form_no')} ditutup di Keasistenan Utama Manajemen Mutu.
                    </li>
                  </ol>
                </p>
                <p>
                  Demikian Berita Acara ini dibuat sebagai pertanggung jawaban dalam proses pemeriksaan Pengaduan, agar dapat dipergunakan seperlunya
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">Dibuat di: ......................</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">Pada tanggal: ....................</td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <div><b>Kepala Keasistenan Utama Manajemen Mutu</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
              <td></td>
              <td style="text-align: center;">
                <div><b>Kepala Keasistenan Regional</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: center;">
                <div>Mengetahui, <br /><b>Wakil Ketua/Anggota Ombudsman/<br />Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
            </tr>
          </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   *  Lampiran 11 : FORMAT 7 SURAT PEMBERITAHUAN PENUTUPAN PENGADUAN MASIH DALAM PROSES KEPADA PENGADU
   * @param {*} id 
   * @returns 
   */
  async letter_11F7(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
          <table border = "0" class="letter" width = "100%">
            <tr>
              <td width="20%">Nomor</td>
              <td width="2%">:</td>
              <td>
                <div style="text-align: right;">
                  Tanggal ${moment().format('DD MMM YYYY')}
                </div>
              </td>
            </tr>
            <tr>
              <td width="20%">Lampiran</td>
              <td width="2%">:</td>
              <td>-</td>
            </tr>
            <tr>
              <td width="20%">Hal</td>
              <td width="2%">:</td>
              <td>Penutupan Pengaduan</td>
            </tr>
            <tr>  
              <td colspan="3">
                <div>Yth.</div>
                <div>${pengadu.getDataValue('fullname')}</div>
                <br />
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Sehubungan dengan surat Ombudsman RI nomor...... tertanggal....., perihal Pemberitahuan Tindak Lanjut Aduan, bersama ini diberitahukan bahwa telah dilakukan upaya untuk menyelesaikan Aduan Saudara. Keasistenan Utama.../Perwakilan Ombudsman RI Provinsi* telah....</p>
                <p>
                  Untuk selanjutnya Saudara diminta agar tetap aktif berkoordinasi dengan Keasistenan Utama..../Perwakilan Ombudsman RI Provinsi* yang menangani laporan tersebut. Dengan demikian Aduan yang Saudara sampaikan kepada Ombudsman RI tanggal ${moment(c.getDataValue('form_date')).format('DD MMM YYYY | HH:mm:ss')} dinyatakan ditutup.
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="3">Atas peran aktif Saudara meyampaikan aduan, Kami ucapkan terima kasih</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">
                <div><b>Ketua Ombudsman Republik Indonesia,</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="font-size: 10px;">
                <div>Tembusan Yth,:</div>
                <ol>
                  <li>............., Anggota Ombudsman Pengampu..........</li>
                  <li>${reported}</li>
                </ol>
              </td>
            </tr>
          </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   * Lampiran 12 : FORMAT 8A SURAT PERMINTAAN DATA KEPADA PENGADU
   * @param {*} id 
   * @returns 
   */
  // async letter_12F8A(id) {
  //   try {
  //     let html = `<div>`;
  //     let c = await models.complaints.findOne(
  //       {
  //         attributes: [
  //           'idx_m_complaint',
  //           'form_no',
  //           'date',
  //           'manpower',
  //           'description',
  //           'hopes',
  //           ['source_complaint', 'source_name'],
  //           'ucreate'
  //         ],
  //         where: { idx_m_complaint: id },
  //         include: [
  //           {
  //             required: false,
  //             attributes: ['idx_m_legal_standing', 'name'],
  //             model: models.legal_standing,
  //           },
  //           {
  //             required: false,
  //             attributes: ['name'],
  //             model: models.complaint_reported,
  //           }
  //         ],
  //       }
  //     );

  //     let m = await models.request.findOne({
  //       attributes: [
  //         'idx_t_request', 'by',
  //         'date', 'media', 'notes',
  //         'to', 'address', 'object', 'imagine', 'docs',
  //         'approver'
  //       ],
  //       where: { idx_m_complaint: id, record_status: 'A' }
  //     })

  //     if (c instanceof models.complaints) {
  //       let pengadu = await models.users.findOne({
  //         attributes: ['fullname'],
  //         where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
  //       })

  //       let reported = c.getDataValue('complaint_reporteds') || [];
  //       reported = reported.map(e => e.name)
  //       reported = reported.join(' , ')

  //       html += `
  //         <table border = "0" class="letter" width = "100%">
  //           <tr>
  //             <td width="20%">
  //               <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
  //             </td>
  //             <td colspan="3">
  //               <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
  //                 <div><span class="title">KEASISTENAN UTAMA MANAJEMEN MUTU</span></div>
  //                 <div><span>Jl. HR. Rasuna Said Kav. C-19 Jakarta Selatan 12940</span></div>
  //                 <div><span>Tel.(021) 52960894-95, 52960904-05</span></div>
  //                 <div><span>Website: <a href="www.ombudsman.go.id" target="_blank">www.ombudsman.go.id</a></span></div>
  //               </center>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td width="20%">Nomor</td>
  //             <td width="2%">:</td>
  //             <td>`+ "${xxxnomor}" + `</td>
  //             <td><div style="text-align: right;">`+ "${xxxtanggal}" + `</div></td>
  //           </tr>
  //           <tr>
  //             <td width="20%">Lampiran</td>
  //             <td width="2%">:</td>
  //             <td colspan="2">-</td>
  //           </tr>
  //           <tr>
  //             <td width="20%">Hal</td>
  //             <td width="2%">:</td>
  //             <td colspan="2">Permintaan Data, Informasi, dan Dokuman Aduan</td>
  //           </tr>
  //           <tr>  
  //             <td colspan="3">
  //               <div>Yth.</div>
  //               <div>${pengadu.getDataValue('fullname')}</div>
  //               <br />
  //             </td>
  //           </tr>
  //           <tr>  
  //             <td colspan="3">
  //               <p>Dengan ini diberitahukan bahwa Keasistenan Utama Manajemen Mutu telah menerima Aduan Saudara mengenai ${c.getDataValue('description')} oleh .....</p>
  //               <p>
  //                 Guna memperoleh gambaran lebih jelas mengenai permasalahan yang diadukan, maka kiranya Saudara dapat menjelaskan:
  //                 <ol>
  //                   <li></li>
  //                   <li></li>
  //                   <li></li>
  //                 </ol>
  //               </p>
  //               <p>
  //                 Selain itu, Kami juga memerlukan salinan data dan dokumen berupa:
  //                 <ol>
  //                   <li></li>
  //                   <li></li>
  //                   <li></li>
  //                 </ol>
  //               </p>
  //               <p>
  //                 Kami harap penjelasan dan data/dokumen dimaksud, agar disampaikan kepada Kepala Keasistenan Utama Manajemen Mutu selambat-lambatnya 14 (empat belas) hari sejak surat ini diterima.
  //               </p>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td colspan="3">Demikian, atas kerjasamanya Kami ucapkan terima kasih.</td>
  //           </tr>
  //           <tr>
  //             <td colspan="3" style="text-align: right;">
  //               <div><b>Kepala Keasistenan Utama Manajemen Mutu,</b></div>
  //               <div><br /><br /><br /></div>
  //               <div>Nama Lengkap</div>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td colspan="3" style="font-size: 10px;">
  //               <div>Tembusan Yth,:</div>
  //               <ol>
  //                 <li>Wakil Ketua/Anggota Ombudsman/Pengampu Keasistenan Utama Manajemen Mutu</li>
  //               </ol>
  //             </td>
  //           </tr>
  //         </table>
  //         `
  //     }

  //     html += `</div> `;
  //     return {
  //       html: html
  //     }
  //   } catch (error) {
  //     
  //     throw (error)
  //   }
  // },
  async letter_12F8A(id, flag = null) {
    try {
      let html = ``;
      let where = { idx_m_complaint: id, record_status: 'A' };
      if (flag && typeof (flag) == 'object') {
        for (const key in flag) {
          where[key] = flag[key];
        }
      }

      let items = await models.request.findAll({
        raw: true,
        attributes: ['idx_t_request', 'by', 'date', 'media', 'notes', 'to', 'address', 'object', 'imagine', 'docs', 'approver', 'mode'],
        where: where
      })

      if (items.length > 0) {
        let users = await models.users.findAll({
          attributes: ['idx_m_user', 'fullname'],
          where: { idx_m_user: { [Op.in]: items.map(e => e.approver) } }
        });

        items.map(e => {
          e.approver_name = users.filter(a => a['idx_m_user'] == e.approver).length > 0 ? users.filter(a => a['idx_m_user'] == e.approver)[0].fullname : null
        })
      }

      for (let i = 0; i < items.length; i++) {
        let k = items[i]
        html += `<table border="0" class="letter" width="100%">
          <tr>
            <td width="20%">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png" />
            </td>
            <td colspan="3">
              <center style="
                  font-weight: bold;
                  font-size: 18px;
                  margin-bottom: 10px;
                ">
                <div>
                  <span class="title">KEASISTENAN UTAMA MANAJEMEN MUTU</span>
                </div>
                <div>
                  <span>Jl. HR. Rasuna Said Kav. C-19 Jakarta Selatan
                    12940</span>
                </div>
                <div>
                  <span>Tel.(021) 52960894-95, 52960904-05</span>
                </div>
                <div>
                  <span>Website:
                    <a href="www.ombudsman.go.id" target="_blank">www.ombudsman.go.id</a></span>
                </div>
              </center>
            </td>
          </tr>
          <tr>
            <td width="20%">Nomor</td>
            <td width="2%">:</td>
            <td>`+ "${xxxnomor}" + `</td>
            <td>
              <div style="text-align: right">`+ "${xxxtanggal}" + `</div>
            </td>
          </tr>
          <tr>
            <td width="20%">Lampiran</td>
            <td width="2%">:</td>
            <td colspan="2">-</td>
          </tr>
          <tr>
            <td width="20%">Hal</td>
            <td width="2%">:</td>
            <td colspan="2">
              Permintaan Data, Informasi, dan Dokuman Aduan
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <div>Yth.</div>
              <div>${k.to}</div>
              <div>di ${k.address}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <p>
                Dengan ini diberitahukan bahwa Keasistenan Utama
                Manajemen Mutu telah menerima Aduan Saudara mengenai ${k.object} oleh ${k.by}
              </p>
              <p>
                Guna memperoleh gambaran lebih jelas mengenai permasalahan yang diadukan, maka kiranya Saudara dapat menjelaskan: ${k.imagine}
              </p>
              <p>
                Selain itu, Kami juga memerlukan salinan data dan dokumen berupa: ${k.docs}
              </p>
              <p>
                Kami harap penjelasan dan data/dokumen dimaksud, agar
                disampaikan kepada Kepala Keasistenan Utama Manajemen
                Mutu selambat-lambatnya 14 (empat belas) hari sejak
                surat ini diterima.
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              Demikian, atas kerjasamanya Kami ucapkan terima kasih.
            </td>
          </tr>
          <tr>
            <td colspan="4" style="text-align: right">
              <div><b>Kepala Keasistenan Utama Manajemen Mutu,</b></div>
              <div> ${k.approver_name} </div>
            </td>
          </tr>
          <tr>
            <td colspan="4" style="font-size: 10px">
              <div>Tembusan Yth,:</div>
              <ol>
                <li>
                  Wakil Ketua/Anggota Ombudsman/Pengampu Keasistenan
                  Utama Manajemen Mutu
                </li>
              </ol>
            </td>
          </tr>
        </table>`
      }

      return { html: html }
    } catch (error) {

      throw (error)
    }
  },

  /**
   * Lampiran 13 : FORMAT 8B SURAT PERMINTAAN DATA KEPADA TERADU.
   * @param {*} id 
   * @returns 
   */
  async letter_13F8B(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
          <table border = "0" class="letter" width = "100%">
            <tr>
              <td width="20%">Nomor</td>
              <td width="2%">:</td>
              <td>
                <div style="text-align: right;">
                  Tanggal ${moment().format('DD MMM YYYY')}
                </div>
              </td>
            </tr>
            <tr>
              <td width="20%">Lampiran</td>
              <td width="2%">:</td>
              <td>-</td>
            </tr>
            <tr>
              <td width="20%">Hal</td>
              <td width="2%">:</td>
              <td>Permintaan Data, Informasi, dan Dokuman Aduan</td>
            </tr>
            <tr>  
              <td colspan="3">
                <div>Yth.</div>
                <div>${reported}</div>
                <br />
              </td>
            </tr>
            <tr>  
              <td colspan="3">
                <p>Dengan ini diberitahukan bahwa Keasistenan Utama Manajemen Mutu telah menerima Aduan dari ${pengadu.getDataValue('fullname')} mengenai ${c.getDataValue('description')} oleh .....</p>
                <p>
                  Aduan tersebut pada intinya mengeluhkan tentang ${c.getDataValue('description')} Pengadu berharap agar Ombudsman ${c.getDataValue('hopes')}
                </p>
                <p>
                  Guna memperoleh gambaran lebih jelas mengenai permasalahan yang diadukan, maka kiranya Saudara dapat menjelaskan:
                  <ol>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ol>
                </p>
                <p>
                  Selain itu, Kami juga memerlukan salinan data dan dokumen berupa:
                  <ol>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ol>
                </p>
                <p>
                  Kami harap penjelasan dan data/dokumen dimaksud, agar disampaikan kepada Kepala Keasistenan Utama Manajemen Mutu selambat-lambatnya 14 (empat belas) hari sejak surat ini diterima.
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="3">Demikian, atas kerjasamanya Kami ucapkan terima kasih.</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">
                <div><b>Kepala Keasistenan Utama Manajemen Mutu,</b></div>
                <div><br /><br /><br /></div>
                <div>Nama Lengkap</div>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="font-size: 10px;">
                <div>Tembusan Yth,:</div>
                <ol>
                  <li>Wakil Ketua/Anggota Ombudsman/Pengampu Keasistenan Utama Manajemen Mutu</li>
                </ol>
              </td>
            </tr>
          </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },


  /**
   * KERTAS KERJA PEMERIKSAAN: KLARIFIKASI
   * @param {*} id 
   * @returns 
   */
  async letter_14F9(id, flag = null) {
    try {
      let html = `<div>
          <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
            <div><span class="title">KERTAS KERJA PEMERIKSAAN:</span></div>
            <div><span class="title">KLARIFIKASI</span></div>
          </center>
        `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
          ],
          where: { idx_m_complaint: id },
          include: [
            {
              required: false,
              attributes: ['idx_m_legal_standing', 'name'],
              model: models.legal_standing,
            },
          ],
        }
      );

      let s = await models.complaint_studies.findOne(
        {
          attributes: [
            'idx_t_complaint_study',
            'notes',
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
              attributes: ['idx_t_complaint_study_violation'],
              model: models.complaint_study_violations,
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
                'idx_t_complaint_study_event',
                'event', 'date', 'notes', 'simple_app_no',
                'dcreate', 'ucreate', 'dmodified', 'umodified'
              ],
              model: models.complaint_study_events,
              where: { record_status: 'A' }
            },
          ],
          where: { record_status: 'A', idx_m_complaint: c instanceof models.complaints ? c.getDataValue('idx_m_complaint') : null }
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = ``;
        for (let i = 0; i < s.getDataValue('complaint_study_reporteds').length; i++) {
          let report = s.getDataValue('complaint_study_reporteds')
          reported += `${report[i].name}`
        }

        // validation
        let arranged_by, approved_by, checked_by;
        let v = await models.validation.findOne(
          {
            attributes: [
              'idx_t_validation',
              'prevention',
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
            where: { record_status: 'A', idx_m_complaint: id }
          }
        )

        let comms = v.getDataValue('validation_comms') || [];
        let terlapor = comms.filter(e => e.by == 'TERLAPOR');
        let teradu = comms.filter(e => e.by == 'TERADU');
        let hterlapor = `
          <table border="1" class="letter" width = "100%">
            <tr>
              <td>Tanggal</td>
              <td>Media</td>
              <td>Keterangan</td>
            </tr>
        `
        let hteradu = `
          <table border="1" class="letter" width="100%">
            <tr>
              <td>Tanggal</td>
              <td>Media</td>
              <td>Keterangan</td>
            </tr>
        `
        for (let i in terlapor) {
          hterlapor += `
          <tr>
              <td>${moment(terlapor[i].date).format('DD MMM YYYY | HH:mm:ss')}</td>
              <td>${terlapor[i].media}</td>
              <td>${terlapor[i].notes}</td>  
            </tr>
          `
        }
        hterlapor += `</table > `

        for (let i in teradu) {
          hteradu += `
          <tr>
              <td>${moment(teradu[i].date).format('DD MMM YYYY | HH:mm:ss')}</td>
              <td>${teradu[i].media}</td>
              <td>${teradu[i].notes}</td>  
            </tr>
          `
        }
        hteradu += `</table > `
        arranged_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('arranged_by') } })
        approved_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('approved_by') } })
        checked_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('checked_by') } })

        v['arranged_by'] = arranged_by instanceof models.users ? arranged_by.getDataValue('email') : null
        v['approved_by'] = approved_by instanceof models.users ? approved_by.getDataValue('email') : null
        v['checked_by'] = checked_by instanceof models.users ? checked_by.getDataValue('email') : null

        // study_lys
        let sl = await models.study_lys.findOne({
          attributes: [
            'idx_t_study_lys', 'manpower', 'description',
            'scope', 'simpel_app_no', 'prevention', 'procedure',
            'product', 'hopes', 'scope_clarification', 'action',
            'others_clarification', 'action', 'others_action',
            'checked', 'arranged_by', 'head_of_reg', 'head_of_kumm'
          ],
          include: [
            {
              required: false,
              attributes: ['idx_m_legal_standing', 'name'],
              model: models.legal_standing,
            },
            {
              required: false,
              attributes: ['idx_t_study_lys_event', 'event', 'date', 'notes'],
              model: models.study_lys_event,
            }
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        })

        let sl_event = s.getDataValue('complaint_study_events') || []
        let hevent = `<table width="100%" border="1" class="letter">
          <tr>
            <td>Tanggal</td>
            <td>Peristiwa</td>
            <td>Keterangan</td>
          </tr>`
        for (let i in sl_event) {
          hevent += `<tr>
            <td>${moment(sl_event[i].date).format('DD MMM YYYY')}</td>
            <td>${sl_event[i].event}</td>
            <td>${sl_event[i].notes}</td>
          </tr> `
        }
        hevent += `</table> `

        html += `
          <p style="font-weight: bold;">A.Informasi Aduan</p>
            <table border="1" class="letter" width="100%">
              <tr style="padding: 5px;">
                <td width="20%" style="font-weight: bold;">No Registrasi Aduan</td>
                <td>${c.getDataValue('form_no')}</td>
              </tr>
              <tr style="padding: 5px;">
                <td width="20%" style="font-weight: bold;">Tanggal Pengaduan</td>
                <td>${moment(c.getDataValue('date')).format('DD MMM YY')}</td>
              </tr>
              <tr>
                <td>Pengadu</td>
                <td>${pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null}</td>
              </tr>
              <tr>
                <td>Teradu</td>
                <td>${reported}</td>
              </tr>
            </table>`

        html += `
              <p style = "font-weight: bold; margin-top: 40px">B.Pemetaan Pengaduan</p>
                <table border="1" class="letter" width="100%">
                  <tbody>
                    <tr>
                      <td width="20%">Legal Standing Pengadu</td>
                      <td>${c.getDataValue('legal_standing')['name']}</td>
                    </tr>
                    <tr>
                      <td>Pokok Aduan</td>
                      <td>${sl instanceof models.study_lys ? sl.getDataValue('description') : ''}</td>
                    </tr>
                    <tr>
                      <td>Ruang Lingkup Aduan</td>
                      <td>
                        <table class="letter" border="1" width="100%">
                          <tr>
                            <td>
                              <div>Pemeriksaan Laporan</div>
                              <div>Laporan Nomor: <i>${sl.getDataValue('simpel_app_no')}</i></div>
                            </td>
                            <td>
                              <div>Pencegahan</div>
                              <div><i>${v.getDataValue('prevention')}</i></div>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2">Substansi: <i></i></td>
                          </tr>
                          <tr>
                            <td colspan="2">Prosedur: <i>${sl.getDataValue('procedure')}</i></td>
                          </tr>
                          <tr>
                            <td colspan="2">Produk: <i>${sl.getDataValue('product')}</i></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>Harapan Pengadu</td>
                      <td>${c.getDataValue('hopes')}</td>
                    </tr>
                  </tbody>
                </table>
        `;

        html += `
          <p style = "font-weight: bold; margin-top: 40px">C.Kronologi Pokok Aduan</p>
          <div>${hevent}</div>
          <p style="font-weight: bold; margin-top: 40px">D. Pokok Aduan Yang Perlu diklarifikasi</p>
          <div>${sl.getDataValue('scope_clarification')}</div>
          <p style="font-weight: bold; margin-top: 40px">E. Opsi Tindak Lanjut Pengaduan</p>
          <div>${sl.getDataValue('action')}</div>
          <p style="font-weight: bold; margin-top: 40px">F. Hal Lain yang Perlu di Klarifikasi</p>
          <div>${sl.getDataValue('others_clarification')}</div>
          <p style="font-weight: bold; margin-top: 40px">G. Opsi Tindak Lanjut Hal Lainnya (Substansi, Prosedur, Produk)</p>
          <div>${sl.getDataValue('others_action')}</div>
          <p style="font-weight: bold; margin-top: 40px">H. Terperiksa</p>
          <div>${sl.getDataValue('checked')}</div>
          <br /><br />
        `

        html += `
          <table border = "1" class="letter" width = "100%">
            <tr>
              <td>Tanggal: <i>${moment(v.getDataValue('arranged_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
              <td>Tanggal: <i>${moment(v.getDataValue('checked_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
              <td>Tanggal: <i>${moment(v.getDataValue('approve_date')).format('DD MMM YYYY | HH:mm:ss')}</i></td>
            </tr>
            <tr>
              <td>Disusun oleh:</td>
              <td>Diperiksa: Kepala Keasistenan Regional</td>
              <td>Disetujui: Kepala Keasistenan Utama Manajement Mutu</td>
            </tr>
            <tr style="text-align: center; font-weight: bold;">
              <td>${v.getDataValue('arranged_by')}</td>
              <td>${v.getDataValue('checked_by')}</td>
              <td>${v.getDataValue('approved_by')}</td>
            </tr>
          </table>
          `
      }

      html += `</div>`;
      return {
        html: html.replace(/(null)/gm, '')
      }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * SURAT PERMINTAAN KLARIFIKASI
   * @param {*} id 
   */
  async letter_15F10(id, flag = null) {
    try {
      let html = ``;
      let c = await models.clarification.findOne({
        attributes: ['idx_t_clarification', 'date', 'teams', 'result', 'to', 'address', 'by', 'object', 'meet_date', 'approver', 'meet_time', 'agenda', 'tempat'],
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

      if (c instanceof models.clarification) {
        let user = await models.users.findOne({ attributes: ['fullname'], where: { idx_m_user: c.getDataValue('approver') } })
        c.setDataValue('approver_name', user instanceof models.users ? user.getDataValue('fullname') : '');
        let meetday = helper.dayToIndo(moment(c.getDataValue('meet_date')).format('dddd'))
        let meetdate = moment(c.getDataValue('meet_date')).format('DD MMM YYYY')
        let meettime = c.getDataValue('meet_time')
        let meetagenda = c.getDataValue('agenda')
        let meettempat = c.getDataValue('tempat')

        html += `
          <table border="0" class="letter" width="100%">
            <tr>
              <td colspan="4">
                <div>
                  <center style="align: center">
                    <img
                      height="160px"
                      width="160px"
                      src="${API_URL}/others/logo/logo-garuda.png"
                    />
                  </center>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colspan="4"
                style="text-align: center; font-size: 21px; font-weight: bold"
              >
                OMBUDSMAN REPUBLIK INDONESIA
              </td>
            </tr>
            <tr>
              <td width="20%">Nomor</td>
              <td width="2%">:</td>
              <td>`+ "${xxxnomor}" + `</td>
              <td><div style="text-align: right">`+ "${xxxtanggal}" + `</div></td>
            </tr>
            <tr>
              <td width="20%">Lampiran</td>
              <td width="2%">:</td>
              <td colspan="2">-</td>
            </tr>
            <tr>
              <td width="20%">Hal</td>
              <td width="2%">:</td>
              <td colspan="2">
                Permintaan Klarifikasi Pengaduan a.n ${c.getDataValue('by')}
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div>Yth.</div>
                <div>${c.getDataValue('to')}</div>
                <div>di ${c.getDataValue('address')}</div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <p>
                  Bersama ini diberitahukan bahwa Keasistenan Utama Manajemen
                  Mutu telah menerima Pengaduan dari ${c.getDataValue('by')} mengenai ${c.getDataValue('object')}
                </p>
                <p>
                  Dalam rangka memperoleh informasi yang lebih jelas dan
                  komprehensif terkait pengaduan dimaksud, maka kepada Saudara
                  dan Keasistenan yang menangani diminta untuk hadir dalam
                  pertemuan permintaan klarifikasi pengaduan pada:
                </p>
                <table>
                  <tr>
                    <td>Hari dan Tanggal</td>
                    <td>${meetday}, ${meetdate}</td>
                  </tr>
                  <tr>
                    <td>Pukul</td>
                    <td>${meettime}</td>
                  </tr>
                  <tr>
                    <td>Agenda</td>
                    <td>${meetagenda}</td>
                  </tr>
                  <tr>
                    <td>Tempat</td>
                    <td>${meettempat}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="4">Demikian, untuk dilaksanakan.<br /></td>
            </tr>
            <tr>
              <td colspan="4" style="text-align: right">
                <div><b>Kepala Keasistenan Utama Manajemen Mutu,</b></div>
                <div>${c.getDataValue('approver_name')}</div>
              </td>
            </tr>
            <tr>
              <td colspan="4" style="font-size: 10px">
                <div>Tembusan Yth,:</div>
                <ol>
                  <li>
                    Wakil Ketua/Anggota Ombudsman/Pengampu Keasistenan Utama
                    Manajemen Mutu
                  </li>
                </ol>
              </td>
            </tr>
          </table>
        `
      }

      return { html: html.replace(/(null)/gm, '') }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * Lampiran 16 : FORMAT 11 BERITA ACARA KLARIFIKASI
   * @param {*} id 
   * @returns 
   */
  async letter_16F11(id, flag = null) {
    try {
      let html = ``;
      let c = await models.clarification.findOne({
        attributes: ['idx_t_clarification', 'date', 'teams', 'result', 'to', 'address', 'by', 'object', 'meet_date', 'approver', 'dcreate', 'meet_time', 'agenda', 'tempat'],
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

      if (c instanceof models.clarification) c.setDataValue('teams_arr', teams);
      if (c instanceof models.clarification) {
        let user = await models.users.findOne({ attributes: ['fullname'], where: { idx_m_user: c.getDataValue('approver') } })
        c.setDataValue('approver_name', user instanceof models.users ? user.getDataValue('fullname') : '');

        let terperiksa = ``;
        let cld = c.getDataValue('clarification_details');
        for (let i = 0; i < cld.length; i++) {
          terperiksa += `
          <tr>
            <td rowspan="4">${i + 1}</td>
            <td colspan="3">
              <tr>
                <td>Name</td>
                <td>:</td>
                <td>${cld[i]['name']}</td>
              </tr>
              <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>${cld[i]['occupation']}</td>
              </tr>
            </td>
          </tr>`;
        }

        let team_html = `<td colspan="3"><center class="ttd-grid">`;
        for (let i = 0; i < teams.length; i++) {
          team_html += `
            <div class="ttd-flex">
              <div><b>${teams[i]['user.usertype.name']}</b></div>
              <div><i>(${teams[i]['user.fullname']})</i></div>
            </div>
          `
        }
        team_html += `</center></td>`

        //   <td colspan="3">
        //   <center class="ttd-grid">
        //     <div v-for="(a,b) in item.clarification_details" :key="b" class="ttd-flex">
        //       <div><b>{{ a['occupation'] }}</b></div>
        //       <div><i>({{a['name']}})</i></div>
        //     </div>
        //   </center>
        // </td>
        let cdetail = c.getDataValue('clarification_details')
        let terperiksa_table = `<td colspan="3"><center class="ttd-grid">`
        for (let i = 0; i < cdetail.length; i++) {
          terperiksa_table += `
            <div class="ttd-flex">
              <div><b>${cdetail[i]['occupation']}</b></div>
              <div><i>(${cdetail[i]['name']})</i></div>
            </div>
          `
        }
        terperiksa_table += `</center></td>`

        html += `
        <table border="0" class="letter" width="100%">
          <tr>
            <td width="20%">
              <img
                height="50px"
                width="175px"
                src="${API_URL}/others/logo/logo.png"
              />
            </td>
            <td colspan="3">
              <center
                style="
                  font-weight: bold;
                  font-size: 18px;
                  margin-bottom: 10px;
                "
              >
                <div>
                  <span class="title">KEASISTENAN UTAMA MANAJEMEN MUTU</span>
                </div>
                <div>
                  <span>Jl. HR. Rasuna Said Kav. C-19 Jakarta Selatan 12940</span>
                </div>
                <div><span>Tel.(021) 52960894-95, 52960904-05</span></div>
                <div>
                  <span>Website:
                    <a href="www.ombudsman.go.id" target="_blank">www.ombudsman.go.id</a></span>
                </div>
              </center>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <center
                style="
                  font-weight: bold;
                  font-size: 14px;
                  margin-bottom: 10px;
                "
              >
                <div>
                  <span>BERITA ACARA PERMINTAAN KLARIFIKASI</span>
                </div>
                <div>
                  <span>Nomor Aduan: ...</span>
                </div>
              </center>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <p>
                Bahwa pada hari ini ${helper.dayToIndo(moment(c.getDataValue('dcreate')).format("dddd"))} tanggal
                ${moment(c.getDataValue('dcreate')).format("DD")} bulan
                ${moment(c.getDataValue('dcreate')).format("MMM")} tahun
                ${moment(c.getDataValue('dcreate')).format("YYYY")} Telah dilakukan permintaan klarifikasi dalam rangka menindaklanjuti Aduan atas nama ${c.getDataValue('by')} selaku ... mengenai ${c.getDataValue('object')}
              </p>
              <p>
                Tim pemeriksa berdasarkan Surat Tugas Kepala Keasistenan
                Utama Manjemen Mutu Nomor: ${det.getDataValue('st_number')} Tanggal ${moment(det.getDataValue('st_date')).format("DD MMM YYYY")} yang terdiri
                dari: ${c.getDataValue('teams')}
              </p>
              <p>
                telah melakukan pemeriksaan kepada: <table>${terperiksa}</table>
              </p>
              <p>
                Adapun hasil klarifikasi adalah sebagai berikut: ${c.getDataValue('result')}
              </p>
              <p>Demikian berita acara ini dibuat guna kepentingan pemeriksaan Aduan kepada Keasistenan Utama Manajemen Mutu.</p>
              <p>
                <table border="1" class="letter" width="100%">
                  <tr><td colspan="3"><span style="font-weight: bold;">I. Tim Pemeriksa</span></td></tr>
                  <tr>${team_html}</tr>
                  <tr><td colspan="3"><span style="font-weight: bold;">II. Terperiksa</span></td></tr>
                  <tr>${terperiksa_table}</tr>
                </table>
              </p>
            </td>
          </tr>
          </table>
        `
      }

      return { html: html.replace(/(null)/gm, '') }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * Lampiran 17 : FORMAT 12 SURAT PERMINTAAN KONFIRMASI
   * @param {*} id 
   * @returns 
   */
  async letter_17F12(id, flag = null) {
    try {
      let html = ``;
      let c = await models.confirmation.findOne({
        attributes: ['idx_t_confirmation', 'value', 'head_of_kumm', 'response', 'to', 'address', 'by', 'object', 'desc'],
        where: { idx_m_complaint: id, record_status: 'A' }
      })

      if (c instanceof models.confirmation) {
        let user = await models.users.findOne({ attributes: ['fullname'], where: { idx_m_user: c.getDataValue('head_of_kumm') } });
        c.setDataValue('head_of_kumm_name', user instanceof models.users ? user.getDataValue('fullname') : '');

        html += `
        <table border="0" class="letter" width="100%">
          <tr>
            <td width="20%">
              <img
                height="50px"
                width="175px"
                src="${API_URL}/others/logo/logo.png"
              />
            </td>
            <td colspan="3">
              <center
                style="
                  font-weight: bold;
                  font-size: 18px;
                  margin-bottom: 10px;
                "
              >
                <div>
                  <span class="title"
                    >KEASISTENAN UTAMA MANAJEMEN MUTU</span
                  >
                </div>
                <div>
                  <span
                    >Jl. HR. Rasuna Said Kav. C-19 Jakarta Selatan
                    12940</span
                  >
                </div>
                <div>
                  <span>Tel.(021) 52960894-95, 52960904-05</span>
                </div>
                <div>
                  <span
                    >Website:
                    <a href="www.ombudsman.go.id" target="_blank"
                      >www.ombudsman.go.id</a
                    ></span
                  >
                </div>
              </center>
            </td>
          </tr>
          <tr>
            <td width="20%">Nomor</td>
            <td width="2%">:</td>
            <td>`+ "${xxxnomor}" + `</td>
            <td><div style="text-align: right">`+ "${xxxtanggal}" + `</div></td>
          </tr>
          <tr>
            <td width="20%">Lampiran</td>
            <td width="2%">:</td>
            <td colspan="2">-</td>
          </tr>
          <tr>
            <td width="20%">Hal</td>
            <td width="2%">:</td>
            <td colspan="2">Permintaan Konfirmasi</td>
          </tr>
          <tr>
            <td colspan="4">
              <div>Yth.</div>
              <div> ${c.getDataValue('to')} </div>
              <div> di ${c.getDataValue('address')} </div>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <p>
                Dengan ini diberitahukan bahwa Keasistenan Utama Manajemen Mutu telah menerima Aduan Saudara mengenai ${c.getDataValue('object')} oleh ${c.getDataValue('by')}
              </p>
              <p>
                Sehubungan dengan hal tersebut, Kami telah melakukan
                klarifikasi kepada
                <span v-html="terperiksa"></span> yang pada intinya
                disampaikan bahwa: ${c.getDataValue('desc')}
              </p>
              <p>
                Terkait hal tersebut, Kami perlu meminta konfirmasi kepada Saudara atas hasil klarifikasi kepada ${c.getDataValue('by')}. Kami harap konfirmasi dimaksud, agar disampaikan kepada Kepala Keasistenan Management Mutu
                selambat-lambatnya 14 (empat belas) hari sejak surat ini
                diterima.
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              Demikian, atas kerjasamanya Kami ucapkan terima kasih.
            </td>
          </tr>
          <tr>
            <td colspan="4" style="text-align: right">
              <div><b>Kepala Keasistenan Utama Manajemen Mutu,</b></div>
              <div> ${c.getDataValue('head_of_kumm_name')} </div>
            </td>
          </tr>
          <tr>
            <td colspan="4" style="font-size: 10px">
              <div>Tembusan Yth,:</div>
              <ol>
                <li>
                  Wakil Ketua/Anggota Ombudsman/Pengampu Keasistenan
                  Utama Manajemen Mutu
                </li>
              </ol>
            </td>
          </tr>
        </table>
        `
      }

      return { html: html }
    } catch (error) {

      throw (error)
    }
  },

  /**
   * LHPA Penyelesaian dan Pencegahan
   */
  async letter_18(id, flag = null) {
    try {
      let html = ``;
      let where = { idx_m_complaint: id, record_status: 'A' };
      if (flag && typeof (flag) == 'object') {
        for (const key in flag) {
          where[key] = flag[key];
        }
      }

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
          'substansi', 'procedure', 'product', 'fakta', 'head_of_kumm',
          'analisis_pemeriksaan', 'pendapat_pemeriksa', 'kesimpulan_pemeriksa', 'tindak_lanjut', 'dcreate',
          [Sequelize.literal(`to_char(lhpa.checked_date, 'DD-MM-YYYY HH24:MI:SS')`), 'checked_date'], 'checked_by',
          [Sequelize.literal(`to_char(lhpa.approved_date, 'DD-MM-YYYY HH24:MI:SS')`), 'approved_date'], 'approved_by',
          [Sequelize.literal(`to_char(lhpa.arranged_date, 'DD-MM-YYYY HH24:MI:SS')`), 'arranged_date'], 'arranged_by'
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
        where: where,
        order: [['dcreate', 'asc']]
      })

      let users = await models.users.findAll({ raw: true, attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name'], 'idx_m_user'], where: { idx_m_user_type: { [Op.ne]: -1 } } })
      if (m.length > 0) {
        m = JSON.parse(JSON.stringify(m));
        m.map(e => {
          let st_date = determination instanceof models.complaint_determinations ? determination.getDataValue('date') : null;
          let st_number = determination instanceof models.complaint_determinations ? determination.getDataValue('st_number') : null;
          let is_kuasa = complaint instanceof models.complaints ? complaint.getDataValue('is_kuasa_pelapor') : false
          let form_no = complaint instanceof models.complaints ? complaint.getDataValue('form_no') : null
          e.arranged_by_name = users.filter(a => a['idx_m_user'] == e['arranged_by']).length > 0 ? users.filter(a => a['idx_m_user'] == e['arranged_by'])[0].name : null
          e.approved_by_name = users.filter(a => a['idx_m_user'] == e['approved_by']).length > 0 ? users.filter(a => a['idx_m_user'] == e['approved_by'])[0].name : null
          e.checked_by_name = users.filter(a => a['idx_m_user'] == e['checked_by']).length > 0 ? users.filter(a => a['idx_m_user'] == e['checked_by'])[0].name : null
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
          e.kronologi_aduan = studies instanceof models.complaint_studies ? studies.getDataValue('complaint_study_events') : []
          // e.head_of_kumm_name = users.filter(a => a['idx_m_user'] == e['head_of_kumm']).length > 0 ? users.filter(a => a['idx_m_user'] == e['head_of_kumm'])[0]['fullname'] : '';
        })

        m.sort(function (a, b) { return a['dcreate'] - b['dcreate'] });
      }

      for (let i = 0; i < m.length; i++) {
        let kronologi_html = ``;
        let kronologi_aduan = m[i].kronologi_aduan;

        for (let i = 0; i < kronologi_aduan.length; i++) {
          kronologi_html += `
            <tr>
              <td>${kronologi_aduan[i]['date'] ? moment(kronologi_aduan[i]['date']).format('DD MMM YYYY') : ''}</td>
              <td>${kronologi_aduan[i]['event']}</td>
              <td>${kronologi_aduan[i]['notes']}</td>
            </tr>
          `
        }

        html += `
        <table border="0" class="letter" width="100%">
        <tr>
          <td width="20%">
            <img
              height="50px"
              width="175px"
              src="${API_URL}/others/logo/logo.png"
            />
          </td>
          <td colspan="3">
            <center
              style="
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 10px;
              "
            >
              <div>
                <span class="title"
                  >KEASISTENAN UTAMA MANAJEMEN MUTU</span
                >
              </div>
              <div>
                <span
                  >Jl. HR. Rasuna Said Kav. C-19 Jakarta Selatan
                  12940</span
                >
              </div>
              <div>
                <span>Tel.(021) 52960894-95, 52960904-05</span>
              </div>
              <div>
                <span
                  >Website:
                  <a href="www.ombudsman.go.id" target="_blank"
                    >www.ombudsman.go.id</a
                  ></span
                >
              </div>
            </center>
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              text-align: center;
              font-size: 16px;
              font-weight: bold;
            "
          >
            <div>LAPORAN HASIL PEMERIKSAAN ADUAN</div>
            <div>KEGIATAN: ${m[i].type}</div>
          </td>
        </tr>
        <tr>
          <td width="20%">NOMOR WBS</td>
          <td width="2%">:</td>
          <td colspan="2">${m[i].form_no}</td>
        </tr>
        <tr>
          <td width="20%">Tanggal Aduan</td>
          <td width="2%">:</td>
          <td colspan="2">
            ${m[i].date ? moment(m[i].date).format("DD MMMM YYYY") : null
          }
          </td>
        </tr>
        <tr>
          <td width="20%">Pengadu</td>
          <td width="2%">:</td>
          <td colspan="2">${m[i].pengadu}</td>
        </tr>
        <tr>
          <td width="20%">Alamat Pengadu</td>
          <td width="2%">:</td>
          <td colspan="2">${m[i].alamat_pengadu ? m[i].alamat_pengadu : ''}</td>
        </tr>
        <tr>
          <td width="20%">Teradu</td>
          <td width="2%">:</td>
          <td colspan="2">
            ${m[i].teradu.length > 0
            ? m[i].teradu.map((e) => e.name).join(" , ")
            : null
          }
          </td>
        </tr>
        <tr>
          <td width="20%">Terperiksa</td>
          <td width="2%">:</td>
          <td colspan="2">${m[i].terperiksa ? m[i].terperiksa : ''}</td>
        </tr>
        <tr>
          <td colspan="4">
            ${m[i].dasar_pemeriksaan}
            <span>
              <div class="title">B. RUANG LINGKUP PEMERIKSAAN ADUAN</div>
              <div>Pemeriksaan Laporan Masyarakat</div>
              <div>Nomor:</div>
              <div>
                <table>
                  <tr>
                    <td>${m[i].substansi ? '[X]' : '[]'}</td>
                    <td>1</td>
                    <td>SUBSTANSI</td>
                  </tr>
                  <tr>
                    <td>${m[i].procedure ? '[X]' : '[]'}</td>
                    <td>2</td>
                    <td>PROSEDUR</td>
                  </tr>
                  <tr>
                    <td>${m[i].product ? '[X]' : '[]'}</td>
                    <td>3</td>
                    <td>PRODUK</td>
                  </tr>
                </table>
              </div>
            </span>
            <span>
              <div class="title">C. KRONOLOAGI ADUAN</div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <td>Tanggal</td>
                      <td>Peristiwa</td>
                      <td>Catatan</td>
                    </tr>
                  </thead>
                  <tbody>${kronologi_html}</tbody>
                </table>
              </div>
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="title">D. PEMETAAN ADUAN</div>
            <div>
              <table width="100%">
                <thead style="font-weight: bold">
                  <tr>
                    <td width="30%">Unsur Pemeriksaan</td>
                    <td>Keterangan</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Legal Standing Pengadu</td>
                    <td>${m[i].legal_standing
            ? m[i].legal_standing["name"]
            : null}
                    </td>
                  </tr>
                  <tr>
                    <td>Layanan yang diadukan</td>
                    <td>${m[i].source_complaint}</td>
                  </tr>
                  <tr>
                    <td>Pokok Aduan</td>
                    <td>${m[i].pokok_aduan}</td>
                  </tr>
                  <tr>
                    <td>Harapan Pengadu</td>
                    <td>${m[i].harapan_pengadu}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="title">E. TINDAK LANJUT LAPORAN MASYARAKAT</div>`;
        let act = ``;
        let lhpa_action_e = m[i].lhpa_actions.filter((e) => e.type == 'E').sort((x, y) => x['idx_t_lhpa_action'] - y['idx_t_lhpa_action']);

        for (let j = 0; j < lhpa_action_e.length; j++) {
          act += `
              <div>${lhpa_action_e[j]['title']}</div>
              <div>oleh ${lhpa_action_e[j]['by'] ? lhpa_action_e[j]['by'] : ''}</div>`;

          act += `<table>
            <thead style="font-weight: bold;">
              <tr>
                <td>No</td>
                <td>Tahapan</td>
                <td>Tanggal</td>
                <td>Keterangan</td>
                <td>Checklist Dokumen</td>
              </tr>          
            </thead>
            <tbody>`;

          let it = lhpa_action_e[j]['lhpa_act_details'].sort((a, b) => a['sort'] - b['sort'])
          for (let k = 0; k < it.length; k++) {
            act += `<tr>
                <td>${it[k]['sort']}</td>
                <td>${it[k]['step']}</td>
                <td>${it[k]['date']
                ? moment(it[k]['date']).format('DD MMM YYYY')
                : ''}</td>
                <td>${it[k]['notes'] ? it[k]['notes'] : ''}</td>
                <td>${it[k]['step'] == true ? '[X]' : '[]'}</td>
              </tr>
            `
          }
        }
        act += `</tbody></table>`
        html += act + `</td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="title">F. PEMERIKSAAN ADUAN OLEH TIM PEMERIKSA</div>`;
        act = ``;
        lhpa_action_e = m[i].lhpa_actions.filter((e) => e.type == 'F').sort((x, y) => x['idx_t_lhpa_action'] - y['idx_t_lhpa_action']);

        lhpa_action_e = lhpa_action_e.sort((a, b) => a['sort'] - b['sort']);
        for (let j = 0; j < lhpa_action_e.length; j++) {
          act += `
                  <div>${lhpa_action_e[j]['title']}</div>
                  <div>oleh ${lhpa_action_e[j]['by'] ? lhpa_action_e[j]['by'] : ''}</div>`;

          act += `<table>
                <thead style="font-weight: bold;">
                  <tr>
                    <td>No</td>
                    <td>Tahapan</td>
                    <td>Tanggal</td>
                    <td>Keterangan</td>
                    <td>Checklist Dokumen</td>
                  </tr>          
                </thead>
                <tbody>`;
          it = lhpa_action_e[j]['lhpa_act_details'].sort((a, b) => a['sort'] - b['sort'])
          for (let k = 0; k < it.length; k++) {
            act += `<tr>
                <td>${it[k]['sort']}</td>
                <td>${it[k]['step']}</td>
                <td>${it[k]['date']
                ? moment(it[k]['date']).format('DD MMM YYYY')
                : ''}</td>
                <td>${it[k]['notes'] ? it[k]['notes'] : ''}</td>
                <td>${it[k]['step'] == true ? '[X]' : '[]'}</td>
              </tr>
            `
          }
        }
        act += `</tbody></table>`
        html += `<div>
              <span class="text-caption">Fakta yang terungkap</span> ${m[i].fakta ? m[i].fakta : ''}
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="title">G. ANALISIS PEMERIKSAAN ADUAN</div> ${m[i].analisis_pemeriksaan}
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="title">H. PENDAPAT PEMERIKSA</div> ${m[i].pendapat_pemeriksa}
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="title">I. KESIMPULAN PEMERIKSA</div>${m[i].analisis_pemeriksaan}
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="title">J. TINDAK LANJUT</div> ${m[i].tindak_lanjut}
          </td>
        </tr>
        <tr>
          <td colspan="4">
            Demikian, atas kerjasamanya Kami ucapkan terima kasih.
          </td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: center">
            <div><b>Disusun Pada ${m[i].arranged_date},</b></div>
            <div> Oleh ${m[i].arranged_by_name} </div>
          </td>
          <td colspan="3" style="text-align: center">
            <div><b>Diperiksa Pada ${m[i].checked_date},</b></div>
            <div> Oleh ${m[i].checked_by_name} </div>
          </td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: right">
          <div><b>Disetujui Pada ${m[i].approved_date},</b></div>
          <div> Oleh ${m[i].approved_by_name} </div>
          </td>
        </tr>
      </table>
      <br /><br />
      `
      }

      return { html: html }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * Lampiran 18 : FORMAT 13 LHPA KEGIATAN : PENYELESAIAN LAPORAN
   * @param {*} id 
   */
  async letter_18F13(id, flag = null) {
    try {
      let html = `<div>
        <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
          <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
          <div><span class="title">LAPORAN HASIL PEMERIKSAAN ADUAN</span></div>
          <div><span class="title">KEGIATAN: PENYELESAIAN LAPORAN</span></div>
        </center>
      `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            },
            {
              required: false,
              attributes: [
                [Sequelize.literal(`coalesce(complaint_decision.dmodified,complaint_decision.dcreate)`), 'dcreate']
              ],
              model: models.complaint_decisions
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname', 'phone_no'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        let clarification = await models.clarification.findOne({
          attributes: [
            'idx_t_clarification',
            'date', 'teams', 'result'
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
        let cladet = clarification instanceof models.clarification ? clarification.getDataValue('clarification_details') : [];
        cladet = cladet.map(e => e.name);
        html += `
          <table border="1" class="letter" width="100%">
            <tr>
              <td width="20%">Nomor Registrasi WBS</td>
              <td width="2%">:</td>
              <td>${c.getDataValue('form_no')}</td>
            </tr>
            <tr>
              <td width="20%">Tanggal Aduan</td>
              <td width="2%">:</td>
              <td>${moment(c.getDataValue('form_date')).format('DD MMM YYYY | HH:mm:ss')}</td>
            </tr>
            <tr>
              <td width="20%">Pengadu</td>
              <td width="2%">:</td>
              <td>${pengadu.getDataValue('fullname')}</td>
            </tr>
            <tr>
              <td width="20%">Kontak Pengadu</td>
              <td width="2%">:</td>
              <td>${pengadu.getDataValue('phone_no')}</td>
            </tr>
            <tr>
              <td width="20%">Teradu</td>
              <td width="2%">:</td>
              <td>${reported}</td>
            </tr>
            <tr>
              <td width="20%">Terperiksa</td>
              <td width="2%">:</td>
              <td>${cladet.join(', ')}</td>
            </tr>
          </table>
        `
        html += `
        <p>
          <div class="title">A. DASAR PEMERIKSAAN</div>
          <ol>
            <li>Undang-Undang No. 37 Tahun 2008 tentang Ombudsman Republik Indonesia</li>
            <li>Undang-Undang No. 25 Tahun 2009 tentang Pelayanan Publik</li>
            <li>Peraturan Ombudsman RI No. 26 tahun 2017 tentang Tata Cara Penerimaan, Pemeriksaan, dan Penyelesaian Laporan</li>
            <li>Peraturan Ombudsman RI No. 27 tahun 2017 tentang Sistem Pelaporan dan Penanganan Pelanggaran Internal</li>
            <li>Putusan penanggung jawab WBS tanggal ${c.getDataValue('complaint_decisions') ? moment(c.getDataValue('complaint_decisions')['dcreate']).format('DD MMM YYYY | HH:mm:ss') : ''}</li>
            <li>Surat Tugas Kepala Keasistenan Utama Manajemen Mutu Nomor .... Tanggal .... tentang Penunjukan Tim Pemeriksa Aduan Nomor ....</li>
          </ol>
        </p>
        `
        let lhpa = await models.lhpa.findOne({
          attributes: [
            'idx_t_lhpa',
            'type', 'substansi', 'procedure',
            'product', 'complaint_mapping', 'action_report',
            'checked_by_kumm', 'complaint_analysis', 'opinion',
            'conclusion', 'action'
          ],
          include: [
            {
              attributes: ['event', 'date', 'notes'],
              model: models.lhpa_events
            }
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        })

        html += `
          <p>
            <div class="title">B. RUANG LINGKUP PEMERIKSAAN ADUAN</div>
            <div>Pemeriksaan Laporan Masyarakat</div>
            <div>Nomor:</div>
            <div>
              <ol>
                <li>
                  <div>SUBSTANSI</div>
                  <div>${lhpa.getDataValue('substansi')}</div>
                </li>
                <li>
                  <div>PROSEDUR</div>
                  <div>${lhpa.getDataValue('procedure')}</div>
                </li>
                <li>
                  <div>PRODUK</div>
                  <div>${lhpa.getDataValue('product')}</div>
                </li>
              </ol>
            </div>
          </p>
        `
        let levent = lhpa.getDataValue('lhpa_events')
        let hlevent = `
          <table border="1" class="letter" width="100%">
            <tr>
              <td width="2%">No</td>
              <td width="20%">Tanggal</td>
              <td>Peristiwa</td>
              <td>Catatan/Bukti</td>
            </tr>
        `
        for (let i in levent) {
          hlevent += `
            <tr>
              <td width="2%">${(i + 1)}</td>
              <td width="20%">${moment(levent[i].date).format('DD MMM YYYY')}</td>
              <td>${levent[i].event}</td>
              <td>${levent[i].notes}</td>
            </tr>
          `
        }

        hlevent += `</table>`
        html += `
          <p>
            <div class="title">C. KRONOLOGI ADUAN</div>
            <div>${hlevent}</div>
          </p>
        `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
   * Lampiran 19 : FORMAT 14 LHPA KEGIATAN : PENCEGAHAN
   * @param {*} id 
   */
  async letter_19F14(id, flag = null) {
    try {
      let html = `<div>
        <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
          <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
          <div><span class="title">LAPORAN HASIL PEMERIKSAAN ADUAN</span></div>
          <div><span class="title">KEGIATAN: PENCEGAHAN</span></div>
        </center>
      `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            },
            {
              required: false,
              attributes: [
                [Sequelize.literal(`coalesce(complaint_decision.dmodified,complaint_decision.dcreate)`), 'dcreate']
              ],
              model: models.complaint_decisions
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname', 'phone_no'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        let clarification = await models.clarification.findOne({
          attributes: [
            'idx_t_clarification',
            'date', 'teams', 'result'
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
        let cladet = clarification instanceof models.clarification ? clarification.getDataValue('clarification_details') : [];
        cladet = cladet.map(e => e.name);
        html += `
          <table border="1" class="letter" width="100%">
            <tr>
              <td width="20%">Nomor Registrasi WBS</td>
              <td width="2%">:</td>
              <td>${c.getDataValue('form_no')}</td>
            </tr>
            <tr>
              <td width="20%">Tanggal Aduan</td>
              <td width="2%">:</td>
              <td>${moment(c.getDataValue('form_date')).format('DD MMM YYYY | HH:mm:ss')}</td>
            </tr>
            <tr>
              <td width="20%">Pengadu</td>
              <td width="2%">:</td>
              <td>${pengadu.getDataValue('fullname')}</td>
            </tr>
            <tr>
              <td width="20%">Kontak Pengadu</td>
              <td width="2%">:</td>
              <td>${pengadu.getDataValue('phone_no')}</td>
            </tr>
            <tr>
              <td width="20%">Teradu</td>
              <td width="2%">:</td>
              <td>${reported}</td>
            </tr>
            <tr>
              <td width="20%">Terperiksa</td>
              <td width="2%">:</td>
              <td>${cladet.join(', ')}</td>
            </tr>
          </table>
        `
        html += `
        <p>
          <div class="title">A. DASAR PEMIKIRAN</div>
          <ol>
            <li>Undang-Undang No. 37 Tahun 2008 tentang Ombudsman Republik Indonesia</li>
            <li>Undang-Undang No. 25 Tahun 2009 tentang Pelayanan Publik</li>
            <li>Peraturan Ombudsman RI No. 26 tahun 2017 tentang Tata Cara Penerimaan, Pemeriksaan, dan Penyelesaian Laporan</li>
            <li>Peraturan Ombudsman RI No. 27 tahun 2017 tentang Sistem Pelaporan dan Penanganan Pelanggaran Internal</li>
            <li>Putusan penanggung jawab WBS tanggal ${c.getDataValue('complaint_decisions') ? moment(c.getDataValue('complaint_decisions')['dcreate']).format('DD MMM YYYY | HH:mm:ss') : ''}</li>
            <li>Surat Tugas Kepala Keasistenan Utama Manajemen Mutu Nomor .... Tanggal .... tentang Penunjukan Tim Pemeriksa Aduan Nomor ....</li>
          </ol>
        </p>
        `
        let lhpa = await models.lhpa.findOne({
          attributes: [
            'idx_t_lhpa',
            'type', 'substansi', 'procedure',
            'product', 'complaint_mapping', 'action_report',
            'checked_by_kumm', 'complaint_analysis', 'opinion',
            'conclusion', 'action'
          ],
          include: [
            {
              attributes: ['event', 'date', 'notes'],
              model: models.lhpa_events
            }
          ],
          where: { idx_m_complaint: id, record_status: 'A' }
        })

        html += `
          <p>
            <div class="title">B. RUANG LINGKUP PEMERIKSAAN ADUAN</div>
            <div>Pemeriksaan Laporan Masyarakat</div>
            <div>Nomor:</div>
            <div>
              <ol>
                <li>
                  <div>SUBSTANSI</div>
                  <div>${lhpa.getDataValue('substansi')}</div>
                </li>
                <li>
                  <div>PROSEDUR</div>
                  <div>${lhpa.getDataValue('procedure')}</div>
                </li>
                <li>
                  <div>PRODUK</div>
                  <div>${lhpa.getDataValue('product')}</div>
                </li>
              </ol>
            </div>
          </p>
        `
        let levent = lhpa.getDataValue('lhpa_events')
        let hlevent = `
          <table border="1" class="letter" width="100%">
            <tr>
              <td width="2%">No</td>
              <td width="20%">Tanggal</td>
              <td>Peristiwa</td>
              <td>Catatan/Bukti</td>
            </tr>
        `
        for (let i in levent) {
          hlevent += `
            <tr>
              <td width="2%">${(i + 1)}</td>
              <td width="20%">${moment(levent[i].date).format('DD MMM YYYY')}</td>
              <td>${levent[i].event}</td>
              <td>${levent[i].notes}</td>
            </tr>
          `
        }

        hlevent += `</table>`
        html += `
          <p>
            <div class="title">C. KRONOLOGI ADUAN</div>
            <div>${hlevent}</div>
          </p>
        `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  // lampiran 20 hold dlu

  /**
   * Lampiran 21 : FORMAT 16 BERITA ACARA RAPAT PLENO ATAS HASIL PEMERIKSAAN PENGADUAN
   * @param {*} id 
   */
  async letter_21F16(id, flag = null) {
    try {
      let html = `<div>
        <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
          <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
          <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
          <div><span>BERITA ACARA RAPAT PLENO</span></div>
          <div><span>PEMBAHASAN HASIL PEMERIKSAAN ADUAN INTERNAL TERKAIT TUGAS PENGAWASAN PELAYANAN PUBLIK</span></div>
        </center>
      `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
        <table border="0" class="letter" width = "100%">
          <tr>  
            <td colspan="3">
              Pada hari ini ${moment().format('dddd')} tanggal ${moment().format('DD')} bulan ${moment().format('MMM')} tahun ${moment().format('YYYY')} telah dilakukan pembahasan hasil pemeriksaan aduan internal terkait  pengawasan pelayanan publik terhadap ...... Laporan Masyarakat dengan keputusan sebagai berikut
            </td>
          </tr>
          <tr>
            <td colspan="3">Demikian Berita Acara ini dibuat dengan sebenarnya.<br /></td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;">...., ${moment().format('DD MMM YYYY')}</td>
          </tr>
          <tr>
            <td style="text-align: center;">
              <div><b>Ketua</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
            <td style="text-align: center;">
              <div><b>Wakil Ketua</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
            <td style="text-align: center;">
              <div><b>Anggota</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">
              <div><b>Anggota</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
            <td style="text-align: center;">
              <div><b>Anggota</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
            <td style="text-align: center;">
              <div><b>Anggota</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">
              <div><b>Anggota</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
            <td style="text-align: center;">
              <div><b>Anggota</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
            <td style="text-align: center;">
              <div><b>Anggota</b></div>
              <div><br /><br /><br /></div>
              <div>Nama Lengkap</div>
            </td>
          </tr>
        </table >
        `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
  * Lampiran 22 : FORMAT 17 SURAT PEMBERITAHUAN PENUTUPAN PENGADUAN TIDAK TERDAPAT TEMUAN KEPADA PENGADU
  * @param {*} id 
  */
  async letter_22F17(id, flag = null) {
    try {
      let html = `<div>
            <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
              <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
            </center>
          `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
            <table border="0" class="letter" width="100%">
              <tr>
                <td width="20%">Nomor</td>
                <td width="2%">:</td>
                <td>
                  <div style="text-align: right;">
                    Tanggal ${moment().format('DD MMM YYYY')}
                  </div>
                </td>
              </tr>
              <tr>
                <td width="20%">Lampiran</td>
                <td width="2%">:</td>
                <td>-</td>
              </tr>
              <tr>
                <td width="20%">Hal</td>
                <td width="2%">:</td>
                <td>
                  Pemberitahuan Tindak Lanjut Aduan
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <div>Yth.</div>
                  <div>${pengadu.getDataValue('fullname')}</div>
                  <br />
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>Dengan hormat,</p>
                  <p>Bersama ini diberitahukan bahwa Ombudsman RI telah menerima Pengaduan dari Saudara mengenai <i>${c.getDataValue('description')}</i> terkait laporan masyarakat Nomor Register ... tanggal ... oleh Keasistenan Utama.../Perwakilan Ombudsman RI Provinsi*......</p>
                  <br />
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>
                  Setelah dilakukan pemeriksaan terhadap Aduan Saudara dan berdasarkan Rapat Pleno Ombudsman RI tanggal ............. diputuskan bahwa prosedur dan hasil (pilih salah satu atau keduanya) pemeriksaan terhadap laporan masyarakat nomor register......... telah sesuai dengan peraturan perundang-undangan yang berlaku di Ombudsman RI. Dengan demikian Aduan yang Saudara sampaikan kepada Ombudsman RI tanggal ${moment(c.getDataValue('form_date')).format('DD MMM YYYY | HH:mm:ss')} dinyatakan ditutup.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3">Atas peran aktif Saudara menyampaikan Aduan, kami ucapkan terima kasih.<br /></td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">
                  <div><b>Ketua Ombudsman Republik Indonesia</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
            </table >
            `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
  * Lampiran 23 : FORMAT 18 BERITA ACARA PENUTUPAN PENGADUAN TIDAK TERDAPAT TEMUAN
  * @param {*} id 
  */
  async letter_23F18(id, flag = null) {
    try {
      let html = `<div>
            <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
              <div><span class="title">BERITA ACARA</span></div>
              <div><span class="title">PENUTUPAN PENGADUAN</span></div>
              <div><span class="title">UNTUK KEGIATAN TELAH TERBIT PRODUK AKHIR</span></div>
              <div><span class="title">NOMOR:</span></div>
            </center>
          `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
            <table border="0" class="letter" width="100%">
              <tr>  
                <td colspan="3">
                  <p>
                    Pada hari ini ${moment().format('dddd')} tanggal ${moment().format('DD')} bulan ${moment().format('MMM')} tahun ${moment().format('YYYY')}, Rapat Pleno Anggota Ombudsman menyetujui untuk menutup Pengaduan yang terdaftar dengan Nomor WBS: ${c.getDataValue('form_no')} Tahun ..., dengan Pengadu atas nama ${pengadu.getDataValue('fullname')} mengenai ${c.getDataValue('description')}
                  </p>
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>
                    <div>Adapun alasan penutupan pengaduannya adalah:</div>
                    <ol>
                      <li></li>
                      <li></li>
                    </ol>
                  </p>
                  <p>
                    Demikian Berita Acara ini dibuat sebagai pertanggung jawaban dalam proses pemeriksaan Pengaduan, agar dapat digunakan seperlunya.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right">
                  <div>Dibuat di: ........................</div>
                  <div>Pada Tanggal: ${moment().format('DD MMM YYYY')}</div>
                </td>
              </tr>
              <tr>
                <td style="text-align: center;">
                  <div><b>Kepala Keasistenan Utama Manajemen Mutu</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
                <td></td>
                <td style="text-align: center;">
                  <div><b>Kepala Keasistenan Regional</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: center;">
                  <div>Mengetahui, <br /><b>Wakil Ketua/Anggota Ombudsman/<br />Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
            </table>
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
  * Lampiran 24 : FORMAT 19 SURAT TINDAK LANJUT PENGADUAN DENGAN TEMUAN KEPADA TERADU
  * @param {*} id 
  */
  async letter_24F19(id, flag = null) {
    try {
      let html = `<div>
            <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
              <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
            </center>
          `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
            <table border="0" class="letter" width="100%">
              <tr>
                <td width="20%">Nomor</td>
                <td width="2%">:</td>
                <td>
                  <div style="text-align: right;">
                    Tanggal ${moment().format('DD MMM YYYY')}
                  </div>
                </td>
              </tr>
              <tr>
                <td width="20%">Lampiran</td>
                <td width="2%">:</td>
                <td>-</td>
              </tr>
              <tr>
                <td width="20%">Hal</td>
                <td width="2%">:</td>
                <td>
                  Hasil Tindak Lanjut Aduan
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <div>Yth. Kepala Keasistenan Utama / Kepala Perwakilan Ombudsman RI Provinsi*....</div>
                  <br />
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>Dengan hormat,</p>
                  <p>Bersama ini diberitahukan bahwa Ombudsman RI telah menerima Pengaduan dari ${pengadu.getDataValue('fullname')} mengenai <i>${c.getDataValue('description')}</i> terkait penanganan laporan masyarakat Nomor Register ... tanggal ... oleh Keasistenan Utama.../Perwakilan Ombudsman RI Provinsi*......</p>
                  <p>
                    Berdasarkan hasil pemeriksaan oleh Keasistenan Utama Manajemen Mutu diperoleh catatan sebagai berikut:
                    <ol>
                      <li></li>
                      <li>Dst</li>
                    </ol>
                  </p>
                  <p>
                    Menindaklanjuti hal tersebut dan berdasarkan Rapat Pleno Ombudsman RI tanggal........... diputuskan bahwa Saudara dan Keasistenan yang menangani laporan dimaksud diminta menindaklanjuti hasil pemeriksaan Aduan dengan melakukan tindakan korektif sebagai berikut :
                    <ol>
                      <li></li>
                      <li>Dst</li>
                      <li>
                        Melaporkan butir kepada Kepala Keasistenan Utama Manajemen Mutu paling lambat 14 (empat belas hari) hari setelah diterimanya surat ini
                      </li>
                    </ol>
                  </p>
                  <p>
                    Untuk selanjutnya kepada Saudara dan Keasistenan yang menangani laporan agar senantiasa menindaklanjuti laporan sesuai dengan alur penyelesaian laporan sebagaimana diatur dalam Peraturan Ombudsman Nomor 26 tahun 2017 tentang Tata Cara Penerimaan, Pemeriksaan dan Penyelesaian Laporan.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3">Demikian, untuk dilaksanakan.<br /></td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">
                  <div><b>Wakil Ketua /Anggota Ombudsman/ Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: left; font-size: 10px">
                  <div>Tembusan Yth,</div>
                  <div>Saudara ${reported}</div>
                </td>
              </tr>
            </table >
            `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
  * Lampiran 25 : FORMAT 20 SURAT TINDAK LANJUT PENGADUAN DENGAN TEMUAN KEPADA PENGADU
  * @param {*} id 
  */
  async letter_25F20(id, flag = null) {
    try {
      let html = `<div>
            <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
              <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
            </center>
          `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
            <table border="0" class="letter" width="100%">
              <tr>
                <td width="20%">Nomor</td>
                <td width="2%">:</td>
                <td>
                  <div style="text-align: right;">
                    Tanggal ${moment().format('DD MMM YYYY')}
                  </div>
                </td>
              </tr>
              <tr>
                <td width="20%">Sifat</td>
                <td width="2%">:</td>
                <td>TERBATAS</td>
              </tr>
              <tr>
                <td width="20%">Lampiran</td>
                <td width="2%">:</td>
                <td>-</td>
              </tr>
              <tr>
                <td width="20%">Hal</td>
                <td width="2%">:</td>
                <td>
                  Pemberitahuan Tindak Lanjut Aduan
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <div>Yth. ${pengadu.getDataValue('fullname')}</div>
                  <br />
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>Dengan hormat,</p>
                  <p>Bersama ini diberitahukan bahwa Ombudsman RI telah menerima aduan Saudara mengenai <i>${c.getDataValue('description')}</i> terkait penanganan laporan masyarakat Nomor Register ... tanggal ... oleh Keasistenan Utama.../Perwakilan Ombudsman RI Provinsi*......</p>
                  <p>
                    Setelah dilakukan pemeriksaan terhadap Aduan Saudara dan berdasarkan Rapat Pleno Ombudsman RI tanggal.... diputuskan bahwa ....... Berkenaan hal tersebut, Keasistenan Utama Manajemen Mutu akan melakukan monitoring atas pelaksanaan tindak lanjut dimaksud.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3">Demikian, atas perhatiannya terima kasih.<br /></td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">
                  <div><b>Ketua Ombudsman Republik Indonesia</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: left; font-size: 10px">
                  <div>Tembusan Yth,</div>
                  <div>Saudara ${reported}</div>
                </td>
              </tr>
            </table >
            `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
  * Lampiran 26 : FORMAT 21 SURAT KE TERADU DENGAN DITEMBUSKAN KE PENGADU
  * @param {*} id 
  */
  async letter_26F21(id, flag = null) {
    try {
      let html = `<div>
            <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
              <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
            </center>
          `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
            <table border="0" class="letter" width="100%">
              <tr>
                <td width="20%">Nomor</td>
                <td width="2%">:</td>
                <td>
                  <div style="text-align: right;">
                    Tanggal ${moment().format('DD MMM YYYY')}
                  </div>
                </td>
              </tr>
              <tr>
                <td width="20%">Sifat</td>
                <td width="2%">:</td>
                <td>TERBATAS</td>
              </tr>
              <tr>
                <td width="20%">Lampiran</td>
                <td width="2%">:</td>
                <td>-</td>
              </tr>
              <tr>
                <td width="20%">Hal</td>
                <td width="2%">:</td>
                <td>
                  Hasil Tindak Lanjut Aduan
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <div>Yth. Kepala Keasistenan Utama/Kepala Perwakilan Ombudsman RI Provinsi</div>
                  <br />
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>Dengan hormat,</p>
                  <p>Bersama ini diberitahukan bahwa Ombudsman RI telah menerima Aduan dari ${pengadu.getDataValue('fullname')} mengenai <i>${c.getDataValue('description')}</i> terkait penanganan laporan masyarakat Nomor Register ... tanggal ... oleh Keasistenan Utama.../Perwakilan Ombudsman RI Provinsi*......</p>
                  <p>
                    Berdasarkan hasil pemeriksaan oleh Keasistenan Utama Manajemen Mutu diketahui bahwa Saudara belum menyampaikan surat/dokumen Nomor... tanggal.. tentang... kepada Pengadu. Sehubungan dengan hal tersebut dan berdasarkan Rapat Pleno Ombudsman RI tanggal ...., diputuskan bahwa Saudara dan Keasistenan yang menangani laporan dimaksud diminta untuk segera menyampaikan surat/dokumen ... kepada Pengadu dan menembuskannya kepada Kepala Keasistenan Utama Manajemen Mutu paling lambat 14 (empat belas hari) hari setelah diterimanya surat ini.
                  </p>
                  <p>
                    Untuk selanjutnya kepada Saudara dan Keasistenan yang menangani laporan agar senantiasa menindaklanjuti laporan sesuai dengan alur penyelesaian laporan sebagaimana diatur dalam Peraturan Ombudsman Nomor 26 tahun 2017 tentang Tata Cara Penerimaan, Pemeriksaan dan Penyelesaian Laporan.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3">Demikian, untuk dilaksanakan.<br /></td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">
                  <div><b>Wakil Ketua/ Anggota Ombudsman/Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: left; font-size: 10px">
                  <div>Tembusan Yth,</div>
                  <div>Saudara ${reported}</div>
                </td>
              </tr>
            </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
  * Lampiran 27 : FORMAT 22 SURAT TINDAK LANJUT PENGADUAN TIDAK TERDAPAT TEMUAN KE PENGADU
  * @param {*} id 
  */
  async letter_27F22(id, flag = null) {
    try {
      let html = `<div>
            <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
              <div><span class="title">NOTA DINAS</span></div>
              <div><span class="title">Nomor</span></div>
            </center>
          `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
            <table border="0" class="letter" width="100%">
              <tr>  
                <td>Kepada Yth,</td>
                <td>:</td>
                <td>Anggota Ombudsman Pengampu Keasistenan Utama.../Perwakilan</td>
              </tr>
              <tr>  
                <td>Dari</td>
                <td>:</td>
                <td>Anggota Ombudsman Pengampu Keasistenan Utama.../Perwakilan</td>
              </tr>
              <tr>  
                <td>Sifat</td>
                <td>:</td>
                <td>Biasa</td>
              </tr>
              <tr>  
                <td>Tanggal</td>
                <td>:</td>
                <td>${moment().format('DD MMM YYYY')}</td>
              </tr>
              <tr>  
                <td>Perihal</td>
                <td>:</td>
                <td>Pelaksanaan Tindak Lanjut Pleno</td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>Dengan hormat,</p>
                  <p>
                    Sehubungan dengan Surat Tindak Lanjut Pleno Nomor … Tanggal … yang ditujukan kepada …. Yang pada pokoknya meminta agar …. ,maka dengan ini diminta kepada Saudara dan Keasistenan Utama…/Perwakilan… untuk dapat menindaklanjuti hal dimaksud dan melaporkannya kepada Keasistenan Utama Manajemen Mutu.
                  </p>
                  <p>
                    Berdasarkan hasil pemeriksaan oleh Keasistenan Utama Manajemen Mutu diketahui bahwa Saudara belum menyampaikan surat/dokumen Nomor... tanggal.. tentang... kepada Pengadu. Sehubungan dengan hal tersebut dan berdasarkan Rapat Pleno Ombudsman RI tanggal ...., diputuskan bahwa Saudara dan Keasistenan yang menangani laporan dimaksud diminta untuk segera menyampaikan surat/dokumen ... kepada Pengadu dan menembuskannya kepada Kepala Keasistenan Utama Manajemen Mutu paling lambat 14 (empat belas hari) hari setelah diterimanya surat ini.
                  </p>
                  <p>
                    Untuk selanjutnya kepada Saudara dan Keasistenan yang menangani laporan agar senantiasa menindaklanjuti laporan sesuai dengan alur penyelesaian laporan sebagaimana diatur dalam Peraturan Ombudsman Nomor 26 tahun 2017 tentang Tata Cara Penerimaan, Pemeriksaan dan Penyelesaian Laporan.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3">Demikian, untuk dilaksanakan.<br /></td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">
                  <div><b>Wakil Ketua/ Anggota Ombudsman/Pengampu Keasistenan Utama Manajemen Mutu</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: left; font-size: 10px">
                  <div>Tembusan Yth,</div>
                  <div>Saudara ${reported}</div>
                </td>
              </tr>
            </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
  * Lampiran 28 : FORMAT 23 SURAT PERINTAH PELAKSANAAN TINDAK LANJUT PLENO
  * @param {*} id 
  */
  async letter_28F23(id, flag = null) {
    try {
      let html = `<div>
            <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
              <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
            </center>
          `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
            <table border="0" class="letter" width="100%">
              <tr>
                <td width="20%">Nomor</td>
                <td width="2%">:</td>
                <td>
                  <div style="text-align: right;">
                    Tanggal ${moment().format('DD MMM YYYY')}
                  </div>
                </td>
              </tr>
              <tr>
                <td width="20%">Sifat</td>
                <td width="2%">:</td>
                <td>TERBATAS</td>
              </tr>
              <tr>
                <td width="20%">Lampiran</td>
                <td width="2%">:</td>
                <td>-</td>
              </tr>
              <tr>
                <td width="20%">Hal</td>
                <td width="2%">:</td>
                <td>
                  Perintah Pelaksanaan Rapat Pleno
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <div>Yth. .....</div>
                  <br />
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>Dengan hormat,</p>
                  <p>
                    Bersama ini diberitahukan bahwa Keasistenan Utama Manajemen Mutu Ombudsman RI telah menerima Pengaduan dari ${pengadu.getDataValue('fullname')} mengenai <i>${c.getDataValue('description')}</i> terkait penanganan laporan masyarakat Nomor Register ... tanggal ... 
                  </p>
                  <p>
                    Berkenaan dengan hal tersebut, berdasarkan Rapat Pleno tanggal diputuskan bahwa agar Saudara menindaklanjuti berupa Terkait hal tersebut, telah disampaikan kepada Saudara terkait Surat Tindak Lanjut Pleno Ombudsman Nomor ... tanggal... yang pada intinya meminta Saudara untuk melaksanakan tindakan korektif sebagaimana dimaksud dan menyampaikan laporan tindak lanjutnya kepada Kepala Keasistenan Utama Manajemen Mutu paling lambat 14 (empat belas) hari setelah diterimanya surat dimaksud, namun sampai saat ini tindak lanjut atas Rapat Pleno dimaksud belum dilaksanakan.
                  </p>
                  <p>
                    Sehubungan dengan hal itu, maka diperintahkan kepada Saudara untuk segera melaksanakan hasil Rapat Pleno dimaksud. Apabila Saudara tetap tidak melaksanakan tanpa alasan yang patut, maka Saudara dianggap melakukan pelanggaran dan akan ditindak sesuai dengan peraturan perundang-undangan yang berlaku.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3">Demikian, untuk dilaksanakan.<br /></td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">
                  <div><b>Ketua Ombudsman Republik Indonesia</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: left; font-size: 10px">
                  <div>Tembusan Yth,</div>
                  <div>Saudara ${reported}</div>
                </td>
              </tr>
            </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },

  /**
  * Lampiran 29 : FORMAT 24 BERITA ACARA PENUTUPAN PENGADUAN KEGIATAN YANG TELAH TERBIT PRODUK AKHIR
  * @param {*} id 
  */
  async letter_29F24(id, flag = null) {
    try {
      let html = `<div>
            <center style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
              <img height="50px" width="175px" src="${API_URL}/others/logo/logo.png"></img>
              <div><span class="title">OMBUDSMAN REPUBLIK INDONESIA</span></div>
            </center>
          `;
      let c = await models.complaints.findOne(
        {
          attributes: [
            'idx_m_complaint',
            'form_no',
            'date',
            'manpower',
            'description',
            'hopes',
            ['source_complaint', 'source_name'],
            'ucreate'
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
              attributes: ['name'],
              model: models.complaint_reported,
            }
          ],
        }
      );

      if (c instanceof models.complaints) {
        let pengadu = await models.users.findOne({
          attributes: ['fullname'],
          where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
        })

        let reported = c.getDataValue('complaint_reporteds') || [];
        reported = reported.map(e => e.name)
        reported = reported.join(' , ')

        html += `
            <table border="0" class="letter" width="100%">
              <tr>
                <td width="20%">Nomor</td>
                <td width="2%">:</td>
                <td>
                  <div style="text-align: right;">
                    Tanggal ${moment().format('DD MMM YYYY')}
                  </div>
                </td>
              </tr>
              <tr>
                <td width="20%">Sifat</td>
                <td width="2%">:</td>
                <td>TERBATAS</td>
              </tr>
              <tr>
                <td width="20%">Lampiran</td>
                <td width="2%">:</td>
                <td>-</td>
              </tr>
              <tr>
                <td width="20%">Hal</td>
                <td width="2%">:</td>
                <td>
                  Pemberitahuan Penutupan Aduan
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <div>Yth. ${pengadu.getDataValue('fullname')}</div>
                  <br />
                </td>
              </tr>
              <tr>  
                <td colspan="3">
                  <p>Dengan hormat,</p>
                  <p>
                    Sehubungan dengan surat Ombudsman RI nomor..... tertanggal.... perihal Pemberitahuan Tindaklanjut Aduan, bersama ini diberitahukan bahwa telah dilakukan upaya untuk menyelesaikan Aduan Saudara. Keasistenan Utama.../Perwakilan Ombudsman RI Provinsi*... melalui surat nomor.... tertanggal.... perihal... juga telah melakukan perbaikan dengan menyampaikan.... kepada Saudara. Dengan demikian Aduan yang Saudara sampaikan kepada Ombudsman RI tanggal ${moment(c.getDataValue('form_date')).format('DD MMM YYYY | HH:mm:ss')} dinyatakan ditutup.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3">Atas peran aktif Saudara menyampaikan Aduan, kami ucapkan terima kasih.<br /></td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">
                  <div><b>Ketua Ombudsman Republik Indonesia</b></div>
                  <div><br /><br /><br /></div>
                  <div>Nama Lengkap</div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: left; font-size: 10px">
                  <div>Tembusan Yth,</div>
                  <div>Saudara ${reported}</div>
                </td>
              </tr>
            </table >
          `
      }

      html += `</div > `;
      return {
        html: html
      }
    } catch (error) {

      throw (error)
    }
  },
}