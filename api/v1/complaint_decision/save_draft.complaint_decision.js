
const router = require('express').Router()
const { response } = require('../../../models')
const { decision } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  try {
    let o = await decision.save(req.body, false).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router