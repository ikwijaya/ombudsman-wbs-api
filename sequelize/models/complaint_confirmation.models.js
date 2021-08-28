const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('confirmation', {
    idx_t_confirmation: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    value: DataTypes.TEXT(),
    head_of_kumm: DataTypes.BIGINT,
    response: DataTypes.TEXT(),

    // lampiran 16
    to: DataTypes.STRING(),
    address: DataTypes.TEXT(),
    by: DataTypes.STRING(),
    object: DataTypes.TEXT(),
    desc: DataTypes.TEXT(),
    via: DataTypes.STRING,

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
    tableName: 't_confirmation',
    timestamps: false,
  });
}