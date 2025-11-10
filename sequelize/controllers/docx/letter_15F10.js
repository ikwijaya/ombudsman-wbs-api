const { models } = require('../..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const { response } = require('../../../models/index');
const moment = require('moment');
const { helper } = require('../../../helper')
const { API_URL } = require('../../../config')
const fs = require('fs')
const { createReport } = require('docx-templates')
const fname = '15F10'

/**
 * 
 * @param {*} id 
 * @returns 
 */
const letter_15F10 = async (id, flag) => {
	try {
		let buffer;
		const c = await models.complaints
			.findOne({ attributes: ['form_no', 'date'], where: { idx_m_complaint: id } });

		if(c instanceof models.complaints) {
			const st = await models.complaint_determinations
				.findOne({ attributes: ['st_number', 'date'], where: { idx_m_complaint: id } });

			const cla = await models.clarification
				.findOne({ 
					attributes: [
						'date', 'teams', 'result', 'to', 'by', 'address', 'approver',
						'meet_date', 'meet_time', 'agenda', 'tempat', 'object',
						'letter_no', 'letter_date'
					], 
					where: { idx_m_complaint: id } 
				});
			
			const user = await models.users.findOne({
				attributes: ['fullname'],
				where: { idx_m_user: cla.getDataValue('approver') }
			})
			
			const template = fs.readFileSync(`./templates/${fname}.docx`)
			buffer = await createReport({
				template,
				cmdDelimiter: ['{{', '}}'],
				data: {
					form_no: c.getDataValue('form_no') + ' pada ' + moment(c.getDataValue('date')).format('DD MMM YY'),
					letter_no: cla.getDataValue('letter_no'),
					letter_date: moment(cla.getDataValue('letter_date')).format('DD MMM YY'),
					by: cla.getDataValue('by'),
					to: cla.getDataValue('to'),
					address: cla.getDataValue('address'),
					object: cla.getDataValue('object'),
					st_number: st.getDataValue('st_number').toString(),
					st_date: moment(st.getDataValue('date')).format('DD MMM YY'),
					teams: cla.getDataValue('teams'),
					result: cla.getDataValue('result'),
					meet: moment(cla.getDataValue('meet_date')).format('DD MMM YY') + ' pada ' + cla.getDataValue('meet_time') ,
					agenda: cla.getDataValue('agenda'),
					tempat: cla.getDataValue('tempat'),
					approver: !user ? '' : user.getDataValue('fullname')
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

module.exports = letter_15F10
