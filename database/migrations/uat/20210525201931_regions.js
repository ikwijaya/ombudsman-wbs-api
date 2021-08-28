
exports.up = function (knex, Promise) {
  return knex.schema.createTable('regions', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('regions');
};