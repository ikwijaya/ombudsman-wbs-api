
const router = require('express').Router()
const { response } = require('../../../models')
const sequelize = require('../../../sequelize')

router.get('/', async (req, res, next) => {
  try {
    let o = await sequelize.authenticate();
    res.send(response.success(`🚀 yey!, API is live`, o)).status(200)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router