
const router = require('express').Router()
const { response } = require('../../../models')
const { confirmation } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || {};

  try {
    let o = await confirmation.save(sid, obj).catch(e => { throw (e) })
    res.send(o)
    // let msg = []
    // if (!obj.head_of_kumm)
    //   msg.push('<li>Kolom Kepala KUMM TIDAK boleh kosong</li>')
    // if (msg.length > 0) res.send(response.failed(`<ul>${msg.join(' ')}</ul>`))
    // else {
    //   let o = await confirmation.save(sid, obj).catch(e => { throw (e) })
    //   res.send(o)
    // }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router