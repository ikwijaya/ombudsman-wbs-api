
exports.up = function (knex, Promise) {
  return knex.schema.createTable('complaints', function (table) {
    table.increments('id').primary();
    table.string('form_no');
    table.timestamp('date');
    table.integer('legal_standing_id')
      .inTable('legal_standing')
      .references('id');
    table.string('manpower');
    table.string('description');
    table.string('hopes');
    table.string('source_id')
      .inTable('types')
      .references('id');
    table.boolean('is_submit').defaultTo(false);
    table.integer('status_id')
      .inTable('statuses')
      .references('id');

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('complaints');
};
