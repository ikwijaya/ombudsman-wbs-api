
exports.up = function (knex, Promise) {
  return knex.schema.createTable('incidents', function (table) {
    table.increments('id').primary();
    table.integer('complaint_id');
    table.enum('for', ['complaints', 'studies', 'decisions', 'determinations']).notNullable();
    table.integer('city_id')
      .inTable('cities')
      .references('id');
    table.integer('work_unit_id')
      .inTable('work_unit')
      .references('id');
    table.string('office_name');
    table.string('address');
    table.date('start_date');
    table.date('end_date');
    table.string('notes');

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('incidents');
};
