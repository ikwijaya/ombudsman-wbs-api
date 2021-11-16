const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('lhpa_actions', {
    idx_t_lhpa_action: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_t_lhpa: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: DataTypes.TEXT(), // E: TINDAK LANJUT, F: PEMERIKSAAN ADUAN OLEH KUMM
    title: DataTypes.TEXT(),
    by: DataTypes.TEXT(),
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
    tableName: 't_lhpa_actions',
    timestamps: false,
  });
}