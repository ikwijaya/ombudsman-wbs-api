const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   * @returns 
   */
  async get(sid, id = null) {
    try {
      let sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      let complaint = await models.complaints.findOne({
        attributes: ['form_no', 'date'],
        where: { idx_m_complaint: id }
      })

      let decision = await models.complaint_decisions.findOne({
        attributes: ['idx_m_violation'],
        where: { idx_m_complaint: id }
      });

      let pleno = await models.complaint_pleno.findOne({
        attributes: ['date'],
        where: { idx_m_complaint: id }
      })

      let m = await models.closing.findOne({
        attributes: [
          'idx_t_closing',
          'head_of_kumm',
          'head_of_region',
          'user_kumm',
          'head_of_wbs',
          'to', 'by', 'object', 'reason'
        ],
        where: { idx_m_complaint: id, record_status: 'A' }
      })

      if (m instanceof models.closing) {
        if (pleno instanceof models.complaint_pleno) m.setDataValue('pleno_date', pleno.getDataValue('date'));
        if (complaint instanceof models.complaints) m.setDataValue('form_no', complaint.getDataValue('form_no'));
        if (complaint instanceof models.complaints) m.setDataValue('form_date', complaint.getDataValue('date'));
        if (decision instanceof models.complaint_decisions) {
          let violation = decision.getDataValue('idx_m_violation') || null
          if (['5', '9'].includes(violation)) { m.setDataValue('violation', 'MASIH DALAM PROSES'); }
          if (['10'].includes(violation)) { m.setDataValue('violation', 'TELAH TERBIT PRODUK AKHIR'); }
        }
      }

      return {
        item: m
      }
    } catch (error) {
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async next(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      let where = {};
      where['idx_t_closing'] = obj.closing.id;
      where[Op.or] = [
        { 'head_of_kumm': { [Op.eq]: null }, },
        { 'head_of_region': { [Op.eq]: null }, },
        { 'user_kumm': { [Op.eq]: null }, },
      ];

      let count = await models.closing.count({ where: where, transaction: t });
      if (count > 0) return response.failed(`<ul><li>` + ['Kolom Kepala Keasistenan Regional', 'Kepala Keasistenan Manajemen Mutu', 'Anggota Pengampu Ombudsman Republik Indonesia TIDAK boleh kosong.'].join('</li><li>') + `</li></ul>`)

      obj.closing['form_status'] = 1;
      await models.closing.update(obj.closing, { transaction: t, where: { idx_t_closing: obj.closing.id } });
      await models.complaints.update(
        { idx_m_status: 17 },
        {
          transaction: t,
          where: { idx_m_complaint: obj['idx_m_complaint'] }
        }
      )

      await models.clogs.create({
        idx_m_complaint: obj['idx_m_complaint'],
        action: 'U',
        flow: '17',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: 'pengaduan berhasil di tutup'
      }, { transaction: t, });
      await t.commit()
      return response.success('Pengaduan berhasil ditutup')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async update(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.closing['umodified'] = sessions[0].user_id;
      obj.closing['dmodified'] = new Date();

      await models.closing.update(obj.closing, {
        where: { idx_t_closing: obj.closing.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.closing['idx_m_complaint'],
        action: 'U',
        flow: '17',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Update berhasi disimpan')
    } catch (error) {
      await t.rollback()
      throw (error)
    }
  },
}