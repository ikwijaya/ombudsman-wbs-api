
const router = require('express').Router()
const { response } = require('../../../models')
const axios = require('axios').default
const { RECAPTCHA_SECRET_KEY } = require('../../../config')

router.post('/', async (req, res, next) => {
  let token = req.body.token || null

  try {
    if (!token) {
      res.status(200).send(response.failed('Cannot process', []))
    } else {
      await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${null}`)
        .then((r) => res.status(200).send(r.data))
        .catch(e => { throw e })
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router