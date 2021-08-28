

exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_violation', function (table) {
    table.increments('idx_m_violation');
    table.string('name').notNullable();
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_violation');
};
