const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const { API_URL } = require('../../config')

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   */
  async next(sid, obj = {}){
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      let idx_m_complaint = obj.data.idx_m_complaint || [];
      delete obj.data.idx_m_complaint;
      await models.complaint_pleno.update(obj.data,
        { 
          where: { idx_m_complaint: { [Op.in]: idx_m_complaint } },
          transaction: t 
        })

      let where = {};
      where['idx_m_complaint'] = {[Op.in]: idx_m_complaint};
      where['date'] = { [Op.eq]: null };

      let count = await models.complaint_pleno.count({ where: where, transaction: t });
      if (count > 0) return response.failed(`<ul><li>` + ['Kolom tanggal rapat pleno TIDAK boleh kosong.'].join('</li><li>') + `</li></ul>`)

      // to Penyampaian Tindak Lanjut
      await models.complaints.update({ idx_m_status: 15 }, { transaction: t, where: { idx_m_complaint: {[Op.in]: idx_m_complaint} } })
      let logs = []
      for(let i=0; i<idx_m_complaint.length; i++){
        logs.push({
          idx_m_complaint: idx_m_complaint[i],
          action: 'U',
          flow: '15',
          changes: JSON.stringify(obj),
          ucreate: sessions[0].user_id,
          notes: 'telah melanjutkan ke flow selanjutnya (penyampaian tindak lanjut)'
        })
      }

      for (let i = 0; i < idx_m_complaint.length; i++) {
        let pengadu; let teradu = [];
        let complaint = await models.complaints.findOne({
          attributes: ['manpower', 'description', 'ucreate', 'hopes', 'idx_m_legal_standing'],
          where: { idx_m_complaint: idx_m_complaint[i] },
          transaction: t
        })
        let studies = await models.complaint_studies.findOne({
          attributes: ['idx_m_complaint'],
          include: [
            {
              attributes: ['name', 'occupation'],
              model: models.complaint_study_reported
            },
          ],
          where: { idx_m_complaint: idx_m_complaint[i] },
        })

        if (complaint instanceof models.complaints) {
          teradu = studies.getDataValue('complaint_study_reporteds').map(e => `${e.name} - ${e.occupation ? e.occupation : '--'}`) || [];
          pengadu = await models.users.findOne({ attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']], transaction: t, where: { idx_m_user: complaint.getDataValue('ucreate') } })
          let getPengadu = complaint.getDataValue('idx_m_legal_standing') == -1 ? complaint.getDataValue('manpower') :
            complaint['ucreate'] = pengadu instanceof models.users ? pengadu.getDataValue('name') : null

          // auto generate penyampaian tindak lanjut
          await models.delivery.bulkCreate([
            {
              idx_m_complaint: idx_m_complaint[i],
              type: 'PENGADU',
              by: teradu.join(' , '),
              to: getPengadu,
              object: complaint.getDataValue('description'),
              address: 'tempat',
              desc: null
            },
            {
              idx_m_complaint: idx_m_complaint[i],
              type: 'TERADU',
              to: teradu.join(' , '),
              by: getPengadu,
              object: complaint.getDataValue('description'),
              address: 'tempat',
              desc: null
            },
          ], { transaction: t })

          await models.clogs.create({
            idx_m_complaint: idx_m_complaint[i],
            action: 'I',
            flow: '14',
            changes: JSON.stringify(idx_m_complaint[i]),
            ucreate: sessions[0].user_id
          }, { transaction: t, });
        }
      }

      await models.clogs.bulkCreate(logs,{ transaction: t })
      await t.commit()
      return response.success('Berhasil ke proses selanjutnya')
    } catch (error) {
      await t.rollback()
      console.log('error', error)
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} id 
   * @returns 
   */
  async get(sid = null, id = null){
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let m = await models.complaint_pleno.findOne({
        attributes: ['date', 'result', 'notes', 'pengadu', 'form_no'],
        where: { idx_m_complaint: id }
      })

      return { item: m };
    } catch (err) {
      throw (err)
    }
  },
  /**
   * 
   * @param {*} sid 
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
            {
              required: true,
              model: models.surgery,
              where: { approved_date: { [Op.ne]: null } }
            }
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
      throw (err)
    }
  },
}