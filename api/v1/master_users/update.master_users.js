
const router = require('express').Router()
const { response } = require('../../../models')
const WBS = require('../../../database/model/users')
const { hmac } = require('../../../helper')

/**
 * Route
 */
router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let idx_m_user = req.body.idx_m_user || null;
  let users = req.body.users || {};
  let roles = req.body.roles || [];

  try {
    let x = new WBS()
    await x.updateUsers(sid, idx_m_user, users, roles)
      .then((r) => res.status(200).send(r))
      .catch(e => {
        throw (e)
      });
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router