
const router = require('express').Router()
const { response } = require('../../../models')
const {
  additional, core, security,
  complaint, status, validation, action
} = require('../../../sequelize/controllers')

router.get('/:id', async (req, res, next) => {
  let sid = '222a3697-ebb1-4a6d-a39e-1aac937d392b-210624T231133' //'8b3b1514-8395-4294-a8eb-b97cc250f35f-210623T195636';
  let id = req.params.id || null;
  let obj = {
    validation: {
      idx_m_complaint: 97,
      prevention: 'prevention',
      product: 'product',
      result_obtained: 'result',
      conclusion: 'conclusion',
      step: 'step',
      date: new Date()
    },
    checklists: [
      {
        checklist: 'checklist_1'
      },
      {
        checklist: 'checklist_2'
      },
      {
        checklist: 'checklist_3'
      }
    ],
    communication: [
      {
        by: 'pengadu',
        media: 'wa',
        notes: 'heheheeh'
      },
      {
        by: 'pengadu2',
        media: 'telegram',
        notes: 'heheheeh222'
      },
      {
        by: 'pengadu3',
        media: 'wa',
        notes: 'heheheeh333'
      }
    ]
  }

  try {
    let o = [];
    o = await Promise.all([
      // additional.validationAdditional()
      // action.load(sid, 122),
      // additional.decisionAdditional(),
      // additional.complaintAdditional()
      // core.checkSession(sid),
      // core.getMenu(sid, ['I']),
      // complaint.stepper(sid, id),
      complaint.stepper_kumm(sid, id),
      // status.load(),
      // complaint.load(sid, null, [], id),
      // validation.load(sid, 97),
      // validation.saveValidation(sid, obj),
      // complaint.update(sid, {
      //   idx_m_complaint: id
      // }, true)
    ])

    res.send(o)
  } catch (err) {
    res.status(401).send(response.failed(err, []))
  }
});

module.exports = router