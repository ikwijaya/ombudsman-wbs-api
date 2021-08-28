
const router = require('express').Router()
const { response } = require('../../../models')
const { study_lys } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || null;

  try {
    if (!obj.study.head_of_kumm) {
      res.send(response.failed('Kolom Disetujui Oleh TIDAK boleh kosong'))
    } else {
      let o = await study_lys.check(sid, obj)
        .catch(e => { throw (e) });
      res.send(o).status(200);
    }
  } catch (err) {
    console.log(err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router