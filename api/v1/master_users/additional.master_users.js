
const router = require('express').Router()
const { response } = require('../../../models')
const WBS = require('../../../database/model/users')
const { hmac } = require('../../../helper')

/**
 * Route
 */
router.get('/:sid', async (req, res, next) => {
  try {
    let x = new WBS()
    await x.getAdditional(req.params.sid)
      .then((r) => res.status(200).send(r))
      .catch(e => { throw (e) });
  } catch (err) {
    console.log(err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router