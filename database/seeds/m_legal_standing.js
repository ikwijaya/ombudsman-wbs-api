
exports.seed = function (knex) {
  return knex('m_legal_standing').del()
    .then(function () {
      return knex('m_legal_standing').insert(
        [
          {
            "idx_m_legal_standing": 1,
            "name": "Korban Langsung",
            "ucreate": "sa",
            "dcreate": "2021-05-10T13:48:22.000Z",
            "umodified": null,
            "dmodified": null,
            "record_status": "A"
          },
          {
            "idx_m_legal_standing": 2,
            "name": "Pelaku",
            "ucreate": "sa",
            "dcreate": "2021-05-10T13:48:22.000Z",
            "umodified": null,
            "dmodified": null,
            "record_status": "A"
          },
          {
            "idx_m_legal_standing": 3,
            "name": "Pelapor Individual",
            "ucreate": "sa",
            "dcreate": "2021-05-10T13:48:22.000Z",
            "umodified": null,
            "dmodified": null,
            "record_status": "A"
          },
          {
            "idx_m_legal_standing": 5,
            "name": "Lain - Lain",
            "ucreate": "sa",
            "dcreate": "2021-05-10T13:48:22.000Z",
            "umodified": null,
            "dmodified": null,
            "record_status": "A"
          },
          {
            "idx_m_legal_standing": -1,
            "name": "Kuasa Pelapor",
            "ucreate": "sa",
            "dcreate": "2021-05-10T13:48:22.000Z",
            "umodified": null,
            "dmodified": null,
            "record_status": "A"
          }
        ]
      );
    });
};
