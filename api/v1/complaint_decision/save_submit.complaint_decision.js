
const router = require('express').Router()
const { response } = require('../../../models')
const { decision } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let c = req.body.complaint || {}
  let violation = req.body.violations || []

  try {
    let msg = [];
    if (!c.idx_m_disposition)
      msg.push('<li>Kolom Disposisi TIDAK boleh kosong.</li>')

    if (msg.length > 0)
      res.send(response.failed('<ul>' + msg.join('') + '</ul>'))

    let o = await decision.save(req.body, true).catch(e => { throw (e) })
    res.status(200).send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router