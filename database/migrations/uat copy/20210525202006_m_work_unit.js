

exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_work_unit', function (table) {
    table.increments('idx_m_work_unit');
    table.string('name').notNullable();
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_work_unit');
};
