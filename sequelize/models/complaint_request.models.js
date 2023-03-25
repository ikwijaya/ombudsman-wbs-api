const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('request', {
    idx_t_request: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    date: DataTypes.DATE,
    media: DataTypes.STRING,

    // as request
    mode: DataTypes.STRING(),
    to: DataTypes.STRING(),
    by: DataTypes.STRING,
    notes: DataTypes.TEXT(),
    address: DataTypes.TEXT(),
    object: DataTypes.TEXT(),
    imagine: DataTypes.TEXT(),
    docs: DataTypes.TEXT(),
    approver: DataTypes.BIGINT,

    // as request2
    letter_no: DataTypes.STRING(),
    letter_date: DataTypes.DATE,
    filename: DataTypes.STRING(),
    path: DataTypes.STRING(),
    mime_type: DataTypes.STRING(),
    filesize: DataTypes.STRING(),

    // as req nadia
    checked_date: DataTypes.DATE,
    checked_by: DataTypes.BIGINT,
    approved_date: DataTypes.DATE,
    approved_by: DataTypes.BIGINT,
    arranged_date: DataTypes.DATE,
    arranged_by: DataTypes.BIGINT,
    tembusan: DataTypes.JSON(),
    
    dcreate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW')
    },
    ucreate: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'sa'
    },
    dmodified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    umodified: {
      type: DataTypes.STRING,
    },
    record_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'A'
    }
  }, {
    schema: SCHEMA,
    tableName: 't_request',
    timestamps: false,
  });
}