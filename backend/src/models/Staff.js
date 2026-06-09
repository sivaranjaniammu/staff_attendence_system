const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  employee_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  profile_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  joining_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  face_template: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  face_registration_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'staff',
  timestamps: true,
  underscored: true
});

Staff.associate = (models) => {
  Staff.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'userCredentials'
  });
  Staff.belongsTo(models.Department, {
    foreignKey: 'department_id',
    as: 'department'
  });
  Staff.hasMany(models.Attendance, {
    foreignKey: 'staff_id',
    onDelete: 'CASCADE',
    as: 'attendances'
  });
  Staff.hasMany(models.LeaveRequest, {
    foreignKey: 'staff_id',
    onDelete: 'CASCADE',
    as: 'leaveRequests'
  });
};

module.exports = Staff;
