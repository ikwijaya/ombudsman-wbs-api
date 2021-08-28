const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('clarification', {
    idx_t_clarification: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    //lampiran_14
    date: DataTypes.DATE,
    teams: DataTypes.TEXT(),
    result: DataTypes.TEXT(),

    //lampiran_15
    to: DataTypes.STRING(),
    address: DataTypes.TEXT(),
    by: DataTypes.STRING(),
    object: DataTypes.TEXT(),
    meet_date: DataTypes.TEXT(),
    approver: DataTypes.BIGINT,
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
    tableName: 't_clarification',
    timestamps: false,
  });
}