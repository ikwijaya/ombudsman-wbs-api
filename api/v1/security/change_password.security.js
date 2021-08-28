
const router = require('express').Router()
const { response } = require('../../../models')
const { hmac } = require('../../../helper')
const { users } = require('../../../sequelize/controllers')

router.post('/:url', async (req, res, next) => {
  let email = req.body.email || null;
  let password = req.body.new_password || null;
  let url_forget = req.params.url || null;
  let decryptPass = hmac.decryptText(password);

  try {
    if (!email || !decryptPass) {
      res.status(200).send(response.failed('Kolom Email dan Password TIDAK boleh kosong.'))
    } else {
      let o = await users.forget_change_password({
        email: email,
        passwd: decryptPass,
        url_forget: url_forget
      }).catch(e => { throw (e) });

      res.send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router