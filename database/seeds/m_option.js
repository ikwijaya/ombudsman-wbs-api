
exports.seed = function (knex) {
  return knex('m_option').del()
    .then(function () {
      return knex('m_option').insert([
        {
          "option_id": "0",
          "name": "GENERAL_STATUS",
          "value": "0",
          "text": "DRAFT",
          "remarks": null,
          "order_no": "0"
        },
        {
          "option_id": "0",
          "name": "GENERAL_STATUS",
          "value": "1",
          "text": "SUBMIT",
          "remarks": null,
          "order_no": "1"
        },
        {
          "option_id": "1",
          "name": "SOURCE_COMPLAINT",
          "value": "1",
          "text": "DATANG LANGSUNG",
          "remarks": null,
          "order_no": "1"
        },
        {
          "option_id": "1",
          "name": "SOURCE_COMPLAINT",
          "value": "2",
          "text": "SURAT",
          "remarks": null,
          "order_no": "2"
        },
        {
          "option_id": "1",
          "name": "SOURCE_COMPLAINT",
          "value": "3",
          "text": "CALL CENTER 137",
          "remarks": null,
          "order_no": "3"
        },
        {
          "option_id": "1",
          "name": "SOURCE_COMPLAINT",
          "value": "4",
          "text": "EMAIL",
          "remarks": null,
          "order_no": "4"
        },
        {
          "option_id": "1",
          "name": "SOURCE_COMPLAINT",
          "value": "5",
          "text": "APLIKASI LAPOR!",
          "remarks": null,
          "order_no": "5"
        },
        {
          "option_id": "1",
          "name": "SOURCE_COMPLAINT",
          "value": "0",
          "text": "WEB",
          "remarks": null,
          "order_no": "0"
        },
        {
          "option_id": "2",
          "name": "VERIFICATION_TYPE",
          "value": "0",
          "text": "DITERIMA",
          "remarks": null,
          "order_no": "0"
        },
        {
          "option_id": "2",
          "name": "VERIFICATION_TYPE",
          "value": "1",
          "text": "DITOLAK",
          "remarks": null,
          "order_no": "1"
        }
      ]);
    });
};
