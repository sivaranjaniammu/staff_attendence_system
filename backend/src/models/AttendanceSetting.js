const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AttendanceSetting = sequelize.define('AttendanceSetting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  office_start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '09:00:00'
  },
  office_end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '17:00:00'
  },
  late_after_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 15
  },
  half_day_after_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 120
  }
}, {
  tableName: 'attendance_settings',
  timestamps: true,
  underscored: true
});

module.exports = AttendanceSetting;
