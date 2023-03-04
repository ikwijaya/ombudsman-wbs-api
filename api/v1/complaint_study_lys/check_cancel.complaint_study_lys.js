
const router = require('express').Router()
const { response } = require('../../../models')
const { study_lys } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  const sid = req.body.sid || null;
  const obj = req.body.obj || null;

  try {
    const o = await study_lys.checkCancel(sid, obj)
        .catch(e => { throw (e) });
    res.send(o).status(200);
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router