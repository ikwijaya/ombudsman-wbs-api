const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const { APP_CODE, PRODUCT_MODE, API_URL } = require('../../config')

module.exports = {
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

      let plenos = obj.data;
      await models.complaint_pleno.bulkCreate(obj.data, { transaction: t });

      for (let i = 0; i < plenos.length; i++) {
        await models.complaints.update(
          { idx_m_status: 15 }, // to Penyampaian tindak lanjut
          {
            transaction: t,
            where: { idx_m_complaint: plenos[i].idx_m_complaint }
          }
        )

        // surat request pengadu | to, address, by, object | get pengadu dari m_complaint
        let pengadu; let teradu = [];
        let complaint = await models.complaints.findOne({
          attributes: ['manpower', 'description', 'ucreate', 'hopes', 'idx_m_legal_standing'],
          include: [
            {
              attributes: [
                'idx_t_complaint_study'
              ],
              model: models.complaint_studies,
              include: [{
                attributes: ['name', 'occupation'],
                model: models.complaint_study_reported,
                include: [
                  {
                    attributes: ['name'],
                    model: models.work_units
                  }
                ]
              }],
              where: { record_status: 'A' }
            },
          ],
          where: { idx_m_complaint: plenos[i].idx_m_complaint }
        })

        if (complaint instanceof models.complaints) {
          teradu = complaint.getDataValue('complaint_study')['complaint_study_reporteds'].map(e => e.name) || [];
          pengadu = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], where: { idx_m_user: complaint.getDataValue('ucreate') } })
          let getPengadu = complaint.getDataValue('idx_m_legal_standing') == -1 ? complaint.getDataValue('manpower') :
            complaint['ucreate'] = pengadu instanceof models.users ? pengadu.getDataValue('name') : null

          // get tim pemeriksa
          let pemeriksa = await models.complaint_determination_users.findAll(
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
                  where: { idx_m_complaint: plenos[i].idx_m_complaint }
                }
              ]
            }
          )
          let getPemeriksa = ``;
          for (let i = 0; i < pemeriksa.length; i++) {
            getPemeriksa += `<li>${pemeriksa[i]['user.fullname']}</li>`
          }

          // auto generate penyampaian tindak lanjut
          await models.delivery.bulkCreate([
            {
              idx_m_complaint: plenos[i].idx_m_complaint,
              type: 'PENGADU',
              by: teradu.join(' , '),
              to: getPengadu,
              object: complaint.getDataValue('description'),
              address: 'tempat',
              desc: null
            },
            {
              idx_m_complaint: plenos[i].idx_m_complaint,
              type: 'TERADU',
              to: teradu.join(' , '),
              by: getPengadu,
              object: complaint.getDataValue('description'),
              address: 'tempat',
              desc: null
            },
          ], { transaction: t })

          await models.clogs.create({
            idx_m_complaint: plenos[i].idx_m_complaint,
            action: 'I',
            flow: '14',
            changes: JSON.stringify(plenos[i]),
            ucreate: sessions[0].user_id
          }, { transaction: t, });
        }
      }

      await t.commit()
      return response.success('Berhasil menyimpan data hasil Rapat Pleno')
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw (error)
    }
  },

  /**
   * 
   * @param {*} sid 
   * @param {*} keyword 
   * @param {*} status_code 
   * @param {*} id 
   * @returns 
   */
  async load(sid = null, id = []) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return [];

      let users = []
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
          where: { idx_m_complaint: { [Op.in]: id } },
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

      return { items: complaint };
    } catch (err) {
      console.log(err)
      throw (err)
    }
  },
}