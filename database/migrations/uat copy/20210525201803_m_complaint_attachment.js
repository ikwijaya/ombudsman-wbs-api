
exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_complaint_attachment', function (table) {
    table.increments('idx_m_complaint_attachment');
    table.integer('idx_m_complaint');
    table.string('description');
    table.string('filename');
    table.string('path');
    table.string('mime_type');
    table.string('filesize');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_complaint_attachment');
};
