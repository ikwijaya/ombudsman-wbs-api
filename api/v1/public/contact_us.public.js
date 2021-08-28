
const router = require('express').Router()
const { response } = require('../../../models')
const WBS = require('../../../database/model/public')

router.post('/', async (req, res, next) => {
  let obj = req.body.object || {}

  try {
    if (!obj.email) {
      res.status(200).send(response.failed("Kolom Email TIDAK boleh kosong."))
    } else {
      let x = new WBS()
      await x.saveContactUs(obj)
        .then((r) => res.status(200).send(r))
        .catch(e => { throw (e) });
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router