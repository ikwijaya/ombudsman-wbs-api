
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
  let custom_filter = req.body.custom_filter || 0;

  try {
    let o = await complaint.load(sid, keyword, status_code,
      {
        teradu: teradu,
        terperiksa: terperiksa,
        custom_filter: custom_filter
      }, null).catch(e => { throw (e) })
    res.send(o).status(200)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router