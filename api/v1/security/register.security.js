
const router = require('express').Router()
const { response } = require('../../../models')
const { hmac } = require('../../../helper')
const { users } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let email = req.body.email || null;
  let fullname = req.body.fullname || null;
  let phoneNo = req.body.phoneNo || null;
  let password = req.body.password || null;
  let repeatPassword = req.body.repeatPassword || null;
  let decryptPass = hmac.decryptText(password);
  let decryptRePass = hmac.decryptText(repeatPassword);

  try {
    if (!email || !decryptPass || !decryptRePass || !fullname || !phoneNo) {
      res.status(200).send(response.failed('Kolom Email, Nama Lengkap, Nomor Telepon, Password dan Ulangi Password TIDAK boleh kosong.'))
    } else {
      if (decryptPass !== decryptRePass) {
        res.status(200).send(response.failed('Kolom Ulangi Password belum sesuai'))
      } else {
        let o = await users.register({
          email: email,
          fullname: fullname,
          identity_no: req.body.identityNo,
          phone_no: phoneNo,
          passwd: decryptPass,
          filename: req.body.filename,
          path: req.body.path,
          mime_type: req.body.mime_type,
          filesize: req.body.filesize
        }).catch(e => { throw (e) });

        res.send(o)
      }
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router