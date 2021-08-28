-- DROP SCHEMA ombudsman;

CREATE SCHEMA ombudsman AUTHORIZATION postgres;

-- DROP TYPE ombudsman."_m_account";

CREATE TYPE ombudsman."_m_account" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_account,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_city";

CREATE TYPE ombudsman."_m_city" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_city,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_complaint";

CREATE TYPE ombudsman."_m_complaint" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_complaint,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_complaint_attachment";

CREATE TYPE ombudsman."_m_complaint_attachment" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_complaint_attachment,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_complaint_event";

CREATE TYPE ombudsman."_m_complaint_event" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_complaint_event,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_complaint_incident";

CREATE TYPE ombudsman."_m_complaint_incident" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_complaint_incident,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_complaint_office";

CREATE TYPE ombudsman."_m_complaint_office" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_complaint_office,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_complaint_rejected_type";

CREATE TYPE ombudsman."_m_complaint_rejected_type" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_complaint_rejected_type,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_complaint_reported";

CREATE TYPE ombudsman."_m_complaint_reported" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_complaint_reported,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_disposition";

CREATE TYPE ombudsman."_m_disposition" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_disposition,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_form";

CREATE TYPE ombudsman."_m_form" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_form,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_legal_standing";

CREATE TYPE ombudsman."_m_legal_standing" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_legal_standing,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_option";

CREATE TYPE ombudsman."_m_option" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_option,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_region";

CREATE TYPE ombudsman."_m_region" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_region,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_user";

CREATE TYPE ombudsman."_m_user" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_user,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_violation";

CREATE TYPE ombudsman."_m_violation" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_violation,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_m_work_unit";

CREATE TYPE ombudsman."_m_work_unit" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_work_unit,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_sys_error_log";

CREATE TYPE ombudsman."_sys_error_log" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.sys_error_log,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_sys_log";

CREATE TYPE ombudsman."_sys_log" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.sys_log,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_action";

CREATE TYPE ombudsman."_t_complaint_action" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_action,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_decision";

CREATE TYPE ombudsman."_t_complaint_decision" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_decision,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_decision_event";

CREATE TYPE ombudsman."_t_complaint_decision_event" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_decision_event,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_decision_incident";

CREATE TYPE ombudsman."_t_complaint_decision_incident" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_decision_incident,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_decision_office";

CREATE TYPE ombudsman."_t_complaint_decision_office" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_decision_office,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_decision_reported";

CREATE TYPE ombudsman."_t_complaint_decision_reported" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_decision_reported,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_study";

CREATE TYPE ombudsman."_t_complaint_study" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_study,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_study_event";

CREATE TYPE ombudsman."_t_complaint_study_event" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_study_event,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_study_indicent";

CREATE TYPE ombudsman."_t_complaint_study_indicent" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_study_indicent,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_study_office";

CREATE TYPE ombudsman."_t_complaint_study_office" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_study_office,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_study_reported";

CREATE TYPE ombudsman."_t_complaint_study_reported" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_study_reported,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_verification";

CREATE TYPE ombudsman."_t_complaint_verification" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_verification,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_roles";

CREATE TYPE ombudsman."_t_roles" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_roles,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_session";

CREATE TYPE ombudsman."_t_session" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_session,
	DELIMITER = ',');

-- DROP TYPE ombudsman.m_account;

CREATE TYPE ombudsman.m_account AS (
	idx_m_account serial,
	email varchar,
	fullname varchar,
	identity_no varchar,
	phone_no varchar,
	passwd varchar,
	remarks text,
	is_login bool,
	last_login timestamp,
	last_logout timestamp,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_city;

CREATE TYPE ombudsman.m_city AS (
	idx_m_city serial,
	idx_m_region int8,
	"name" varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_complaint;

CREATE TYPE ombudsman.m_complaint AS (
	idx_m_complaint_form int4,
	form_no varchar,
	"date" varchar,
	idx_m_account int8,
	idx_m_legal_standing int8,
	manpower varchar,
	idx_m_violation int8,
	description varchar,
	hopes varchar,
	idx_m_work_unit int8,
	idx_m_city int8,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar,
	form_status varchar,
	source_complaint varchar);

-- DROP TYPE ombudsman.m_complaint_attachment;

CREATE TYPE ombudsman.m_complaint_attachment AS (
	idx_t_complaint_attachment int4,
	idx_m_complaint int8,
	description varchar,
	filename varchar,
	"path" varchar,
	mime_type varchar,
	filesize int8,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_complaint_event;

CREATE TYPE ombudsman.m_complaint_event AS (
	idx_t_complaint_event int4,
	idx_m_complaint int8,
	"event" varchar,
	"date" date,
	notes varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_complaint_incident;

CREATE TYPE ombudsman.m_complaint_incident AS (
	idx_t_complaint_incident int4,
	idx_m_complaint int8,
	start_date date,
	end_date date,
	notes varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_complaint_office;

CREATE TYPE ombudsman.m_complaint_office AS (
	idx_t_complaint_office int4,
	idx_m_complaint int8,
	"name" varchar,
	address varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_complaint_rejected_type;

CREATE TYPE ombudsman.m_complaint_rejected_type AS (
	idx_m_complaint_rejected_type int4,
	"name" varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_complaint_reported;

CREATE TYPE ombudsman.m_complaint_reported AS (
	idx_t_complaint_reported int4,
	idx_m_complaint int8,
	"name" varchar,
	identity_no varchar,
	occupation varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_disposition;

CREATE TYPE ombudsman.m_disposition AS (
	idx_m_disposition serial,
	"name" varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_form;

CREATE TYPE ombudsman.m_form AS (
	idx_m_form serial,
	form_name varchar,
	form_icon varchar,
	form_color varchar,
	form_url varchar,
	form_sort varchar,
	idx_m_form_parent int8,
	is_read_only bool,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_legal_standing;

CREATE TYPE ombudsman.m_legal_standing AS (
	idx_m_legal_standing serial,
	"name" varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_option;

CREATE TYPE ombudsman.m_option AS (
	option_id varchar,
	"name" varchar,
	value varchar,
	"text" varchar,
	remarks varchar,
	order_no varchar);

-- DROP TYPE ombudsman.m_region;

CREATE TYPE ombudsman.m_region AS (
	idx_m_region serial,
	"name" varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_user;

CREATE TYPE ombudsman.m_user AS (
	idx_m_user serial,
	username varchar,
	passwd varchar,
	remarks text,
	is_login bool,
	last_login timestamp,
	last_logout timestamp,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_violation;

CREATE TYPE ombudsman.m_violation AS (
	idx_m_violation serial,
	"name" varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.m_work_unit;

CREATE TYPE ombudsman.m_work_unit AS (
	idx_m_work_unit serial,
	"name" varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.sys_error_log;

CREATE TYPE ombudsman.sys_error_log AS (
	idx_sys_error_log serial,
	error_type varchar,
	error_procedure varchar,
	error_state varchar,
	error_message varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.sys_log;

CREATE TYPE ombudsman.sys_log AS (
	idx_sys_log serial,
	activity varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_action;

CREATE TYPE ombudsman.t_complaint_action AS (
	idx_t_complaint_action serial,
	idx_m_complaint int8,
	"date" date,
	description varchar,
	is_close bool,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_decision;

CREATE TYPE ombudsman.t_complaint_decision AS (
	idx_t_complaint_decision serial,
	idx_m_complaint int8,
	idx_m_disposition int8,
	notes varchar,
	idx_m_violation int8,
	idx_m_work_unit int8,
	idx_m_city int8,
	form_status varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar,
	approved_by int8,
	approved_date timestamp);

-- DROP TYPE ombudsman.t_complaint_decision_event;

CREATE TYPE ombudsman.t_complaint_decision_event AS (
	idx_t_complaint_decision_event serial,
	idx_t_complaint_decision int8,
	"event" varchar,
	"date" date,
	notes varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_decision_incident;

CREATE TYPE ombudsman.t_complaint_decision_incident AS (
	idx_t_complaint_decision_incident int4,
	idx_t_complaint_decision int8,
	start_date date,
	end_date date,
	notes varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_decision_office;

CREATE TYPE ombudsman.t_complaint_decision_office AS (
	idx_t_complaint_decision_office serial,
	idx_t_complaint_decision int8,
	"name" varchar,
	address varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_decision_reported;

CREATE TYPE ombudsman.t_complaint_decision_reported AS (
	idx_t_complaint_decision_reported int4,
	idx_t_complaint_decision int8,
	"name" varchar,
	identity_no varchar,
	occupation varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_study;

CREATE TYPE ombudsman.t_complaint_study AS (
	idx_t_complaint_study serial,
	idx_m_complaint int8,
	notes varchar,
	idx_m_violation int8,
	idx_m_city int8,
	form_status varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar,
	idx_m_work_unit int8);

-- DROP TYPE ombudsman.t_complaint_study_event;

CREATE TYPE ombudsman.t_complaint_study_event AS (
	idx_t_complaint_study_event serial,
	idx_t_complaint_study int8,
	"event" varchar,
	"date" date,
	notes varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_study_indicent;

CREATE TYPE ombudsman.t_complaint_study_indicent AS (
	idx_t_complaint_study_incident serial,
	idx_t_complaint_study int8,
	start_date date,
	end_date date,
	notes varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_study_office;

CREATE TYPE ombudsman.t_complaint_study_office AS (
	idx_t_complaint_study_office serial,
	idx_t_complaint_study int8,
	"name" varchar,
	address varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_study_reported;

CREATE TYPE ombudsman.t_complaint_study_reported AS (
	idx_t_complaint_study_reported int8,
	idx_t_complaint_study int8,
	"name" varchar,
	identity_no varchar,
	occupation varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_complaint_verification;

CREATE TYPE ombudsman.t_complaint_verification AS (
	idx_t_complaint_verification serial,
	idx_m_complaint int8,
	idx_m_complaint_rejected_type int8,
	verification_type varchar,
	remarks varchar,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_roles;

CREATE TYPE ombudsman.t_roles AS (
	idx_t_roles serial,
	idx_m_user int8,
	idx_m_form int8,
	role_action varchar,
	role_value bool,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP TYPE ombudsman.t_session;

CREATE TYPE ombudsman.t_session AS (
	idx_t_session serial,
	user_id int8,
	"type" varchar,
	sid varchar,
	expires timestamp,
	ucreate varchar,
	dcreate timestamp,
	umodified varchar,
	dmodified timestamp,
	record_status varchar);

-- DROP SEQUENCE ombudsman.m_account_idx_m_account_seq;

CREATE SEQUENCE ombudsman.m_account_idx_m_account_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_account_idx_m_account_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_account_idx_m_account_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_city_idx_m_city_seq;

CREATE SEQUENCE ombudsman.m_city_idx_m_city_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_city_idx_m_city_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_city_idx_m_city_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_disposition_idx_m_disposition_seq;

CREATE SEQUENCE ombudsman.m_disposition_idx_m_disposition_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_disposition_idx_m_disposition_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_disposition_idx_m_disposition_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_form_idx_m_form_seq;

CREATE SEQUENCE ombudsman.m_form_idx_m_form_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_form_idx_m_form_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_form_idx_m_form_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_legal_standing_idx_m_legal_standing_seq;

CREATE SEQUENCE ombudsman.m_legal_standing_idx_m_legal_standing_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_legal_standing_idx_m_legal_standing_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_legal_standing_idx_m_legal_standing_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_region_idx_m_region_seq;

CREATE SEQUENCE ombudsman.m_region_idx_m_region_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_region_idx_m_region_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_region_idx_m_region_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_rejected_idx_m_rejected_seq;

CREATE SEQUENCE ombudsman.m_rejected_idx_m_rejected_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_rejected_idx_m_rejected_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_rejected_idx_m_rejected_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_user_idx_m_user_seq;

CREATE SEQUENCE ombudsman.m_user_idx_m_user_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_user_idx_m_user_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_user_idx_m_user_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_violation_idx_m_violation_seq;

CREATE SEQUENCE ombudsman.m_violation_idx_m_violation_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_violation_idx_m_violation_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_violation_idx_m_violation_seq TO postgres;

-- DROP SEQUENCE ombudsman.m_work_unit_idx_m_work_unit_seq;

CREATE SEQUENCE ombudsman.m_work_unit_idx_m_work_unit_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_work_unit_idx_m_work_unit_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_work_unit_idx_m_work_unit_seq TO postgres;

-- DROP SEQUENCE ombudsman.sys_error_log_idx_sys_error_log_seq;

CREATE SEQUENCE ombudsman.sys_error_log_idx_sys_error_log_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.sys_error_log_idx_sys_error_log_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.sys_error_log_idx_sys_error_log_seq TO postgres;

-- DROP SEQUENCE ombudsman.sys_log_idx_sys_log_seq;

CREATE SEQUENCE ombudsman.sys_log_idx_sys_log_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.sys_log_idx_sys_log_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.sys_log_idx_sys_log_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_action_idx_t_complaint_action_seq;

CREATE SEQUENCE ombudsman.t_complaint_action_idx_t_complaint_action_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_action_idx_t_complaint_action_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_action_idx_t_complaint_action_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_attachment_idx_t_complaint_attachment_seq;

CREATE SEQUENCE ombudsman.t_complaint_attachment_idx_t_complaint_attachment_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_attachment_idx_t_complaint_attachment_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_attachment_idx_t_complaint_attachment_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_decision_event_idx_t_complaint_decision_event_seq;

CREATE SEQUENCE ombudsman.t_complaint_decision_event_idx_t_complaint_decision_event_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_decision_event_idx_t_complaint_decision_event_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_decision_event_idx_t_complaint_decision_event_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_decision_idx_t_complaint_decision_seq;

CREATE SEQUENCE ombudsman.t_complaint_decision_idx_t_complaint_decision_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_decision_idx_t_complaint_decision_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_decision_idx_t_complaint_decision_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_decision_incident_idx_t_complaint_decision_inci_seq;

CREATE SEQUENCE ombudsman.t_complaint_decision_incident_idx_t_complaint_decision_inci_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_decision_incident_idx_t_complaint_decision_inci_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_decision_incident_idx_t_complaint_decision_inci_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_decision_office_idx_t_complaint_decision_office_seq;

CREATE SEQUENCE ombudsman.t_complaint_decision_office_idx_t_complaint_decision_office_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_decision_office_idx_t_complaint_decision_office_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_decision_office_idx_t_complaint_decision_office_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_decision_reported_idx_t_complaint_decision_repo_seq;

CREATE SEQUENCE ombudsman.t_complaint_decision_reported_idx_t_complaint_decision_repo_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_decision_reported_idx_t_complaint_decision_repo_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_decision_reported_idx_t_complaint_decision_repo_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_event_idx_t_complaint_event_seq;

CREATE SEQUENCE ombudsman.t_complaint_event_idx_t_complaint_event_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_event_idx_t_complaint_event_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_event_idx_t_complaint_event_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_form_idx_t_complaint_form_seq;

CREATE SEQUENCE ombudsman.t_complaint_form_idx_t_complaint_form_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_form_idx_t_complaint_form_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_form_idx_t_complaint_form_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_incident_idx_t_complaint_incident_seq;

CREATE SEQUENCE ombudsman.t_complaint_incident_idx_t_complaint_incident_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_incident_idx_t_complaint_incident_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_incident_idx_t_complaint_incident_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_office_idx_t_complaint_office_seq;

CREATE SEQUENCE ombudsman.t_complaint_office_idx_t_complaint_office_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_office_idx_t_complaint_office_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_office_idx_t_complaint_office_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_reported_idx_t_complaint_reported_seq;

CREATE SEQUENCE ombudsman.t_complaint_reported_idx_t_complaint_reported_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_reported_idx_t_complaint_reported_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_reported_idx_t_complaint_reported_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_study_event_idx_t_complaint_study_event_seq;

CREATE SEQUENCE ombudsman.t_complaint_study_event_idx_t_complaint_study_event_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_study_event_idx_t_complaint_study_event_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_study_event_idx_t_complaint_study_event_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_study_idx_t_complaint_study_seq;

CREATE SEQUENCE ombudsman.t_complaint_study_idx_t_complaint_study_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_study_idx_t_complaint_study_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_study_idx_t_complaint_study_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_study_indicent_idx_t_complaint_study_incident_seq;

CREATE SEQUENCE ombudsman.t_complaint_study_indicent_idx_t_complaint_study_incident_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_study_indicent_idx_t_complaint_study_incident_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_study_indicent_idx_t_complaint_study_incident_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_study_office_idx_t_complaint_study_office_seq;

CREATE SEQUENCE ombudsman.t_complaint_study_office_idx_t_complaint_study_office_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_study_office_idx_t_complaint_study_office_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_study_office_idx_t_complaint_study_office_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_verification_idx_t_complaint_verification_seq;

CREATE SEQUENCE ombudsman.t_complaint_verification_idx_t_complaint_verification_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_verification_idx_t_complaint_verification_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_verification_idx_t_complaint_verification_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_roles_idx_t_roles_seq;

CREATE SEQUENCE ombudsman.t_roles_idx_t_roles_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_roles_idx_t_roles_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_roles_idx_t_roles_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_session_idx_t_session_seq;

CREATE SEQUENCE ombudsman.t_session_idx_t_session_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_session_idx_t_session_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_session_idx_t_session_seq TO postgres;
-- ombudsman.m_account definition

-- Drop table

-- DROP TABLE ombudsman.m_account;

CREATE TABLE ombudsman.m_account (
	idx_m_account serial NOT NULL,
	email varchar NOT NULL,
	fullname varchar NOT NULL,
	identity_no varchar NULL,
	phone_no varchar NOT NULL,
	passwd varchar NOT NULL,
	remarks text NULL,
	is_login bool NULL DEFAULT false,
	last_login timestamp(0) NULL,
	last_logout timestamp(0) NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_account_pk PRIMARY KEY (idx_m_account)
);

-- Permissions

ALTER TABLE ombudsman.m_account OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_account TO postgres;


-- ombudsman.m_city definition

-- Drop table

-- DROP TABLE ombudsman.m_city;

CREATE TABLE ombudsman.m_city (
	idx_m_city serial NOT NULL,
	idx_m_region int8 NOT NULL,
	"name" varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_city_pk PRIMARY KEY (idx_m_city)
);

-- Permissions

ALTER TABLE ombudsman.m_city OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_city TO postgres;


-- ombudsman.m_complaint definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint;

CREATE TABLE ombudsman.m_complaint (
	idx_m_complaint_form int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_form_idx_t_complaint_form_seq'::regclass),
	form_no varchar NOT NULL,
	"date" varchar NULL,
	idx_m_account int8 NOT NULL,
	idx_m_legal_standing int8 NOT NULL,
	manpower varchar NULL,
	idx_m_violation int8 NOT NULL,
	description varchar NOT NULL,
	hopes varchar NOT NULL,
	idx_m_work_unit int8 NOT NULL,
	idx_m_city int8 NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	form_status varchar NOT NULL DEFAULT 0,
	source_complaint varchar NOT NULL DEFAULT 0,
	CONSTRAINT t_complaint_form_pk PRIMARY KEY (idx_m_complaint_form)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint TO postgres;


-- ombudsman.m_complaint_attachment definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_attachment;

CREATE TABLE ombudsman.m_complaint_attachment (
	idx_t_complaint_attachment int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_attachment_idx_t_complaint_attachment_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	description varchar NULL,
	filename varchar NOT NULL,
	"path" varchar NOT NULL,
	mime_type varchar NOT NULL,
	filesize int8 NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_attachment_pk PRIMARY KEY (idx_t_complaint_attachment)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_attachment OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_attachment TO postgres;


-- ombudsman.m_complaint_event definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_event;

CREATE TABLE ombudsman.m_complaint_event (
	idx_t_complaint_event int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_event_idx_t_complaint_event_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	"event" varchar NOT NULL,
	"date" date NOT NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_event_pk PRIMARY KEY (idx_t_complaint_event)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_event OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_event TO postgres;


-- ombudsman.m_complaint_incident definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_incident;

CREATE TABLE ombudsman.m_complaint_incident (
	idx_t_complaint_incident int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_incident_idx_t_complaint_incident_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	start_date date NULL,
	end_date date NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_incident OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_incident TO postgres;


-- ombudsman.m_complaint_office definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_office;

CREATE TABLE ombudsman.m_complaint_office (
	idx_t_complaint_office int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_office_idx_t_complaint_office_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	"name" varchar NOT NULL,
	address varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_office_pk PRIMARY KEY (idx_t_complaint_office)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_office OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_office TO postgres;


-- ombudsman.m_complaint_rejected_type definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_rejected_type;

CREATE TABLE ombudsman.m_complaint_rejected_type (
	idx_m_complaint_rejected_type int4 NOT NULL DEFAULT nextval('ombudsman.m_rejected_idx_m_rejected_seq'::regclass),
	"name" varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_rejected_pk PRIMARY KEY (idx_m_complaint_rejected_type)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_rejected_type OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_rejected_type TO postgres;


-- ombudsman.m_complaint_reported definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_reported;

CREATE TABLE ombudsman.m_complaint_reported (
	idx_t_complaint_reported int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_reported_idx_t_complaint_reported_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	"name" varchar NOT NULL DEFAULT 'ANONIM'::character varying,
	identity_no varchar NULL,
	occupation varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_reported_pk PRIMARY KEY (idx_t_complaint_reported)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_reported OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_reported TO postgres;


-- ombudsman.m_disposition definition

-- Drop table

-- DROP TABLE ombudsman.m_disposition;

CREATE TABLE ombudsman.m_disposition (
	idx_m_disposition serial NOT NULL,
	"name" varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_disposition_pk PRIMARY KEY (idx_m_disposition)
);

-- Permissions

ALTER TABLE ombudsman.m_disposition OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_disposition TO postgres;


-- ombudsman.m_form definition

-- Drop table

-- DROP TABLE ombudsman.m_form;

CREATE TABLE ombudsman.m_form (
	idx_m_form serial NOT NULL,
	form_name varchar NOT NULL,
	form_icon varchar NOT NULL,
	form_color varchar NULL,
	form_url varchar NOT NULL,
	form_sort varchar NULL,
	idx_m_form_parent int8 NULL,
	is_read_only bool NOT NULL DEFAULT false,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_form_pk PRIMARY KEY (idx_m_form)
);

-- Permissions

ALTER TABLE ombudsman.m_form OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_form TO postgres;


-- ombudsman.m_legal_standing definition

-- Drop table

-- DROP TABLE ombudsman.m_legal_standing;

CREATE TABLE ombudsman.m_legal_standing (
	idx_m_legal_standing serial NOT NULL,
	"name" varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_legal_standing_pk PRIMARY KEY (idx_m_legal_standing)
);

-- Permissions

ALTER TABLE ombudsman.m_legal_standing OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_legal_standing TO postgres;


-- ombudsman.m_option definition

-- Drop table

-- DROP TABLE ombudsman.m_option;

CREATE TABLE ombudsman.m_option (
	option_id varchar NOT NULL,
	"name" varchar NULL,
	value varchar NULL,
	"text" varchar NULL,
	remarks varchar NULL,
	order_no varchar NULL
);

-- Permissions

ALTER TABLE ombudsman.m_option OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_option TO postgres;


-- ombudsman.m_region definition

-- Drop table

-- DROP TABLE ombudsman.m_region;

CREATE TABLE ombudsman.m_region (
	idx_m_region serial NOT NULL,
	"name" varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_region_pk PRIMARY KEY (idx_m_region)
);

-- Permissions

ALTER TABLE ombudsman.m_region OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_region TO postgres;


-- ombudsman.m_user definition

-- Drop table

-- DROP TABLE ombudsman.m_user;

CREATE TABLE ombudsman.m_user (
	idx_m_user serial NOT NULL,
	username varchar NOT NULL,
	passwd varchar NOT NULL,
	remarks text NULL,
	is_login bool NULL DEFAULT false,
	last_login timestamp(0) NULL,
	last_logout timestamp(0) NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_user_pk PRIMARY KEY (idx_m_user)
);

-- Permissions

ALTER TABLE ombudsman.m_user OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_user TO postgres;


-- ombudsman.m_violation definition

-- Drop table

-- DROP TABLE ombudsman.m_violation;

CREATE TABLE ombudsman.m_violation (
	idx_m_violation serial NOT NULL,
	"name" varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_violation_pk PRIMARY KEY (idx_m_violation)
);

-- Permissions

ALTER TABLE ombudsman.m_violation OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_violation TO postgres;


-- ombudsman.m_work_unit definition

-- Drop table

-- DROP TABLE ombudsman.m_work_unit;

CREATE TABLE ombudsman.m_work_unit (
	idx_m_work_unit serial NOT NULL,
	"name" varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_work_unit_pk PRIMARY KEY (idx_m_work_unit)
);

-- Permissions

ALTER TABLE ombudsman.m_work_unit OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_work_unit TO postgres;


-- ombudsman.sys_error_log definition

-- Drop table

-- DROP TABLE ombudsman.sys_error_log;

CREATE TABLE ombudsman.sys_error_log (
	idx_sys_error_log serial NOT NULL,
	error_type varchar NULL,
	error_procedure varchar NULL,
	error_state varchar NULL,
	error_message varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT sys_error_log_pk PRIMARY KEY (idx_sys_error_log)
);

-- Permissions

ALTER TABLE ombudsman.sys_error_log OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.sys_error_log TO postgres;


-- ombudsman.sys_log definition

-- Drop table

-- DROP TABLE ombudsman.sys_log;

CREATE TABLE ombudsman.sys_log (
	idx_sys_log serial NOT NULL,
	activity varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT sys_log_pk PRIMARY KEY (idx_sys_log)
);

-- Permissions

ALTER TABLE ombudsman.sys_log OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.sys_log TO postgres;


-- ombudsman.t_complaint_action definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_action;

CREATE TABLE ombudsman.t_complaint_action (
	idx_t_complaint_action serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	"date" date NOT NULL,
	description varchar NOT NULL,
	is_close bool NOT NULL DEFAULT false,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_action_pk PRIMARY KEY (idx_t_complaint_action)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_action OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_action TO postgres;


-- ombudsman.t_complaint_decision definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_decision;

CREATE TABLE ombudsman.t_complaint_decision (
	idx_t_complaint_decision serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	idx_m_disposition int8 NOT NULL,
	notes varchar NULL,
	idx_m_violation int8 NOT NULL,
	idx_m_work_unit int8 NOT NULL,
	idx_m_city int8 NOT NULL,
	form_status varchar NOT NULL DEFAULT 0, -- ambil dari general m_option (draft/submit)
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	approved_by int8 NULL, -- kumm, cek halaman 27
	approved_date timestamp(0) NULL,
	CONSTRAINT t_complaint_decision_pk PRIMARY KEY (idx_t_complaint_decision)
);
COMMENT ON TABLE ombudsman.t_complaint_decision IS 'modul putusan pengaduan, form_status sama kek yg lainnya
ada tricky cek halaman 27, jika disposisi adalah proses, dan ditutup maka ada yg harus di submit (sudah diterima kumm) cek page 27
3.3.2.7.1 Modul Penerimaan Penugasan oleh KUMM';

-- Column comments

COMMENT ON COLUMN ombudsman.t_complaint_decision.form_status IS 'ambil dari general m_option (draft/submit)';
COMMENT ON COLUMN ombudsman.t_complaint_decision.approved_by IS 'kumm, cek halaman 27';

-- Permissions

ALTER TABLE ombudsman.t_complaint_decision OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_decision TO postgres;


-- ombudsman.t_complaint_decision_event definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_decision_event;

CREATE TABLE ombudsman.t_complaint_decision_event (
	idx_t_complaint_decision_event serial NOT NULL,
	idx_t_complaint_decision int8 NOT NULL,
	"event" varchar NOT NULL,
	"date" date NOT NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_decision_event_pk PRIMARY KEY (idx_t_complaint_decision_event)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_decision_event OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_decision_event TO postgres;


-- ombudsman.t_complaint_decision_incident definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_decision_incident;

CREATE TABLE ombudsman.t_complaint_decision_incident (
	idx_t_complaint_decision_incident int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_decision_incident_idx_t_complaint_decision_inci_seq'::regclass),
	idx_t_complaint_decision int8 NOT NULL,
	start_date date NULL,
	end_date date NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_decision_incident_pk PRIMARY KEY (idx_t_complaint_decision_incident)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_decision_incident OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_decision_incident TO postgres;


-- ombudsman.t_complaint_decision_office definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_decision_office;

CREATE TABLE ombudsman.t_complaint_decision_office (
	idx_t_complaint_decision_office serial NOT NULL,
	idx_t_complaint_decision int8 NOT NULL,
	"name" varchar NOT NULL,
	address varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_decision_office_pk PRIMARY KEY (idx_t_complaint_decision_office)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_decision_office OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_decision_office TO postgres;


-- ombudsman.t_complaint_decision_reported definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_decision_reported;

CREATE TABLE ombudsman.t_complaint_decision_reported (
	idx_t_complaint_decision_reported int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_decision_reported_idx_t_complaint_decision_repo_seq'::regclass),
	idx_t_complaint_decision int8 NOT NULL,
	"name" varchar NOT NULL DEFAULT 'ANONIM'::character varying,
	identity_no varchar NULL,
	occupation varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_decision_reported_pk PRIMARY KEY (idx_t_complaint_decision_reported)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_decision_reported OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_decision_reported TO postgres;


-- ombudsman.t_complaint_study definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study;

CREATE TABLE ombudsman.t_complaint_study (
	idx_t_complaint_study serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	notes varchar NULL,
	idx_m_violation int8 NOT NULL,
	idx_m_city int8 NOT NULL,
	form_status varchar NOT NULL DEFAULT 0, -- ambil dari general m_option (draft/submit)
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	idx_m_work_unit int8 NOT NULL,
	CONSTRAINT t_complaint_study_pk PRIMARY KEY (idx_t_complaint_study)
);
COMMENT ON TABLE ombudsman.t_complaint_study IS 'module telaah pengaduan, form_status cek halaman 21-22, 0 draft, 1 telah di submit (telaah/study)';

-- Column comments

COMMENT ON COLUMN ombudsman.t_complaint_study.form_status IS 'ambil dari general m_option (draft/submit)';

-- Permissions

ALTER TABLE ombudsman.t_complaint_study OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study TO postgres;


-- ombudsman.t_complaint_study_event definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study_event;

CREATE TABLE ombudsman.t_complaint_study_event (
	idx_t_complaint_study_event serial NOT NULL,
	idx_t_complaint_study int8 NOT NULL,
	"event" varchar NOT NULL,
	"date" date NOT NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_study_event_pk PRIMARY KEY (idx_t_complaint_study_event)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_study_event OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study_event TO postgres;


-- ombudsman.t_complaint_study_indicent definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study_indicent;

CREATE TABLE ombudsman.t_complaint_study_indicent (
	idx_t_complaint_study_incident serial NOT NULL,
	idx_t_complaint_study int8 NOT NULL,
	start_date date NULL,
	end_date date NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying
);
COMMENT ON TABLE ombudsman.t_complaint_study_indicent IS 'modul telaah pengaduan tempat kejadian';

-- Permissions

ALTER TABLE ombudsman.t_complaint_study_indicent OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study_indicent TO postgres;


-- ombudsman.t_complaint_study_office definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study_office;

CREATE TABLE ombudsman.t_complaint_study_office (
	idx_t_complaint_study_office serial NOT NULL,
	idx_t_complaint_study int8 NOT NULL,
	"name" varchar NOT NULL,
	address varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_study_office_pk PRIMARY KEY (idx_t_complaint_study_office)
);
COMMENT ON TABLE ombudsman.t_complaint_study_office IS 'modul telaah pengaduan';

-- Permissions

ALTER TABLE ombudsman.t_complaint_study_office OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study_office TO postgres;


-- ombudsman.t_complaint_study_reported definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study_reported;

CREATE TABLE ombudsman.t_complaint_study_reported (
	idx_t_complaint_study_reported int8 NOT NULL,
	idx_t_complaint_study int8 NOT NULL,
	"name" varchar NOT NULL DEFAULT 'ANONIM'::character varying,
	identity_no varchar NULL,
	occupation varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_study_reported_pk PRIMARY KEY (idx_t_complaint_study_reported)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_study_reported OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study_reported TO postgres;


-- ombudsman.t_complaint_verification definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_verification;

CREATE TABLE ombudsman.t_complaint_verification (
	idx_t_complaint_verification serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	idx_m_complaint_rejected_type int8 NULL,
	verification_type varchar NOT NULL DEFAULT 0, -- ambil dari m_option (2)
	remarks varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_verification_pk PRIMARY KEY (idx_t_complaint_verification)
);

-- Column comments

COMMENT ON COLUMN ombudsman.t_complaint_verification.verification_type IS 'ambil dari m_option (2)';

-- Permissions

ALTER TABLE ombudsman.t_complaint_verification OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_verification TO postgres;


-- ombudsman.t_roles definition

-- Drop table

-- DROP TABLE ombudsman.t_roles;

CREATE TABLE ombudsman.t_roles (
	idx_t_roles serial NOT NULL,
	idx_m_user int8 NOT NULL,
	idx_m_form int8 NOT NULL,
	role_action varchar NULL,
	role_value bool NOT NULL DEFAULT false,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_roles_pk PRIMARY KEY (idx_t_roles)
);

-- Permissions

ALTER TABLE ombudsman.t_roles OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_roles TO postgres;


-- ombudsman.t_session definition

-- Drop table

-- DROP TABLE ombudsman.t_session;

CREATE TABLE ombudsman.t_session (
	idx_t_session serial NOT NULL,
	user_id int8 NOT NULL,
	"type" varchar NOT NULL DEFAULT 'PUBLIC'::character varying,
	sid varchar NOT NULL,
	expires timestamp(0) NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_session_pk PRIMARY KEY (idx_t_session)
);

-- Permissions

ALTER TABLE ombudsman.t_session OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_session TO postgres;




-- Permissions

GRANT ALL ON SCHEMA ombudsman TO postgres;
