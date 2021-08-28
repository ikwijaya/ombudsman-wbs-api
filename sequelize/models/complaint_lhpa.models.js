const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('lhpa', {
    idx_t_lhpa: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: DataTypes.TEXT,
    substansi: DataTypes.BOOLEAN(),
    procedure: DataTypes.BOOLEAN(),
    product: DataTypes.BOOLEAN(),
    head_of_kumm: DataTypes.BIGINT,
    fakta: DataTypes.TEXT(),
    analisis_pemeriksaan: DataTypes.TEXT(),
    pendapat_pemeriksa: DataTypes.TEXT(),
    kesimpulan_pemeriksa: DataTypes.TEXT(),
    tindak_lanjut: DataTypes.TEXT(),
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
    },
    /// UNUSED
    // complaint_mapping: DataTypes.TEXT(),
    // action_report: DataTypes.TEXT(),
    // checked_by_kumm: DataTypes.TEXT(),
    // complaint_analysis: DataTypes.TEXT(),
    // opinion: DataTypes.TEXT(),
    // conclusion: DataTypes.TEXT(),
    // action: DataTypes.TEXT(),
    // tindak_lanjut_laporan: DataTypes.TEXT(),
    // pemeriksaan_kumm: DataTypes.TEXT(),
  }, {
    schema: SCHEMA,
    tableName: 't_lhpa',
    timestamps: false,
  });
}