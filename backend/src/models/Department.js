const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'departments',
  timestamps: true,
  underscored: true
});

Department.associate = (models) => {
  Department.hasMany(models.Staff, {
    foreignKey: 'department_id',
    onDelete: 'SET NULL',
    as: 'employees'
  });
};

module.exports = Department;
