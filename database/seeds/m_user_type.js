
exports.seed = function (knex) {
  return knex('m_user_type').del()
    .then(function () {
      return knex('m_user_type').insert([
        {
          "idx_m_user_type": 0,
          "name": "SUPERADMIN",
          "ucreate": "sa",
          "dcreate": "2021-05-17T11:33:50.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_user_type": 1,
          "name": "ADMIN INSPEKTORAT",
          "ucreate": "sa",
          "dcreate": "2021-05-17T11:34:01.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_user_type": 3,
          "name": "USER KUMM",
          "ucreate": "sa",
          "dcreate": "2021-05-17T11:40:57.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_user_type": 2,
          "name": "ADMIN KUMM",
          "ucreate": "sa",
          "dcreate": "2021-05-17T11:34:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_user_type": -1,
          "name": "PUBLIC",
          "ucreate": "sa",
          "dcreate": "2021-05-17T15:21:40.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        }
      ]
      );
    });
};
