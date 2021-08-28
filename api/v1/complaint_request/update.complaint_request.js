
const router = require('express').Router()
const { response } = require('../../../models')
const { request } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body || null;

  try {
    let o = await request.update(sid, obj).catch(e => { throw (e) })
    res.send(o)
  } catch (err) {
    console.log(err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router