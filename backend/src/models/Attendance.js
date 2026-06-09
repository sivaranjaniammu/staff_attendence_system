const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'staff',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  check_in: {
    type: DataTypes.DATE,
    allowNull: true
  },
  check_out: {
    type: DataTypes.DATE,
    allowNull: true
  },
  working_hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'),
    allowNull: false,
    defaultValue: 'PRESENT'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  check_in_ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  check_out_ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  check_in_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  check_in_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  check_out_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  check_out_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  check_in_method: {
    type: DataTypes.ENUM('WEB', 'QR', 'FACE'),
    allowNull: false,
    defaultValue: 'WEB'
  },
  check_out_method: {
    type: DataTypes.ENUM('WEB', 'QR', 'FACE'),
    allowNull: false,
    defaultValue: 'WEB'
  },
  device_info: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['staff_id', 'date']
    }
  ]
});

Attendance.associate = (models) => {
  Attendance.belongsTo(models.Staff, {
    foreignKey: 'staff_id',
    as: 'staff'
  });
};

module.exports = Attendance;
