
exports.seed = function (knex) {
  return knex('m_violation').del()
    .then(function () {
      return knex('m_violation').insert([
        {
          "idx_m_violation": 1,
          "name": "Tindak Pidana Korupsi",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:34.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 2,
          "name": "Kecurangan (Fraud)",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:34.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 3,
          "name": "Tindak Pidana Lainnya",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:35.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 4,
          "name": "Pelanggaran Kode Etik dan Perilaku",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:35.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 5,
          "name": "Pelanggaran Maladministras",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:35.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 6,
          "name": "Pelanggaran Disiplin Insan Ombudsman",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:35.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 7,
          "name": "Perbuatan yang Dapat Menimbulkan\r\nKerugian Finansial atau Non-Finansial\r\nterhadap Ombudsman RI atau\r\nmerugikan Kepentingan Ombudsman RI",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:35.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 8,
          "name": "Pelanggaran Prosedur Operasi Standar\r\n(SOP) Pelaksanaan Tugas dan Fungsi",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:35.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 9,
          "name": "(SOP) Pelaksanaan Tugas dan Fungsi\r\n Pelanggaran Prosedur Operasi Standar\r\n(SOP), terkait Penanganan Laporan\r\nMasyarakat yang telah Ditutup",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:35.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_violation": 10,
          "name": "Pelanggaran Prosedur Operasi Standar\r\n(SOP), terkait Penanganan Laporan\r\nMasyarakat yang masih dalam Proses",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:44:35.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        }
      ]
      );
    });
};
