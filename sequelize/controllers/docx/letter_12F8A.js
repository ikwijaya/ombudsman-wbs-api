const { models } = require('../..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../../models/index');
const moment = require('moment');
const { helper } = require('../../../helper')
const { API_URL } = require('../../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')
const fname = '12F8A'

/**
 * 
 * @param {*} id 
 * @returns 
 */
const letter_12F8A = async (id, flag) => {
	try {
		let buffer;
		const where = { idx_m_complaint: id, record_status: 'A', mode: 'TERADU' };

		if (flag && typeof (flag) == 'object') {
			for (const key in flag) { where[key] = flag[key]; }
		}

		const c = await models.complaints.findOne({ attributes: ['form_no', 'date'], where: { idx_m_complaint: id },})
		const items = await models.request.findAll({
			raw: true,
			attributes: [
				'by', 'date', 'media', 'notes', 'to', 'address',
				'object', 'imagine', 'docs', 'approver', 'mode',
				'checked_date', 'checked_by', 'approved_date', 'letter_no', 'letter_date',
				'approved_by', 'arranged_by', 'arranged_date', 'dmodified'
			],
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
			const k = items[i]
			const template = fs.readFileSync(`./templates/${fname}.docx`)
			buffer = await createReport({
				template,
				cmdDelimiter: ['{{', '}}'],
				data: {
					form_no: c.getDataValue('form_no'),
					created_at: moment(c.getDataValue('date')).format('DD MMM YY'),
					to: k.to,
					address: k.address,
					object: k.object,
					by: k.by,
					imagine: k.imagine,
					docs: k.docs,
					approver_name: k.approver_name,
					no_surat: k.letter_no,
					tanggal_surat: moment(k.letter_date).format('DD MMM YY'),

					////
					arranged_by: k.arranged_by,
					arranged_date: k.arranged_date
						? moment(k.arranged_date).format('DD MMM YYYY | HH:mm:ss') : '',
					checked_by: k.checked_by,
					checked_date: k.checked_date
						? moment(k.checked_date).format('DD MMM YYYY | HH:mm:ss') : '',
					approved_by: k.approved_by,
					approved_date: k.approved_date
						? moment(k.approved_date).format('DD MMM YYYY | HH:mm:ss') : ''
				}
			})

			const filename = `${c.getDataValue('form_no')}_${fname}.docx`
			fs.writeFileSync(`./reports/${filename}`, buffer);
			return response.success('Your file has been generated. Click preview for check file.', {
				filename,
				url: API_URL + '/report/open/' + filename
			})
		}

		// }
		// else return response.failed('We cannot create file, because data not found.')
	} catch (error) {
		console.log(error)
		throw (error)
	}
}

module.exports = letter_12F8A
