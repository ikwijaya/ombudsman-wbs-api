
exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_complaint_reported', function (table) {
    table.increments('idx_m_complaint_reported');
    table.integer('idx_m_complaint');
    table.string('name');
    table.string('identity_no');
    table.string('occupation');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_complaint_reported');
};
