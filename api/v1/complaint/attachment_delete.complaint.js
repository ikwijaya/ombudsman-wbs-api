
const router = require('express').Router()
const { response } = require('../../../models')
const { complaint } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let id = req.body.idx_m_complaint_attachment || null

  console.log(req.body)
  try {
    let o = await complaint.deleteAttachment(sid, id).catch(e => { throw (e) })
    res.send(o).status(200)
  } catch (err) {
    console.log(err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router
