
const router = require('express').Router()
const { response } = require('../../../models')
const { request } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || {};

  try {
    let msg = []
    let o = null;

    if (!obj.request.date)
      msg.push('<li>Kolom Tanggal Permintaan TIDAK boleh kosong</li>')

    if (!obj.request.media)
      msg.push('<li>Kolom Media Permintaan TIDAK boleh kosong</li>')

    if (!obj.request.notes)
      msg.push('<li>Kolom Uraian Permintaan dan Tanggapan TIDAK boleh kosong</li>')

    if (msg.length == 0) o = await request.save(sid, obj).catch(e => { throw (e) })
    else o = response.failed(`<ul>${msg.join('')}</ul>`)

    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router