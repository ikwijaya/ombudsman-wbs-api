
exports.seed = function (knex) {
  return knex('m_form').del()
    .then(function () {
      return knex('m_form').insert([
        {
          "idx_m_form": 2,
          "form_name": "Pengaduan",
          "form_icon": "mdi-chart-donut",
          "form_color": "red",
          "form_url": "\/Pengaduan",
          "form_sort": "1",
          "idx_m_form_parent": null,
          "is_read_only": false,
          "ucreate": "sa",
          "dcreate": "2021-05-17T11:43:25.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_form": 9999,
          "form_name": "Online Message",
          "form_icon": "mdi-chart-donut",
          "form_color": "red",
          "form_url": "\/OnlineMsg",
          "form_sort": "9",
          "idx_m_form_parent": null,
          "is_read_only": true,
          "ucreate": "sa",
          "dcreate": "2021-05-17T11:59:50.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_form": 1,
          "form_name": "Dashboard",
          "form_icon": "mdi-chart-donut",
          "form_color": "white",
          "form_url": "\/Dashboard",
          "form_sort": "0",
          "idx_m_form_parent": null,
          "is_read_only": true,
          "ucreate": "sa",
          "dcreate": "2021-05-11T05:22:17.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_form": 3,
          "form_name": "Telaah Pengaduan",
          "form_icon": "mdi-glasses",
          "form_color": "blue darken-1",
          "form_url": "\/TelaahPengaduan",
          "form_sort": "2",
          "idx_m_form_parent": 9998,
          "is_read_only": false,
          "ucreate": "sa",
          "dcreate": "2021-05-21T13:22:53.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_form": 9998,
          "form_name": "Module",
          "form_icon": "mdi-chart-donut",
          "form_color": "red",
          "form_url": "\/ModulApps",
          "form_sort": "2",
          "idx_m_form_parent": null,
          "is_read_only": false,
          "ucreate": "sa",
          "dcreate": "2021-05-21T13:31:04.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_form": 4,
          "form_name": "Putusan Anggota Ombudsman Pengampu WBS",
          "form_icon": "mdi-comma",
          "form_color": "black",
          "form_url": "\/PengampuWBS",
          "form_sort": "3",
          "idx_m_form_parent": 9998,
          "is_read_only": false,
          "ucreate": "sa",
          "dcreate": "2021-05-21T13:24:07.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_form": 5,
          "form_name": "Verifikasi Persyaratan",
          "form_icon": "mdi-shield",
          "form_color": "red",
          "form_url": null,
          "form_sort": "0",
          "idx_m_form_parent": 2,
          "is_read_only": true,
          "ucreate": "sa",
          "dcreate": "2021-05-21T13:25:10.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_form": 6,
          "form_name": "Penanganan Pengaduan Oleh Inspektorat \/ Unit Kerja Terkait",
          "form_icon": "mdi-hand-heart",
          "form_color": "pink lighten-1",
          "form_url": "\/PenangananPengaduan",
          "form_sort": "4",
          "idx_m_form_parent": 9998,
          "is_read_only": false,
          "ucreate": "sa",
          "dcreate": "2021-05-21T13:28:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_form": 7,
          "form_name": "Penerimaan Penugasan oleh KUMM",
          "form_icon": "mdi-skull-scan",
          "form_color": "red darken-1",
          "form_url": "\/PemeriksaanPengaduan",
          "form_sort": "5",
          "idx_m_form_parent": 9998,
          "is_read_only": false,
          "ucreate": "sa",
          "dcreate": "2021-05-21T13:29:16.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        }
      ]
      );
    });
};
