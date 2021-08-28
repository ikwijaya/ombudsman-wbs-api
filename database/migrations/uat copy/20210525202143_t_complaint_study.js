
exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_complaint_study', function (table) {
    table.increments('idx_t_complaint_study');
    table.integer('idx_m_complaint');
    table.integer('idx_m_disposition');
    table.integer('idx_m_violation');
    table.string('notes');
    table.string('form_status').defaultTo(0);
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_complaint_study');
};
