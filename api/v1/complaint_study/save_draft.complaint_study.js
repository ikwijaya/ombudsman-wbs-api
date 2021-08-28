
const router = require('express').Router()
const { response } = require('../../../models')
const { study } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  try {
    let o = await study.save(req.body, false).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router