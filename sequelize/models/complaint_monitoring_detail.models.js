const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('monitoring_detail', {
    idx_t_monitoring_detail: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_t_monitoring: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    by: DataTypes.STRING,
    date: DataTypes.DATE,
    is_did: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT(),
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
    tableName: 't_monitoring_detail',
    timestamps: false,
  });
}