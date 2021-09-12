
const router = require('express').Router()
const { response } = require('../../../models')
const { core } = require('../../../sequelize/controllers')

router.post('/', async (req, res, next) => {
  let sid = req.body.sid || null;

  try {
    if (!sid || sid == '') {
      let arr = [
        {
          form_url: '/',
          form_icon: null,
          form_name: 'Beranda'
        },
        {
          form_url: '/Lapor',
          form_icon: null,
          form_name: 'Cara Melapor'
        },
        {
          form_url: '/FAQ',
          form_icon: null,
          form_name: 'FAQ'
        },
        {
          form_url: '/Contact',
          form_icon: null,
          form_name: 'Hubungi Kami'
        },
        {
          form_url: '/Login',
          form_icon: null,
          form_name: 'Login'
        }
      ]

      res.status(200).send(arr)
    } else {
      let o = await core.getMenu(sid, ['R']).catch(e => { throw (e) })
      res.send(o).status(200)
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router