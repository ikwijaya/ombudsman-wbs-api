const { models } = require('../..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../../models/index');
const moment = require('moment');
const { helper } = require('../../../helper')
const { API_URL } = require('../../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')
const fname = '14'

/**
 * 
 * @param {*} id 
 * @returns 
 */
const letter_14 = async (id, flag=null) => {
	try {
		let buffer;
		const c = await models.complaints.findOne(
			{
				attributes: [
					'idx_m_complaint',
					'form_no',
					'date',
					'manpower',
					'description',
					'hopes',
					['source_complaint', 'source_name'],
					[Sequelize.literal(`case when complaints.idx_m_legal_standing = -1 then true else false end`), 'is_kuasa_pelapor'],
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

		if (c instanceof models.complaints) {
			const pengadu = await models.users.findOne({
				attributes: ['fullname'],
				where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }
			})

			const csr = await models.complaint_study_reported.findAll({
				raw: true,
				attributes: ['name', 'identity_no', 'occupation'],
				where: { record_status: 'A' },
				include: [
					{
						required: true,
						attributes: [],
						model: models.complaint_studies,
						where: { record_status: 'A', idx_m_complaint: c instanceof models.complaints ? c.getDataValue('idx_m_complaint') : null }
					}
				]
			});

			const std = await models.complaint_studies.findOne({
				attributes: ['simple_app_no'],
				where: { record_status: 'A', idx_m_complaint: c instanceof models.complaints ? c.getDataValue('idx_m_complaint') : null }
			})

			const rpt = csr.map(e => e.name)
			const reported = rpt.join(',');
			const v = await models.validation.findOne({
				attributes: ['pokok_aduan'],
				where: { record_status: 'A', idx_m_complaint: c instanceof models.complaints ? c.getDataValue('idx_m_complaint') : null }
			})

			// lhpa
			let arranged_by, approved_by, checked_by;
			const lhpa = await models.lhpa.findOne(
				{
					attributes: [
						'type', 'substansi', 'product', 'procedure', 'head_of_kumm', 'fakta',
						'analisis_pemeriksaan', 'pendapat_pemeriksa', 'kesimpulan_pemeriksa',
						'tindak_lanjut', 'checked_date', 'checked_by', 'approved_date',
						'approved_by', 'arranged_by', 'arranged_date', 'dmodified'
					],
					include: [
						{
							required: false,
							attributes: ['type', 'title', 'by'],
							model: models.lhpa_actions,
							include: [
								{
									required: false,
									attributes: [
										'sort','step','date','notes',
										[Sequelize.literal(`case when is_checklist=true then '✔' else '' end`), 'is_checklist']
									],
									model: models.lhpa_act_detail,
									order: [
										[models.lhpa, models.lhpa_actions, {model: models.lhpa_act_detail},'sort', 'desc'],
									]
								}
							]
						}
					],
					where: { record_status: 'A', idx_m_complaint: id, type: flag }
				}
			)

			arranged_by = await models.users.findOne({ where: { idx_m_user: lhpa.getDataValue('arranged_by') } })
			approved_by = await models.users.findOne({ where: { idx_m_user: lhpa.getDataValue('approved_by') } })
			checked_by = await models.users.findOne({ where: { idx_m_user: lhpa.getDataValue('checked_by') } })

			lhpa['arranged_by'] = arranged_by instanceof models.users ? arranged_by.getDataValue('email') : null
			lhpa['approved_by'] = approved_by instanceof models.users ? approved_by.getDataValue('email') : null
			lhpa['checked_by'] = checked_by instanceof models.users ? checked_by.getDataValue('email') : null

			const is_kuasa_pelapor = c.getDataValue('is_kuasa_pelapor')
			const manpower = c.getDataValue('manpower')
			const fpengadu = pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null

			const st = await models.complaint_determinations
				.findOne({ attributes: ['st_number', 'date'], where: { idx_m_complaint: id } });
			
			const actions = JSON.parse(JSON.stringify(lhpa.getDataValue('lhpa_actions')))
			// console.log(`actions`, actions[0])
			// console.log(`actions`, actions[0]['lhpa_act_details'])

			////// config data for excel input
			const template = fs.readFileSync(`./templates/${fname}.docx`)
			buffer = await createReport({
				template,
				cmdDelimiter: ['{{', '}}'],
				data: {
					type: lhpa.getDataValue('type'),
					form_no: c.getDataValue('form_no'),
					created_at: moment(c.getDataValue('date')).format('DD MMM YY'),
					pengadu: is_kuasa_pelapor ? manpower : fpengadu,
					address: null,
					no_telp: null,
					kontak_pengadu: null,
					teradu: reported,
					list_terperiksa: null,

					//// Bag. A & B
					st_number: st.getDataValue('st_number').toString(),
					st_date: moment(st.getDataValue('date')).format('DD MMM YY'),
					simple_no: std.getDataValue('simple_app_no'),
					is_sub1: lhpa.getDataValue('substansi') && lhpa.getDataValue('type') == 'PENYELESAIAN' ? '✔' : '',
					is_pro1: lhpa.getDataValue('procedure') && lhpa.getDataValue('type') == 'PENYELESAIAN' ? '✔' : '',
					is_prd1: lhpa.getDataValue('product') && lhpa.getDataValue('type') == 'PENYELESAIAN' ? '✔' : '',
					is_sub2: lhpa.getDataValue('substansi') && lhpa.getDataValue('type') == 'PENCEGAHAN' ? '✔' : '',
					is_pro2: lhpa.getDataValue('procedure') && lhpa.getDataValue('type') == 'PENCEGAHAN' ? '✔' : '',
					is_prd2: lhpa.getDataValue('product') && lhpa.getDataValue('type') == 'PENCEGAHAN' ? '✔' : '',
				
					//// Bag. C & D
					kr_ad: [],
					legal_standing: c.getDataValue('legal_standing')['name'],
					layanan: c.getDataValue('source_name'),
					pokok_aduan: v.getDataValue('pokok_aduan'),
					hopes: c.getDataValue('hopes'),
					
					////// Bag. E -> J
					tindak_lanjut_lm: actions.filter(e => e.type == 'E')
						.map(e => ({...e, lhpa_act_details: e.lhpa_act_details.sort((a,b) => a.sort - b.sort) })),
					pemeriksaan_aduan: actions.filter(e => e.type == 'F')
						.map(e => ({...e, lhpa_act_details: e.lhpa_act_details.sort((a,b) => a.sort - b.sort) })),
					fakta: lhpa.getDataValue('fakta'),
					analisis_pemeriksaan: lhpa.getDataValue('analisis_pemeriksaan'),
					pendapat_pemeriksa: lhpa.getDataValue('pendapat_pemeriksa'),
					kesimpulan_pemeriksa: lhpa.getDataValue('kesimpulan_pemeriksa'),
					tindak_lanjut: lhpa.getDataValue('tindak_lanjut'),

					//// SIGN
					arranged_by: lhpa.getDataValue('arranged_by'),
					arranged_date: lhpa.getDataValue('arranged_date') 
						? moment(lhpa.getDataValue('arranged_date')).format('DD MMM YYYY | HH:mm:ss') : '',
					checked_by: lhpa.getDataValue('checked_by'),
					checked_date: lhpa.getDataValue('checked_date') 
						? moment(lhpa.getDataValue('checked_date')).format('DD MMM YYYY | HH:mm:ss') : '',
					approved_by: lhpa.getDataValue('approved_by'),
					approved_date: lhpa.getDataValue('approved_date') 
						? moment(lhpa.getDataValue('approved_date')).format('DD MMM YYYY | HH:mm:ss') : ''
				}
			})

			const filename = `${c.getDataValue('form_no')}_${fname}.docx`
			fs.writeFileSync(`./reports/${filename}`, buffer);
			return response.success('Your file has been generated. Click preview for check file.', {
				filename,
				url: API_URL + '/report/open/' + filename
			})
		}
		else return response.failed('We cannot create file, because data not found.')
	} catch (error) {
		console.log(error)
		throw (error)
	}
}

module.exports = letter_14
