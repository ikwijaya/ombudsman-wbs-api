
const router = require('express').Router()
const { response } = require('../../../models')
const { download_docx } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let idx = req.body.id || null;
  let letter = req.body.letter || null;
  let flag = req.body.flag || null;
  
  try {
    let o = await download_docx[`letter_${letter}`](idx).catch(e => { throw (e) })
    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router