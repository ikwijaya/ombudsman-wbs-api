
exports.up = function (knex, Promise) {
  return knex.schema.createTable('types', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.enum('type', ['source_complaint', 'user_type']).notNullable();

    table.boolean('is_fixed').notNullable().defaultTo(false);
    table.integer('sort').notNullable().defaultTo(0);
    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
    .then(() => {
      knex('types')
        .insert(data)
        .then(() => console.log('table types created'))
    })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('types');
};

let data = [
  {
    name: 'WEB',
    type: 'source_complaint',
    is_fixed: true,
    sort: 0
  },
  {
    name: 'DATANG LANGSUNG',
    type: 'source_complaint',
    sort: 1
  },
  {
    name: 'SURAT',
    type: 'source_complaint',
    sort: 2
  },
  {
    name: 'CALL CENTER 137',
    type: 'source_complaint',
    sort: 3
  },
  {
    name: 'EMAIL',
    type: 'source_complaint',
    sort: 4
  },
  {
    name: 'APLIKASI LAPOR!',
    type: 'source_complaint',
    sort: 5
  },
]