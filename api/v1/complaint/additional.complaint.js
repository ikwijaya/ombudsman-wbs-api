
const router = require('express').Router()
const { response } = require('../../../models')
const { additional } = require('../../../sequelize/controllers')

router.get('/', async (req, res, next) => {
  try {
    let o = await additional.complaintAdditional().catch(e => { throw (e) })
    res.send(o).status(200)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router