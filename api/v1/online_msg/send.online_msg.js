
const router = require('express').Router()
const { response } = require('../../../models')
const PublicOM = require('../../../database/model/online_msg')

/**
 * Route
 * Transaction Search
 */
router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;
  let parent_id = req.body.parent_id || null;
  let receiver = req.body.receiver || null;
  let subject = req.body.subject || 'General Subject';
  let body = req.body.body || null;

  try {
    if (!receiver || !body) {
      res.status(200).send(response.failed('Kolom Penerima dan Pesan TIDAK boleh kosong.'))
    } else {
      let x = new PublicOM()
      await x.sendMsg(sid, receiver, body, subject, parent_id)
        .then((r) => res.status(200).send(r))
        .catch(e => { throw (e) });
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router