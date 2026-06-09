const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LeaveRequest = sequelize.define('LeaveRequest', {
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
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  applied_days: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: false
  },
  leave_type: {
    type: DataTypes.ENUM('SICK', 'CASUAL', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID'),
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  approved_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'leave_requests',
  timestamps: true,
  underscored: true
});

LeaveRequest.associate = (models) => {
  LeaveRequest.belongsTo(models.Staff, {
    foreignKey: 'staff_id',
    as: 'applicant'
  });
  LeaveRequest.belongsTo(models.User, {
    foreignKey: 'approved_by_user_id',
    as: 'reviewer'
  });
};

module.exports = LeaveRequest;
