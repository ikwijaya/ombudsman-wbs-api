INSERT INTO m_form (idx_m_form,form_name,form_url,form_color,form_icon,form_sort,idx_m_form_parent,is_read_only) VALUES
	 (0,'Dashboard','/Dashboard','white','mdi-dashboard','0',NULL,true),
	 (1,'Pengaduan','/Pengaduan','white','mdi-account-tie','1',NULL,false),
	 (2,'Verifikasi Persyaratan',NULL,'red','mdi-shield','2',100,true),
	 (3,'Telaah Pengaduan','/TelaahPengaduan','blue darken-1','mdi-glasses','3',100,false),
	 (4,'Putusan Anggota Ombudsman Pengampu WBS','/PengampuWBS','black','mdi-comma','4',100,false),
	 (5,'Penyetujuan atau Tindak Lanjut ',NULL,NULL,NULL,NULL,100,true),
	 (6,'Penetapan Tim Pemeriksa','/PenangananPengaduan','pink lighten-1','mdi-hand-heart','5',100,false),
	 (7,'Kertas Kerja Validasi',NULL,NULL,NULL,NULL,101,false),
	 (8,'Permintaan Data dan Dokumen',NULL,NULL,NULL,NULL,101,false),
	 (9,'Kertas Kerja Klarifikasi',NULL,NULL,NULL,NULL,101,false);
INSERT INTO m_form (idx_m_form,form_name,form_url,form_color,form_icon,form_sort,idx_m_form_parent,is_read_only) VALUES
	 (10,'Klarifikasi Terperiksa',NULL,NULL,NULL,NULL,101,false),
	 (11,'Konfirmasi Pengadu',NULL,NULL,NULL,NULL,101,false),
	 (12,'Penyusunan LHPA',NULL,NULL,NULL,NULL,101,false),
	 (13,'Bedah Pengaduan',NULL,NULL,NULL,NULL,101,false),
	 (14,'Rapat Pleno',NULL,NULL,NULL,NULL,101,false),
	 (15,'Penyampaian Tindak Lanjut ',NULL,NULL,NULL,NULL,101,false),
	 (16,'Monitoring',NULL,NULL,NULL,NULL,101,false),
	 (17,'Penutupan',NULL,NULL,NULL,NULL,101,false),
	 (18,'To Do','/MyTodo','white','mdi-tag-multiple','3',NULL,true),
	--  (19,'Bedah Laporan dan Rapat Pleno','/BLPleno','white','mdi-cube','3',NULL,true),
	 (91,'Approve Validasi',NULL,NULL,NULL,NULL,7,true),
	 (200,'Master Users','/MasterUsers',NULL,'mdi-cog','100',9998,false);
INSERT INTO m_form (idx_m_form,form_name,form_url,form_color,form_icon,form_sort,idx_m_form_parent,is_read_only) VALUES
	 (201,'Roles Management',NULL,NULL,NULL,'7',200,true),
	 (203,'External Users','/ExternalUsers',NULL,'mdi-user-groups','101',NULL,true),
	 (9998,'Module','/Master','red','mdi-chart-donut','999',NULL,true),
	 (300,'Rollback Procedure',NULL,NULL,NULL,NULL,1,true);