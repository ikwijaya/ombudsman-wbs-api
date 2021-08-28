
const router = require('express').Router()
const { response } = require('../../../models')
const { users } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let email = req.body.email || null;

  try {
    let o = await users.forget(email).catch(e => { throw (e) });
    res.send(o);
  } catch (err) {
    console.log(err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router