
const router = require('express').Router()
const { response } = require('../../../models')
const { helper } = require('../../../helper')
const { createWorker, PSM, OEM } = require('tesseract.js')
const worker = createWorker({ logger: ev => console.log('[running] ocr => ', ev) })

router.post('/', async (req, res, next) => {
  try {
    let url = req.body.url || null
    let filename = req.body.filename || null

    if(!url) res.status(200).send(response.failed(`Image ${filename} not found!`))
    else {
      await worker.load()
      await worker.loadLanguage('eng')
      await worker.initialize('eng', OEM.LSTM_ONLY)
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      })
      let { data: { text }} = await worker.recognize(url)
      res.status(200).send(response.success('OCR generated!', {
        filename: filename,
        ocr_text: text
      }))
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router