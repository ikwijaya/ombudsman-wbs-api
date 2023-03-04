const { models } = require('../..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../../models/index');
const moment = require('moment');
const { helper } = require('../../../helper')
const { API_URL } = require('../../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')
const fname = '14F9'

/**
 * 
 * @param {*} id 
 * @returns 
 */
const letter_14F9 = async (id) => {
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


			// validation
			let arranged_by, approved_by, checked_by;
			const v = await models.study_lys.findOne(
				{
					attributes: [ 'idx_t_study_lys',
						'manpower', 'prevention', 'description', 'scope', 'simpel_app_no',
						'prevention', 'procedure', 'product', 'hopes', 'scope_clarification',
						'action', 'others_clarification', 'others_action', 'checked',
						'arranged_by', 'arranged_date', 'head_of_reg', 'head_of_reg_date',
						'head_of_kumm', 'head_of_kumm_date'
					],
					where: { record_status: 'A', idx_m_complaint: id }
				}
			)

			const kr = await models.study_lys_event.findAll({
				raw: true,
				attributes: ['event', 'date', 'notes'],
				where: { idx_t_study_lys: v.getDataValue('idx_t_study_lys'), record_status: 'A' },
				order: [['date', 'desc']]
			})

			arranged_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('arranged_by') } })
			approved_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('head_of_reg') } })
			checked_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('head_of_kumm') } })

			v['arranged_by'] = arranged_by instanceof models.users ? arranged_by.getDataValue('email') : null
			v['approved_by'] = approved_by instanceof models.users ? approved_by.getDataValue('email') : null
			v['checked_by'] = checked_by instanceof models.users ? checked_by.getDataValue('email') : null

			////// produk, substansi, prosedur
			let product = !v.getDataValue('product') ? [] : JSON.parse(v.getDataValue('product'))
			product = product.map(e => {
				if(e.value) {
					return e.value.toLowerCase()
				}
			})

			const is_kuasa_pelapor = c.getDataValue('is_kuasa_pelapor')
			const manpower = c.getDataValue('manpower')
			const fpengadu = pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null

			const template = fs.readFileSync(`./templates/${fname}.docx`)
			buffer = await createReport({
				template,
				cmdDelimiter: ['{{', '}}'],
				data: {
					form_no: c.getDataValue('form_no'),
					created_at: moment(c.getDataValue('date')).format('DD MMM YY'),
					pengadu: is_kuasa_pelapor ? manpower : fpengadu,
					legal_standing_pengadu: c.getDataValue('legal_standing')['name'],
					teradu: reported,
					pokok_aduan: null,
					simple_no: std.getDataValue('simple_app_no'),
					is_pemeriksaan: !v.getDataValue('scope') ? '' 
						: v.getDataValue('scope').toLowerCase() == '1' ? '✔' : '',
					is_pencegahan: !v.getDataValue('scope') ? '' 
						: v.getDataValue('scope').toLowerCase() == '2' ? '✔' : '',
					pencegahan: v.getDataValue('prevention'),
					is_substansi: product.includes('substansi') ? '✔' : '',
					is_prosedur: product.includes('prosedur') ? '✔' : '',
					is_produk: product.includes('produk') ? '✔' : '',
					hope: c.getDataValue('hopes'),
					kronologi: kr,
					pokok_klarifikasi: v.getDataValue('scope_clarification'),
					klarifikasi_lainnya: v.getDataValue('others_clarification'),
					opsi_tindak_lanjut: v.getDataValue('others_action'),
					terperiksa: v.getDataValue('checked'),

					////
					arranged_by: v.getDataValue('arranged_by'),
					arranged_date: v.getDataValue('arranged_date') 
						? moment(v.getDataValue('arranged_date')).format('DD MMM YYYY | HH:mm:ss') : '',
					checked_by: v.checked_by,
					checked_date: v.getDataValue('head_of_reg_date') 
						? moment(v.getDataValue('head_of_reg_date')).format('DD MMM YYYY | HH:mm:ss') : '',
					approved_by: v.approved_by,
					approved_date: v.getDataValue('head_of_kumm_date') 
						? moment(v.getDataValue('head_of_kumm_date')).format('DD MMM YYYY | HH:mm:ss') : ''
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

module.exports = letter_14F9
