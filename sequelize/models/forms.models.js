const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('forms', {
    idx_m_form: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    form_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    form_icon: {
      type: DataTypes.STRING
    },
    form_color: {
      type: DataTypes.STRING
    },
    form_url: {
      type: DataTypes.STRING
    },
    form_sort: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    idx_m_form_parent: {
      type: DataTypes.INTEGER
    },
    is_read_only: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'm_form',
    timestamps: false
  });
}