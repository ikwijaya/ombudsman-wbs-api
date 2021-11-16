
const router = require('express').Router()
const { response } = require('../../../models')
const { study } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.reported || {}

  try {
    let o = await study.saveReported(sid, obj).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router