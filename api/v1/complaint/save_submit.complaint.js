
const router = require('express').Router()
const { response } = require('../../../models')
const { complaint } = require('../../../sequelize/controllers')
const { helper } = require('../../../helper')

router.post('/', async (req, res, next) => {
  let c = req.body.complaints || {}
  let event = req.body.events || []
  let incident = req.body.incidents || []
  let reported = req.body.reported || []
  let violation = req.body.violations || []

  try {
    let msg = [];
    if (!c.idx_m_legal_standing)
      msg.push('<li>Kolom Legal Standing TIDAK boleh kosong.</li>')
    if (!c.description)
      msg.push('<li>Kolom Perihal/Ringkasan aduan TIDAK boleh kosong.</li>')
    if (!c.hopes)
      msg.push('<li>Kolom Harapan Pengadu TIDAK boleh kosong.</li>')
    if (violation.length == 0)
      msg.push('<li>Kolom Jenis Dugaan Pelanggaran TIDAK boleh kosong.</li>')
    if (event.length == 0)
      msg.push('<li>Kronologi Aduan TIDAK boleh kosong.</li>')
    if (await helper.validateArrayVal(incident, ['idx_m_work_unit', 'idx_m_city', 'start_date', 'end_date']) || incident.length === 0)
      msg.push('<li>Tempat Kejadian Kolom Unit Kerja, Kota dan Waktu Kejadian TIDAK boleh kosong.</li>')
    if (await helper.validateArrayVal(reported, ['name']) || reported.length === 0)
      msg.push('<li>Terlapor Kolom Nama Terlapor TIDAK boleh kosong.</li>')
    if (msg.length > 0)
      res.send(response.failed('<ul>' + msg.join('') + '</ul>'))

    let o = await complaint.save(req.body, true).catch(e => { throw (e) })
    res.status(200).send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router