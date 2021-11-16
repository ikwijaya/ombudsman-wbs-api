
const router = require('express').Router()
const { response } = require('../../../models')
const { study } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let id = req.body.idx_t_study_attachment || null

  try {
    let o = await study.deleteAttachment(sid, id).catch(e => { throw (e) })
    res.send(o).status(200)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router
