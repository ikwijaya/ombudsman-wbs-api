
const router = require('express').Router()
const { response } = require('../../../models')
const PublicOM = require('../../../database/model/online_msg')

/**
 * Route
 * Transaction Search
 */
router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;

  try {
    let x = new PublicOM()
    await x.get(sid)
      .then((r) => res.status(200).send(r))
      .catch(e => { throw (e) });
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router