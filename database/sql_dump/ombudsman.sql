-- DROP SCHEMA ombudsman;

CREATE SCHEMA ombudsman AUTHORIZATION postgres;

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

-- DROP TYPE ombudsman."_m_complaint_violation";

CREATE TYPE ombudsman."_m_complaint_violation" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_complaint_violation,
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

-- DROP TYPE ombudsman."_m_status";

CREATE TYPE ombudsman."_m_status" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_status,
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

-- DROP TYPE ombudsman."_m_user_type";

CREATE TYPE ombudsman."_m_user_type" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.m_user_type,
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

-- DROP TYPE ombudsman."_t_complaint_clarification";

CREATE TYPE ombudsman."_t_complaint_clarification" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_clarification,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_closing";

CREATE TYPE ombudsman."_t_complaint_closing" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_closing,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_confirmation";

CREATE TYPE ombudsman."_t_complaint_confirmation" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_confirmation,
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

-- DROP TYPE ombudsman."_t_complaint_decision_attachment";

CREATE TYPE ombudsman."_t_complaint_decision_attachment" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_decision_attachment,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_decision_violation";

CREATE TYPE ombudsman."_t_complaint_decision_violation" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_decision_violation,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_determination";

CREATE TYPE ombudsman."_t_complaint_determination" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_determination,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_determination_user";

CREATE TYPE ombudsman."_t_complaint_determination_user" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_determination_user,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_map";

CREATE TYPE ombudsman."_t_complaint_map" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_map,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_monitoring";

CREATE TYPE ombudsman."_t_complaint_monitoring" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_monitoring,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_monitoring_validation";

CREATE TYPE ombudsman."_t_complaint_monitoring_validation" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_monitoring_validation,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_request";

CREATE TYPE ombudsman."_t_complaint_request" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_request,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_request_docs";

CREATE TYPE ombudsman."_t_complaint_request_docs" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_request_docs,
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

-- DROP TYPE ombudsman."_t_complaint_study_incident";

CREATE TYPE ombudsman."_t_complaint_study_incident" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_study_incident,
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

-- DROP TYPE ombudsman."_t_complaint_study_violation";

CREATE TYPE ombudsman."_t_complaint_study_violation" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_study_violation,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_validation";

CREATE TYPE ombudsman."_t_complaint_validation" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_validation,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_validation_checklist";

CREATE TYPE ombudsman."_t_complaint_validation_checklist" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_validation_checklist,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_complaint_validation_communication";

CREATE TYPE ombudsman."_t_complaint_validation_communication" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_complaint_validation_communication,
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

-- DROP TYPE ombudsman."_t_contact_us";

CREATE TYPE ombudsman."_t_contact_us" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_contact_us,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_faq";

CREATE TYPE ombudsman."_t_faq" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_faq,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_t_online_msg";

CREATE TYPE ombudsman."_t_online_msg" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.t_online_msg,
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

-- DROP TYPE ombudsman."_z_a";

CREATE TYPE ombudsman."_z_a" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.z_a,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_zm_account";

CREATE TYPE ombudsman."_zm_account" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.zm_account,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_zm_complaint_office";

CREATE TYPE ombudsman."_zm_complaint_office" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.zm_complaint_office,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_zt_complaint_decision_event";

CREATE TYPE ombudsman."_zt_complaint_decision_event" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.zt_complaint_decision_event,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_zt_complaint_decision_incident";

CREATE TYPE ombudsman."_zt_complaint_decision_incident" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.zt_complaint_decision_incident,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_zt_complaint_decision_office";

CREATE TYPE ombudsman."_zt_complaint_decision_office" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.zt_complaint_decision_office,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_zt_complaint_decision_reported";

CREATE TYPE ombudsman."_zt_complaint_decision_reported" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.zt_complaint_decision_reported,
	DELIMITER = ',');

-- DROP TYPE ombudsman."_zt_complaint_study_office";

CREATE TYPE ombudsman."_zt_complaint_study_office" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = ombudsman.zt_complaint_study_office,
	DELIMITER = ',');

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

-- DROP SEQUENCE ombudsman.m_complaint_legal_standing_idx_m_complaint_legal_standing_seq;

CREATE SEQUENCE ombudsman.m_complaint_legal_standing_idx_m_complaint_legal_standing_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_complaint_legal_standing_idx_m_complaint_legal_standing_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_complaint_legal_standing_idx_m_complaint_legal_standing_seq TO postgres;

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

-- DROP SEQUENCE ombudsman.m_status_idx_m_status_seq;

CREATE SEQUENCE ombudsman.m_status_idx_m_status_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_status_idx_m_status_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_status_idx_m_status_seq TO postgres;

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

-- DROP SEQUENCE ombudsman.m_user_type_idx_m_user_type_seq;

CREATE SEQUENCE ombudsman.m_user_type_idx_m_user_type_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.m_user_type_idx_m_user_type_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.m_user_type_idx_m_user_type_seq TO postgres;

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

-- DROP SEQUENCE ombudsman.t_complaint_clarification_idx_t_complaint_clarification_seq;

CREATE SEQUENCE ombudsman.t_complaint_clarification_idx_t_complaint_clarification_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_clarification_idx_t_complaint_clarification_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_clarification_idx_t_complaint_clarification_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_closing_idx_t_complaint_closing_seq;

CREATE SEQUENCE ombudsman.t_complaint_closing_idx_t_complaint_closing_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_closing_idx_t_complaint_closing_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_closing_idx_t_complaint_closing_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_confirmation_idx_t_complaint_confirmation_seq;

CREATE SEQUENCE ombudsman.t_complaint_confirmation_idx_t_complaint_confirmation_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_confirmation_idx_t_complaint_confirmation_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_confirmation_idx_t_complaint_confirmation_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_decision_attachme_idx_t_complaint_decision_atta_seq;

CREATE SEQUENCE ombudsman.t_complaint_decision_attachme_idx_t_complaint_decision_atta_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_decision_attachme_idx_t_complaint_decision_atta_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_decision_attachme_idx_t_complaint_decision_atta_seq TO postgres;

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

-- DROP SEQUENCE ombudsman.t_complaint_determination_idx_t_complaint_determination_seq;

CREATE SEQUENCE ombudsman.t_complaint_determination_idx_t_complaint_determination_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_determination_idx_t_complaint_determination_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_determination_idx_t_complaint_determination_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_determination_use_idx_t_complaint_determination_seq;

CREATE SEQUENCE ombudsman.t_complaint_determination_use_idx_t_complaint_determination_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_determination_use_idx_t_complaint_determination_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_determination_use_idx_t_complaint_determination_seq TO postgres;

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

-- DROP SEQUENCE ombudsman.t_complaint_map_idx_t_complaint_map_seq;

CREATE SEQUENCE ombudsman.t_complaint_map_idx_t_complaint_map_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_map_idx_t_complaint_map_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_map_idx_t_complaint_map_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_monitoring_valida_idx_t_complaint_monitoring_va_seq;

CREATE SEQUENCE ombudsman.t_complaint_monitoring_valida_idx_t_complaint_monitoring_va_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_monitoring_valida_idx_t_complaint_monitoring_va_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_monitoring_valida_idx_t_complaint_monitoring_va_seq TO postgres;

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

-- DROP SEQUENCE ombudsman.t_complaint_request_docs_idx_t_complaint_request_docs_seq;

CREATE SEQUENCE ombudsman.t_complaint_request_docs_idx_t_complaint_request_docs_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_request_docs_idx_t_complaint_request_docs_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_request_docs_idx_t_complaint_request_docs_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_request_idx_t_complaint_request_seq;

CREATE SEQUENCE ombudsman.t_complaint_request_idx_t_complaint_request_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_request_idx_t_complaint_request_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_request_idx_t_complaint_request_seq TO postgres;

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

-- DROP SEQUENCE ombudsman.t_complaint_study_reported_idx_t_complaint_study_reported_seq;

CREATE SEQUENCE ombudsman.t_complaint_study_reported_idx_t_complaint_study_reported_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_study_reported_idx_t_complaint_study_reported_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_study_reported_idx_t_complaint_study_reported_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_validation_checkl_idx_t_complaint_validation_ch_seq;

CREATE SEQUENCE ombudsman.t_complaint_validation_checkl_idx_t_complaint_validation_ch_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_validation_checkl_idx_t_complaint_validation_ch_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_validation_checkl_idx_t_complaint_validation_ch_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_validation_commun_idx_t_complaint_validation_co_seq;

CREATE SEQUENCE ombudsman.t_complaint_validation_commun_idx_t_complaint_validation_co_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_validation_commun_idx_t_complaint_validation_co_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_validation_commun_idx_t_complaint_validation_co_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_validation_idx_t_complaint_validation_seq;

CREATE SEQUENCE ombudsman.t_complaint_validation_idx_t_complaint_validation_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_validation_idx_t_complaint_validation_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_validation_idx_t_complaint_validation_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_complaint_validation_monito_idx_t_complaint_validation_mo_seq;

CREATE SEQUENCE ombudsman.t_complaint_validation_monito_idx_t_complaint_validation_mo_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_complaint_validation_monito_idx_t_complaint_validation_mo_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_complaint_validation_monito_idx_t_complaint_validation_mo_seq TO postgres;

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

-- DROP SEQUENCE ombudsman.t_contact_us_idx_t_contact_us_seq;

CREATE SEQUENCE ombudsman.t_contact_us_idx_t_contact_us_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_contact_us_idx_t_contact_us_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_contact_us_idx_t_contact_us_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_faq_idx_t_faq_seq;

CREATE SEQUENCE ombudsman.t_faq_idx_t_faq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_faq_idx_t_faq_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_faq_idx_t_faq_seq TO postgres;

-- DROP SEQUENCE ombudsman.t_online_msg_idx_t_online_msg_seq;

CREATE SEQUENCE ombudsman.t_online_msg_idx_t_online_msg_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE ombudsman.t_online_msg_idx_t_online_msg_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE ombudsman.t_online_msg_idx_t_online_msg_seq TO postgres;

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
	idx_m_complaint int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_form_idx_t_complaint_form_seq'::regclass),
	form_no varchar NULL,
	"date" timestamp(0) NULL,
	idx_m_account int8 NOT NULL,
	idx_m_legal_standing int8 NULL,
	manpower varchar NULL,
	idx_m_violation int8 NULL,
	description varchar NULL,
	hopes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	form_status varchar NOT NULL DEFAULT 0,
	source_complaint varchar NOT NULL DEFAULT 0,
	idx_m_status int8 NOT NULL DEFAULT 0,
	CONSTRAINT t_complaint_form_pk PRIMARY KEY (idx_m_complaint)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint TO postgres;


-- ombudsman.m_complaint_attachment definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_attachment;

CREATE TABLE ombudsman.m_complaint_attachment (
	idx_m_complaint_attachment int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_attachment_idx_t_complaint_attachment_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	description varchar NULL,
	filename varchar NULL,
	"path" varchar NULL,
	mime_type varchar NULL,
	filesize varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_attachment_pk PRIMARY KEY (idx_m_complaint_attachment)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_attachment OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_attachment TO postgres;


-- ombudsman.m_complaint_event definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_event;

CREATE TABLE ombudsman.m_complaint_event (
	idx_m_complaint_event int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_event_idx_t_complaint_event_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	"event" varchar NULL,
	"date" date NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_event_pk PRIMARY KEY (idx_m_complaint_event)
);
COMMENT ON TABLE ombudsman.m_complaint_event IS 'Kronologi Aduan';

-- Permissions

ALTER TABLE ombudsman.m_complaint_event OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_event TO postgres;


-- ombudsman.m_complaint_incident definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_incident;

CREATE TABLE ombudsman.m_complaint_incident (
	idx_m_complaint_incident int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_incident_idx_t_complaint_incident_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	start_date date NULL,
	end_date date NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	idx_m_city int8 NULL,
	office_name varchar NULL,
	address varchar NULL,
	idx_m_work_unit int8 NULL
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_incident OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_incident TO postgres;


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
	idx_m_complaint_reported int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_reported_idx_t_complaint_reported_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	"name" varchar NULL DEFAULT 'ANONIM'::character varying,
	identity_no varchar NULL,
	occupation varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_reported_pk PRIMARY KEY (idx_m_complaint_reported)
);

-- Permissions

ALTER TABLE ombudsman.m_complaint_reported OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_reported TO postgres;


-- ombudsman.m_complaint_violation definition

-- Drop table

-- DROP TABLE ombudsman.m_complaint_violation;

CREATE TABLE ombudsman.m_complaint_violation (
	idx_m_complaint_violation int4 NOT NULL DEFAULT nextval('ombudsman.m_complaint_legal_standing_idx_m_complaint_legal_standing_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	idx_m_violation int8 NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_complaint_legal_standing_pk PRIMARY KEY (idx_m_complaint_violation)
);
COMMENT ON TABLE ombudsman.m_complaint_violation IS 'dugaan pelanggaran';

-- Permissions

ALTER TABLE ombudsman.m_complaint_violation OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_complaint_violation TO postgres;


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
	form_icon varchar NULL,
	form_color varchar NULL,
	form_url varchar NULL,
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


-- ombudsman.m_status definition

-- Drop table

-- DROP TABLE ombudsman.m_status;

CREATE TABLE ombudsman.m_status (
	idx_m_status serial NOT NULL,
	"name" varchar NOT NULL,
	color varchar NULL,
	code int4 NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_status_pk PRIMARY KEY (idx_m_status)
);

-- Permissions

ALTER TABLE ombudsman.m_status OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_status TO postgres;


-- ombudsman.m_user definition

-- Drop table

-- DROP TABLE ombudsman.m_user;

CREATE TABLE ombudsman.m_user (
	idx_m_user serial NOT NULL,
	email varchar NOT NULL,
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
	idx_m_user_type int8 NULL,
	fullname varchar NULL,
	identity_no varchar NULL,
	phone_no varchar NULL,
	is_verify bool NOT NULL DEFAULT false,
	url_verify varchar NULL,
	verify_date timestamp(0) NULL,
	expires timestamp(0) NULL,
	url_forget varchar NULL,
	forget_expires timestamp(0) NULL,
	CONSTRAINT m_user_pk PRIMARY KEY (idx_m_user)
);

-- Permissions

ALTER TABLE ombudsman.m_user OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_user TO postgres;


-- ombudsman.m_user_type definition

-- Drop table

-- DROP TABLE ombudsman.m_user_type;

CREATE TABLE ombudsman.m_user_type (
	idx_m_user_type serial NOT NULL,
	"name" varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT m_user_type_pk PRIMARY KEY (idx_m_user_type)
);
COMMENT ON TABLE ombudsman.m_user_type IS 'type user untuk one2many';

-- Permissions

ALTER TABLE ombudsman.m_user_type OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.m_user_type TO postgres;


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
	action_name varchar NULL,
	CONSTRAINT t_complaint_action_pk PRIMARY KEY (idx_t_complaint_action)
);
COMMENT ON TABLE ombudsman.t_complaint_action IS 'pg 26. form TINDAK LANJUT';

-- Permissions

ALTER TABLE ombudsman.t_complaint_action OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_action TO postgres;


-- ombudsman.t_complaint_clarification definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_clarification;

CREATE TABLE ombudsman.t_complaint_clarification (
	idx_t_complaint_clarification serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	"date" timestamp(0) NULL,
	teams varchar NULL,
	"result" varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_clarification_pk PRIMARY KEY (idx_t_complaint_clarification)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_clarification OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_clarification TO postgres;


-- ombudsman.t_complaint_closing definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_closing;

CREATE TABLE ombudsman.t_complaint_closing (
	idx_t_complaint_closing serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	head_of_kumm int8 NOT NULL,
	head_of_region int8 NOT NULL,
	kumm_user int8 NOT NULL,
	head_of_wbs varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_closing_pk PRIMARY KEY (idx_t_complaint_closing)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_closing OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_closing TO postgres;


-- ombudsman.t_complaint_confirmation definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_confirmation;

CREATE TABLE ombudsman.t_complaint_confirmation (
	idx_t_complaint_confirmation serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	head_of_kumm int8 NOT NULL,
	response varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_confirmation_pk PRIMARY KEY (idx_t_complaint_confirmation)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_confirmation OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_confirmation TO postgres;


-- ombudsman.t_complaint_decision definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_decision;

CREATE TABLE ombudsman.t_complaint_decision (
	idx_t_complaint_decision serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	idx_m_disposition int8 NULL,
	notes varchar NULL,
	idx_m_violation int8 NULL,
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
COMMENT ON TABLE ombudsman.t_complaint_decision IS 'modul putusan pengaduan pengampu WBS, form_status sama kek yg lainnya
ada tricky cek halaman 27, jika disposisi adalah proses, dan ditutup maka ada yg harus di submit (sudah diterima kumm) cek page 27
3.3.2.7.1 Modul Penerimaan Penugasan oleh KUMM';

-- Column comments

COMMENT ON COLUMN ombudsman.t_complaint_decision.form_status IS 'ambil dari general m_option (draft/submit)';
COMMENT ON COLUMN ombudsman.t_complaint_decision.approved_by IS 'kumm, cek halaman 27';

-- Permissions

ALTER TABLE ombudsman.t_complaint_decision OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_decision TO postgres;


-- ombudsman.t_complaint_decision_attachment definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_decision_attachment;

CREATE TABLE ombudsman.t_complaint_decision_attachment (
	idx_t_complaint_decision_attachment int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_decision_attachme_idx_t_complaint_decision_atta_seq'::regclass),
	idx_t_complaint_decision int8 NOT NULL,
	description varchar NULL,
	filename varchar NULL,
	"path" varchar NULL,
	mime_type varchar NULL,
	filesize varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_decision_attachment_pk PRIMARY KEY (idx_t_complaint_decision_attachment)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_decision_attachment OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_decision_attachment TO postgres;


-- ombudsman.t_complaint_decision_violation definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_decision_violation;

CREATE TABLE ombudsman.t_complaint_decision_violation (
	umodified varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	idx_t_complaint_decision_violation int4 NOT NULL DEFAULT nextval('ombudsman.m_complaint_legal_standing_idx_m_complaint_legal_standing_seq'::regclass),
	idx_t_complaint_decision int8 NOT NULL,
	idx_m_violation int8 NOT NULL,
	dmodified timestamp(0) NULL,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT t_complaint_decision_violation_pk PRIMARY KEY (idx_t_complaint_decision_violation)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_decision_violation OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_decision_violation TO postgres;


-- ombudsman.t_complaint_determination definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_determination;

CREATE TABLE ombudsman.t_complaint_determination (
	"date" date NOT NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	idx_m_complaint int8 NOT NULL,
	determination_by int4 NOT NULL,
	idx_t_complaint_determination serial NOT NULL,
	CONSTRAINT t_complaint_determination_pk PRIMARY KEY (idx_t_complaint_determination)
);
COMMENT ON TABLE ombudsman.t_complaint_determination IS 'pg 28, form_penetapan';

-- Permissions

ALTER TABLE ombudsman.t_complaint_determination OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_determination TO postgres;


-- ombudsman.t_complaint_determination_user definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_determination_user;

CREATE TABLE ombudsman.t_complaint_determination_user (
	idx_t_complaint_determination_user int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_determination_use_idx_t_complaint_determination_seq'::regclass),
	idx_m_user int8 NOT NULL,
	idx_t_complaint_determination int8 NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_determination_user_pk PRIMARY KEY (idx_t_complaint_determination_user)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_determination_user OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_determination_user TO postgres;


-- ombudsman.t_complaint_map definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_map;

CREATE TABLE ombudsman.t_complaint_map (
	idx_t_complaint_map serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	idx_m_legal_standing int8 NOT NULL,
	manpower varchar NULL,
	description varchar NULL,
	"scope" varchar NULL,
	report_number varchar NULL,
	prevention varchar NULL,
	"procedure" varchar NULL,
	product varchar NULL,
	hopes varchar NULL,
	clarification varchar NULL,
	"action" varchar NULL,
	other_clarification varchar NULL,
	other_action varchar NULL,
	checked varchar NULL,
	idx_m_user int8 NULL,
	head_of_region int8 NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_map_pk PRIMARY KEY (idx_t_complaint_map)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_map OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_map TO postgres;


-- ombudsman.t_complaint_monitoring definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_monitoring;

CREATE TABLE ombudsman.t_complaint_monitoring (
	idx_t_complaint_monitoring int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_validation_monito_idx_t_complaint_validation_mo_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	"date" timestamp(0) NOT NULL,
	catatan varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_validation_monitoring_pk PRIMARY KEY (idx_t_complaint_monitoring)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_monitoring OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_monitoring TO postgres;


-- ombudsman.t_complaint_monitoring_validation definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_monitoring_validation;

CREATE TABLE ombudsman.t_complaint_monitoring_validation (
	idx_t_complaint_monitoring_validation int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_monitoring_valida_idx_t_complaint_monitoring_va_seq'::regclass),
	idx_t_complaint_monitoring int8 NOT NULL,
	idx_m_user int8 NOT NULL,
	"date" timestamp(0) NOT NULL,
	is_did bool NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_monitoring_validation_pk PRIMARY KEY (idx_t_complaint_monitoring_validation)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_monitoring_validation OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_monitoring_validation TO postgres;


-- ombudsman.t_complaint_request definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_request;

CREATE TABLE ombudsman.t_complaint_request (
	idx_t_complaint_request serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	request_date timestamp(0) NOT NULL,
	request_media varchar NOT NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_validation_request_pk PRIMARY KEY (idx_t_complaint_request)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_request OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_request TO postgres;


-- ombudsman.t_complaint_request_docs definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_request_docs;

CREATE TABLE ombudsman.t_complaint_request_docs (
	idx_t_complaint_request_docs serial NOT NULL,
	idx_t_complaint_request int8 NOT NULL,
	description varchar NULL,
	filename varchar NULL,
	"path" varchar NULL,
	mime_type varchar NULL,
	filesize varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_request_docs_pk PRIMARY KEY (idx_t_complaint_request_docs)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_request_docs OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_request_docs TO postgres;


-- ombudsman.t_complaint_study definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study;

CREATE TABLE ombudsman.t_complaint_study (
	idx_t_complaint_study serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	notes varchar NULL,
	idx_m_violation int8 NULL,
	form_status varchar NOT NULL DEFAULT 0, -- ambil dari general m_option (draft/submit)
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	idx_m_disposition int8 NULL,
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
	"event" varchar NULL,
	"date" date NOT NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	simple_app_no varchar NULL,
	CONSTRAINT t_complaint_study_event_pk PRIMARY KEY (idx_t_complaint_study_event)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_study_event OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study_event TO postgres;


-- ombudsman.t_complaint_study_incident definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study_incident;

CREATE TABLE ombudsman.t_complaint_study_incident (
	idx_t_complaint_study_incident int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_study_indicent_idx_t_complaint_study_incident_seq'::regclass),
	idx_t_complaint_study int8 NOT NULL,
	start_date date NULL,
	end_date date NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	idx_m_city int8 NULL,
	office_name varchar NULL,
	address varchar NULL,
	idx_m_work_unit int8 NULL
);
COMMENT ON TABLE ombudsman.t_complaint_study_incident IS 'modul telaah pengaduan tempat kejadian';

-- Permissions

ALTER TABLE ombudsman.t_complaint_study_incident OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study_incident TO postgres;


-- ombudsman.t_complaint_study_reported definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study_reported;

CREATE TABLE ombudsman.t_complaint_study_reported (
	idx_t_complaint_study int8 NOT NULL,
	"name" varchar NOT NULL DEFAULT 'ANONIM'::character varying,
	identity_no varchar NULL,
	occupation varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	idx_t_complaint_study_reported serial NOT NULL,
	CONSTRAINT t_complaint_study_reported_pk PRIMARY KEY (idx_t_complaint_study_reported)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_study_reported OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study_reported TO postgres;


-- ombudsman.t_complaint_study_violation definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_study_violation;

CREATE TABLE ombudsman.t_complaint_study_violation (
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	dmodified timestamp(0) NULL,
	idx_t_complaint_study int8 NOT NULL,
	idx_t_complaint_study_violation int4 NOT NULL DEFAULT nextval('ombudsman.m_complaint_legal_standing_idx_m_complaint_legal_standing_seq'::regclass),
	idx_m_violation int8 NOT NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	umodified varchar NULL,
	CONSTRAINT t_complaint_study_violation_pk PRIMARY KEY (idx_t_complaint_study_violation)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_study_violation OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_study_violation TO postgres;


-- ombudsman.t_complaint_validation definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_validation;

CREATE TABLE ombudsman.t_complaint_validation (
	idx_t_complaint_validation serial NOT NULL,
	idx_m_complaint int8 NOT NULL,
	pencegahan varchar NULL,
	product varchar NULL,
	step varchar NOT NULL,
	"date" timestamp(0) NOT NULL,
	results_obtained varchar NULL,
	conclusion varchar NULL,
	action_plan varchar NULL,
	checked_date timestamp(0) NULL,
	checked_by int8 NULL,
	approve_date timestamp(0) NULL,
	approve_by int8 NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_validation_pk PRIMARY KEY (idx_t_complaint_validation)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_validation OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_validation TO postgres;


-- ombudsman.t_complaint_validation_checklist definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_validation_checklist;

CREATE TABLE ombudsman.t_complaint_validation_checklist (
	idx_t_complaint_validation_checklist int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_validation_checkl_idx_t_complaint_validation_ch_seq'::regclass),
	idx_t_complaint_validation int8 NOT NULL,
	checklist varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_validation_checklist_pk PRIMARY KEY (idx_t_complaint_validation_checklist)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_validation_checklist OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_validation_checklist TO postgres;


-- ombudsman.t_complaint_validation_communication definition

-- Drop table

-- DROP TABLE ombudsman.t_complaint_validation_communication;

CREATE TABLE ombudsman.t_complaint_validation_communication (
	idx_t_complaint_validation_communication int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_validation_commun_idx_t_complaint_validation_co_seq'::regclass),
	idx_t_complaint_validation int8 NOT NULL,
	"by" varchar NULL,
	media varchar NULL,
	notes varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_validation_communication_pk PRIMARY KEY (idx_t_complaint_validation_communication)
);

-- Permissions

ALTER TABLE ombudsman.t_complaint_validation_communication OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_complaint_validation_communication TO postgres;


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


-- ombudsman.t_contact_us definition

-- Drop table

-- DROP TABLE ombudsman.t_contact_us;

CREATE TABLE ombudsman.t_contact_us (
	idx_t_contact_us serial NOT NULL,
	email varchar NOT NULL,
	notes varchar NULL,
	phone_no varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_contact_us_pk PRIMARY KEY (idx_t_contact_us)
);

-- Permissions

ALTER TABLE ombudsman.t_contact_us OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_contact_us TO postgres;


-- ombudsman.t_faq definition

-- Drop table

-- DROP TABLE ombudsman.t_faq;

CREATE TABLE ombudsman.t_faq (
	idx_t_faq serial NOT NULL,
	question varchar NULL,
	answer varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_faq_pk PRIMARY KEY (idx_t_faq)
);

-- Permissions

ALTER TABLE ombudsman.t_faq OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_faq TO postgres;


-- ombudsman.t_online_msg definition

-- Drop table

-- DROP TABLE ombudsman.t_online_msg;

CREATE TABLE ombudsman.t_online_msg (
	idx_t_online_msg serial NOT NULL,
	sender int8 NOT NULL,
	receiver int8 NOT NULL,
	subject varchar NULL,
	body varchar NULL,
	parent_id int8 NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_online_msg_pk PRIMARY KEY (idx_t_online_msg)
);

-- Permissions

ALTER TABLE ombudsman.t_online_msg OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.t_online_msg TO postgres;


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


-- ombudsman.z_a definition

-- Drop table

-- DROP TABLE ombudsman.z_a;

CREATE TABLE ombudsman.z_a (
	propinsi_id int8 NULL,
	propinsi_nama varchar NULL,
	kota_id varchar NULL,
	kota_nama varchar NULL
);

-- Permissions

ALTER TABLE ombudsman.z_a OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.z_a TO postgres;


-- ombudsman.zm_account definition

-- Drop table

-- DROP TABLE ombudsman.zm_account;

CREATE TABLE ombudsman.zm_account (
	idx_m_account int4 NOT NULL DEFAULT nextval('ombudsman.m_account_idx_m_account_seq'::regclass),
	fullname varchar NOT NULL,
	identity_no varchar NULL,
	occupation varchar NOT NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	email varchar NULL,
	CONSTRAINT m_account_pk PRIMARY KEY (idx_m_account)
);

-- Permissions

ALTER TABLE ombudsman.zm_account OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.zm_account TO postgres;


-- ombudsman.zm_complaint_office definition

-- Drop table

-- DROP TABLE ombudsman.zm_complaint_office;

CREATE TABLE ombudsman.zm_complaint_office (
	idx_m_complaint_office int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_office_idx_t_complaint_office_seq'::regclass),
	idx_m_complaint int8 NOT NULL,
	"name" varchar NULL,
	address varchar NULL,
	ucreate varchar NOT NULL DEFAULT 'sa'::character varying,
	dcreate timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	umodified varchar NULL,
	dmodified timestamp(0) NULL,
	record_status varchar NOT NULL DEFAULT 'A'::character varying,
	CONSTRAINT t_complaint_office_pk PRIMARY KEY (idx_m_complaint_office)
);

-- Permissions

ALTER TABLE ombudsman.zm_complaint_office OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.zm_complaint_office TO postgres;


-- ombudsman.zt_complaint_decision_event definition

-- Drop table

-- DROP TABLE ombudsman.zt_complaint_decision_event;

CREATE TABLE ombudsman.zt_complaint_decision_event (
	idx_t_complaint_decision_event int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_decision_event_idx_t_complaint_decision_event_seq'::regclass),
	idx_t_complaint_decision int8 NOT NULL,
	"event" varchar NULL,
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

ALTER TABLE ombudsman.zt_complaint_decision_event OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.zt_complaint_decision_event TO postgres;


-- ombudsman.zt_complaint_decision_incident definition

-- Drop table

-- DROP TABLE ombudsman.zt_complaint_decision_incident;

CREATE TABLE ombudsman.zt_complaint_decision_incident (
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
	idx_m_city int8 NULL,
	office_name varchar NULL,
	address varchar NULL,
	idx_m_work_unit int8 NULL,
	CONSTRAINT t_complaint_decision_incident_pk PRIMARY KEY (idx_t_complaint_decision_incident)
);

-- Permissions

ALTER TABLE ombudsman.zt_complaint_decision_incident OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.zt_complaint_decision_incident TO postgres;


-- ombudsman.zt_complaint_decision_office definition

-- Drop table

-- DROP TABLE ombudsman.zt_complaint_decision_office;

CREATE TABLE ombudsman.zt_complaint_decision_office (
	idx_t_complaint_decision_office int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_decision_office_idx_t_complaint_decision_office_seq'::regclass),
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

ALTER TABLE ombudsman.zt_complaint_decision_office OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.zt_complaint_decision_office TO postgres;


-- ombudsman.zt_complaint_decision_reported definition

-- Drop table

-- DROP TABLE ombudsman.zt_complaint_decision_reported;

CREATE TABLE ombudsman.zt_complaint_decision_reported (
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

ALTER TABLE ombudsman.zt_complaint_decision_reported OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.zt_complaint_decision_reported TO postgres;


-- ombudsman.zt_complaint_study_office definition

-- Drop table

-- DROP TABLE ombudsman.zt_complaint_study_office;

CREATE TABLE ombudsman.zt_complaint_study_office (
	idx_t_complaint_study_office int4 NOT NULL DEFAULT nextval('ombudsman.t_complaint_study_office_idx_t_complaint_study_office_seq'::regclass),
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
COMMENT ON TABLE ombudsman.zt_complaint_study_office IS 'modul telaah pengaduan';

-- Permissions

ALTER TABLE ombudsman.zt_complaint_study_office OWNER TO postgres;
GRANT ALL ON TABLE ombudsman.zt_complaint_study_office TO postgres;




-- Permissions

GRANT ALL ON SCHEMA ombudsman TO postgres;
