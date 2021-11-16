
const router = require('express').Router()
const { response } = require('../../../models')
const region = require('../../../sequelize/controllers/region')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let regional = req.body.regional || null;

  try {
    let o = await region.load_by_region(sid, regional).catch(e => { throw (e) })
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});


module.exports = router