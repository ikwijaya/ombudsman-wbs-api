
const router = require('express').Router()
const { response } = require('../../../models')
const { complaint } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  try {
    let o = await complaint.save(req.body, false).catch(e => { throw (e) })
    res.status(200).send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router