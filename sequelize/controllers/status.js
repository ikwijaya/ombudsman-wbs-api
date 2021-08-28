const { models } = require('..');
const { Sequelize, Op } = require('sequelize')

module.exports = {
  /**
   * 
   * @param {*} type null (0)
   * @returns 
   */
  async load(code = []) {
    try {
      let where = { record_status: 'A' }

      if (code.length > 0)
        where['code'] = { [Op.in]: code }

      console.log('where => ', where)
      let status = await models.status.findAll(
        {
          raw: true,
          attributes: [
            'idx_m_status', 'color',
            [`name`, 'name'],
            [`name`, 'status_name'],
            [Sequelize.literal(`code`), 'value']
          ],
          where: where,
          order: [
            [Sequelize.literal('cast(code as integer)'), 'ASC']
          ]
        },
      )

      return status;
    } catch (err) {
      console.log(err)
      throw (err)
    }
  }
}