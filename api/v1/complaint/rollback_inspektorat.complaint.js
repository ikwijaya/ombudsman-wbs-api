
const router = require('express').Router()
const { response } = require('../../../models')
const { complaint } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  const sid = req.body.sid || null;
  const id = req.body.idx_m_complaint || null;
  const reason = req.body.reason || null;

  try {
    const o = await complaint.rollbackInspektorat(sid, id, reason).catch(e => { throw (e) })
    res.status(200).send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router