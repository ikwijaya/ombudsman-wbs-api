const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('complaints', {
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    form_no: DataTypes.STRING,
    date: DataTypes.DATE,
    idx_m_legal_standing: DataTypes.BIGINT,
    manpower: DataTypes.TEXT(),
    description: DataTypes.TEXT(),
    hopes: DataTypes.TEXT(),
    form_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
      comment: "default 0. Nilai 0 (DRAFT) dan Nilai 1 (SUBMIT)"
    },
    idx_m_status: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    source_complaint: DataTypes.STRING,
    cancel_reason: DataTypes.TEXT,
    cancel_date: DataTypes.DATE,
    cancel_by: DataTypes.BIGINT,
    is_secure: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    original_no: DataTypes.STRING,
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
    tableName: 'm_complaint',
    timestamps: false,
  });
}