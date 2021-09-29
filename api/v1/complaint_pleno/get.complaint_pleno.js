
const router = require('express').Router()
const { response } = require('../../../models')
const { pleno } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let id = req.body.id || null;

  try {
    let o = await pleno.get(sid, id).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router