
const router = require('express').Router()
const { response } = require('../../../models')
const WBS = require('../../../database/model/users')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let keyword = req.body.keyword || null;

  try {
    let x = new WBS()
    await x.getExternal(sid, keyword)
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