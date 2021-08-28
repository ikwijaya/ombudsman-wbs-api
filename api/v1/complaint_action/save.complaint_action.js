
const router = require('express').Router()
const { response } = require('../../../models')
const { action } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || {};

  try {
    if (!obj.date) {
      res.status(200).send(response.failed('Kolom Tanggal Tindak Lanjut TIDAK boleh kosong.'))
    } else if (!obj.action_name) {
      res.status(200).send(response.failed('Kolom Tindak Lanjut TIDAK boleh kosong.'))
    } else if (!obj.description) {
      res.status(200).send(response.failed('Kolom Uraian TIDAK boleh kosong.'))
    } else {
      let o = await action.save(sid, obj).catch(e => { throw (e) });
      res.send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router