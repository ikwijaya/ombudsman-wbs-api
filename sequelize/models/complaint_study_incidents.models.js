const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('complaint_study_incidents', {
    idx_t_complaint_study_incident: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_t_complaint_study: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    idx_m_city: DataTypes.BIGINT,
    idx_m_work_unit: DataTypes.BIGINT,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT(),
    office_name: DataTypes.STRING,
    address: DataTypes.TEXT,
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
    tableName: 't_complaint_study_incident',
    timestamps: false,
  });
}