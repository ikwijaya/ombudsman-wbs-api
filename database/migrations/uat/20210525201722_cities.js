

exports.up = function (knex, Promise) {
  return knex.schema.createTable('cities', function (table) {
    table.increments('id').primary();
    table.integer('region_id')
      .unsigned()
      .notNullable()
      .inTable('regions')
      .references('id');
    table.string('name').notNullable();

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('cities');
};
