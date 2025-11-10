
const router = require('express').Router()
const { response } = require('../../../models')
const REPORT_FOLDER = './reports/'
const { helper } = require('../../../helper')
const core = require('../../../sequelize/controllers/core');
const { API_URL } = require('../../../config')

router.post('/', async (req, res, next) => {
  const { sid } = req.body;

  try {
    const sessions = await core.checkSession(sid).catch(e => { throw (e) })
    if (sessions.length === 0) res.send({
      url: API_URL+'/report/open/',
      files: []
    })
    else {
      const o = helper.readFolder(REPORT_FOLDER);
      res.send({
        url: API_URL+'/report/open/',
        files: o
      })
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router
