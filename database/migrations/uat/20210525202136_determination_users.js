
exports.up = function (knex, Promise) {
  return knex.schema.createTable('determination_users', function (table) {
    table.increments('id').primary();
    table.integer('determination_id')
      .inTable('determinations')
      .references('id');
    table.integer('user_id')
      .inTable('users')
      .references('id');

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('determination_users');
};
