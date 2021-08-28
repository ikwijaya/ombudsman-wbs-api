
exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_complaint_action', function (table) {
    table.increments('idx_t_complaint_action');
    table.integer('idx_m_complaint');
    table.string('action_name');
    table.date('date');
    table.string('description');
    table.boolean('is_close').defaultTo(false);
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_complaint_action');
};
