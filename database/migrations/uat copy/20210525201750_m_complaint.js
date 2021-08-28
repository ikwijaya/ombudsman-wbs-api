
exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_complaint', function (table) {
    table.increments('idx_m_complaint');
    table.string('form_no');
    table.date('date');
    table.integer('idx_m_account');
    table.integer('idx_m_legal_standing');
    table.string('manpower');
    table.integer('idx_m_violation');
    table.string('description');
    table.string('hopes');
    table.string('source_complaint').defaultTo(0);
    table.string('form_status').defaultTo(0);
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_complaint');
};
