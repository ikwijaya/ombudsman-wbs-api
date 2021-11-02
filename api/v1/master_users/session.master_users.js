
const router = require('express').Router()
const { response } = require('../../../models')
const { core } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;

  try {
    let o = await core.loadSession(sid).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router