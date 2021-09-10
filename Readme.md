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
