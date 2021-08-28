const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('options', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    option_id: DataTypes.STRING,
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    text: DataTypes.STRING,
    remarks: DataTypes.TEXT,
    order_no: DataTypes.STRING
  }, {
    schema: SCHEMA,
    tableName: 'm_option',
    timestamps: false,
  });
}