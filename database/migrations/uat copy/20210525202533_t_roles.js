

exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_roles', function (table) {
    table.increments('idx_t_roles');
    table.integer('idx_m_user').notNullable();
    table.integer('idx_m_form').notNullable();
    table.string('role_action').notNullable().defaultTo('R');
    table.boolean('role_value').defaultTo(false);
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_roles');
};
