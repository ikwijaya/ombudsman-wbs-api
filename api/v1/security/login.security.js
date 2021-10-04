
const router = require('express').Router()
const { response } = require('../../../models')
const { security } = require('../../../sequelize/controllers')
const { hmac } = require('../../../helper')

/**
 * Route
 * Transaction Search
 */
router.post('/', async (req, res, next) => {
  let email = req.body.email || null;
  let password = req.body.password || null;
  let decryptPass = hmac.decryptText(password);
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
  let ua = req.headers['user-agent'] || null
  let host = req.headers.host || null

  try {
    if (!email || !decryptPass) {
      res.status(200).send(response.failed('Kolom Email dan Password TIDAK boleh kosong.'))
    } else {
      let o = await security.login(email, decryptPass, {
        ua: ua,
        ip: ip,
        host: host
      }).catch(e => { throw (e) })
      res.send(o).status(200);
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router