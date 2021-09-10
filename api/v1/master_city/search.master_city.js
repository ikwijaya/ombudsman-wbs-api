
const router = require('express').Router()
const { response } = require('../../../models')
const city = require('../../../sequelize/controllers/city')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let keyword = req.body.keyword || null;

  try {
    let o = await city.load(sid, keyword).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router