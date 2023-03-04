
const router = require('express').Router()
const { response } = require('../../../models')
const WBS = require('../../../database/model/users')

router.post('/', async (req, res, next) => {
  const sid = req.body.sid || null;
  const keyword = req.body.keyword || null;
  const idx_m_user = req.body.idx_m_user || null;

  try {
    const x = new WBS()
    await x.getExternal(sid, keyword, idx_m_user)
      .then((r) => res.status(200).send(r))
      .catch(e => {
        throw (e)
      });
  } catch (err) {
    console.log(err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router