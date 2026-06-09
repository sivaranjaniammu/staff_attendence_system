const reportService = require('../services/report.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Reports Controller
 */
const reportController = {
  /**
   * JSON previews endpoints
   */
  getAttendanceReport: async (req, res, next) => {
    try {
      const data = await reportService.getAttendanceReport(req.query);
      return ApiResponse.success(res, 'Attendance report generated successfully', { data });
    } catch (error) {
      next(error);
    }
  },

  getStaffReport: async (req, res, next) => {
    try {
      const data = await reportService.getStaffReport(req.query);
      return ApiResponse.success(res, 'Staff report generated successfully', { data });
    } catch (error) {
      next(error);
    }
  },

  getLeavesReport: async (req, res, next) => {
    try {
      const data = await reportService.getLeavesReport(req.query);
      return ApiResponse.success(res, 'Leave report generated successfully', { data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PDF export handlers
   */
  exportAttendancePDF: async (req, res, next) => {
    try {
      const doc = await reportService.generateAttendancePDF(req.query);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.pdf"');
      doc.pipe(res);
    } catch (error) {
      next(error);
    }
  },

  exportStaffPDF: async (req, res, next) => {
    try {
      const doc = await reportService.generateStaffPDF(req.query);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="staff_report.pdf"');
      doc.pipe(res);
    } catch (error) {
      next(error);
    }
  },

  exportLeavesPDF: async (req, res, next) => {
    try {
      const doc = await reportService.generateLeavesPDF(req.query);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="leave_report.pdf"');
      doc.pipe(res);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excel export handlers
   */
  exportAttendanceExcel: async (req, res, next) => {
    try {
      const workbook = await reportService.generateAttendanceExcel(req.query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  },

  exportStaffExcel: async (req, res, next) => {
    try {
      const workbook = await reportService.generateStaffExcel(req.query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="staff_report.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  },

  exportLeavesExcel: async (req, res, next) => {
    try {
      const workbook = await reportService.generateLeavesExcel(req.query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="leave_report.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reportController;
