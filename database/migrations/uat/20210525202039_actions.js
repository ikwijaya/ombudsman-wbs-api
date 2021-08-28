
exports.up = function (knex, Promise) {
  return knex.schema.createTable('actions', function (table) {
    table.increments('id').primary();
    table.integer('complaint_id')
      .inTable('complaints')
      .references('id');
    table.string('action_name');
    table.date('date');
    table.string('description');
    table.boolean('is_close').defaultTo(false);

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('actions');
};
