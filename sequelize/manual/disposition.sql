INSERT INTO m_disposition (idx_m_disposition, "name", flag) VALUES(1, 'Pemeriksaan', 1);
INSERT INTO m_disposition (idx_m_disposition, "name", flag) VALUES(2, 'Pemeriksaan dengan Mekanisme Penegakan Etik : Majelis Etik', 2);
INSERT INTO m_disposition (idx_m_disposition, "name", flag) VALUES(3, 'Pemeriksaan dengan Mekanisme Penegakan Etik : Dewan Etik', 2);
INSERT INTO m_disposition (idx_m_disposition, "name", flag) VALUES(4, 'Pembinaan Oleh Atasan Langsung', 1);
INSERT INTO m_disposition (idx_m_disposition, "name", flag) VALUES(5, 'Supervisi Monitoring Pengampu', 1);
INSERT INTO m_disposition (idx_m_disposition, "name", flag) VALUES(6, 'Tidak dilanjutkan dengan pemeriksaan', 1);
INSERT INTO m_disposition (idx_m_disposition, "name", flag) VALUES(7, 'Pemeriksaan dengan Mekanisme Penegakan Etik', 3);

INSERT INTO m_legal_standing (idx_m_legal_standing, "name") VALUES(1, 'Korban Langsung');
INSERT INTO m_legal_standing (idx_m_legal_standing, "name") VALUES(3, 'Pelapor Individual');
INSERT INTO m_legal_standing (idx_m_legal_standing, "name") VALUES(5, 'Lain - Lain');
INSERT INTO m_legal_standing (idx_m_legal_standing, "name") VALUES(-1, 'Kuasa Pelapor');
INSERT INTO m_legal_standing (idx_m_legal_standing, "name") VALUES(2, 'Pelaku');

INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(1, '0', 'GENERAL_STATUS', '0', 'DRAFT', NULL, '0');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(2, '0', 'GENERAL_STATUS', '1', 'SUBMIT', NULL, '1');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(9, '2', 'VERIFICATION_TYPE', '0', 'DITERIMA', NULL, '0');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(10, '2', 'VERIFICATION_TYPE', '1', 'DITOLAK', NULL, '1');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(11, '3', 'MEDIA', 'TELEPON', 'TELEPON', NULL, '1');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(12, '3', 'MEDIA', 'WHATSAPP', 'WHATSAPP', NULL, '2');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(13, '3', 'MEDIA', 'SMS', 'SMS', NULL, '3');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(14, '3', 'MEDIA', 'EMAIL', 'EMAIL', NULL, '4');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(15, '3', 'MEDIA', 'SURAT', 'SURAT', NULL, '5');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(16, '4', 'TAHAPAN_VALIDASI', 'PENERIMAAN DAN VERIFIKASI', 'PENERIMAAN DAN VERIFIKASI', NULL, '1');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(17, '4', 'TAHAPAN_VALIDASI', 'PEMERIKSAAN LAPORAN', 'PEMERIKSAAN LAPORAN', NULL, '2');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(18, '4', 'TAHAPAN_VALIDASI', 'RESOLUSI DAN MONITORING', 'RESOLUSI DAN MONITORING', NULL, '3');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(19, '5', 'DOC_CHECKLIST_VALIDASI', 'INFORMASI ADMINISTRASI PENGADUAN PUTUSAN PENANGGUNG JAWAB WBS BUKTI PENGADUAN YANG DISAMPAIKAN OLEH PENGADU DOKUMEN PENDUKUNG PENGADUAN', 'INFORMASI ADMINISTRASI PENGADUAN PUTUSAN PENANGGUNG JAWAB WBS BUKTI PENGADUAN YANG DISAMPAIKAN OLEH PENGADU DOKUMEN PENDUKUNG PENGADUAN', NULL, '1');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(20, '5', 'DOC_CHECKLIST_VALIDASI', 'PUTUSAN PENANGGUNG JAWAB WBS', 'PUTUSAN PENANGGUNG JAWAB WBS', NULL, '2');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(21, '5', 'DOC_CHECKLIST_VALIDASI', 'BUKTI PENGADUAN YANG DISAMPAIKAN OLEH PENGADU', 'BUKTI PENGADUAN YANG DISAMPAIKAN OLEH PENGADU', NULL, '3');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(22, '5', 'DOC_CHECKLIST_VALIDASI', 'DOKUMEN PENDUKUNG PENGADUAN', 'DOKUMEN PENDUKUNG PENGADUAN', NULL, '4');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(3, '1', 'SOURCE_COMPLAINT', 'DATANG LANGSUNG', 'DATANG LANGSUNG', NULL, '1');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(4, '1', 'SOURCE_COMPLAINT', 'SURAT', 'SURAT', NULL, '2');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(5, '1', 'SOURCE_COMPLAINT', 'CALL CENTER 137', 'CALL CENTER 137', NULL, '3');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(6, '1', 'SOURCE_COMPLAINT', 'EMAIL', 'EMAIL', NULL, '4');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(7, '1', 'SOURCE_COMPLAINT', 'APLIKASI LAPOR!', 'APLIKASI LAPOR!', NULL, '5');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(8, '1', 'SOURCE_COMPLAINT', 'WEB', 'WEB', NULL, '0');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(23, '6', 'VALIDASI_PRODUK', 'PRODUK', 'PRODUK', NULL, '1');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(24, '6', 'VALIDASI_PRODUK', 'SUBSTANSI', 'SUBSTANSI', NULL, '2');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(25, '6', 'VALIDASI_PRODUK', 'PROSEDUR', 'PROSEDUR', NULL, '3');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(26, '4', 'TAHAPAN_VALIDASI', 'DETEKSI', 'DETEKSI', NULL, '4');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(27, '4', 'TAHAPAN_VALIDASI', 'ANALISIS', 'ANALISIS', NULL, '5');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(28, '4', 'TAHAPAN_VALIDASI', 'SURVEY', 'SURVEY', NULL, '6');
INSERT INTO m_option (id, option_id, "name", value, "text", remarks, order_no) VALUES(29, '4', 'TAHAPAN_VALIDASI', 'PERLAKUAAN PELAKSANAAN SARAN', 'PERLAKUAAN PELAKSANAAN SARAN', NULL, '7');

INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(1, 'Pengaduan', 'green', '1');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(3, 'Ditelaah Inspektorat', 'green', '3');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(4, 'Putusan Pengampu WBS', 'green', '4');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(2, 'Laporan Verifikasi', 'green', '2');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(7, 'Kertas Kerja Validasi', 'green', '7');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(6, 'Penetapan Tim Pemeriksa', 'green', '6');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(5, 'Penyetujuan atau Tindak Lanjut ', 'green', '5');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(8, 'Permintaan Data dan Dokumen', 'green', '8');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(9, 'Kertas Kerja Klarifikasi', 'green', '9');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(10, 'Klarifikasi Terperiksa', 'green', '10');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(11, 'Konfirmasi Pengadu', 'green', '11');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(12, 'Penyusunan LHPA', 'green', '12');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(13, 'Bedah Aduan', 'green', '13');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(14, 'Rapat Pleno', 'green', '14');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(15, 'Penyampaian Tindak Lanjut ', 'green', '15');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(16, 'Monitoring', 'green', '16');
INSERT INTO m_status (idx_m_status, "name", color, code) VALUES(17, 'Penutupan', 'green', '17');

-- violation 5,9,10 is special
INSERT INTO m_violation (idx_m_violation, "name") VALUES(1, 'Tindak Pidana Korupsi');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(2, 'Kecurangan (Fraud)');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(3, 'Tindak Pidana Lainnya');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(4, 'Pelanggaran Kode Etik dan Perilaku');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(5, 'Pelanggaran Maladministras');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(6, 'Pelanggaran Disiplin Insan Ombudsman');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(7, 'Perbuatan yang Dapat Menimbulkan Kerugian Finansial atau Non-Finansial terhadap Ombudsman RI atau merugikan Kepentingan Ombudsman RI');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(8, 'Pelanggaran Prosedur Operasi Standar (SOP) Pelaksanaan Tugas dan Fungsi');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(9, 'Pelanggaran Prosedur Operasi Standar (SOP), terkait Penanganan Laporan Masyarakat yang masih dalam Proses');
INSERT INTO m_violation (idx_m_violation, "name") VALUES(10, '(SOP) Pelaksanaan Tugas dan Fungsi Pelanggaran Prosedur Operasi Standar (SOP), terkait Penanganan Laporan Masyarakat yang telah Ditutup');


INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(1, 'Kantor Perwakilan Ombudsman RI');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(2, 'Kepala Perwakilan Ombudsman RI');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(3, 'Pimpinan Ombudsman RI');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(4, 'Unit Luar Dalam Lingkup Ombudsman');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(5, 'Sekretariat Jenderal Ombudsman RI');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(6, 'Biro SDM dan Umum');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(7, 'Unit Keasistenan Pusat');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(8, 'Biro Perencanaan dan Keuangan');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(9, 'Biro Hukum Kerjasama dan Organisasi');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(10, 'Unit Keasistenan Perwakilan');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(11, 'Inspektorat');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(12, 'Biro Humas dan Teknologi Informasi');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(13, 'Biro Fasilitasi dan Pelayanan Teknis');
INSERT INTO m_work_unit (idx_m_work_unit, "name") VALUES(14, 'Unit Lainnya');

INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(1, '01', 'Lampiran 1 : FORMAT LAPORAN HASIL PENELAAHAN ADUAN – OLEH INSPEKTORAT OMBUDSMAN');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(2, '02', 'Lampiran 2 : FORMAT DISPOSISI HASIL TELAAH WBS – OLEH ANGGOTA PENGAMPU WBS');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(3, '03F14A', 'Lampiran 3 : FORMAT 14a LHPA - LAPORAN HASIL PEMERIKSAAN ADUAN');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(4, '04F14B', 'Lampiran 4 : FORMAT 14b LHPA - LAPORAN HASIL PEMERIKSAAN ADUAN');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(5, '05F1', 'Lampiran 5 : FORMAT 1 SURAT TUGAS KEPADA TIM PEMERIKSA KUMM');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(6, '06F2', 'Lampiran 6 : FORMAT 2 KERTAS KERJA VALIDASI');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(7, '07F3A', 'Lampiran 7 : FORMAT 3A SURAT PEMBERITAHUAN HASIL VALIDASI KEPADA TERADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(8, '08F3B', 'Lampiran 8 : FORMAT 3B SURAT PEMBERITAHUAN HASIL VALIDASI KEPADA PENGADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(9, '09F4', 'Lampiran 9 : FORMAT 4 NOTA DINAS DAN FORMAT 5 SURAT PERINTAH PELAKSANAAN SURAT PEMBERITAHUAN HASIL VALIDASI');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(10, '09F5', 'Lampiran 9 : FORMAT 5 SURAT PERINTAH PELAKSANAAN SURAT PEMBERITAHUAN HASIL VALIDASI');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(11, '10F6', 'Lampiran 10 : FORMAT 6 BERITA ACARA PENUTUPAN PENGADUAN KEGIATAN MASIH DALAM PROSES');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(12, '11F7', 'Lampiran 11 : FORMAT 7 SURAT PEMBERITAHUAN PENUTUPAN PENGADUAN MASIH DALAM PROSES KEPADA PENGADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(13, '12F8A', 'Lampiran 12 : FORMAT 8A SURAT PERMINTAAN DATA KEPADA PENGADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(14, '13F8B', 'Lampiran 13 : FORMAT 8B SURAT PERMINTAAN DATA KEPADA TERADU.');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(15, '14F9', 'Lampiran 14 : KERTAS KERJA PEMERIKSAAN: KLARIFIKASI');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(16, '15F10', 'Lampiran 15 : SURAT PERMINTAAN KLARIFIKASI');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(17, '16F11', 'Lampiran 16 : FORMAT 11 BERITA ACARA KLARIFIKASI');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(18, '17F12', 'Lampiran 17 : FORMAT 12 SURAT PERMINTAAN KONFIRMASI');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(19, '18F13', 'Lampiran 18 : FORMAT 13 LHPA KEGIATAN : PENYELESAIAN LAPORAN');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(20, '19F14', 'Lampiran 19 : FORMAT 14 LHPA KEGIATAN : PENCEGAHAN');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(21, '20', 'Lampiran 20 : ');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(22, '21F16', 'Lampiran 21 : FORMAT 16 BERITA ACARA RAPAT PLENO ATAS HASIL PEMERIKSAAN PENGADUAN');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(23, '22F17', 'Lampiran 22 : FORMAT 17 SURAT PEMBERITAHUAN PENUTUPAN PENGADUAN TIDAK TERDAPAT TEMUAN KEPADA PENGADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(24, '23F18', 'Lampiran 23 : FORMAT 18 BERITA ACARA PENUTUPAN PENGADUAN TIDAK TERDAPAT TEMUAN');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(25, '24F19', 'Lampiran 24 : FORMAT 19 SURAT TINDAK LANJUT PENGADUAN DENGAN TEMUAN KEPADA TERADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(26, '25F20', 'Lampiran 25 : FORMAT 20 SURAT TINDAK LANJUT PENGADUAN DENGAN TEMUAN KEPADA PENGADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(27, '26F21', 'Lampiran 26 : FORMAT 21 SURAT KE TERADU DENGAN DITEMBUSKAN KE PENGADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(28, '27F22', 'Lampiran 27 : FORMAT 22 SURAT TINDAK LANJUT PENGADUAN TIDAK TERDAPAT TEMUAN KE PENGADU');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(29, '28F23', 'Lampiran 28 : FORMAT 23 SURAT PERINTAH PELAKSANAAN TINDAK LANJUT PLENO');
INSERT INTO t_letters (idx_t_letter, code, "description") VALUES(30, '29F24', 'Lampiran 29 : FORMAT 24 BERITA ACARA PENUTUPAN PENGADUAN KEGIATAN YANG TELAH TERBIT PRODUK AKHIR');

--- REJECTED TYPE
INSERT INTO m_complaint_rejected_type ("name") VALUES
	 ('Pengadu bukan Pelapor Kuasa Pelapor/Kuasa Pengadu Terlapor/Pihak Terkait'),
	 ('Teradu bukan Insan Ombudsman RI/Keasistenan Utama/Perwakilan Ombudsman'),
	 ('Pengaduan yang disampaikan telah lewat batas waktu yang ditetapkan'),
	 ('Pengaduan yang disampaikan sama dengan pengaduan yang telah disampaikan sebelumnya (Nebis In Idem)');