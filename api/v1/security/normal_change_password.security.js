
const router = require('express').Router()
const { response } = require('../../../models')
const { hmac } = require('../../../helper')
const { users } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let old_password = req.body.old_password || null;
  let new_password = req.body.new_password || null;

  let decryptOldPass = hmac.decryptText(old_password);
  let decryptNewPass = hmac.decryptText(new_password);

  try {
    if (!old_password || !new_password) {
      res.status(200).send(response.failed('Kolom Password Lama dan Password Baru TIDAK boleh kosong.'))
    } else {
      let o = await users.change_password(sid, decryptOldPass, decryptNewPass).catch(e => { throw (e) });
      res.send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router