

exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_form', function (table) {
    table.increments('idx_m_form');
    table.string('form_name').notNullable();
    table.string('form_icon');
    table.string('form_color').notNullable().defaultTo('white');
    table.string('form_url').notNullable();
    table.string('form_sort').notNullable().defaultTo(0);
    table.integer('idx_m_form_parent');
    table.boolean('is_read_only').defaultTo(false);
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_form');
};
