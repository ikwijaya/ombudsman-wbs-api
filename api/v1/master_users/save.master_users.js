
const router = require('express').Router()
const { response } = require('../../../models')
const WBS = require('../../../database/model/users')

/**
 * Route
 */
router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let users = req.body.users || {};
  let roles = req.body.roles || [];

  try {
    if (!users.email) {
      res.status(200).send(response.failed('Kolom Email TIDAK boleh kosong.'));
    } else if (!users.fullname) {
      res.status(200).send(response.failed('Kolom Nama Lengkap TIDAK boleh kosong.'));
    } else if (!users.phone_no) {
      res.status(200).send(response.failed('Kolom No Telepon TIDAK boleh kosong.'));
    } else {
      let x = new WBS()
      await x.saveUser(sid, users, roles)
        .then((r) => res.status(200).send(r))
        .catch(e => {
          throw (e)
        });
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router
