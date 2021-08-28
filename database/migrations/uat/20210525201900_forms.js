

exports.up = function (knex, Promise) {
  return knex.schema.createTable('forms', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('icon');
    table.string('color').notNullable().defaultTo('white');
    table.string('url').notNullable();
    table.string('sort').notNullable().defaultTo(0);
    table.integer('parent_id');
    table.boolean('is_ro').defaultTo(false);

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('forms');
};
