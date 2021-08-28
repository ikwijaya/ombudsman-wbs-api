
exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_complaint_study_incident', function (table) {
    table.increments('idx_t_complaint_study_incident');
    table.integer('idx_t_complaint_study');
    table.integer('idx_m_city');
    table.integer('idx_m_work_unit');
    table.date('start_date');
    table.date('end_date');
    table.string('notes');
    table.string('office_name');
    table.string('address');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_complaint_study_incident');
};
