
const router = require('express').Router()
const { response } = require('../../../models')
const { download_letter } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let idx = req.body.id || null;
  let letter = req.body.letter || null;
  let flag = req.body.flag || null;

  try {
    let o = await download_letter[`letter_${letter}`](idx, flag).catch(e => { throw (e) })
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router