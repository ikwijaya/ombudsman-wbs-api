

exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_account', function (table) {
    table.increments('idx_m_account');
    table.string('fullname').notNullable();
    table.string('occupation');
    table.string('email').notNullable();
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_account');
};
