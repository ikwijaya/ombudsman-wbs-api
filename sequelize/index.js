/**
 * Connection for knex instance
 * Digunakan untuk seluruhnya yg menggunakan ORM
 */
const { SQ_LOG, DB_SSL, DB_URL, DB_CLIENT } = require('../config')
const { Sequelize } = require('sequelize')
const { applyExtraSetup } = require('./extraSetup')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'api-v2.ombudsman' })
const logger = (msg) => { log.info(msg) }
const _DB_SSL = DB_SSL == '1' ? true : false

const sequelize = new Sequelize(DB_URL, {
  dialect: DB_CLIENT,
  dialectOptions: { 
    ssl: _DB_SSL ? { require: true, rejectUnauthorized: false } : null,
    connectTimeout: 60000 
  },
  pool: {
    max: 500,
    min: 0,
    acquire: 10000
  },
  logging: SQ_LOG == 'bunyan' ? logger : SQ_LOG == '1' ? true : false
});

const modelDefiners = [
  require('./models/city.models'),
  require('./models/complaint_actions.models'),
  require('./models/complaint_attachments.models'),
  require('./models/complaint_decision_violations.models'),
  require('./models/complaint_decisions.models'),
  require('./models/complaint_determination_users.models'),
  require('./models/complaint_determinations.models'),
  require('./models/complaint_events.models'),
  require('./models/complaint_incidents.models'),
  require('./models/complaint_rejected_types.models'),
  require('./models/complaint_reported.models'),
  require('./models/complaint_studies'),
  require('./models/complaint_study_events.models'),
  require('./models/complaint_study_incidents.models'),
  require('./models/complaint_study_reported.models'),
  require('./models/complaint_study_attachments.models'),
  require('./models/complaint_study_violations.models'),
  require('./models/complaint_verifications.models'),
  require('./models/complaint_violations.models'),
  require('./models/complaints.models'),
  require('./models/dispositions.models'),
  require('./models/forms.models'),
  require('./models/legal_standing.models'),
  require('./models/options.models'),
  require('./models/regions.models'),
  require('./models/roles.models'),
  require('./models/user_types.model'),
  require('./models/user_regions.model'),
  require('./models/users.models'),
  require('./models/violations.models'),
  require('./models/work_units.models'),
  require('./models/sessions.models'),
  require('./models/status.models'),
  require('./models/complaint_decision_attachments.models'),
  require('./models/complaint_validation.models'),
  require('./models/complaint_validation_communication.models'),
  require('./models/complaint_validation_checklist.models'),
  require('./models/complaint_monitoring.models'),
  require('./models/complaint_monitoring_detail.models'),
  require('./models/complaint_closing.models'),
  require('./models/complaint_request.models'),
  require('./models/complaint_request_attachment.models'),
  require('./models/complaint_clarification.models'),
  require('./models/complaint_clarification_detail.models'),
  require('./models/complaint_confirmation.models'),
  require('./models/complaint_study_lys.models'),
  require('./models/complaint_study_lys_violation.models'),
  require('./models/complaint_study_lys_event.models'),
  require('./models/complaint_surgery.models'),
  require('./models/complaint_surgery_users.models'),
  require('./models/complaint_lhpa.models'),
  require('./models/complaint_lhpa_actions.models'),
  require('./models/complaint_lhpa_act_detail.models'),
  require('./models/complaint_lhpa_events.models'),
  require('./models/complaint_delivery.models'),
  require('./models/complaint_letter.models'),
  require('./models/complaint_logs.models'),
  require('./models/complaint_pleno.models'),
  require('./models/form_types.model')
];

for (let m of modelDefiners) { m(sequelize); }
applyExtraSetup(sequelize)

module.exports = sequelize;