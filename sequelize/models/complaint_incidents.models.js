const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('complaint_incidents', {
    idx_m_complaint_incident: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    idx_m_city: DataTypes.BIGINT,
    idx_m_work_unit: DataTypes.BIGINT,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT(),
    office_name: DataTypes.TEXT(),
    address: DataTypes.TEXT(),
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
    tableName: 'm_complaint_incident',
    timestamps: false,
  });
}