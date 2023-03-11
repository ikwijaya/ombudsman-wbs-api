const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const FORM_ID = 17

module.exports = {
  /**
   * 
   * @param {*} sid 
   * @param {*} complaintId 
   * @returns 
   */
  async get(sid, id = null) {
    try {
      const sessions = await core.checkSession(sid)
      if (sessions.length === 0)
        return null;

      const who = sessions[0].user_code;
      const r = await core.checkRoles(sessions[0].user_id, [FORM_ID]);
      const complaint = await models.complaints.findOne({
        attributes: ['form_no', 'date'],
        where: { idx_m_complaint: id }
      })

      const decision = await models.complaint_decisions.findOne({
        attributes: ['idx_m_violation'],
        where: { idx_m_complaint: id }
      });

      const pleno = await models.complaint_pleno.findOne({
        attributes: ['date'],
        where: { idx_m_complaint: id }
      })

      let m = await models.closing.findOne({
        raw: true,
        attributes: [
          'idx_t_closing',
          'head_of_kumm',
          'head_of_region',
          'user_kumm',
          'head_of_wbs',
          'to', 'by', 'object', 'reason',
          'ba_no', 'closing_no',
          [Sequelize.literal(`to_char(closing.ba_date, 'YYYY-MM-DD')`), 'ba_date'],
          [Sequelize.literal(`to_char(closing.closing_date, 'YYYY-MM-DD')`), 'closing_date'],
          [Sequelize.literal(`to_char(closing.checked_date, 'DD-MM-YYYY HH24:MI:SS')`), 'checked_date'], 'checked_by',
          [Sequelize.literal(`to_char(closing.approved_date, 'DD-MM-YYYY HH24:MI:SS')`), 'approved_date'], 'approved_by',
          [Sequelize.literal(`to_char(closing.arranged_date, 'DD-MM-YYYY HH24:MI:SS')`), 'arranged_date'], 'arranged_by'
        ],
        where: { idx_m_complaint: id, record_status: 'A' }
      })

      if (m) {
        users = await models.users.findAll({ raw: true, attributes: [[Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name'], 'idx_m_user'], where: { idx_m_user_type: { [Op.ne]: -1 } } })
        m.arranged_by_name = users.filter(a => a['idx_m_user'] == m['arranged_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['arranged_by'])[0].name : null
        m.approved_by_name = users.filter(a => a['idx_m_user'] == m['approved_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['approved_by'])[0].name : null
        m.checked_by_name = users.filter(a => a['idx_m_user'] == m['checked_by']).length > 0 ? users.filter(a => a['idx_m_user'] == m['checked_by'])[0].name : null

        const is_update = r.filter(a => a.idx_m_form == 17 && a.is_update).length > 0
        const uid = sessions[0].user_id
        if (['inspektorat', 'kumm'].includes(who)) m.is_update = is_update && m.arranged_date == null && m.checked_date == null
        if ('kkr' == who) m.is_update = m.checked_by == uid && !m.approved_by && m.arranged_date != null
        if ('kkumm' == who) m.is_update = m.approved_by == uid

        m.is_check = m.checked_by == uid && !m.approved_by && m.arranged_date != null
        m.is_approve = m.approved_by == uid
        m.who = who

        /** SECURITY */
        // if ((m.arranged_by == sessions[0].user_id || !m.arranged_date) && is_update) {
        //   m.is_update = !m.checked_date
        //   m.is_check = false
        //   m.is_approve = false
        //   m.is_update2 = !m.checked_date || !m.approved_date
        // }

        // if ((m.checked_by == sessions[0].user_id || is_void_checker) && is_update) {
        //   m.is_update = !m.approved_date
        //   m.is_check = !m.approved_date
        //   m.is_approve = false
        //   m.is_update2 = !m.approved_date
        // }

        // if (m.approved_by == sessions[0].user_id && is_update) {
        //   m.is_update = true
        //   m.is_check = false
        //   m.is_approve = true
        //   m.is_update2 = false
        // }
        /** END -- SECURITY */

        if (pleno instanceof models.complaint_pleno) m.pleno_date = pleno.getDataValue('date');
        if (complaint instanceof models.complaints) m.form_no = complaint.getDataValue('form_no');
        if (complaint instanceof models.complaints) m.form_date = complaint.getDataValue('date');
        if (decision instanceof models.complaint_decisions) {
          let violation = decision.getDataValue('idx_m_violation') || null
          if (['5', '9'].includes(violation)) { m.violation = 'MASIH DALAM PROSES' }
          if (['10'].includes(violation)) { m.violation = 'TELAH TERBIT PRODUK AKHIR' }
        }
      }

      return {
        item: m
      }
    } catch (error) {
      console.log(error)
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
      const sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      let user;
      obj.closing['umodified'] = sessions[0].user_id;
      obj.closing['dmodified'] = new Date();
      if(obj.closing['checked_by']) {
        obj.closing['arranged_date'] = new Date()
        obj.closing['arranged_by'] = sessions[0].user_id;
      }
      if(obj.closing['checked_by'])
        user = await models.users.findOne({
          transaction: t,
          attributes: ['fullname', 'email'],
          where: { record_status: 'A', idx_m_user: obj.closing['checked_by'] }
        }).catch(e => { throw(e) })
      
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
      if(obj.closing['checked_by']) return response.success(`Sukses melakukan assign ke ${user.getDataValue('fullname')}`)
      return response.success('Update berhasi disimpan')
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
  async check(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      const sessions = await core.checkSession(sid).catch(e => { throw (e) })
      let user;
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.closing['umodified'] = sessions[0].user_id;
      obj.closing['dmodified'] = new Date();
      if(obj.closing['approved_by']) obj.closing['checked_date'] = new Date();
      if(obj.closing['approved_by'])
        user = await models.users.findOne({
          transaction: t,
          attributes: ['fullname', 'email'],
          where: { record_status: 'A', idx_m_user: obj.closing['approved_by'] }
        }).catch(e => { throw(e) })

      const is_arranged = await models.closing.count({
        where: {
          idx_t_closing: obj.closing.id,
          [Op.or]: [
            { arranged_by: null, },
            { arranged_date: null }
          ]
        },
        transaction: t
      })

      if (is_arranged > 0) return response.failed('Form belum dilakukan penyusunan, Silakan klik tombol SIMPAN untuk melakukan sign penyusunan.')
      
      await models.closing.update(obj.closing, {
        where: { idx_t_closing: obj.closing.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.closing['idx_m_complaint'],
        action: 'U',
        flow: '14',
        notes: `Pemeriksaan berhasil disimpan.`,
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      if(obj.closing['approved_by']) return response.success(`Sukses melakukan assign ke ${user.getDataValue('fullname')} `, [])
      return response.success('Pemeriksaan penutupan berhasil disimpan')
    } catch (error) {
      await t.rollback()
      console.log('err', error)
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async checkCancel(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      const sessions = await core.checkSession(sid).catch(e => { throw (e) })
      let user;
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.closing['umodified'] = sessions[0].user_id;
      obj.closing['dmodified'] = new Date();
      obj.closing['arranged_date'] = null
      obj.closing['approved_by'] = null
      obj.closing['approved_date'] = null
      obj.closing['checked_by'] = null
      obj.closing['checked_date'] = null
      
      await models.closing.update(obj.closing, {
        where: { idx_t_closing: obj.closing.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.closing['idx_m_complaint'],
        action: 'U',
        flow: '14',
        notes: `telah melakukan CANCEL PEMERIKSAAN pada Penutupan`,
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Cancel pemeriksaan Penutupan berhasil disimpan')
    } catch (error) {
      await t.rollback()
      console.log('err', error)
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async approve(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.closing['form_status'] = 1;
      obj.closing['umodified'] = sessions[0].user_id;
      obj.closing['dmodified'] = new Date();
      obj.closing['approved_date'] = new Date();
      obj.closing['approved_by'] = sessions[0].user_id;

      const is_checked = await models.closing.count({
        where: {
          idx_t_closing: obj.closing.id,
          [Op.or]: [
            { checked_by: null, },
            { checked_date: null }
          ]
        },
        transaction: t
      }).catch(e => { throw (e) })

      const is_approved = await models.closing.count({
        where: {
          idx_t_closing: obj.closing.id,
          approved_by: { [Op.ne]: null },
          approved_date: { [Op.ne]: null }
        },
        transaction: t
      }).catch(e => { throw (e) })

      if (is_checked > 0) return response.failed('Form belum dilakukan pengecekan, Silakan klik tombol DIPERIKSA untuk melakukan sign pemeriksaan.')
      if (is_approved > 0) return response.failed(`Form sudah dilakukan penyetujuan`)
      await models.closing.update(obj.closing, { where: { idx_t_closing: obj.closing.id }, transaction: t }).catch(e => { throw (e) });
      await models.complaints.update(
        { idx_m_status: 17 },
        {
          transaction: t,
          where: { idx_m_complaint: obj.closing['idx_m_complaint'] }
        }
      ).catch(e => { throw (e) })

      await models.clogs.create({
        idx_m_complaint: obj.closing['idx_m_complaint'],
        action: 'U',
        flow: '17',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: 'pengaduan berhasil di tutup'
      }, { transaction: t, }).catch(e => { throw (e) });

      await t.commit().catch(e => { throw (e) });
      return response.success('Penyetujuan penutupan pengaduan berhasil disimpan')
    } catch (error) {
      await t.rollback().catch(e => { throw (e) });
      console.log('err', error)
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async approveCancel(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.closing['form_status'] = null;
      obj.closing['umodified'] = sessions[0].user_id;
      obj.closing['checked_date'] = null
      obj.closing['approved_date'] = null
      obj.closing['approved_by'] = null

      await models.closing.update(obj.closing, { where: { idx_t_closing: obj.closing.id }, transaction: t }).catch(e => { throw (e) });
      await models.clogs.create({
        idx_m_complaint: obj.closing['idx_m_complaint'],
        action: 'U',
        flow: '17',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id,
        notes: 'telah melakukan Cancel penyetujuan pada tahapan penutupan.'
      }, { transaction: t, }).catch(e => { throw (e) });

      await t.commit().catch(e => { throw (e) });
      return response.success('Cancel penyetujuan penutupan pengaduan berhasil disimpan')
    } catch (error) {
      await t.rollback().catch(e => { throw (e) });
      console.log('err', error)
      throw (error)
    }
  },
}