const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('complaint_verifications', {
    idx_t_complaint_verification: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    idx_m_complaint_rejected_type: {
      type: DataTypes.BIGINT
    },
    verification_type: {
      type: DataTypes.STRING,
      defaultValue: 0
    },
    verification_by: DataTypes.STRING,
    verification_date: DataTypes.DATE,
    remarks: DataTypes.TEXT(),
    tembusan: DataTypes.JSON(),
    
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
    tableName: 't_complaint_verification',
    timestamps: false,
  });
}