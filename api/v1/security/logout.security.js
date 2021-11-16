
const router = require('express').Router()
const { response } = require('../../../models')
const { security } = require('../../../sequelize/controllers')

router.get('/:sid', async (req, res, next) => {
  let sid = req.params.sid || null

  try {
    let o = await security.logout(sid).catch(e => { throw (e) })
    res.send(o).status(200);
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router