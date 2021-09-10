/**
 * build route instant
 */

const router = require('express').Router()
const { receive } = require('../../middlewares')
const { helper } = require('../../helper')
const fs = require('fs')
const cors = require('cors')

router.use(cors())
fs.readdir(`api/v1/complaint`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint/${name}`, receive.rules(), receive.validate, require(`./complaint/${file}`))
    console.log({ route: `/complaint/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_action`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_action) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_action/${name}`, receive.rules(), receive.validate, require(`./complaint_action/${file}`))
    console.log({ route: `/complaint_action/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_verification`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_verification) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_verification/${name}`, receive.rules(), receive.validate, require(`./complaint_verification/${file}`))
    console.log({ route: `/complaint_verification/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_study`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_study) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_study/${name}`, receive.rules(), receive.validate, require(`./complaint_study/${file}`))
    console.log({ route: `/complaint_study/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_decision`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_decision) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_decision/${name}`, receive.rules(), receive.validate, require(`./complaint_decision/${file}`))
    console.log({ route: `/complaint_decision/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_determination`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_determination) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_determination/${name}`, receive.rules(), receive.validate, require(`./complaint_determination/${file}`))
    console.log({ route: `/complaint_determination/${name}`, status: 'ready' })
  });
});

// fs.readdir(`api/v1/online_msg`, async function (err, files) {
//   if (err) { return console.log(`Unable to scan directory (api/v1/online_msg) : ` + err); }
//   files.forEach(async function (file) {
//     let name = await helper.createRouteName(file).catch(e => { throw (e) })
//     router.use(`/online_msg/${name}`, receive.rules(), receive.validate, require(`./online_msg/${file}`))
//     console.log({ route: `/online_msg/${name}`, status: 'ready' })
//   });
// });

fs.readdir(`api/v1/security`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/security) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/security/${name}`, receive.rules(), receive.validate, require(`./security/${file}`))
    console.log({ route: `/security/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/others`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/others) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/others/${name}`, receive.rules(), receive.validate, require(`./others/${file}`))
    console.log({ route: `/others/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/master_users`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/master_users) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/master_users/${name}`, receive.rules(), receive.validate, require(`./master_users/${file}`))
    console.log({ route: `/master_users/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/dashboard`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/dashboard) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/dashboard/${name}`, receive.rules(), receive.validate, require(`./dashboard/${file}`))
    console.log({ route: `/dashboard/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/public`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/public) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/public/${name}`, receive.rules(), receive.validate, require(`./public/${file}`))
    console.log({ route: `/public/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_validation`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_validation) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_validation/${name}`, receive.rules(), receive.validate, require(`./complaint_validation/${file}`))
    console.log({ route: `/complaint_validation/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/download_letter`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/download_letter) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/download_letter/${name}`, receive.rules(), receive.validate, require(`./download_letter/${file}`))
    console.log({ route: `/download_letter/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_monitoring`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_monitoring) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_monitoring/${name}`, receive.rules(), receive.validate, require(`./complaint_monitoring/${file}`))
    console.log({ route: `/complaint_monitoring/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_closing`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_closing) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_closing/${name}`, receive.rules(), receive.validate, require(`./complaint_closing/${file}`))
    console.log({ route: `/complaint_closing/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_confirmation`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_confirmation) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_confirmation/${name}`, receive.rules(), receive.validate, require(`./complaint_confirmation/${file}`))
    console.log({ route: `/complaint_confirmation/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_study_lys`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_study_lys) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_study_lys/${name}`, receive.rules(), receive.validate, require(`./complaint_study_lys/${file}`))
    console.log({ route: `/complaint_study_lys/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_request`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_request) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_request/${name}`, receive.rules(), receive.validate, require(`./complaint_request/${file}`))
    console.log({ route: `/complaint_request/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_clarification`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_clarification) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_clarification/${name}`, receive.rules(), receive.validate, require(`./complaint_clarification/${file}`))
    console.log({ route: `/complaint_clarification/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_lhpa`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_lhpa) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_lhpa/${name}`, receive.rules(), receive.validate, require(`./complaint_lhpa/${file}`))
    console.log({ route: `/complaint_lhpa/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_surgery`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_surgery) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_surgery/${name}`, receive.rules(), receive.validate, require(`./complaint_surgery/${file}`))
    console.log({ route: `/complaint_surgery/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_pleno`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_pleno) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_pleno/${name}`, receive.rules(), receive.validate, require(`./complaint_pleno/${file}`))
    console.log({ route: `/complaint_pleno/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_delivery`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_delivery) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_delivery/${name}`, receive.rules(), receive.validate, require(`./complaint_delivery/${file}`))
    console.log({ route: `/complaint_delivery/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/complaint_letter`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/complaint_letter) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/complaint_letter/${name}`, receive.rules(), receive.validate, require(`./complaint_letter/${file}`))
    console.log({ route: `/complaint_letter/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/clogs`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/clogs) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/clogs/${name}`, receive.rules(), receive.validate, require(`./clogs/${file}`))
    console.log({ route: `/clogs/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/user_region`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/user_region) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/user_region/${name}`, receive.rules(), receive.validate, require(`./user_region/${file}`))
    console.log({ route: `/user_region/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/master_violation`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/master_violation) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/master_violation/${name}`, receive.rules(), receive.validate, require(`./master_violation/${file}`))
    console.log({ route: `/master_violation/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/master_work_unit`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/master_work_unit) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/master_work_unit/${name}`, receive.rules(), receive.validate, require(`./master_work_unit/${file}`))
    console.log({ route: `/master_work_unit/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/master_legal_standing`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/master_legal_standing) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/master_legal_standing/${name}`, receive.rules(), receive.validate, require(`./master_legal_standing/${file}`))
    console.log({ route: `/master_legal_standing/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/master_rejected_type`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/master_rejected_type) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/master_rejected_type/${name}`, receive.rules(), receive.validate, require(`./master_rejected_type/${file}`))
    console.log({ route: `/master_rejected_type/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/master_city`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/master_city) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/master_city/${name}`, receive.rules(), receive.validate, require(`./master_city/${file}`))
    console.log({ route: `/master_city/${name}`, status: 'ready' })
  });
});

fs.readdir(`api/v1/master_region`, async function (err, files) {
  if (err) { return console.log(`Unable to scan directory (api/v1/master_region) : ` + err); }
  files.forEach(async function (file) {
    let name = await helper.createRouteName(file).catch(e => { throw (e) })
    router.use(`/master_region/${name}`, receive.rules(), receive.validate, require(`./master_region/${file}`))
    console.log({ route: `/master_region/${name}`, status: 'ready' })
  });
});

module.exports = router