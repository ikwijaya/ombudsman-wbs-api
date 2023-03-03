const { models } = require('../..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../../models/index');
const moment = require('moment');
const { helper } = require('../../../helper')
const { API_URL } = require('../../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')

/**
 * 
 * @param {*} id 
 * @returns 
 */
const letter_06F2 = async (id) => {
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
			const v = await models.validation.findOne(
				{
					attributes: [
						'prevention', 'product', 'step', 'date', 'pokok_aduan', 'result_obtained',
						'conclusion', 'action_plan', 'checked_date', 'checked_by', 'approved_date',
						'approved_by', 'arranged_by', 'arranged_date', 'dmodified', 'simple_app_no', 'scope'
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

			///// checklist document
			const ckl = await models.options
				.findAll({ attributes: ['value'], where: { option_id: '5' } })

			let checklist = []
			if (v.getDataValue('validation_checklists') && v.getDataValue('validation_checklists').length > 0) {
				let cl = v.getDataValue('validation_checklists')
				cl = cl.map(e => e.checklist)
				
				for (let i in ckl) {
					const v = ckl[i].getDataValue('value')
					checklist.push({ is: cl.includes(v) ? 'X' : '', value: v })
				}
			}

			const comms = v.getDataValue('validation_comms') || [];
			const terlapor = comms.filter(e => e.by == 'PENGADU');
			const teradu = comms.filter(e => e.by == 'TERADU');
			let hterlapor = []
			let hteradu = []

			for (let i in terlapor) {
				hteradu.push({
					time: `Melalui: ${terlapor[i].media} pada ${moment(terlapor[i].date).format('DD MMM YYYY | HH:mm:ss')}`,
					notes: terlapor[i].notes
				})
				hterlapor.push(w)
			}

			for (let i in teradu) {
				hteradu.push({
					time: `Melalui: ${teradu[i].media} pada ${moment(teradu[i].date).format('DD MMM YYYY | HH:mm:ss')}`,
					notes: teradu[i].notes
				})
			}

			arranged_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('arranged_by') } })
			approved_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('approved_by') } })
			checked_by = await models.users.findOne({ where: { idx_m_user: v.getDataValue('checked_by') } })

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

			let vstep = v.getDataValue('step') ? JSON.parse(v.getDataValue('step')) : [];
			vstep = vstep.map(e => e.value)
			const baseSteps = await models.options
				.findAll({ attributes: ['value'], where: { option_id: '4' } })

			let stepHtml = []
			for (let i in baseSteps) {
				const v = baseSteps[i].getDataValue('value')
				stepHtml.push({ is: vstep.includes(v) ? 'X' : '', value: v })
			}

			const is_kuasa_pelapor = c.getDataValue('is_kuasa_pelapor')
			const manpower = c.getDataValue('manpower')
			const fpengadu = pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null

			const template = fs.readFileSync('./templates/06F2.docx')
			buffer = await createReport({
				template,
				cmdDelimiter: ['{{', '}}'],
				data: {
					form_no: c.getDataValue('form_no') +' pada '+ moment(c.getDataValue('date')).format('DD MMM YY'),
					pengadu: is_kuasa_pelapor ? manpower : fpengadu,
					legal_standing_pengadu: c.getDataValue('legal_standing')['name'],
					teradu: reported,
					pokok_aduan: v.getDataValue('pokok_aduan'),
					tahapan: stepHtml,
					simple_no: std.getDataValue('simple_app_no'),
					is_pemeriksaan: !v.getDataValue('scope') ? '' 
						: v.getDataValue('scope').toLowerCase() == '1' ? 'X' : '',
					is_pencegahan: !v.getDataValue('scope') ? '' 
						: v.getDataValue('scope').toLowerCase() == '2' ? 'X' : '',
					pencegahan: v.getDataValue('prevention'),
					is_substansi: product.includes('substansi') ? 'X' : '',
					is_prosedur: product.includes('prosedur') ? 'X' : '',
					is_produk: product.includes('produk') ? 'X' : '',
					hope: c.getDataValue('hopes'),
					ckls: checklist,
					hpengadu: hterlapor,
					hteradu: hteradu,
					kesimpulan_validasi: v.getDataValue('conclusion'),
					rencana_tindak_lanjut: v.getDataValue('action_plan'),

					////
					arranged_by: v.getDataValue('arranged_by'),
					arranged_date: v.getDataValue('arranged_date') 
						? moment(v.getDataValue('arranged_date')).format('DD MMM YYYY | HH:mm:ss') : '',
					checked_by: v.getDataValue('checked_by'),
					checked_date: v.getDataValue('checked_date') 
						? moment(v.getDataValue('checked_date')).format('DD MMM YYYY | HH:mm:ss') : '',
					approved_by: v.getDataValue('approved_by'),
					approved_date: v.getDataValue('approved_date') 
						? moment(v.getDataValue('approved_date')).format('DD MMM YYYY | HH:mm:ss') : ''
				}
			})

			const filename = `${c.getDataValue('form_no')}_06F2.docx`
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

module.exports = letter_06F2
