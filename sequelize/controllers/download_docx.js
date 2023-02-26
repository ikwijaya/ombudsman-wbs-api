const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../models/index');
const moment = require('moment');
const { helper } = require('../../helper')
const { API_URL } = require('../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')

module.exports = {
	letter_06F2: async (id) => {
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

			const s = await models.complaint_studies.findOne(
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
				const pengadu = await models.users.findOne({
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
							'pokok_aduan',
							'result_obtained',
							'conclusion',
							'action_plan',
							'checked_date',
							'checked_by',
							'approved_date',
							'approved_by',
							'arranged_by',
							'arranged_date',
							'dmodified'
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

				let checklist_docs = [], cdocs = `<ul>`;
				if (v.getDataValue('validation_checklists') && v.getDataValue('validation_checklists').length > 0) {
					checklist_docs = v.getDataValue('validation_checklists')
					let cd = checklist_docs.map(e => e.checklist)
					cdocs += `<li>` + cd.join(`</li><li>`) + `</li>`
				}
				cdocs += `</ul>`

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

				let is_kuasa_pelapor = c.getDataValue('is_kuasa_pelapor')
				let manpower = c.getDataValue('manpower')
				let fpengadu = pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null

				const template = fs.readFileSync('./templates/06F2.docx')
				buffer = await createReport({
					template,
					cmdDelimiter: ['{{', '}}'],
					data: {
						form_no: c.getDataValue('form_no') + moment(c.getDataValue('date')).format('DD MMM YY'),
						pengadu: is_kuasa_pelapor ? manpower : fpengadu,
						legal_standing_pengadu: c.getDataValue('legal_standing')['name'],
						teradu: reported,
						pokok_aduan: v.getDataValue('pokok_aduan'),
						hope: c.getDataValue('hopes'),
						hteradu: [hteradu],
						hpengadu: [hterlapor],
						kesimpulan_validasi: v.getDataValue('result_obtained'),
						rencana_tindak_lanjut: v.getDataValue('action_plan'),
						sign: {
							arranged_by: v.getDataValue('arranged_by'),
							arranged_date: moment(v.getDataValue('arranged_date')).format('DD MMM YYYY | HH:mm:ss'),
							checked_by: v.getDataValue('checked_by'),
							checked_date: moment(v.getDataValue('checked_date')).format('DD MMM YYYY | HH:mm:ss'),
							approved_by: v.getDataValue('approved_by'),
							approved_date: moment(v.getDataValue('approved_date')).format('DD MMM YYYY | HH:mm:ss')
						}
					}
				})

				const filename = `${c.getDataValue('form_no')}_06F2.docx`
				fs.writeFileSync(`./reports/${filename}`, buffer);
				return response.success('Your file has been generated. Click preview for check file.', { 
					filename, 
					url: API_URL+'/report/open/'+filename 
				})
			} 
			else return response.failed('We cannot create file, because data not found.')
		} catch (error) {
			console.log(error)
			throw (error)
		}
	}
}
