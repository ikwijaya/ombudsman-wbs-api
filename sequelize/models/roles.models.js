const { DataTypes, Sequelize } = require('sequelize')
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('roles', {
    idx_t_roles: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_form: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    idx_m_user: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    role_action: {
      type: DataTypes.STRING,
    },
    role_value: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
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
    tableName: 't_roles',
    timestamps: false
  });
}