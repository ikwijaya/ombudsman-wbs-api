

exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_option', function (table) {
    table.increments('idx_m_form');
    table.integer('option_id').notNullable();
    table.string('name');
    table.string('value').notNullable();
    table.string('text').notNullable();
    table.string('remarks');
    table.integer('order_no').notNullable().defaultTo(0);
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_option');
};
