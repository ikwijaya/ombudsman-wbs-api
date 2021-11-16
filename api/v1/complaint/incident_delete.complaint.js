
const router = require('express').Router()
const { response } = require('../../../models')
const { complaint } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let id = req.body.idx_m_complaint_incident || null

  try {
    let o = await complaint.deleteIncident(sid, id).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router