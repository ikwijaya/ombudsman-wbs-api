
const router = require('express').Router()
const { response } = require('../../../models')
const { surgery } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body || {};

  try {
    let o = await surgery.checkCancel(sid, obj).catch(e => { throw (e) })
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router