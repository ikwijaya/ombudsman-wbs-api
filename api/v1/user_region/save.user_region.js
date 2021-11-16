
const router = require('express').Router()
const { response } = require('../../../models')
const userregion = require('../../../sequelize/controllers/userregion')

router.post('/', async (req, res, next) => {
  try {
    let sid = req.body.sid || null;
    let obj = req.body.obj || {}

    let o = await userregion.save(sid, obj).catch(e => { throw (e) })
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});


module.exports = router