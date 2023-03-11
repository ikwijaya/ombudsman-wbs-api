const { models } = require('../..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../../models/index');
const moment = require('moment');
const { helper } = require('../../../helper')
const { API_URL } = require('../../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')
const fname = '99X'

/**
 * 
 * @param {*} id 
 * @returns 
 */
const letter_99X = async (id, flag) => {
	try {
		let buffer;
		const c = await models.complaints
			.findOne({ attributes: ['form_no', 'date', 'dcreate', 'ucreate'], where: { idx_m_complaint: id } });

		const decision = await models.complaint_decisions.findOne({ attributes: ['idx_m_violation'], where: { idx_m_complaint: id } });
		const pengadu = await models.users.findOne({ attributes: ['fullname'], where: { idx_m_user: parseInt(c.getDataValue('ucreate')) } })
		const fpengadu = pengadu instanceof models.users ? pengadu.getDataValue('fullname') : null
		const pleno = await models.complaint_pleno.findOne({ attributes: ['date'], where: { idx_m_complaint: id } })
		let m = await models.closing.findOne({
			raw: true,
			attributes: [
				'head_of_kumm', 'head_of_region', 'user_kumm', 'head_of_wbs',
				'to', 'by', 'object', 'reason', 'ba_no', 'closing_no',
				[Sequelize.literal(`to_char(closing.ba_date, 'YYYY-MM-DD')`), 'ba_date'],
				[Sequelize.literal(`to_char(closing.closing_date, 'YYYY-MM-DD')`), 'closing_date'],
				[Sequelize.literal(`to_char(closing.checked_date, 'DD-MM-YYYY HH24:MI:SS')`), 'checked_date'], 'checked_by',
				[Sequelize.literal(`to_char(closing.approved_date, 'DD-MM-YYYY HH24:MI:SS')`), 'approved_date'], 'approved_by',
				[Sequelize.literal(`to_char(closing.arranged_date, 'DD-MM-YYYY HH24:MI:SS')`), 'arranged_date'], 'arranged_by'
			],
			where: { idx_m_complaint: id, record_status: 'A' }
		})

		if (m) {
			const users = await models.users.findAll({ raw: true, attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name'], 'idx_m_user'], where: { idx_m_user_type: { [Op.ne]: -1 } } })
			m.arranged_by_name = users.filter(a => a['idx_m_user'] == m['arranged_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['arranged_by'])[0].name : null
			m.approved_by_name = users.filter(a => a['idx_m_user'] == m['approved_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['approved_by'])[0].name : null
			m.checked_by_name = users.filter(a => a['idx_m_user'] == m['checked_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['checked_by'])[0].name : null

			if (decision instanceof models.complaint_decisions) {
				let violation = decision.getDataValue('idx_m_violation') || null
				if (['5', '9'].includes(violation)) { m.violation = 'MASIH DALAM PROSES' }
				if (['10'].includes(violation)) { m.violation = 'TELAH TERBIT PRODUK AKHIR' }
			}
		}

		const template = fs.readFileSync(`./templates/${fname}.docx`)
		buffer = await createReport({
			template,
			cmdDelimiter: ['{{', '}}'],
			data: {
				ba_no: m.ba_no,
				today: moment().format('DD MMM YYYY'),
				pleno_date: moment(pleno.getDataValue('date')).format('DD MMM YYYY'),
				form_no: c.getDataValue('form_no'),
				get_year: moment(c.getDataValue('dcreate')).format('YYYY'),
				object: m.object,
				place: null,
				ba_date: m.ba_date,
				kegiatan: m.violation,
				pengadu: fpengadu,

				////// sign
				arranged_by: m.arranged_by_name,
				arranged_date: m.arranged_date,
				checked_by: m.checked_by_name,
				checked_date: m.checked_date,
				approved_by: m.approved_by_name,
				approved_date: m.approved_date
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

module.exports = letter_99X
