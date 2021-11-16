
const router = require('express').Router()
const { response } = require('../../../models')
const { determination } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || {};

  try {
    if (!obj.determination.date) {
      res.status(200).send(response.failed('Kolom Tanggal Penetapan TIDAK boleh kosong.'))
    } else if (obj.users == 0) {
      res.status(200).send(response.failed('Daftar Tim TIDAK boleh kosong.'))
    } else {
      let o = await determination.save(sid, obj).catch(e => { throw (e) });
      res.send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router