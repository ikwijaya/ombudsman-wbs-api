
const router = require('express').Router()
const { response } = require('../../../models')
const { letters } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;

  try {
    console.log(req.body)
    let o = await letters.load(sid).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router