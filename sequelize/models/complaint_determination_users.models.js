const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('complaint_determination_users', {
    idx_t_determination_user: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_user: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    idx_t_complaint_determination: {
      type: DataTypes.BIGINT,
      allowNull: false
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
    tableName: 't_complaint_determination_user',
    timestamps: false,
  });
}