/**
 * Standard API response messages to maintain consistency
 */
module.exports = {
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGIN_FAILED: 'Invalid credentials',
    UNAUTHORIZED: 'You must log in to access this resource',
    FORBIDDEN: 'You do not have permission to view this resource',
    LOGOUT: 'Logged out successfully'
  },
  STAFF: {
    CREATE_SUCCESS: 'Staff member profile created successfully',
    UPDATE_SUCCESS: 'Staff member profile updated successfully',
    DELETE_SUCCESS: 'Staff member profile deleted successfully',
    FETCH_SUCCESS: 'Staff records retrieved successfully',
    NOT_FOUND: 'Staff record not found'
  },
  ATTENDANCE: {
    CHECK_IN_SUCCESS: 'Check-in successful',
    CHECK_OUT_SUCCESS: 'Check-out successful',
    ALREADY_CHECKED_IN: 'You have already checked in today',
    ALREADY_CHECKED_OUT: 'You have already checked out today',
    FETCH_SUCCESS: 'Attendance records retrieved successfully'
  },
  LEAVE: {
    APPLY_SUCCESS: 'Leave request submitted successfully',
    UPDATE_SUCCESS: 'Leave request status updated successfully',
    FETCH_SUCCESS: 'Leave records retrieved successfully',
    NOT_FOUND: 'Leave record not found'
  },
  GENERAL: {
    SUCCESS: 'Operation completed successfully',
    SERVER_ERROR: 'Internal server error occurred',
    VALIDATION_ERROR: 'Invalid input fields provided'
  }
};
