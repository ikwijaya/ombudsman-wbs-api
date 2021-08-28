

exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('passwd').notNullable();
    table.string('remarks');
    table.boolean('is_login').defaultTo(false);
    table.timestamp('last_login');
    table.timestamp('last_logout');
    table.integer('type_id')
      .inTable('types')
      .references('id');
    table.string('fullname').notNullable();
    table.string('identity_no');
    table.string('phone_no');
    table.boolean('is_verify').notNullable().defaultTo(false);
    table.string('url_verify');
    table.timestamp('verify_date');
    table.timestamp('expires');
    table.string('url_forget');
    table.timestamp('forget_expires');

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
