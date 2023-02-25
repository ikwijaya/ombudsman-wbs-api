
const router = require('express').Router()
const { response } = require('../../../models')
const { additional } = require('../../../sequelize/controllers')

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    let o = await additional.determinationAdditional(id).catch(e => { throw (e) });
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router