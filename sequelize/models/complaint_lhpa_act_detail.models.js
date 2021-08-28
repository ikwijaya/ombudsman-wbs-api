const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('lhpa_act_detail', {
    idx_t_action_detail: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_t_lhpa_action: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    sort: DataTypes.INTEGER,
    step: DataTypes.TEXT(),
    date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT(),
    is_checklist: DataTypes.BOOLEAN,
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
    tableName: 't_lhpa_action_detail',
    timestamps: false,
  });
}