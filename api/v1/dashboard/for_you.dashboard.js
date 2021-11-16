
const router = require('express').Router()
const { response } = require('../../../models')
const { cache } = require('../../../helper')
const WBS = require('../../../database/model/dashboard')

router.post('/', cache.MCache(30), async (req, res, next) => {
  let sid = req.body.sid || null;

  try {
    let x = new WBS()
    let to_you = await x.getToYou(sid).catch(e => { throw (e) })
    
    res.send({
      to_you: to_you
    })
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router