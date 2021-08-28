
const router = require('express').Router()
const { response } = require('../../../models')
const { request } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let id = req.body.idx_t_request || null;

  try {
    let o = await request.delete(sid, id).catch(e => { throw (e) })
    res.send(o)
  } catch (err) {
    console.log(err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router