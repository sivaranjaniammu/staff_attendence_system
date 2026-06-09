const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Compare password method
User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.associate = (models) => {
  User.belongsTo(models.Role, {
    foreignKey: 'role_id',
    as: 'role'
  });
  User.hasOne(models.Staff, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    as: 'staffProfile'
  });
  User.hasMany(models.LeaveRequest, {
    foreignKey: 'approved_by_user_id',
    onDelete: 'SET NULL',
    as: 'reviewedLeaves'
  });
  User.hasMany(models.Notification, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    as: 'notifications'
  });
};

module.exports = User;
