
exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_complaint_incident', function (table) {
    table.increments('idx_m_complaint_incident');
    table.integer('idx_m_complaint');
    table.integer('idx_m_city');
    table.integer('idx_m_work_unit');
    table.string('office_name');
    table.string('address');
    table.date('start_date');
    table.date('end_date');
    table.string('notes');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_complaint_incident');
};
