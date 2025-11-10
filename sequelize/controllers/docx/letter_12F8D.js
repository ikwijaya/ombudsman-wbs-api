const { models } = require('../..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../../models/index');
const moment = require('moment');
const { helper } = require('../../../helper')
const { API_URL } = require('../../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')
const fname = '12F8D'

/**
 * 
 * @param {*} id 
 * @returns 
 */
const letter_12F8D = async (id, flag) => {
	try {
		let buffer;
		const where = { idx_m_complaint: id, record_status: 'A', idx_t_delivery: flag };

		if (flag && typeof (flag) == 'object') {
			for (const key in flag) { where[key] = flag[key]; }
		}

		const c = await models.complaints.findOne({ attributes: ['form_no','ucreate'], where: { idx_m_complaint: id },})
		const pengadu = await models.users.findOne({ attributes: ['fullname'], where: { idx_m_user: parseInt(c.getDataValue('ucreate')) }})
		const fpengadu = pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null
		const pleno = await models.complaint_pleno.findOne({ attributes: ['date'], where: { idx_m_complaint: id }})
		const items = await models.delivery.findAll({
			raw: true,
			attributes: [
				'type', 'isWithFact', 'action', 'to', 
				'address', 'by', 'object', 'desc', 
				'letter_no', 'letter_date'
			],
			where: where
		})

		for (let i = 0; i < items.length; i++) {
			const k = items[i]
			const template = fs.readFileSync(`./templates/${fname}.docx`)
			buffer = await createReport({
				template,
				cmdDelimiter: ['{{', '}}'],
				data: {
					no_surat: k.letter_no,
					tanggal_surat: k.letter_date ? moment(k.letter_date).format('DD MMM YYYY | HH:mm:ss') : '',
					to: k.to,
					address: k.address,
					pengadu: fpengadu,
					object: k.object,
					laporan_masyarakat: null,
					rapat_pleno_date: pleno ? moment(pleno.getDataValue('date')).format('DD MMM YYYY | HH:mm:ss') : '',
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

module.exports = letter_12F8D
