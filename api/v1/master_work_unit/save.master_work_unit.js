
const router = require('express').Router()
const { response } = require('../../../models')
const work_unit = require('../../../sequelize/controllers/work_unit')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || {};

  try {
    let o = await work_unit.save(sid, obj).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router