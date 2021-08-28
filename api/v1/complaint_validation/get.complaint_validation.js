
const router = require('express').Router()
const { response } = require('../../../models')
const { validation } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let complaintId = req.body.idx_m_complaint || null;

  try {
    let o = await validation.get(sid, complaintId)
      .catch(e => { throw (e) });
    res.send(o).status(200);
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router