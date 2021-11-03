
const router = require('express').Router()
const { response } = require('../../../models')
const { helper } = require('../../../helper')
const { createWorker, PSM, OEM } = require('tesseract.js')
const worker = createWorker({ logger: ev => console.log('[running] ocr => ', ev) })

router.post('/', async (req, res, next) => {
  try {
    let img = req.body || {}
    if(!img.url) res.status(200).send(response.failed('Image not found!'))
    else {
      await worker.load()
      await worker.loadLanguage('eng')
      await worker.initialize('eng', OEM.LSTM_ONLY)
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      })
      let { data: { text }} = await worker.recognize(img.url)
      img['ocr_text'] = text
      delete img['url']

      res.status(200).send(response.success('OCR generated!', img))
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router