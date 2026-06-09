import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';

// Pages
import Login from '../pages/auth/Login';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Departments from '../pages/admin/Departments';
import StaffList from '../pages/admin/StaffList';
import LeavesList from '../pages/admin/LeavesList';
import Reports from '../pages/admin/Reports';

import StaffDashboard from '../pages/staff/StaffDashboard';
import AttendanceClock from '../pages/staff/AttendanceClock';
import LeavesHistory from '../pages/staff/LeavesHistory';
import ProfileDetails from '../pages/staff/ProfileDetails';

import NotFound from '../pages/errors/NotFound';
import Forbidden from '../pages/errors/Forbidden';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Path - Auto Redirect to login or dashboards */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Public Authentication Routes */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/auth/login" element={<Login />} />
      </Route>

      {/* Admin Panel Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/staff" element={<StaffList />} />
        <Route path="/admin/leaves" element={<LeavesList />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Route>

      {/* Staff Portal Routes */}
      <Route element={<ProtectedRoute allowedRoles={['STAFF']}><StaffLayout /></ProtectedRoute>}>
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/attendance" element={<AttendanceClock />} />
        <Route path="/staff/leaves" element={<LeavesHistory />} />
        <Route path="/staff/profile" element={<ProfileDetails />} />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
