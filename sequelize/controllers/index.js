const additional = require('./additional')
const core = require('./core')
const security = require('./security')
const complaint = require('./complaint')
const status = require('./status')
const validation = require('./validation')
const verification = require('./verification')
const study = require('./study')
const decision = require('./decision')
const action = require('./action')
const determination = require('./determination')
const monitoring = require('./monitoring')
const closing = require('./closing')
const download_letter = require('./download_letter')
const request = require('./request')
const clarification = require('./clarification')
const confirmation = require('./confirmation')
const study_lys = require('./study_lys')
const lhpa = require('./lhpa')
const surgery = require('./surgery')
const pleno = require('./pleno')
const delivery = require('./delivery')
const users = require('./users')
const letters = require('./letter')
const clogs = require('./clogs')
const userregion = require('./userregion')
const region = require('./region')
const usertypes = require('./usertypes')

module.exports = {
  additional, core, security,
  complaint, status, validation,
  verification, study, decision,
  action, determination, monitoring,
  closing, download_letter,
  request, clarification, confirmation,
  study_lys, lhpa, surgery, pleno, delivery,
  users, letters, clogs, userregion, region,
  usertypes
}