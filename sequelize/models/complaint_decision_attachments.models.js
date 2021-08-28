const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('complaint_decision_attachments', {
    idx_t_decision_attachment: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_t_complaint_decision: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    description: DataTypes.TEXT(),
    filename: DataTypes.STRING,
    path: DataTypes.STRING,
    mime_type: DataTypes.STRING,
    filesize: DataTypes.STRING,
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
    tableName: 't_complaint_decision_attachment',
    timestamps: false,
  });
}