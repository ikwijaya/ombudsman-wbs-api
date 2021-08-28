const sequelize = require('./sequelize')
const seed = require('./sequelize/seeders/seed')
const cities = require('./sequelize/seeders/cities.json').cities
const dispositions = require('./sequelize/seeders/dispositions.json').dispositions
const forms = require('./sequelize/seeders/forms.json').forms
const legal_standing = require('./sequelize/seeders/legal_standing.json').legal_standing
const options = require('./sequelize/seeders/options.json').options
const regions = require('./sequelize/seeders/regions.json').regions
const complaint_rejected_types = require('./sequelize/seeders/reject_types.json').complaint_rejected_types
const status = require('./sequelize/seeders/status.json').status
const usertypes = require('./sequelize/seeders/user_types.json').usertypes
const users = require('./sequelize/seeders/users.json').users
const violations = require('./sequelize/seeders/violations.json').violations
const work_units = require('./sequelize/seeders/work_units.json').work_units
const { SQ_ALTER, SQ_FORCE, SQ_SEED } = require('./config')

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 yey! your database is connected to me.');
  } catch (err) {
    console.error('sorry, something wrong with your connection: ', err);
  }
}

const run = async () => {
  try {
    console.log('🚀 sync', `${SQ_FORCE == 1 ? 'force mode TRUE, (be carefule when using this options)' : ''}\n${SQ_ALTER == 1 ? 'alter mode TRUE' : ''}\n${SQ_SEED == 1 ? 'seed is running' : ''}`)

    await sequelize.sync({
      alter: SQ_ALTER == '1' ? true : false,
      force: SQ_FORCE == '1' ? true : false
    });

    if (SQ_SEED == '1') {
      //// sync data tables
      // await seed.run({ dispositions })
      // await seed.run({ legal_standing })
      // await seed.run({ options })
      // await seed.run({ complaint_rejected_types })
      // await seed.run({ status })
      // await seed.run({ violations })
      // await seed.run({ work_units })
    }
  } catch (error) { console.log(`error sync`, error) }
}

authenticate();
run();



