
const router = require('express').Router()
const { response } = require('../../../models')
const { users } = require('../../../sequelize/controllers')

router.get('/:verify_url', async (req, res, next) => {
  let verify_url = req.params.verify_url || null

  try {
    if (!verify_url) {
      res.status(200).send(response.failed('Kode verifikasi TIDAK ditemukan.'))
    } else {
      let o = await users.verify(verify_url).catch(e => { throw (e) });
      res.send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router