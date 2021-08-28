
exports.up = function (knex, Promise) {
  return knex.schema.createTable('dispositions', function (table) {
    table.increments('id').primary();
    table.string('name');

    table.integer('sort').notNullable().defaultTo(0);
    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('dispositions');
};
