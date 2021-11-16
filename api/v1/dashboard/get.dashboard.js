
const router = require('express').Router()
const { response } = require('../../../models')
const { cache } = require('../../../helper')
const WBS = require('../../../database/model/dashboard')

router.post('/', cache.MCache(30), async (req, res, next) => {
  let sid = req.body.sid || null;
  // let sid = '76fab62cc7ac481e5b4f2cbc6a4f1fe14261ca2366522a0e835bb043c52789552b5fd545890d59d497f8f509493d047e11232110022346.457'

  try {
    let x = new WBS()
    let count_by_type = await x.getCountByType(sid).catch(e => { throw (e) })
    let count_by_status = await x.getCountByStatus(sid).catch(e => { throw (e) })
    // let to_you = []
    // let total = await x.getTotal(sid).catch(e => { throw (e) })
    // let count_by_region = await x.getCountByRegion(sid).catch(e => { throw (e) })
    // let count_by_region_name = await x.getCountByRegionName(sid).catch(e => { throw (e) })
    let complaint_by_region = await x.getComplaintByRegion(sid).catch(e => { throw (e) })
    let complaint_by_violation = await x.getComplaintByViolation(sid).catch(e => { throw (e) })
    let complaint_by_process = await x.getComplaintByProcess(sid).catch(e => { throw (e) })
    // let complaint_by_work_unit = await x.getCountByWorkUnit(sid).catch(e => { throw (e) })
    // let complaint_by_person = await x.getCountByPerson(sid).catch(e => { throw (e) })
    // let complaint_by_ukname1 = await x.getCountByUKName1(sid).catch(e => { throw (e) })
    // let complaint_by_ukname2 = await x.getCountByUKName2(sid).catch(e => { throw (e) })
    let complaint_by_ukreg1 = await x.getCountByUKRegion1(sid).catch(e => { throw (e) })
    let complaint_by_ukreg2 = await x.getCountByUKRegion2(sid).catch(e => { throw (e) })

    res.send({
      count_by_type: count_by_type,               // SUMBER ADUAN
      count_by_status: count_by_status,
      to_you: [],
      total: [], // total,
      count_by_region: [], //count_by_region,           // REGIONAL - PROVINSI -> REGIONAL - PERWAKILAN (Unit Kerja)
      complaint_by_region: complaint_by_region,   // Aduan Terkait Pengawasan Pelayanan Publik
      count_by_region_name: [], //count_by_region_name, // PERWAKILAN
      complaint_by_violation: complaint_by_violation.rows,  // JENIS PENGADUAN
      complaint_by_process: complaint_by_process.rows,      // PROSES KUMM
      complaint_by_work_unit: [],
      complaint_by_person: [],  //complaint_by_person, 
      complaint_by_ukname1: [],             // UNIT KERJA INSPEKTORAT
      complaint_by_ukname2: [],             // UNIT KERJA KUMM
      complaint_by_ukreg1: complaint_by_ukreg1,               // INSPEKTORAT REGIONAL - UNIT KERJA (PERWAKILAN UNIT KERJA)
      complaint_by_ukreg2: complaint_by_ukreg2                // KUMM
    })
  } catch (err) {
    req.log.error('error', err)
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router