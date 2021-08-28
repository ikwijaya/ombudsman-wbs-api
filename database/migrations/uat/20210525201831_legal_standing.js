
exports.up = function (knex, Promise) {
  return knex.schema.createTable('legal_standing', function (table) {
    table.increments('id').primary();
    table.string('name');

    table.integer('sort').notNullable().defaultTo(0);
    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  }).then(() => {
    knex('legal_standing')
      .insert(data)
      .then(() => console.log('table legal_standing created'))
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('legal_standing');
};

let data = [
  // legal standing
  {
    id: 0,
    name: 'KUASA PELAPOR',
    sort: 0
  },
  {
    id: 1,
    name: 'KORBAN LANGSUNG',
    sort: 1
  },
  {
    id: 2,
    name: 'PELAKU',
    sort: 2
  },
  {
    id: 3,
    name: 'PELAPOR INDIVIDUAL',
    sort: 3
  },
  {
    id: 4,
    name: 'LAIN-LAIN',
    sort: 4
  },
]