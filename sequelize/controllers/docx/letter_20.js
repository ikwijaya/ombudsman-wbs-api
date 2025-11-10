const { models } = require('../..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../../models/index');
const moment = require('moment');
const { helper } = require('../../../helper')
const { API_URL } = require('../../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')
const fname = '20'

/**
 * 
 * @param {*} id 
 * @returns 
 */
const letter_20 = async (id, flag) => {
	try {
		let buffer;
		const c = await models.complaints
			.findOne({ attributes: ['form_no', 'date'], where: { idx_m_complaint: id } });

		const complaint = await models.complaints.findAll(
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
						attributes: ['pokok_aduan'],
						model: models.validation,
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

		const users = await models.users.findAll(
			{
				attributes: ['fullname', 'idx_m_user'],
				where: {
					idx_m_user: {
						[Op.in]: complaint.filter(e => e.legal_standing.idx_m_legal_standing !== -1).map(e => parseInt(e.ucreate))
					}
				}
			}
		)

		const items = JSON.parse(JSON.stringify(complaint))
		items.map(async e => {
			if (e.legal_standing && e.legal_standing.idx_m_legal_standing == -1) { e.pengadu = e.manpower; }
			else {
				let filter_pengadu = users.filter(a => a.idx_m_user == parseInt(e.ucreate))
				e.pengadu = filter_pengadu.length > 0 ? filter_pengadu[0].fullname : null
			}
		})

		const template = fs.readFileSync(`./templates/${fname}.docx`)
		buffer = await createReport({
			template,
			cmdDelimiter: ['{{', '}}'],
			data: {
				items: items
			}
		})

		const filename = `${c.getDataValue('form_no')}_${fname}.docx`
		fs.writeFileSync(`./reports/${filename}`, buffer);
		return response.success('Your file has been generated. Click preview for check file.', {
			filename,
			url: API_URL + '/report/open/' + filename
		})
		// return response.failed('We cannot create file, because data not found.')
	} catch (error) {
		console.log(error)
		throw (error)
	}
}

module.exports = letter_20
