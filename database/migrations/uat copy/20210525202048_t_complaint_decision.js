
exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_complaint_decision', function (table) {
    table.increments('idx_t_complaint_decision');
    table.integer('idx_m_complaint');
    table.integer('idx_m_disposition');
    table.integer('idx_m_violation');
    table.string('notes');
    table.string('form_status').defaultTo(0);
    table.integer('approved_by');
    table.timestamp('approved_date');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_complaint_decision');
};
