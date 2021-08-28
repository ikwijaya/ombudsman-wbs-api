

exports.up = function (knex, Promise) {
  return knex.schema.createTable('m_user', function (table) {
    table.increments('idx_m_user');
    table.string('email').notNullable();
    table.string('passwd').notNullable();
    table.string('remarks');
    table.boolean('is_login').defaultTo(false);
    table.timestamp('last_login');
    table.timestamp('last_logout');
    table.integer('idx_m_user_type').notNullable();
    table.string('fullname').notNullable();
    table.string('identity_no');
    table.string('phone_no');
    table.boolean('is_verify').notNullable().defaultTo(false);
    table.string('url_verify');
    table.timestamp('verify_date');
    table.timestamp('expires');
    table.string('url_forget');
    table.timestamp('forget_expires');
    table.string('ucreate').notNullable().defaultTo('sa');
    table.timestamp('dcreate').defaultTo(knex.fn.now());
    table.string('umodified');
    table.timestamp('dmodified');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('m_user');
};
