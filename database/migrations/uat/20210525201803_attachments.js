
exports.up = function (knex, Promise) {
  return knex.schema.createTable('attachments', function (table) {
    table.increments('id').primary();
    table.integer('complaint_id');
    table.enum('for', ['complaints', 'studies', 'decisions', 'determinations']).notNullable();
    table.string('description');
    table.string('filename');
    table.string('path');
    table.string('mime_type');
    table.string('filesize');

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('attachments');
};
