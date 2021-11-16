
const router = require('express').Router()
const { response } = require('../../../models')
const Public = require('../../../database/model/public')

router.post('/', async (req, res, next) => {
  let keyword = req.body.keyword || null;

  try {
    let x = new Public()
    await x.getFAQ(keyword)
      .then((r) => res.status(200).send(r))
      .catch(e => { throw (e) });
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router