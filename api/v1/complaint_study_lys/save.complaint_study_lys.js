
const router = require('express').Router()
const { response } = require('../../../models')
const { study_lys } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || {};

  try {
    if (!obj.study.head_of_reg) {
      res.send(response.failed('Kolom Diperiksa Oleh TIDAK boleh kosong'))
    } else {
      let o = await study_lys.save(sid, obj).catch(e => { throw (e) })
      res.send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router