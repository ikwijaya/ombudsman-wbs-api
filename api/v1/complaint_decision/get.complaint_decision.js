
const router = require('express').Router()
const { response } = require('../../../models')
const { decision } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let id = req.body.idx_m_complaint || null;

  try {
    let o = await decision.get(sid, id).catch(e => { throw (e) })
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router