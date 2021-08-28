
exports.up = function (knex, Promise) {
  return knex.schema.createTable('t_complaint_verification', function (table) {
    table.increments('idx_t_complaint_verification');
    table.integer('idx_m_complaint');
    table.integer('idx_m_complaint_rejected_type');
    table.string('verification_type').defaultTo(0);
    table.string('remarks');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('t_complaint_verification');
};
