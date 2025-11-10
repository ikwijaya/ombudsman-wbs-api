
const router = require('express').Router()
const { response } = require('../../../models')
const { cache } = require('../../../helper')
const WBS = require('../../../database/model/dashboard')

router.post('/', cache.MCache(30), async (req, res, next) => {
  const sid = req.body.sid || null;
  
  try {
    const x = new WBS()
    const complaint_by_region = await x.getComplaintByRegion(sid).catch(e => { throw (e) })
    res.send({
      complaint_by_region: complaint_by_region
    })
  } catch (err) {
    req.log.error('error', err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router