
exports.up = function (knex, Promise) {
  return knex.schema.createTable('violations', function (table) {
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
      knex('violations')
        .insert(data)
        .then(() => console.log('table violations created'))
    })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('violations');
};

let data = [
  //disposition
  {
    id: 1,
    name: 'Pemeriksaan Inspektorat',
    sort: 1
  },
  {
    id: 2,
    name: 'Pemeriksaan Keasistenan Utama Manajemen - Mutu: Proses',
    sort: 2
  },
  {
    id: 3,
    name: 'Pemeriksaan Keasistenan Utama Manajemen - Mutu: Ditutup',
    sort: 3
  },
  {
    id: 4,
    name: 'Pemeriksaan Tim Gabungan',
    sort: 4
  },
  {
    id: 5,
    name: 'Pemeriksaan Dengan Mekanisme Penegakan - Etik: Majelis Etik',
    sort: 5
  },
  {
    id: 6,
    name: 'Pemeriksaan Dengan Mekanisme Penegakan - Etik: Dewan Etik',
    sort: 6
  },
  {
    id: 7,
    name: 'Pembinaan Oleh Atasan Langsung',
    sort: 7
  },
  {
    id: 8,
    name: 'Supervisi / Monitoring Pengampu',
    sort: 8
  },
  {
    id: 9,
    name: 'Tidak Dilanjutkan dengan Pemeriksaan',
    sort: 9
  },

  // work_unit
  {
    name: 'Kantor Perwakilan Ombudsman RI',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Kepala Perwakilan Ombudsman RI',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Pimpinan Ombudsman RI',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Unit Luar Dalam Lingkup Ombudsman',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Sekretariat Jenderal Ombudsman RI',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Biro SDM dan Umum',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Unit Keasistenan Pusat',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Biro Perencanaan dan Keuangan',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Biro Hukum Kerjasama dan Organisasi',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Unit Keasistenan Perwakilan',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Inspektorat',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Biro Humas dan Teknologi Informasi',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Biro Fasilitasi dan Pelayanan Teknis',
    type: 'work_unit',
    sort: 1
  },
  {
    name: 'Unit Lainnya',
    type: 'work_unit',
    sort: 1
  },
]