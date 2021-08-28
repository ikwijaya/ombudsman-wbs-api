
const router = require('express').Router()
const { response } = require('../../../models')
const { core } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let parent_id = req.body.id || null;

  try {
    let o = await core.getMenuMaster(sid, parent_id).catch(e => { throw (e) })
    res.send(o).status(200)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router