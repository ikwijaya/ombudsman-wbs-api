
const router = require('express').Router()
const { response } = require('../../../models')
const { delivery } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || {};

  try {
    if (!obj.action) {
      res.status(200).send(response.failed('Kolom Keputusan Pleno TIDAK boleh kosong.'))
    } else {
      let o = await delivery.save(sid, obj).catch(e => { throw (e) });
      res.send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router