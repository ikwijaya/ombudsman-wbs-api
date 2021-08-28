
exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_complaint_determination_user', function (table) {
    table.increments('idx_t_complaint_determination_user');
    table.integer('idx_t_complaint_determination');
    table.integer('idx_m_user');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_complaint_determination_user');
};
