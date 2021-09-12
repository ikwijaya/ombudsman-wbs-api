
const router = require('express').Router()
const { response } = require('../../../models')
const { cache } = require('../../../helper')
const WBS = require('../../../database/model/dashboard')

router.post('/', cache.MCache(30), async (req, res, next) => {
  let sid = req.body.sid || null;

  try {
    let x = new WBS()
    let count_by_type = await x.getCountByType(sid).catch(e => { throw (e) })
    let count_by_status = await x.getCountByStatus(sid).catch(e => { throw (e) })
    let to_you = await x.getToYou(sid).catch(e => { throw (e) })
    let total = await x.getTotal(sid).catch(e => { throw (e) })
    let count_by_region = await x.getCountByRegion(sid).catch(e => { throw (e) })
    let count_by_region_name = await x.getCountByRegionName(sid).catch(e => { throw (e) })
    let complaint_by_region = await x.getComplaintByRegion(sid).catch(e => { throw (e) })
    let complaint_by_violation = await x.getComplaintByViolation(sid).catch(e => { throw (e) })
    let complaint_by_process = await x.getComplaintByProcess(sid).catch(e => { throw (e) })

    res.send({
      count_by_type: count_by_type,
      count_by_status: count_by_status,
      to_you: to_you,
      total: total,
      count_by_region: count_by_region,
      complaint_by_region: complaint_by_region,
      count_by_region_name: count_by_region_name,
      complaint_by_violation: complaint_by_violation.rows,
      complaint_by_process: complaint_by_process.rows
    })
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router