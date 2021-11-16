const { DataTypes, Sequelize } = require('sequelize');
const { DB_SCHEMA } = require('../../config')
const SCHEMA = DB_SCHEMA

module.exports = (sq) => {
  sq.define('clarification', {
    idx_t_clarification: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idx_m_complaint: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    //lampiran_14
    date: DataTypes.DATE,
    teams: DataTypes.TEXT(),
    result: DataTypes.TEXT(),

    //lampiran_15
    to: DataTypes.STRING(),
    address: DataTypes.TEXT(),
    by: DataTypes.STRING(),
    object: DataTypes.TEXT(),
    approver: DataTypes.BIGINT,

    // gantinya meet_date, kenapa penamaannya campur aduk?
    // sue!! karena requirementnya campur-aduk-pula
    meet_date: DataTypes.DATE(),
    meet_time: DataTypes.TIME,
    agenda: DataTypes.STRING(),
    tempat: DataTypes.STRING(),

    // as request2
    letter_no: DataTypes.STRING(),
    letter_date: DataTypes.DATE,
    filename: DataTypes.STRING(),
    path: DataTypes.STRING(),
    mime_type: DataTypes.STRING(),
    filesize: DataTypes.STRING(),
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
    tableName: 't_clarification',
    timestamps: false,
  });
}