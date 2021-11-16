const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('study_lys', {
    idx_t_study_lys: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    idx_m_legal_standing: {
      type: DataTypes.BIGINT,
    },
    manpower: DataTypes.TEXT(),
    description: DataTypes.TEXT(),
    scope: DataTypes.TEXT(),
    simpel_app_no: DataTypes.STRING,
    prevention: DataTypes.TEXT(),
    procedure: DataTypes.TEXT(),
    product: DataTypes.TEXT(),
    hopes: DataTypes.TEXT(),
    scope_clarification: DataTypes.TEXT(),
    action: DataTypes.TEXT(),
    others_clarification: DataTypes.TEXT(),
    others_action: DataTypes.TEXT(),
    checked: DataTypes.TEXT(),
    arranged_by: DataTypes.BIGINT,
    arranged_date: DataTypes.DATE,
    head_of_reg: DataTypes.BIGINT,
    head_of_reg_date: DataTypes.DATE,
    head_of_kumm: DataTypes.BIGINT,
    head_of_kumm_date: DataTypes.DATE,
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
    tableName: 't_study_lys',
    timestamps: false,
  });
}