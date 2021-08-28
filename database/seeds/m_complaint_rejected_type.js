
exports.seed = function (knex) {
  return knex('m_complaint_rejected_type').del()
    .then(function () {
      // Inserts seed entries
      return knex('m_complaint_rejected_type').insert([
        {
          "idx_m_complaint_rejected_type": 1,
          "name": "Pengadu bukan Pelapor\/Kuasa Pelapor\/Kuasa Pengadu\/Terlapor\/Pihak Terkait",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:30:03.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_complaint_rejected_type": 2,
          "name": "Teradu bukan Insan Ombudsman RI\/ Keasistenan Utama\/ Perwakilan\r\nOmbudsman",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:30:03.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_complaint_rejected_type": 3,
          "name": "Pengaduan yang disampaikan telah lewat batas waktu yang ditetapkan",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:30:03.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_complaint_rejected_type": 4,
          "name": "Pengaduan yang disampaikan sama dengan pengaduan yang telah disampaikan\r\nsebelumnya (Nebis In Idem)",
          "ucreate": "sa",
          "dcreate": "2021-05-10T13:30:03.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        }
      ]);
    });
};
