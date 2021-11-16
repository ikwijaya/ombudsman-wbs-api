
const router = require('express').Router()
const { response } = require('../../../models')
const WBS = require('../../../database/model/users')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let id = req.body.idx_m_user || null;

  try {
    let x = new WBS()
    await x.resendVerifikasi(sid, id)
      .then((r) => res.status(200).send(r))
      .catch(e => {
        throw (e)
      });
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router