
const router = require('express').Router()
const { response } = require('../../../models')
const { hmac } = require('../../../helper')
const { users } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  const email = req.body.email || null;
  const fullname = req.body.fullname || null;
  const phoneNo = req.body.phoneNo || null;
  const identityNo = req.body.identityNo || null;
  const password = req.body.password || null;
  const repeatPassword = req.body.repeatPassword || null;
  const decryptPass = hmac.decryptText(password);
  const decryptRePass = hmac.decryptText(repeatPassword);
  const selectedImage = req.body.selectedImage || null

  try {
    if(!selectedImage) return res.status(200).send(response.failed('Kami TIDAK menemukan identitas Anda. Silakan upload identitas Anda.'))
    if (!email || !decryptPass || !decryptRePass || !fullname || !phoneNo || !identityNo) {
      res.status(200).send(response.failed('Kolom Email, Nama Lengkap, Nomor Telepon, Password dan Ulangi Password TIDAK boleh kosong.'))
    } else {
      if (decryptPass !== decryptRePass) {
        res.status(200).send(response.failed('Kolom Ulangi Password belum sesuai'))
      } else {
        if(!identityNo.match(/^(1[1-9]|21|[37][1-6]|5[1-3]|6[1-5]|[89][12])\d{2}\d{2}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}/g))
          res.status(200).send(response.failed('(!) NIK TIDAK sesuai, silakan re-upload KTP dengan lebih detail.'))
        else {
          let o = await users.register({
            email: email,
            fullname: fullname,
            identity_no: identityNo,
            phone_no: phoneNo,
            passwd: decryptPass,
            filename: selectedImage.filename,
            path: selectedImage.path,
            mime_type: selectedImage.mime_type,
            filesize: selectedImage.filesize
          }).catch(e => { throw (e) });
  
          res.send(o)
        }
      }
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router