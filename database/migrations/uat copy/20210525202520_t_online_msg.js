
exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_online_msg', function (table) {
    table.increments('idx_t_online_msg');
    table.integer('sender');
    table.integer('receiver');
    table.string('subject');
    table.string('body');
    table.integer('parent_id');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_online_msg');
};
