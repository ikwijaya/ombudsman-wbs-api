
const router = require('express').Router()
const { response } = require('../../../models')
const { helper } = require('../../../helper')
const { study } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let c = req.body.complaint || {}
  let event = req.body.events || []
  let incident = req.body.incidents || []
  let reported = req.body.reported || []
  let violation = req.body.violations || []
  let attachment = req.body.attachments || []

  try {
    let msg = [];
    if (!c.idx_m_disposition)
      msg.push('<li>Kolom Disposisi TIDAK boleh kosong.</li>')
    if (violation.length == 0)
      msg.push('<li>Kolom Jenis Dugaan Pelanggaran TIDAK boleh kosong.</li>')
    if (event.length == 0)
      msg.push('<li>Kronologi Aduan TIDAK boleh kosong.</li>')
      // remove 'idx_m_city'
    if (await helper.validateArrayVal(incident, ['idx_m_work_unit', 'start_date', 'end_date']) || incident.length === 0)
      msg.push('<li>Tempat Kejadian Kolom Unit Kerja, Kota dan Waktu Kejadian TIDAK boleh kosong.</li>')
    if (await helper.validateArrayVal(reported, ['name']) || reported.length === 0)
      msg.push('<li>Terlapor Kolom Nama Terlapor TIDAK boleh kosong.</li>')
    if (attachment.length == 0)
      msg.push('<li>Lampiran TIDAK boleh kosong</li>')

    if (msg.length > 0) {
      res.send(response.failed('<ul>' + msg.join('') + '</ul>'))
    } else {
      let o = await study.save(req.body, true).catch(e => { throw (e) })
      res.status(200).send(o)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router