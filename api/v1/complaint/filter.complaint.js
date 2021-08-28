
const router = require('express').Router()
const { response } = require('../../../models')
const { additional } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let reg = req.body.regional || []
  try {
    let o = await additional.complaintFilterAdditional(reg).catch(e => { throw (e) })
    res.send(o).status(200)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router