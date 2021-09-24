const { models } = require('..');
const { Sequelize, Op, DataTypes } = require('sequelize');
const moment = require('moment');
const core = require('./core');
const { response } = require('../../models/index');
const sequelize = require('..');
const { API_URL } = require('../../config')

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

      let m = await models.request.findAll({
        attributes: [
          'idx_t_request', 'by',
          'date', 'media', 'notes',
          'to', 'address', 'object', 'imagine', 'docs',
          'approver', 'mode', 'letter_no', 
          [Sequelize.literal(`cast(letter_date AS DATE)`), 'letter_date'],
          'filename', 'path', 'mime_type', 'filesize',
          [Sequelize.literal(`concat('${API_URL}/others/open/',filename)`), 'url']
        ],
        where: { idx_m_complaint: id, record_status: 'A' },
        order: [['idx_t_request', 'asc']]
      })

      return m
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
  async save(sid, obj = {}) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0)
        return response.failed('Session expires')

      obj.request['ucreate'] = sessions[0].user_id;
      let v = await models.request.create(obj.request, { transaction: t, });

      if (v instanceof models.request) {
        let attachment = obj.attachment;
        attachment.map(e => { e.idx_t_request = v.getDataValue('idx_t_request') })

        await models.request_attachment.bulkCreate(attachment, { transaction: t })
      }

      await t.commit()
      return response.success('Permintaan data dan dokumen berhasi disimpan')
    } catch (error) {
      await t.rollback()
      console.log('======> ', error)
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

      obj.request['umodified'] = sessions[0].user_id;
      obj.request['dmodified'] = new Date();
      await models.request.update(obj.request, {
        where: { idx_t_request: obj.request.id },
        transaction: t,
      });

      await models.clogs.create({
        idx_m_complaint: obj.request['idx_m_complaint'],
        action: 'U',
        flow: '8',
        changes: JSON.stringify(obj),
        ucreate: sessions[0].user_id
      }, { transaction: t, });

      await t.commit()
      return response.success('Update berhasi disimpan')
    } catch (error) {
      await t.rollback()
      console.log('======> ', error)
      throw (error)
    }
  },
  /**
   * 
   * @param {*} sid 
   * @param {*} obj 
   * @returns 
   */
  async next(sid, id = null, flag = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      if(!flag) return response.failed('Silakan pilih FORM untuk melanjutkan !')
      let where = {};
      where['idx_m_complaint'] = id;
      where['mode'] = flag;
      where[Op.or] = {
        'letter_no': { [Op.eq]: null },
        'letter_date': { [Op.eq]: null },
        'filename': { [Op.eq]: null }
      }

      let count = await models.request.count({ where: where, transaction: t });
      if (count > 0) return response.failed(`<ul><li>` + [`Kolom Nomor Surat, Tanggal Surat dan Upload Dokumen Surat pada FORM KEPADA <b>${flag}</b> TIDAK boleh kosong.`].join('</li><li>') + `</li></ul>`)

      await models.complaints.update(
        { idx_m_status: 9 }, // to Telaah dan Analysis
        {
          transaction: t,
          where: { idx_m_complaint: id }
        }
      )

      // LOGS
      await models.clogs.create({
        idx_m_complaint: id,
        action: 'U',
        flow: '8',
        changes: JSON.stringify({}),
        ucreate: sessions[0].user_id,
        notes: 'telah melanjutkan ke flow selanjutnya (kertas kerja klarifikasi)'
      }, { transaction: t, });

      await t.commit()
      return response.success('Berhasil ke proses selanjutnya')
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
  async delete(sid, id = null) {
    const t = await sequelize.transaction();

    try {
      let sessions = await core.checkSession(sid).catch(e => { throw (e) })
      if (sessions.length === 0 && id)
        return response.failed('Session expires')

      await models.request.destroy({
        where: { idx_t_request: id },
        transaction: t
      })

      await models.request_attachment.destroy({
        where: { idx_t_request: id },
        transaction: t
      })

      await t.commit()
      return response.success('Permintaan data dan dokumen berhasi dihapus')
    } catch (error) {
      await t.rollback()

      throw (error)
    }
  }
}