
const router = require('express').Router()
const { response } = require('../../../models')
const work_unit = require('../../../sequelize/controllers/work_unit')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let keyword = req.body.keyword || null;

  try {
    let o = await work_unit.load(sid, keyword).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router