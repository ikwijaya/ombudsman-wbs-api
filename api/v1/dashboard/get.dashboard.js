
const router = require('express').Router()
const { response } = require('../../../models')
const { cache } = require('../../../helper')
const WBS = require('../../../database/model/dashboard')

router.post('/', cache.MCache(30), async (req, res, next) => {
  const sid = req.body.sid || null;
  // let sid = '76fab62cc7ac481e5b4f2cbc6a4f1fe14261ca2366522a0e835bb043c52789552b5fd545890d59d497f8f509493d047e11232110022346.457'

  try {
    const x = new WBS()
    const count_by_type_insp = await x.getCountByType(sid,true).catch(e => { throw (e) })
    const count_by_type_kumm = await x.getCountByType(sid,false).catch(e => { throw (e) })
    const count_by_status = await x.getCountByStatus(sid).catch(e => { throw (e) })
    const complaint_by_violation = await x.getComplaintByViolation(sid).catch(e => { throw (e) })
    const complaint_by_process = await x.getComplaintByProcess(sid).catch(e => { throw (e) })
    const complaint_by_ukreg1 = await x.getCountByUKRegion1(sid).catch(e => { throw (e) })
    const complaint_by_ukreg2 = await x.getCountByUKRegion2(sid).catch(e => { throw (e) })
    const count_monthly = await x.getCountByMonthly(sid).catch(e => { throw (e) })
    const count_wku = await x.getCountByWorkUnit(sid).catch(e => { throw (e) })
    const count_region = await x.getCountByUKRegion3(sid).catch(e => { throw (e) })

    res.send({
      count_by_type_insp: count_by_type_insp,               // SUMBER ADUAN
      count_by_type_kumm: count_by_type_kumm,               // SUMBER ADUAN
      count_by_status: count_by_status,
      complaint_by_violation: complaint_by_violation.rows,  // JENIS PENGADUAN
      complaint_by_process: complaint_by_process.rows,      // PROSES KUMM
      complaint_by_ukreg1: complaint_by_ukreg1,               // INSPEKTORAT REGIONAL - UNIT KERJA (PERWAKILAN UNIT KERJA)
      complaint_by_ukreg2: complaint_by_ukreg2,                // KUMM
      count_monthly: count_monthly,
      count_work_unit: count_wku,
      count_region: count_region

    })
  } catch (err) {
    req.log.error('error', err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router