
const router = require('express').Router()
const { response } = require('../../../models')
const { decision } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || {}

  try {
    if (obj.attachment.length == 0) {
      res.status(200).send(response.failed('Kolom Lampiran TIDAK boleh kosong.'))
    } else {
      let o = await decision.approve(sid, obj).catch(e => { throw (e) });
      res.send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router