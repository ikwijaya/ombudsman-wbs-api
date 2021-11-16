'use strict';
const { models } = require('..');
const sequelize = require('..');

module.exports = {
  /**
   * 
   * @param {*} m 
   * @param {*} data 
   */
  run: async (object = null) => {
    const t = await sequelize.transaction();
    console.log(`seed`, '--- start ---')
    try {
      if (object == null) return 'null'
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const data = object[key];
          await models[key].truncate({ transaction: t, cascade: true })
            .then(async r => {
              console.log('delete', `models ${key}`)
              await models[key].bulkCreate(data, { transaction: t })
                .then(r => {
                  console.log('bulk insert', `models ${key}`)
                }).catch(e => { throw (e) });
            }).catch(e => { throw (e) });
        }
      }

      await t.commit()
      console.log(`seed`, '--- end ---')
    } catch (error) {
      await t.rollback()
      console.log('seed', error)
      throw (error)
    }
  }
}
