const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('users', {
    idx_m_user: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passwd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    remarks: DataTypes.TEXT,
    occupation: DataTypes.TEXT,
    is_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_login: DataTypes.DATE,
    last_logout: DataTypes.DATE,
    idx_m_user_type: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    fullname: DataTypes.STRING,
    identity_no: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    is_verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    url_verify: DataTypes.STRING,
    verify_date: DataTypes.DATE,
    expires: DataTypes.DATE,
    url_forget: DataTypes.STRING,
    forget_expires: DataTypes.DATE,
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
    tableName: 'm_user',
    timestamps: false
  });
}