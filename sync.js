const sequelize = require('./sequelize')
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
    await sequelize.sync({
      alter: true
    });
  } catch (error) { console.log(`error sync`, error) }
}

authenticate();
run();



