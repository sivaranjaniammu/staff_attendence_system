const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true
});

Role.associate = (models) => {
  Role.hasMany(models.User, {
    foreignKey: 'role_id',
    onDelete: 'RESTRICT',
    as: 'users'
  });
};

module.exports = Role;
