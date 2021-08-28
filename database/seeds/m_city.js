
exports.seed = function (knex) {
  return knex('m_city').del()
    .then(function () {
      return knex('m_city').insert([
        {
          "idx_m_city": 1,
          "idx_m_region": 22,
          "name": "KOTA KEDIRI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 2,
          "idx_m_region": 6,
          "name": "KOTA MAGELANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 3,
          "idx_m_region": 5,
          "name": "KABUPATEN SINTANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 4,
          "idx_m_region": 32,
          "name": "KABUPATEN TOLIKARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 5,
          "idx_m_region": 23,
          "name": "KABUPATEN MURUNG RAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 6,
          "idx_m_region": 6,
          "name": "KABUPATEN PURBALINGGA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 7,
          "idx_m_region": 9,
          "name": "KOTA KUPANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 8,
          "idx_m_region": 22,
          "name": "KABUPATEN TRENGGALEK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 9,
          "idx_m_region": 12,
          "name": "KABUPATEN KARAWANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 10,
          "idx_m_region": 34,
          "name": "KOTA TOMOHON",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 11,
          "idx_m_region": 22,
          "name": "KABUPATEN BLITAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 12,
          "idx_m_region": 4,
          "name": "KABUPATEN HALMAHERA TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 13,
          "idx_m_region": 28,
          "name": "KABUPATEN MAHAKAM HULU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 14,
          "idx_m_region": 1,
          "name": "KABUPATEN BENGKULU TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 15,
          "idx_m_region": 10,
          "name": "KABUPATEN TULANGBAWANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 16,
          "idx_m_region": 31,
          "name": "KOTA PADANG PANJANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 17,
          "idx_m_region": 8,
          "name": "KABUPATEN BANGGAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 18,
          "idx_m_region": 29,
          "name": "KABUPATEN PINRANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 19,
          "idx_m_region": 9,
          "name": "KABUPATEN ROTE NDAO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 20,
          "idx_m_region": 31,
          "name": "KABUPATEN LIMA PULUH KOTA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 21,
          "idx_m_region": 1,
          "name": "KABUPATEN SELUMA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 22,
          "idx_m_region": 32,
          "name": "KABUPATEN BOVEN DIGOEL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 23,
          "idx_m_region": 4,
          "name": "KOTA TERNATE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 24,
          "idx_m_region": 2,
          "name": "KOTA SERANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 25,
          "idx_m_region": 14,
          "name": "KABUPATEN BANJAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 26,
          "idx_m_region": 6,
          "name": "KABUPATEN BANJARNEGARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 27,
          "idx_m_region": 33,
          "name": "KABUPATEN SORONG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 28,
          "idx_m_region": 22,
          "name": "KOTA BATU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 29,
          "idx_m_region": 31,
          "name": "KABUPATEN SIJUNJUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 30,
          "idx_m_region": 12,
          "name": "KABUPATEN BEKASI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 31,
          "idx_m_region": 26,
          "name": "KABUPATEN ROKAN HULU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 32,
          "idx_m_region": 16,
          "name": "KABUPATEN SAROLANGUN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 33,
          "idx_m_region": 27,
          "name": "KABUPATEN TAPANULI SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 34,
          "idx_m_region": 26,
          "name": "KABUPATEN ROKAN HILIR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 35,
          "idx_m_region": 32,
          "name": "KABUPATEN ASMAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 36,
          "idx_m_region": 1,
          "name": "KOTA BENGKULU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 37,
          "idx_m_region": 32,
          "name": "KABUPATEN YALIMO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 38,
          "idx_m_region": 1,
          "name": "KABUPATEN KAUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 39,
          "idx_m_region": 22,
          "name": "KABUPATEN BONDOWOSO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 40,
          "idx_m_region": 32,
          "name": "KABUPATEN YAHUKIMO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 41,
          "idx_m_region": 28,
          "name": "KOTA BONTANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 42,
          "idx_m_region": 3,
          "name": "KOTA SUBULUSSALAM",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 43,
          "idx_m_region": 17,
          "name": "KABUPATEN MALUKU TENGGARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 44,
          "idx_m_region": 26,
          "name": "KABUPATEN S I A K",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 45,
          "idx_m_region": 29,
          "name": "KABUPATEN BULUKUMBA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 46,
          "idx_m_region": 20,
          "name": "KABUPATEN MUSI RAWAS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 47,
          "idx_m_region": 7,
          "name": "KOTA JAKARTA TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 48,
          "idx_m_region": 26,
          "name": "KOTA PEKANBARU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 49,
          "idx_m_region": 8,
          "name": "KABUPATEN MOROWALI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 50,
          "idx_m_region": 34,
          "name": "KABUPATEN BOLAANG MONGONDOW TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 51,
          "idx_m_region": 27,
          "name": "KABUPATEN DAIRI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 52,
          "idx_m_region": 18,
          "name": "KABUPATEN KONAWE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 53,
          "idx_m_region": 3,
          "name": "KOTA LHOKSEUMAWE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 54,
          "idx_m_region": 11,
          "name": "KABUPATEN BADUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 55,
          "idx_m_region": 31,
          "name": "KABUPATEN DHARMASRAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 56,
          "idx_m_region": 31,
          "name": "KOTA PARIAMAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 57,
          "idx_m_region": 27,
          "name": "KOTA PEMATANG SIANTAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 58,
          "idx_m_region": 1,
          "name": "KABUPATEN REJANG LEBONG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 59,
          "idx_m_region": 18,
          "name": "KABUPATEN KOLAKA UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 60,
          "idx_m_region": 9,
          "name": "KABUPATEN TIMOR TENGAH UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 61,
          "idx_m_region": 27,
          "name": "KABUPATEN MANDAILING NATAL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 62,
          "idx_m_region": 18,
          "name": "KABUPATEN BUTON UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 63,
          "idx_m_region": 30,
          "name": "KABUPATEN BANGKA BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 64,
          "idx_m_region": 25,
          "name": "KABUPATEN NATUNA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 65,
          "idx_m_region": 30,
          "name": "KABUPATEN BELITUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 66,
          "idx_m_region": 29,
          "name": "KABUPATEN WAJO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 67,
          "idx_m_region": 29,
          "name": "KABUPATEN TAKALAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 68,
          "idx_m_region": 6,
          "name": "KABUPATEN SUKOHARJO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 69,
          "idx_m_region": 19,
          "name": "KABUPATEN POHUWATO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 70,
          "idx_m_region": 6,
          "name": "KOTA SEMARANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 71,
          "idx_m_region": 6,
          "name": "KABUPATEN BATANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 72,
          "idx_m_region": 22,
          "name": "KABUPATEN SITUBONDO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 73,
          "idx_m_region": 27,
          "name": "KABUPATEN SERDANG BEDAGAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 74,
          "idx_m_region": 12,
          "name": "KOTA BANJAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 75,
          "idx_m_region": 5,
          "name": "KABUPATEN LANDAK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 76,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 77,
          "idx_m_region": 6,
          "name": "KABUPATEN BREBES",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 78,
          "idx_m_region": 29,
          "name": "KABUPATEN LUWU TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 79,
          "idx_m_region": 4,
          "name": "KABUPATEN HALMAHERA BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 80,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 81,
          "idx_m_region": 32,
          "name": "KABUPATEN MAMBERAMO RAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 82,
          "idx_m_region": 17,
          "name": "KABUPATEN MALUKU TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 83,
          "idx_m_region": 6,
          "name": "KABUPATEN WONOSOBO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 84,
          "idx_m_region": 22,
          "name": "KOTA SURABAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 85,
          "idx_m_region": 22,
          "name": "KABUPATEN KEDIRI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 86,
          "idx_m_region": 8,
          "name": "KABUPATEN TOLI-TOLI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 87,
          "idx_m_region": 5,
          "name": "KABUPATEN KAYONG UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 88,
          "idx_m_region": 6,
          "name": "KABUPATEN GROBOGAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 89,
          "idx_m_region": 33,
          "name": "KABUPATEN MANOKWARI SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 90,
          "idx_m_region": 9,
          "name": "KABUPATEN TIMOR TENGAH SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 91,
          "idx_m_region": 31,
          "name": "KABUPATEN AGAM",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 92,
          "idx_m_region": 9,
          "name": "KABUPATEN MANGGARAI BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 93,
          "idx_m_region": 31,
          "name": "KOTA SOLOK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 94,
          "idx_m_region": 28,
          "name": "KOTA SAMARINDA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 95,
          "idx_m_region": 29,
          "name": "KABUPATEN TORAJA UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 96,
          "idx_m_region": 16,
          "name": "KABUPATEN TANJUNG JABUNG BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 97,
          "idx_m_region": 19,
          "name": "KABUPATEN GORONTALO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 98,
          "idx_m_region": 22,
          "name": "KABUPATEN GRESIK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 99,
          "idx_m_region": 26,
          "name": "KABUPATEN INDRAGIRI HILIR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 100,
          "idx_m_region": 24,
          "name": "KABUPATEN POLEWALI MANDAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 101,
          "idx_m_region": 32,
          "name": "KABUPATEN JAYAPURA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 102,
          "idx_m_region": 9,
          "name": "KABUPATEN KUPANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 103,
          "idx_m_region": 34,
          "name": "KABUPATEN BOLAANG MONGONDOW SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 104,
          "idx_m_region": 20,
          "name": "KABUPATEN OGAN KOMERING ILIR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 105,
          "idx_m_region": 34,
          "name": "KOTA MANADO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 106,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH BARAT DAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 107,
          "idx_m_region": 5,
          "name": "KOTA PONTIANAK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 108,
          "idx_m_region": 12,
          "name": "KABUPATEN CIAMIS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 109,
          "idx_m_region": 11,
          "name": "KABUPATEN BANGLI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 110,
          "idx_m_region": 6,
          "name": "KABUPATEN BLORA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 111,
          "idx_m_region": 16,
          "name": "KABUPATEN BUNGO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 112,
          "idx_m_region": 26,
          "name": "KABUPATEN PELALAWAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 113,
          "idx_m_region": 27,
          "name": "KABUPATEN PAKPAK BHARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 114,
          "idx_m_region": 23,
          "name": "KABUPATEN KAPUAS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 115,
          "idx_m_region": 12,
          "name": "KOTA BANDUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 116,
          "idx_m_region": 31,
          "name": "KABUPATEN TANAH DATAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 117,
          "idx_m_region": 8,
          "name": "KABUPATEN MOROWALI UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 118,
          "idx_m_region": 14,
          "name": "KABUPATEN TAPIN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 119,
          "idx_m_region": 34,
          "name": "KABUPATEN SIAU TAGULANDANG BIARO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 120,
          "idx_m_region": 33,
          "name": "KABUPATEN MAYBRAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 121,
          "idx_m_region": 28,
          "name": "KABUPATEN BERAU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 122,
          "idx_m_region": 24,
          "name": "KABUPATEN MAJENE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 123,
          "idx_m_region": 31,
          "name": "KOTA SAWAH LUNTO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 124,
          "idx_m_region": 10,
          "name": "KABUPATEN LAMPUNG SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 125,
          "idx_m_region": 22,
          "name": "KABUPATEN PAMEKASAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 126,
          "idx_m_region": 20,
          "name": "KABUPATEN EMPAT LAWANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 127,
          "idx_m_region": 34,
          "name": "KABUPATEN MINAHASA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 128,
          "idx_m_region": 5,
          "name": "KABUPATEN SANGGAU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 129,
          "idx_m_region": 11,
          "name": "KABUPATEN GIANYAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 130,
          "idx_m_region": 3,
          "name": "KABUPATEN NAGAN RAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 131,
          "idx_m_region": 23,
          "name": "KABUPATEN BARITO SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 132,
          "idx_m_region": 22,
          "name": "KABUPATEN BOJONEGORO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 133,
          "idx_m_region": 29,
          "name": "KABUPATEN TANA TORAJA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 134,
          "idx_m_region": 33,
          "name": "KABUPATEN RAJA AMPAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 135,
          "idx_m_region": 27,
          "name": "KABUPATEN LANGKAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 136,
          "idx_m_region": 22,
          "name": "KOTA MALANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 137,
          "idx_m_region": 29,
          "name": "KABUPATEN SIDENRENG RAPPANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 138,
          "idx_m_region": 20,
          "name": "KABUPATEN BANYU ASIN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 139,
          "idx_m_region": 17,
          "name": "KABUPATEN MALUKU TENGGARA BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 140,
          "idx_m_region": 14,
          "name": "KABUPATEN BALANGAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 141,
          "idx_m_region": 25,
          "name": "KABUPATEN KEPULAUAN ANAMBAS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 142,
          "idx_m_region": 29,
          "name": "KABUPATEN JENEPONTO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 143,
          "idx_m_region": 12,
          "name": "KABUPATEN TASIKMALAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 144,
          "idx_m_region": 22,
          "name": "KABUPATEN MAGETAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 145,
          "idx_m_region": 13,
          "name": "KABUPATEN SUMBAWA BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 146,
          "idx_m_region": 2,
          "name": "KABUPATEN PANDEGLANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 147,
          "idx_m_region": 29,
          "name": "KABUPATEN BONE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 148,
          "idx_m_region": 12,
          "name": "KABUPATEN KUNINGAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 149,
          "idx_m_region": 22,
          "name": "KABUPATEN SUMENEP",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 150,
          "idx_m_region": 34,
          "name": "KOTA KOTAMOBAGU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 151,
          "idx_m_region": 33,
          "name": "KABUPATEN TELUK WONDAMA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 152,
          "idx_m_region": 28,
          "name": "KABUPATEN PASER",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 153,
          "idx_m_region": 27,
          "name": "KABUPATEN DELI SERDANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 154,
          "idx_m_region": 33,
          "name": "KABUPATEN TAMBRAUW",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 155,
          "idx_m_region": 12,
          "name": "KABUPATEN PURWAKARTA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 156,
          "idx_m_region": 14,
          "name": "KOTA BANJAR BARU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 157,
          "idx_m_region": 3,
          "name": "KABUPATEN SIMEULUE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 158,
          "idx_m_region": 29,
          "name": "KABUPATEN KEPULAUAN SELAYAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 159,
          "idx_m_region": 5,
          "name": "KABUPATEN KAPUAS HULU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 160,
          "idx_m_region": 32,
          "name": "KABUPATEN KEEROM",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 161,
          "idx_m_region": 25,
          "name": "KABUPATEN LINGGA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 162,
          "idx_m_region": 22,
          "name": "KABUPATEN BANYUWANGI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 163,
          "idx_m_region": 25,
          "name": "KOTA B A T A M",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 164,
          "idx_m_region": 2,
          "name": "KOTA CILEGON",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 165,
          "idx_m_region": 17,
          "name": "KABUPATEN SERAM BAGIAN BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 166,
          "idx_m_region": 32,
          "name": "KABUPATEN PEGUNUNGAN BINTANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 167,
          "idx_m_region": 18,
          "name": "KABUPATEN BUTON",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 168,
          "idx_m_region": 32,
          "name": "KABUPATEN INTAN JAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 169,
          "idx_m_region": 31,
          "name": "KABUPATEN KEPULAUAN MENTAWAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 170,
          "idx_m_region": 23,
          "name": "KABUPATEN GUNUNG MAS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 171,
          "idx_m_region": 10,
          "name": "KOTA BANDAR LAMPUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 172,
          "idx_m_region": 14,
          "name": "KABUPATEN BARITO KUALA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 173,
          "idx_m_region": 27,
          "name": "KABUPATEN ASAHAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 174,
          "idx_m_region": 11,
          "name": "KABUPATEN KLUNGKUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 175,
          "idx_m_region": 5,
          "name": "KABUPATEN KUBU RAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 176,
          "idx_m_region": 29,
          "name": "KABUPATEN SINJAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 177,
          "idx_m_region": 5,
          "name": "KABUPATEN SAMBAS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 178,
          "idx_m_region": 20,
          "name": "KOTA PRABUMULIH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 179,
          "idx_m_region": 7,
          "name": "KABUPATEN KEPULAUAN SERIBU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 180,
          "idx_m_region": 27,
          "name": "KOTA GUNUNGSITOLI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 181,
          "idx_m_region": 29,
          "name": "KABUPATEN SOPPENG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 182,
          "idx_m_region": 20,
          "name": "KABUPATEN LAHAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 183,
          "idx_m_region": 13,
          "name": "KABUPATEN LOMBOK TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 184,
          "idx_m_region": 26,
          "name": "KABUPATEN KUANTAN SINGINGI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 185,
          "idx_m_region": 14,
          "name": "KABUPATEN HULU SUNGAI SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 186,
          "idx_m_region": 8,
          "name": "KABUPATEN TOJO UNA-UNA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 187,
          "idx_m_region": 27,
          "name": "KABUPATEN KARO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 188,
          "idx_m_region": 10,
          "name": "KOTA METRO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 189,
          "idx_m_region": 32,
          "name": "KABUPATEN LANNY JAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 190,
          "idx_m_region": 3,
          "name": "KABUPATEN PIDIE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 191,
          "idx_m_region": 16,
          "name": "KABUPATEN MUARO JAMBI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 192,
          "idx_m_region": 15,
          "name": "KABUPATEN SLEMAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 193,
          "idx_m_region": 34,
          "name": "KABUPATEN KEPULAUAN TALAUD",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 194,
          "idx_m_region": 20,
          "name": "KABUPATEN MUSI RAWAS UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 195,
          "idx_m_region": 17,
          "name": "KOTA TUAL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 196,
          "idx_m_region": 16,
          "name": "KABUPATEN KERINCI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 197,
          "idx_m_region": 26,
          "name": "KABUPATEN INDRAGIRI HULU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 198,
          "idx_m_region": 34,
          "name": "KABUPATEN MINAHASA SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 199,
          "idx_m_region": 22,
          "name": "KABUPATEN PASURUAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 200,
          "idx_m_region": 3,
          "name": "KABUPATEN PIDIE JAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 201,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH TAMIANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 202,
          "idx_m_region": 4,
          "name": "KABUPATEN PULAU MOROTAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 203,
          "idx_m_region": 22,
          "name": "KOTA PROBOLINGGO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 204,
          "idx_m_region": 5,
          "name": "KOTA SINGKAWANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 205,
          "idx_m_region": 24,
          "name": "KABUPATEN MAMUJU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 206,
          "idx_m_region": 9,
          "name": "KABUPATEN SIKKA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 207,
          "idx_m_region": 22,
          "name": "KOTA BLITAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 208,
          "idx_m_region": 3,
          "name": "KABUPATEN BIREUEN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 209,
          "idx_m_region": 32,
          "name": "KABUPATEN MAMBERAMO TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 210,
          "idx_m_region": 31,
          "name": "KOTA PADANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 211,
          "idx_m_region": 30,
          "name": "KABUPATEN BANGKA TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 212,
          "idx_m_region": 27,
          "name": "KABUPATEN BATU BARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 213,
          "idx_m_region": 30,
          "name": "KABUPATEN BANGKA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 214,
          "idx_m_region": 22,
          "name": "KABUPATEN PROBOLINGGO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 215,
          "idx_m_region": 26,
          "name": "KABUPATEN BENGKALIS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 216,
          "idx_m_region": 5,
          "name": "KABUPATEN BENGKAYANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 217,
          "idx_m_region": 33,
          "name": "KABUPATEN MANOKWARI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 218,
          "idx_m_region": 10,
          "name": "KABUPATEN LAMPUNG TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 219,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 220,
          "idx_m_region": 29,
          "name": "KABUPATEN ENREKANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 221,
          "idx_m_region": 16,
          "name": "KABUPATEN MERANGIN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 222,
          "idx_m_region": 23,
          "name": "KABUPATEN KOTAWARINGIN BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 223,
          "idx_m_region": 9,
          "name": "KABUPATEN BELU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 224,
          "idx_m_region": 31,
          "name": "KABUPATEN PASAMAN BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 225,
          "idx_m_region": 9,
          "name": "KABUPATEN SABU RAIJUA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 226,
          "idx_m_region": 4,
          "name": "KABUPATEN PULAU TALIABU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 227,
          "idx_m_region": 10,
          "name": "KABUPATEN LAMPUNG UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 228,
          "idx_m_region": 7,
          "name": "KOTA JAKARTA BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 229,
          "idx_m_region": 23,
          "name": "KABUPATEN BARITO TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 230,
          "idx_m_region": 27,
          "name": "KOTA MEDAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 231,
          "idx_m_region": 27,
          "name": "KABUPATEN TAPANULI UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 232,
          "idx_m_region": 18,
          "name": "KABUPATEN MUNA BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 233,
          "idx_m_region": 13,
          "name": "KOTA BIMA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 234,
          "idx_m_region": 3,
          "name": "KOTA LANGSA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 235,
          "idx_m_region": 18,
          "name": "KABUPATEN KONAWE KEPULAUAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 236,
          "idx_m_region": 13,
          "name": "KABUPATEN LOMBOK BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 237,
          "idx_m_region": 19,
          "name": "KABUPATEN GORONTALO UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 238,
          "idx_m_region": 12,
          "name": "KABUPATEN PANGANDARAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 239,
          "idx_m_region": 14,
          "name": "KABUPATEN HULU SUNGAI TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 240,
          "idx_m_region": 8,
          "name": "KABUPATEN DONGGALA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 241,
          "idx_m_region": 6,
          "name": "KABUPATEN DEMAK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 242,
          "idx_m_region": 32,
          "name": "KABUPATEN SUPIORI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 243,
          "idx_m_region": 18,
          "name": "KABUPATEN KOLAKA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 244,
          "idx_m_region": 20,
          "name": "KOTA PAGAR ALAM",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 245,
          "idx_m_region": 27,
          "name": "KABUPATEN HUMBANG HASUNDUTAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 246,
          "idx_m_region": 9,
          "name": "KABUPATEN SUMBA BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 247,
          "idx_m_region": 11,
          "name": "KOTA DENPASAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 248,
          "idx_m_region": 15,
          "name": "KABUPATEN BANTUL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 249,
          "idx_m_region": 25,
          "name": "KOTA TANJUNG PINANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 250,
          "idx_m_region": 24,
          "name": "KABUPATEN MAMASA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 251,
          "idx_m_region": 9,
          "name": "KABUPATEN MANGGARAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 252,
          "idx_m_region": 32,
          "name": "KABUPATEN KEPULAUAN YAPEN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 253,
          "idx_m_region": 12,
          "name": "KABUPATEN SUMEDANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 254,
          "idx_m_region": 23,
          "name": "KABUPATEN SERUYAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 255,
          "idx_m_region": 28,
          "name": "KOTA BALIKPAPAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 256,
          "idx_m_region": 6,
          "name": "KABUPATEN WONOGIRI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 257,
          "idx_m_region": 18,
          "name": "KOTA KENDARI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 258,
          "idx_m_region": 22,
          "name": "KABUPATEN TULUNGAGUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 259,
          "idx_m_region": 29,
          "name": "KABUPATEN GOWA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 260,
          "idx_m_region": 10,
          "name": "KABUPATEN PRINGSEWU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 261,
          "idx_m_region": 30,
          "name": "KABUPATEN BELITUNG TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 262,
          "idx_m_region": 29,
          "name": "KABUPATEN LUWU UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 263,
          "idx_m_region": 22,
          "name": "KABUPATEN NGANJUK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 264,
          "idx_m_region": 32,
          "name": "KABUPATEN MERAUKE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 265,
          "idx_m_region": 29,
          "name": "KOTA PAREPARE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 266,
          "idx_m_region": 12,
          "name": "KABUPATEN CIREBON",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 267,
          "idx_m_region": 6,
          "name": "KABUPATEN SRAGEN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 268,
          "idx_m_region": 9,
          "name": "KABUPATEN SUMBA TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 269,
          "idx_m_region": 27,
          "name": "KABUPATEN LABUHAN BATU UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 270,
          "idx_m_region": 6,
          "name": "KABUPATEN PEKALONGAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 271,
          "idx_m_region": 21,
          "name": "KABUPATEN BULUNGAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 272,
          "idx_m_region": 18,
          "name": "KABUPATEN KONAWE UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 273,
          "idx_m_region": 13,
          "name": "KABUPATEN LOMBOK TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 274,
          "idx_m_region": 12,
          "name": "KABUPATEN BANDUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 275,
          "idx_m_region": 9,
          "name": "KABUPATEN ALOR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 276,
          "idx_m_region": 9,
          "name": "KABUPATEN SUMBA TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 277,
          "idx_m_region": 31,
          "name": "KOTA PAYAKUMBUH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 278,
          "idx_m_region": 8,
          "name": "KABUPATEN POSO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 279,
          "idx_m_region": 18,
          "name": "KABUPATEN KOLAKA TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 280,
          "idx_m_region": 18,
          "name": "KABUPATEN WAKATOBI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 281,
          "idx_m_region": 33,
          "name": "KABUPATEN TELUK BINTUNI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 282,
          "idx_m_region": 33,
          "name": "KABUPATEN SORONG SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 283,
          "idx_m_region": 18,
          "name": "KABUPATEN KONAWE SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 284,
          "idx_m_region": 1,
          "name": "KABUPATEN LEBONG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 285,
          "idx_m_region": 34,
          "name": "KOTA BITUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 286,
          "idx_m_region": 10,
          "name": "KABUPATEN PESAWARAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 287,
          "idx_m_region": 10,
          "name": "KABUPATEN WAY KANAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 288,
          "idx_m_region": 26,
          "name": "KABUPATEN KEPULAUAN MERANTI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 289,
          "idx_m_region": 22,
          "name": "KOTA MADIUN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 290,
          "idx_m_region": 8,
          "name": "KABUPATEN BANGGAI LAUT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 291,
          "idx_m_region": 2,
          "name": "KOTA TANGERANG SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 292,
          "idx_m_region": 32,
          "name": "KABUPATEN MAPPI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 293,
          "idx_m_region": 32,
          "name": "KABUPATEN SARMI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 294,
          "idx_m_region": 27,
          "name": "KOTA TANJUNG BALAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 295,
          "idx_m_region": 27,
          "name": "KABUPATEN NIAS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 296,
          "idx_m_region": 34,
          "name": "KABUPATEN MINAHASA UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 297,
          "idx_m_region": 27,
          "name": "KABUPATEN PADANG LAWAS UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 298,
          "idx_m_region": 21,
          "name": "KABUPATEN MALINAU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 299,
          "idx_m_region": 1,
          "name": "KABUPATEN MUKOMUKO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 300,
          "idx_m_region": 16,
          "name": "KABUPATEN BATANG HARI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 301,
          "idx_m_region": 9,
          "name": "KABUPATEN LEMBATA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 302,
          "idx_m_region": 10,
          "name": "KABUPATEN PESISIR BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 303,
          "idx_m_region": 20,
          "name": "KABUPATEN OGAN ILIR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 304,
          "idx_m_region": 20,
          "name": "KABUPATEN OGAN KOMERING ULU SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 305,
          "idx_m_region": 18,
          "name": "KABUPATEN BUTON SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 306,
          "idx_m_region": 28,
          "name": "KABUPATEN PENAJAM PASER UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 307,
          "idx_m_region": 3,
          "name": "KOTA BANDA ACEH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 308,
          "idx_m_region": 22,
          "name": "KABUPATEN MADIUN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 309,
          "idx_m_region": 19,
          "name": "KABUPATEN BONE BOLANGO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 310,
          "idx_m_region": 6,
          "name": "KABUPATEN KUDUS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 311,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 312,
          "idx_m_region": 26,
          "name": "KABUPATEN KAMPAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 313,
          "idx_m_region": 12,
          "name": "KABUPATEN GARUT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 314,
          "idx_m_region": 6,
          "name": "KABUPATEN KENDAL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 315,
          "idx_m_region": 5,
          "name": "KABUPATEN MELAWI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 316,
          "idx_m_region": 20,
          "name": "KABUPATEN MUARA ENIM",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 317,
          "idx_m_region": 14,
          "name": "KABUPATEN HULU SUNGAI UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 318,
          "idx_m_region": 27,
          "name": "KOTA TEBING TINGGI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 319,
          "idx_m_region": 12,
          "name": "KOTA CIREBON",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 320,
          "idx_m_region": 13,
          "name": "KABUPATEN DOMPU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 321,
          "idx_m_region": 31,
          "name": "KABUPATEN PADANG PARIAMAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 322,
          "idx_m_region": 23,
          "name": "KABUPATEN SUKAMARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 323,
          "idx_m_region": 32,
          "name": "KABUPATEN PUNCAK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 324,
          "idx_m_region": 6,
          "name": "KABUPATEN KEBUMEN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 325,
          "idx_m_region": 5,
          "name": "KABUPATEN SEKADAU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 326,
          "idx_m_region": 8,
          "name": "KOTA PALU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 327,
          "idx_m_region": 32,
          "name": "KABUPATEN WAROPEN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 328,
          "idx_m_region": 12,
          "name": "KABUPATEN INDRAMAYU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 329,
          "idx_m_region": 34,
          "name": "KABUPATEN MINAHASA TENGGARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 330,
          "idx_m_region": 10,
          "name": "KABUPATEN LAMPUNG TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 331,
          "idx_m_region": 2,
          "name": "KOTA TANGERANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 332,
          "idx_m_region": 6,
          "name": "KABUPATEN PATI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 333,
          "idx_m_region": 4,
          "name": "KABUPATEN HALMAHERA SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 334,
          "idx_m_region": 3,
          "name": "KABUPATEN BENER MERIAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 335,
          "idx_m_region": 2,
          "name": "KABUPATEN SERANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 336,
          "idx_m_region": 20,
          "name": "KABUPATEN PENUKAL ABAB LEMATANG ILIR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 337,
          "idx_m_region": 22,
          "name": "KABUPATEN SAMPANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 338,
          "idx_m_region": 2,
          "name": "KABUPATEN LEBAK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 339,
          "idx_m_region": 3,
          "name": "KABUPATEN GAYO LUES",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 340,
          "idx_m_region": 16,
          "name": "KOTA SUNGAI PENUH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 341,
          "idx_m_region": 32,
          "name": "KABUPATEN NABIRE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 342,
          "idx_m_region": 32,
          "name": "KABUPATEN PUNCAK JAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 343,
          "idx_m_region": 6,
          "name": "KABUPATEN SEMARANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 344,
          "idx_m_region": 6,
          "name": "KABUPATEN MAGELANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 345,
          "idx_m_region": 32,
          "name": "KABUPATEN DEIYAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 346,
          "idx_m_region": 10,
          "name": "KABUPATEN TULANG BAWANG BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 347,
          "idx_m_region": 16,
          "name": "KABUPATEN TANJUNG JABUNG TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 348,
          "idx_m_region": 6,
          "name": "KABUPATEN KLATEN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 349,
          "idx_m_region": 10,
          "name": "KABUPATEN TANGGAMUS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 350,
          "idx_m_region": 29,
          "name": "KABUPATEN MAROS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 351,
          "idx_m_region": 9,
          "name": "KABUPATEN ENDE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 352,
          "idx_m_region": 1,
          "name": "KABUPATEN KEPAHIANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 353,
          "idx_m_region": 2,
          "name": "KABUPATEN TANGERANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 354,
          "idx_m_region": 21,
          "name": "KABUPATEN NUNUKAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 355,
          "idx_m_region": 10,
          "name": "KABUPATEN MESUJI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 356,
          "idx_m_region": 33,
          "name": "KOTA SORONG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 357,
          "idx_m_region": 13,
          "name": "KABUPATEN SUMBAWA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 358,
          "idx_m_region": 30,
          "name": "KABUPATEN BANGKA SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 359,
          "idx_m_region": 12,
          "name": "KOTA DEPOK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 360,
          "idx_m_region": 27,
          "name": "KABUPATEN NIAS UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 361,
          "idx_m_region": 3,
          "name": "KOTA SABANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 362,
          "idx_m_region": 17,
          "name": "KABUPATEN BURU SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 363,
          "idx_m_region": 18,
          "name": "KABUPATEN MUNA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 364,
          "idx_m_region": 27,
          "name": "KABUPATEN TOBA SAMOSIR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 365,
          "idx_m_region": 28,
          "name": "KABUPATEN KUTAI TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 366,
          "idx_m_region": 23,
          "name": "KABUPATEN PULANG PISAU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 367,
          "idx_m_region": 27,
          "name": "KABUPATEN LABUHAN BATU SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 368,
          "idx_m_region": 33,
          "name": "KABUPATEN FAKFAK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 369,
          "idx_m_region": 22,
          "name": "KABUPATEN LAMONGAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 370,
          "idx_m_region": 6,
          "name": "KOTA SALATIGA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 371,
          "idx_m_region": 27,
          "name": "KOTA PADANGSIDIMPUAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 372,
          "idx_m_region": 20,
          "name": "KABUPATEN MUSI BANYUASIN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 373,
          "idx_m_region": 19,
          "name": "KOTA GORONTALO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 374,
          "idx_m_region": 27,
          "name": "KABUPATEN LABUHAN BATU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 375,
          "idx_m_region": 22,
          "name": "KABUPATEN LUMAJANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 376,
          "idx_m_region": 12,
          "name": "KABUPATEN SUKABUMI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 377,
          "idx_m_region": 22,
          "name": "KABUPATEN JEMBER",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 378,
          "idx_m_region": 27,
          "name": "KABUPATEN NIAS SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 379,
          "idx_m_region": 17,
          "name": "KOTA AMBON",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 380,
          "idx_m_region": 31,
          "name": "KABUPATEN PASAMAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 381,
          "idx_m_region": 6,
          "name": "KABUPATEN CILACAP",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 382,
          "idx_m_region": 23,
          "name": "KABUPATEN KATINGAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 383,
          "idx_m_region": 15,
          "name": "KOTA YOGYAKARTA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 384,
          "idx_m_region": 23,
          "name": "KOTA PALANGKA RAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 385,
          "idx_m_region": 4,
          "name": "KABUPATEN KEPULAUAN SULA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 386,
          "idx_m_region": 14,
          "name": "KOTA BANJARMASIN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 387,
          "idx_m_region": 27,
          "name": "KABUPATEN NIAS BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 388,
          "idx_m_region": 4,
          "name": "KABUPATEN HALMAHERA TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 389,
          "idx_m_region": 21,
          "name": "KABUPATEN TANA TIDUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 390,
          "idx_m_region": 6,
          "name": "KABUPATEN BANYUMAS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 391,
          "idx_m_region": 12,
          "name": "KOTA SUKABUMI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 392,
          "idx_m_region": 11,
          "name": "KABUPATEN TABANAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 393,
          "idx_m_region": 6,
          "name": "KABUPATEN REMBANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 394,
          "idx_m_region": 27,
          "name": "KABUPATEN TAPANULI TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 395,
          "idx_m_region": 6,
          "name": "KABUPATEN PURWOREJO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 396,
          "idx_m_region": 22,
          "name": "KABUPATEN SIDOARJO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 397,
          "idx_m_region": 29,
          "name": "KABUPATEN BARRU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 398,
          "idx_m_region": 22,
          "name": "KABUPATEN TUBAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 399,
          "idx_m_region": 13,
          "name": "KABUPATEN LOMBOK UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 400,
          "idx_m_region": 27,
          "name": "KOTA BINJAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 401,
          "idx_m_region": 12,
          "name": "KABUPATEN MAJALENGKA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 402,
          "idx_m_region": 30,
          "name": "KOTA PANGKAL PINANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 403,
          "idx_m_region": 28,
          "name": "KABUPATEN KUTAI KARTANEGARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 404,
          "idx_m_region": 6,
          "name": "KABUPATEN BOYOLALI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 405,
          "idx_m_region": 9,
          "name": "KABUPATEN NGADA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 406,
          "idx_m_region": 32,
          "name": "KABUPATEN PANIAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 407,
          "idx_m_region": 14,
          "name": "KABUPATEN TANAH BUMBU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 408,
          "idx_m_region": 24,
          "name": "KABUPATEN MAMUJU UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 409,
          "idx_m_region": 22,
          "name": "KABUPATEN PONOROGO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 410,
          "idx_m_region": 6,
          "name": "KABUPATEN JEPARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 411,
          "idx_m_region": 22,
          "name": "KABUPATEN BANGKALAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 412,
          "idx_m_region": 6,
          "name": "KABUPATEN KARANGANYAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 413,
          "idx_m_region": 28,
          "name": "KABUPATEN KUTAI BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 414,
          "idx_m_region": 22,
          "name": "KABUPATEN MOJOKERTO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 415,
          "idx_m_region": 17,
          "name": "KABUPATEN BURU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 416,
          "idx_m_region": 22,
          "name": "KABUPATEN NGAWI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 417,
          "idx_m_region": 22,
          "name": "KOTA MOJOKERTO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 418,
          "idx_m_region": 12,
          "name": "KABUPATEN BOGOR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 419,
          "idx_m_region": 17,
          "name": "KABUPATEN SERAM BAGIAN TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 420,
          "idx_m_region": 8,
          "name": "KABUPATEN PARIGI MOUTONG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 421,
          "idx_m_region": 12,
          "name": "KABUPATEN BANDUNG BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 422,
          "idx_m_region": 22,
          "name": "KABUPATEN JOMBANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 423,
          "idx_m_region": 29,
          "name": "KABUPATEN LUWU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 424,
          "idx_m_region": 12,
          "name": "KOTA BOGOR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 425,
          "idx_m_region": 17,
          "name": "KABUPATEN KEPULAUAN ARU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 426,
          "idx_m_region": 6,
          "name": "KABUPATEN PEMALANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 427,
          "idx_m_region": 33,
          "name": "KABUPATEN KAIMANA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 428,
          "idx_m_region": 5,
          "name": "KABUPATEN KETAPANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 429,
          "idx_m_region": 13,
          "name": "KOTA MATARAM",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 430,
          "idx_m_region": 29,
          "name": "KABUPATEN BANTAENG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 431,
          "idx_m_region": 4,
          "name": "KOTA TIDORE KEPULAUAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 432,
          "idx_m_region": 11,
          "name": "KABUPATEN BULELENG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 433,
          "idx_m_region": 24,
          "name": "KABUPATEN MAMUJU TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 434,
          "idx_m_region": 4,
          "name": "KABUPATEN HALMAHERA UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 435,
          "idx_m_region": 6,
          "name": "KABUPATEN TEGAL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 436,
          "idx_m_region": 18,
          "name": "KABUPATEN BUTON TENGAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 437,
          "idx_m_region": 8,
          "name": "KABUPATEN BANGGAI KEPULAUAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 438,
          "idx_m_region": 9,
          "name": "KABUPATEN SUMBA BARAT DAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 439,
          "idx_m_region": 22,
          "name": "KABUPATEN MALANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 440,
          "idx_m_region": 12,
          "name": "KABUPATEN SUBANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 441,
          "idx_m_region": 23,
          "name": "KABUPATEN LAMANDAU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 442,
          "idx_m_region": 9,
          "name": "KABUPATEN MANGGARAI TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 443,
          "idx_m_region": 32,
          "name": "KABUPATEN BIAK NUMFOR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 444,
          "idx_m_region": 18,
          "name": "KABUPATEN BOMBANA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 445,
          "idx_m_region": 32,
          "name": "KABUPATEN JAYAWIJAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 446,
          "idx_m_region": 25,
          "name": "KABUPATEN KARIMUN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 447,
          "idx_m_region": 6,
          "name": "KABUPATEN TEMANGGUNG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 448,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 449,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH BESAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 450,
          "idx_m_region": 27,
          "name": "KABUPATEN SAMOSIR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 451,
          "idx_m_region": 9,
          "name": "KABUPATEN FLORES TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 452,
          "idx_m_region": 27,
          "name": "KOTA SIBOLGA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 453,
          "idx_m_region": 12,
          "name": "KOTA BEKASI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 454,
          "idx_m_region": 19,
          "name": "KABUPATEN BOALEMO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 455,
          "idx_m_region": 23,
          "name": "KABUPATEN KOTAWARINGIN TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 456,
          "idx_m_region": 32,
          "name": "KABUPATEN NDUGA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 457,
          "idx_m_region": 11,
          "name": "KABUPATEN JEMBRANA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 458,
          "idx_m_region": 20,
          "name": "KABUPATEN OGAN KOMERING ULU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 459,
          "idx_m_region": 9,
          "name": "KABUPATEN MALAKA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 460,
          "idx_m_region": 6,
          "name": "KOTA TEGAL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 461,
          "idx_m_region": 14,
          "name": "KABUPATEN TANAH LAUT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 462,
          "idx_m_region": 12,
          "name": "KOTA TASIKMALAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 463,
          "idx_m_region": 31,
          "name": "KOTA BUKITTINGGI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 464,
          "idx_m_region": 12,
          "name": "KOTA CIMAHI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 465,
          "idx_m_region": 31,
          "name": "KABUPATEN SOLOK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 466,
          "idx_m_region": 20,
          "name": "KABUPATEN OGAN KOMERING ULU TIMUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 467,
          "idx_m_region": 29,
          "name": "KOTA MAKASSAR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 468,
          "idx_m_region": 7,
          "name": "KOTA JAKARTA UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 469,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH TENGGARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 470,
          "idx_m_region": 10,
          "name": "KABUPATEN LAMPUNG BARAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 471,
          "idx_m_region": 12,
          "name": "KABUPATEN CIANJUR",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 472,
          "idx_m_region": 29,
          "name": "KOTA PALOPO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 473,
          "idx_m_region": 8,
          "name": "KABUPATEN SIGI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 474,
          "idx_m_region": 20,
          "name": "KOTA PALEMBANG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 475,
          "idx_m_region": 34,
          "name": "KABUPATEN BOLAANG MONGONDOW",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 476,
          "idx_m_region": 14,
          "name": "KABUPATEN TABALONG",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 477,
          "idx_m_region": 7,
          "name": "KOTA JAKARTA SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 478,
          "idx_m_region": 11,
          "name": "KABUPATEN KARANG ASEM",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 479,
          "idx_m_region": 23,
          "name": "KABUPATEN BARITO UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 480,
          "idx_m_region": 29,
          "name": "KABUPATEN PANGKAJENE DAN KEPULAUAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 481,
          "idx_m_region": 22,
          "name": "KOTA PASURUAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 482,
          "idx_m_region": 20,
          "name": "KOTA LUBUKLINGGAU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 483,
          "idx_m_region": 22,
          "name": "KABUPATEN PACITAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 484,
          "idx_m_region": 32,
          "name": "KOTA JAYAPURA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 485,
          "idx_m_region": 31,
          "name": "KABUPATEN PESISIR SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 486,
          "idx_m_region": 1,
          "name": "KABUPATEN BENGKULU SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 487,
          "idx_m_region": 16,
          "name": "KABUPATEN TEBO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 488,
          "idx_m_region": 7,
          "name": "KOTA JAKARTA PUSAT",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 489,
          "idx_m_region": 15,
          "name": "KABUPATEN KULON PROGO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 490,
          "idx_m_region": 13,
          "name": "KABUPATEN BIMA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 491,
          "idx_m_region": 27,
          "name": "KABUPATEN PADANG LAWAS",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 492,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH JAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 493,
          "idx_m_region": 9,
          "name": "KABUPATEN NAGEKEO",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 494,
          "idx_m_region": 14,
          "name": "KABUPATEN KOTA BARU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 495,
          "idx_m_region": 17,
          "name": "KABUPATEN MALUKU BARAT DAYA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 496,
          "idx_m_region": 26,
          "name": "KOTA D U M A I",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 497,
          "idx_m_region": 32,
          "name": "KABUPATEN DOGIYAI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 498,
          "idx_m_region": 16,
          "name": "KOTA JAMBI",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 499,
          "idx_m_region": 32,
          "name": "KABUPATEN MIMIKA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 500,
          "idx_m_region": 3,
          "name": "KABUPATEN ACEH SINGKIL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 501,
          "idx_m_region": 34,
          "name": "KABUPATEN BOLAANG MONGONDOW UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 502,
          "idx_m_region": 21,
          "name": "KOTA TARAKAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 503,
          "idx_m_region": 15,
          "name": "KABUPATEN GUNUNG KIDUL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 504,
          "idx_m_region": 6,
          "name": "KOTA SURAKARTA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 505,
          "idx_m_region": 8,
          "name": "KABUPATEN BUOL",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 506,
          "idx_m_region": 25,
          "name": "KABUPATEN BINTAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 507,
          "idx_m_region": 31,
          "name": "KABUPATEN SOLOK SELATAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 508,
          "idx_m_region": 27,
          "name": "KABUPATEN SIMALUNGUN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 509,
          "idx_m_region": 5,
          "name": "KABUPATEN MEMPAWAH",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 510,
          "idx_m_region": 1,
          "name": "KABUPATEN BENGKULU UTARA",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 511,
          "idx_m_region": 33,
          "name": "KABUPATEN PEGUNUNGAN ARFAK",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 512,
          "idx_m_region": 6,
          "name": "KOTA PEKALONGAN",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 513,
          "idx_m_region": 34,
          "name": "KABUPATEN KEPULAUAN SANGIHE",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        },
        {
          "idx_m_city": 514,
          "idx_m_region": 18,
          "name": "KOTA BAUBAU",
          "ucreate": "sa",
          "dcreate": "2021-05-24T08:54:13.000Z",
          "umodified": null,
          "dmodified": null,
          "record_status": "A"
        }
      ]
      );
    });
};
