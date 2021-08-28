

exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_session', function (table) {
    table.increments('idx_t_session');
    table.integer('user_id').notNullable();
    table.string('type').notNullable().defaultTo('PUBLIC');
    table.string('sid').notNullable();
    table.timestamp('expires').notNullable();
    table.boolean('role_value').defaultTo(false);
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_session');
};
