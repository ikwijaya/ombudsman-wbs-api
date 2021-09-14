# API OMBUDSMAN WBS2.0

_Dugaan Pelanggaran di Pengampu WBS (5,9,10)_

> filename, sequelize/controller/validaton.js#342
> if (d instanceof models.complaint_decisions)
> next = [9, 5].includes(d.getDataValue('idx_m_violation')) ? 16 : 8

> filename, sequelize/controller/complaint.js#239
> if (
> violationNo instanceof models.complaint_decisions
> && [5, 9].includes(parseInt(violationNo.getDataValue('violation')))
> ) {
> s = await status.load([`6`, `7`, `16`, `17`])
> } else {
> s = await status.load([`6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`])
> }

Error:
https://bobcares.com/blog/postgresql-error-code-23505/

--SELECT setval('m_work_unit_idx_m_work_unit_seq', (SELECT MAX(a.idx_m_work_unit) FROM m_work_unit as a)+1);
--SELECT setval('m_legal_standing_idx_m_legal_standing_seq', (SELECT MAX(a.idx_m_legal_standing) FROM m_legal_standing as a)+1);
--SELECT setval('m_region_idx_m_region_seq', (SELECT MAX(a.idx_m_region) FROM m_region as a)+1);
--SELECT setval('m_city_idx_m_city_seq', (SELECT MAX(a.idx_m_city) FROM m_city as a)+1);
--SELECT setval('m_disposition_idx_m_disposition_seq', (SELECT MAX(a.idx_m_disposition) FROM m_disposition as a)+1);
--SELECT setval('m_violation_idx_m_violation_seq', (SELECT MAX(a.idx_m_violation) FROM m_violation as a)+1);
