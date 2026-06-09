// Load environment configurations first
require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

// Initialize server boot
const startServer = async () => {
  try {
    // 1. Authenticate Database
    await connectDB();

    // 2. Synchronize models
    const { sequelize, User, Role, Department, Staff, AttendanceSetting } = require('./models');
    await sequelize.sync();
    logger.info('Database models synchronized successfully.');

    // 3. Seed initial data if database is empty
    const roleCount = await Role.count();
    if (roleCount === 0) {
      logger.info('Database is empty. Seeding initial Roles, Users, Departments, and Settings...');
      
      // Create roles
      const superAdminRole = await Role.create({ name: 'SUPER_ADMIN' });
      const adminRole = await Role.create({ name: 'ADMIN' });
      const staffRole = await Role.create({ name: 'STAFF' });

      // Create a default department
      const department = await Department.create({
        name: 'Technology Services',
        code: 'TECH',
        description: 'Engineering and System Services'
      });

      // Create Admin credentials and staff profile
      const adminUser = await User.create({
        email: 'admin@company.com',
        password: 'AdminPass123',
        role_id: adminRole.id
      });
      await Staff.create({
        user_id: adminUser.id,
        department_id: department.id,
        employee_code: 'EMP000',
        designation: 'System Administrator',
        first_name: 'System',
        last_name: 'Admin'
      });

      // Create Staff credentials and profile
      const staffUser = await User.create({
        email: 'staff@company.com',
        password: 'StaffPass123',
        role_id: staffRole.id
      });
      await Staff.create({
        user_id: staffUser.id,
        department_id: department.id,
        employee_code: 'EMP001',
        designation: 'Software Engineer',
        first_name: 'Jane',
        last_name: 'Doe'
      });

      // Create default settings
      await AttendanceSetting.create({
        office_start_time: '09:00:00',
        office_end_time: '17:00:00',
        late_after_minutes: 15,
        half_day_after_minutes: 120
      });

      logger.info('Database seeding completed successfully.');
    }
    
    // 4. Start Listening
    app.listen(PORT, () => {
      logger.info(`Server successfully listening in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Critical failure during service boot:', error);
    process.exit(1);
  }
};

startServer();
