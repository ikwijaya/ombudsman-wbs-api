INSERT INTO m_user (idx_m_user,email,passwd,idx_m_user_type,fullname,identity_no,phone_no,is_verify) VALUES 
	 (1,'superadmin','202cb962ac59075b964b07152d234b70',0,'SUPER ADMIN','-','-',true);

INSERT INTO m_user (email,passwd,idx_m_user_type,fullname,identity_no,phone_no,is_verify) VALUES
	 ('inspektorat','202cb962ac59075b964b07152d234b70',1,'INSPEKTORAT','-','-',true),
	 ('kumm','202cb962ac59075b964b07152d234b70',2,'ANGGOTA KUMM 01','-','-',true),
	 ('kumm02','202cb962ac59075b964b07152d234b70',2,'ANGGOTA KUMM 02','-','-',true),
	 ('kku','202cb962ac59075b964b07152d234b70',3,'KEPALA KUMM','-','-',true),
	 ('kkr','202cb962ac59075b964b07152d234b70',4,'KEPALA KEASISTENAN REGIONAL','-','-',true),
	 ('bigboss','202cb962ac59075b964b07152d234b70',5,'KETUA OMBUDSMAN','-','-',true);

-- ROLES
INSERT INTO t_roles (idx_m_user,idx_m_form,role_action,role_value) VALUES
	 (1,0,'R',true),
	 (1,1,'R',true),
	 (1,1,'U',true),
	 (1,1,'I',true),
	 (1,200,'R',true),
	 (1,200,'U',true),
	 (1,200,'I',true),
	 (1,2,'R',true),
	 (1,3,'R',true),
	 (1,3,'U',true);
INSERT INTO t_roles (idx_m_user,idx_m_form,role_action,role_value) VALUES
	 (1,3,'I',true),
	 (1,4,'R',true),
	 (1,4,'U',true),
	 (1,4,'I',true),
	 (1,6,'R',true),
	 (1,6,'U',true),
	 (1,6,'I',true),
	 (1,201,'R',true),
	 (1,9998,'R',true),
	 (1,8,'R',true);
INSERT INTO t_roles (idx_m_user,idx_m_form,role_action,role_value) VALUES
	 (1,8,'U',true),
	 (1,8,'I',true),
	 (1,91,'R',true),
	 (1,7,'R',true),
	 (1,7,'U',true),
	 (1,7,'I',true),
	 (1,5,'R',true);