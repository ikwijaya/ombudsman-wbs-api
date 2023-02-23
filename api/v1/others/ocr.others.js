
const router = require('express').Router()
const { response } = require('../../../models')
const { helper } = require('../../../helper')
const CPM = require('connect-multiparty')
const multiparty = CPM();
const { createWorker, PSM, OEM } = require('tesseract.js')
const worker = createWorker({
  // logger: ev => console.log('[running] ocr => ', ev),
  errorHandler: (err) => { return err }
})

router.post('/', multiparty, async (req, res, next) => {
  try {
    let upload = req.files.upload || []
    let url = upload.path;
    let filename = upload.originalFilename

    // console.log(` ${upload.size / 1000}`)

    if (!url) res.status(200).send(response.failed(`Image ${filename} not found!`))
    else if (upload.size / 1000 > 5000) res.status(200).send(response.failed(`Gambar Tidak lebih dari 1MB`))
    else {
      await worker.load().catch(e => { throw (e) })
      await worker.loadLanguage('ind').catch(e => { throw (e) })
      await worker.initialize('ind', OEM.LSTM_ONLY).catch(e => { throw (e) })
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      }).catch(e => { throw (e) })
      let { data: { text } } = await worker.recognize(url).catch(e => { throw (e) })

      /**
       * final
       */
      const arr = !text ? null : text.split("\n")
      const c = await extract(arr);
      if (!c) res.status(200).send(response.failed(`Kami TIDAK dapat memindai gambar dengan baik, karena pencahayaan pada gambar kurang.`))
      else if (!c.nik) res.status(200).send(response.failed(`Kami TIDAK dapat memindai gambar dengan baik, karena pencahayaan pada gambar kurang.`))
      else {
        res.status(200).send(response.success('OCR generated!', {
          filename: filename,
          ocr: {
            // text: text,
            arr:  process.env.NODE_ENV.match(/dev/g) ? arr : [],
            data: await extract(arr),
          }
        }))
      }
    }
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router

/**
 * 
 * @param {*} arr 
 * @returns 
 */
const extract = async (arr = []) => {
  return new Promise((ok) => {
    if (arr.length == 0) return ok(null)

    let o = {}
    arr.forEach(e => {
      if (e.includes('NIK')) o['identityType'] = 'KTP'
      else if (e.includes('DRIVING LICENSE')) o['identityType'] = 'SIM'

      if (e.match(/(NIK|nik)/g)) {
        const nik = e.replace(/([A-Za-z])|(\s+)|([:?\-:&*%^()$#@!_+=~`])/g, '');
        o['nik'] = nik
        console.log(`nik`, nik) 
      }
    });

    return ok(o)
  })
}