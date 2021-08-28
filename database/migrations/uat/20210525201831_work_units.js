
exports.up = function (knex, Promise) {
  return knex.schema.createTable('work_units', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.integer('sort').notNullable().defaultTo(0);

    table.string('created_by').notNullable().defaultTo('sa');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('modified_by');
    table.timestamp('updated_at');
    table.string('record_status').notNullable().defaultTo('A');
  })
    .then(() => {
      knex('work_units')
        .insert(data)
        .then(() => console.log('table work_units created'))
    })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('work_units');
};

let data = [
  {
    name: 'Kantor Perwakilan Ombudsman RI',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Kepala Perwakilan Ombudsman RI',
    type: 'work_unit',
    sort: 2
  },
  {
    name: 'Pimpinan Ombudsman RI',
    type: 'work_unit',
    sort: 3
  },
  {
    name: 'Unit Luar Dalam Lingkup Ombudsman',
    type: 'work_unit',
    sort: 4
  },
  {
    name: 'Sekretariat Jenderal Ombudsman RI',
    type: 'work_unit',
    sort: 5
  },
  {
    name: 'Biro SDM dan Umum',
    type: 'work_unit',
    sort: 6
  },
  {
    name: 'Unit Keasistenan Pusat',
    type: 'work_unit',
    sort: 7
  },
  {
    name: 'Biro Perencanaan dan Keuangan',
    type: 'work_unit',
    sort: 8
  },
  {
    name: 'Biro Hukum Kerjasama dan Organisasi',
    type: 'work_unit',
    sort: 9
  },
  {
    name: 'Unit Keasistenan Perwakilan',
    type: 'work_unit',
    sort: 10
  },
  {
    name: 'Inspektorat',
    type: 'work_unit',
    sort: 11
  },
  {
    name: 'Biro Humas dan Teknologi Informasi',
    type: 'work_unit',
    sort: 12
  },
  {
    name: 'Biro Fasilitasi dan Pelayanan Teknis',
    type: 'work_unit',
    sort: 13
  },
  {
    name: 'Unit Lainnya',
    type: 'work_unit',
    sort: 14
  },
]