const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('dispositions', {
    idx_m_disposition: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    /**
     * flag
     * 1 => using for default call
     * 2 => using for complaint decision (wbs)
     * 3 => using for complaint study
     */
    flag: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '1'
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
    tableName: 'm_disposition',
    timestamps: false,
  });
}