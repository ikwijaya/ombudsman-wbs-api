
const router = require('express').Router()
const { response } = require('../../../models')
const { helper } = require('../../../helper')
const { UPLOAD_PATH } = require('../../../config')

router.post('/', async (req, res, next) => {
  try {
    let name = req.body.filename || null

    await helper.deleteFile(`${UPLOAD_PATH}${name}`)
      .then(async (r) => res.status(200).send(r))
      .catch(e => console.log(e))
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router