

exports.up = function (knex, Promise) {
  return knex.schema.createTable('study_violations', function (table) {
    table.increments('id').primary();
    table.integer('study_id')
      .notNullable()
      .inTable('studies')
      .references('id');
    table.integer('violation_id')
      .notNullable()
      .inTable('violations')
      .references('id');

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('study_violations');
};
