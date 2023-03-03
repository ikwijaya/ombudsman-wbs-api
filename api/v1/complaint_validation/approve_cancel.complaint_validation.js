
const router = require('express').Router()
const { response } = require('../../../models')
const { validation } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let obj = req.body.obj || null;

  try {
    let o = await validation.approveCancel(sid, obj)
      .catch(e => { throw (e) });
    res.send(o).status(200);
  } catch (err) {
    console.log(`approve-cancel`, err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router