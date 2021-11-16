const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('validation', {
    idx_t_validation: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    simple_app_no: DataTypes.TEXT(),
    prevention: DataTypes.TEXT(),
    product: DataTypes.TEXT(),
    step: DataTypes.TEXT(),
    date: DataTypes.DATE,
    result_obtained: DataTypes.TEXT(),
    conclusion: DataTypes.TEXT(),
    action_plan: DataTypes.TEXT(),
    checked_date: DataTypes.DATE,
    checked_by: DataTypes.BIGINT,
    approved_date: DataTypes.DATE,
    approved_by: DataTypes.BIGINT,
    arranged_date: DataTypes.DATE,
    arranged_by: DataTypes.BIGINT,
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
    tableName: 't_validation',
    timestamps: false,
  });
}