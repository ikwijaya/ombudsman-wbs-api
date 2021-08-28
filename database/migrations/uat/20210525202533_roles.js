

exports.up = function (knex, Promise) {
  return knex.schema.createTable('roles', function (table) {
    table.increments('id').primary();
    table.integer('user_id')
      .inTable('users')
      .references('id');
    table.integer('form_id')
      .inTable('forms')
      .references('id');
    table.string('role_action').notNullable().defaultTo('R');
    table.boolean('role_value').defaultTo(false);

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('roles');
};
