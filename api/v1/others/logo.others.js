
const router = require('express').Router()
const { response } = require('../../../models')
const { helper } = require('../../../helper')
const { LOGO_PATH } = require('../../../config')

/**
 * Logo
 */
router.get('/:filename', async (req, res, next) => {
  try {
    let name = req.params.filename || null;

    if (!name) {
      res.status(200).send(response.failed('File not found'))
    } else {
      let mime_type = await helper.getExt(name.toLowerCase());

      await helper.readFile(`${LOGO_PATH}${name}`)
        .then(async (r) => {
          if (r) { res.contentType(mime_type).send(r) }
          else { res.status(200).send(response.failed(err)) }
        })
        .catch(e => console.log(e))
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router