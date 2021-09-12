
const router = require('express').Router()
const { response } = require('../../../models')
const { cache } = require('../../../helper')
const { complaint } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let keyword = req.body.keyword || null;
  let status_code = req.body.status_code || [];
  let sid = req.body.sid || null;
  let teradu = req.body.teradu || [];
  let terperiksa = req.body.terperiksa || [];

  try {
    let o = await complaint.load(sid, keyword, status_code,
      {
        teradu: teradu,
        terperiksa: terperiksa
      }, null).catch(e => { throw (e) })
    res.send(o).status(200)
  } catch (err) {
    console.log('route complaint/search', err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router