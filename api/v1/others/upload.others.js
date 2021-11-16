
const router = require('express').Router()
const { response } = require('../../../models')
const { helper } = require('../../../helper')
const CPM = require('connect-multiparty')
const multiparty = CPM();
const { UPLOAD_PATH } = require('../../../config')

router.post('/', multiparty, async (req, res, next) => {
  try {
    let upload = req.files.upload || []

    await helper.uploadFile(upload, upload.path, UPLOAD_PATH)
      .then(async (r) => res.status(200).send(r))
      .catch(e => { throw (e) })
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router