
exports.up = function (knex, Promise) {
  return knex.schema.createTable('statuses', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.string('color');
    table.string('code');

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('statuses');
};
