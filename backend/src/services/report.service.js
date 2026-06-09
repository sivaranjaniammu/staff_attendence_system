const { Attendance, Staff, Department, LeaveRequest, User } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const logger = require('../config/logger');
const ApiError = require('../utils/apiError');

/**
 * Helper to fetch attendance report data
 */
const getAttendanceReportData = async (filters) => {
  const { startDate, endDate, departmentId, staffId } = filters;

  if (!startDate || !endDate) {
    throw new ApiError('Start date and End date filters are required.', 400);
  }

  const attendanceWhere = {
    date: { [Op.between]: [startDate, endDate] }
  };

  const staffWhere = {};
  if (staffId) staffWhere.id = staffId;
  if (departmentId) staffWhere.department_id = departmentId;

  const records = await Attendance.findAll({
    where: attendanceWhere,
    include: [{
      model: Staff,
      as: 'staff',
      where: staffWhere,
      include: [{ model: Department, as: 'department', attributes: ['name', 'code'] }]
    }],
    order: [['date', 'ASC']]
  });

  // Aggregate stats per staff member
  const aggregates = {};

  records.forEach((rec) => {
    const s = rec.staff;
    if (!aggregates[s.id]) {
      aggregates[s.id] = {
        employee_code: s.employee_code,
        name: `${s.first_name} ${s.last_name}`,
        department: s.department ? s.department.name : 'N/A',
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        onLeave: 0,
        totalHours: 0
      };
    }

    const stat = aggregates[s.id];
    if (rec.status === 'PRESENT') stat.present++;
    else if (rec.status === 'LATE') stat.late++;
    else if (rec.status === 'HALF_DAY') stat.halfDay++;
    else if (rec.status === 'ABSENT') stat.absent++;
    else if (rec.status === 'ON_LEAVE') stat.onLeave++;

    if (rec.working_hours) {
      stat.totalHours += parseFloat(rec.working_hours);
    }
  });

  // Format total hours decimals
  Object.keys(aggregates).forEach((key) => {
    aggregates[key].totalHours = parseFloat(aggregates[key].totalHours.toFixed(2));
  });

  return Object.values(aggregates);
};

/**
 * Helper to fetch staff list report data
 */
const getStaffReportData = async (filters) => {
  const { departmentId } = filters;
  const staffWhere = {};
  if (departmentId) staffWhere.department_id = departmentId;

  const staffList = await Staff.findAll({
    where: staffWhere,
    include: [
      { model: Department, as: 'department', attributes: ['name', 'code'] },
      { model: User, as: 'userCredentials', attributes: ['is_active'] }
    ],
    order: [['employee_code', 'ASC']]
  });

  return staffList.map((s) => ({
    employee_code: s.employee_code,
    name: `${s.first_name} ${s.last_name}`,
    department: s.department ? s.department.name : 'N/A',
    designation: s.designation,
    joining_date: s.joining_date,
    status: s.userCredentials && s.userCredentials.is_active ? 'Active' : 'Inactive'
  }));
};

/**
 * Helper to fetch leaves report data
 */
const getLeavesReportData = async (filters) => {
  const { startDate, endDate, status } = filters;
  const leaveWhere = {};

  if (startDate && endDate) {
    leaveWhere.start_date = { [Op.between]: [startDate, endDate] };
  }

  if (status) {
    leaveWhere.status = status;
  }

  const requests = await LeaveRequest.findAll({
    where: leaveWhere,
    include: [
      { model: Staff, as: 'applicant', attributes: ['first_name', 'last_name', 'employee_code'] }
    ],
    order: [['start_date', 'DESC']]
  });

  return requests.map((l) => ({
    employee_code: l.applicant ? l.applicant.employee_code : 'N/A',
    name: l.applicant ? `${l.applicant.first_name} ${l.applicant.last_name}` : 'N/A',
    leave_type: l.leave_type,
    start_date: l.start_date,
    end_date: l.end_date,
    applied_days: l.applied_days,
    status: l.status
  }));
};

/**
 * Drawing clean tables in PDFKit documents
 */
const drawPDFTable = (doc, headers, data, title, filterSummary) => {
  // Page header
  doc.fontSize(18).fillColor('#3730a3').text('AttendEase Attendance Portal', { align: 'center' });
  doc.fontSize(10).fillColor('#6b7280').text('Staff Attendance Management System Reports', { align: 'center' });
  doc.moveDown();

  doc.fontSize(14).fillColor('#111827').text(title, { underline: true });
  doc.fontSize(9).fillColor('#4b5563').text(`Generated On: ${new Date().toLocaleString()}`);
  doc.text(filterSummary);
  doc.moveDown();

  // Draw headers
  let y = doc.y;
  doc.rect(40, y - 5, 530, 20).fill('#e0e7ff');
  doc.fillColor('#3730a3').fontSize(9);

  let xOffsets = [45, 145, 245, 305, 365, 425, 485, 535];
  if (headers.length === 6) { // Staff Report
    xOffsets = [45, 135, 235, 335, 435, 515];
  } else if (headers.length === 7) { // Leave Report
    xOffsets = [45, 125, 205, 275, 345, 425, 505];
  }

  headers.forEach((header, index) => {
    doc.text(header, xOffsets[index], y);
  });
  
  y += 20;
  doc.fillColor('#3730a3');

  // Draw rows
  data.forEach((row, rowIndex) => {
    if (y > 700) {
      doc.addPage();
      y = 50;
      doc.rect(40, y - 5, 530, 20).fill('#e0e7ff');
      doc.fillColor('#3730a3').fontSize(9);
      headers.forEach((header, index) => {
        doc.text(header, xOffsets[index], y);
      });
      y += 20;
    }

    // Zebra striping backgrounds
    if (rowIndex % 2 === 0) {
      doc.rect(40, y - 4, 530, 16).fill('#f8fafc');
    }
    
    doc.fillColor('#1e293b').fontSize(8.5);

    const values = Object.values(row);
    values.forEach((val, colIndex) => {
      doc.text(String(val), xOffsets[colIndex], y);
    });

    y += 18;
  });

  // Footer Page numbers setup
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor('#94a3b8').text(
      `Page ${i + 1} of ${range.count}`,
      50,
      740,
      { align: 'center' }
    );
  }
};

/**
 * Reports Service
 */
const reportService = {
  /**
   * JSON reports data queries
   */
  getAttendanceReport: getAttendanceReportData,
  getStaffReport: getStaffReportData,
  getLeavesReport: getLeavesReportData,

  /**
   * Generate Attendance Report PDF
   */
  generateAttendancePDF: async (filters) => {
    const data = await getAttendanceReportData(filters);
    const doc = new PDFDocument({ bufferPages: true, margin: 40 });

    const filterSummary = `Date Range: ${filters.startDate} to ${filters.endDate}`;
    const headers = ['Code', 'Name', 'Department', 'Present', 'Absent', 'Late', 'Half Day', 'Hours'];
    
    drawPDFTable(doc, headers, data, 'Attendance Summarized Log Report', filterSummary);
    doc.end();
    return doc;
  },

  /**
   * Generate Staff Directory PDF
   */
  generateStaffPDF: async (filters) => {
    const data = await getStaffReportData(filters);
    const doc = new PDFDocument({ bufferPages: true, margin: 40 });

    const filterSummary = `Department Filter ID: ${filters.departmentId || 'All Departments'}`;
    const headers = ['Code', 'Name', 'Department', 'Designation', 'Joining Date', 'Status'];
    
    drawPDFTable(doc, headers, data, 'Staff Member Registry Directory', filterSummary);
    doc.end();
    return doc;
  },

  /**
   * Generate Leave Applications PDF
   */
  generateLeavesPDF: async (filters) => {
    const data = await getLeavesReportData(filters);
    const doc = new PDFDocument({ bufferPages: true, margin: 40 });

    const filterSummary = `Date Range: ${filters.startDate || 'All'} to ${filters.endDate || 'All'} | Status: ${filters.status || 'All'}`;
    const headers = ['Code', 'Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status'];
    
    drawPDFTable(doc, headers, data, 'Leave Applications Review Summary', filterSummary);
    doc.end();
    return doc;
  },

  /**
   * Generate Attendance Excel Sheet
   */
  generateAttendanceExcel: async (filters) => {
    const data = await getAttendanceReportData(filters);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Attendance Summary');

    sheet.columns = [
      { header: 'Employee Code', key: 'employee_code', width: 15 },
      { header: 'Full Name', key: 'name', width: 25 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Present Days', key: 'present', width: 15 },
      { header: 'Absent Days', key: 'absent', width: 15 },
      { header: 'Late Days', key: 'late', width: 15 },
      { header: 'Half Days', key: 'halfDay', width: 15 },
      { header: 'Total Working Hours', key: 'totalHours', width: 20 }
    ];

    // Styling Headers
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3730A3' } // Indigo color
    };

    // Add Data
    sheet.addRows(data);
    return workbook;
  },

  /**
   * Generate Staff Excel Sheet
   */
  generateStaffExcel: async (filters) => {
    const data = await getStaffReportData(filters);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Staff Directory');

    sheet.columns = [
      { header: 'Employee Code', key: 'employee_code', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'Joining Date', key: 'joining_date', width: 15 },
      { header: 'Account Status', key: 'status', width: 15 }
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3730A3' }
    };

    sheet.addRows(data);
    return workbook;
  },

  /**
   * Generate Leaves Excel Sheet
   */
  generateLeavesExcel: async (filters) => {
    const data = await getLeavesReportData(filters);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Leaves Summary');

    sheet.columns = [
      { header: 'Employee Code', key: 'employee_code', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Leave Type', key: 'leave_type', width: 15 },
      { header: 'Start Date', key: 'start_date', width: 15 },
      { header: 'End Date', key: 'end_date', width: 15 },
      { header: 'Applied Days', key: 'applied_days', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3730A3' }
    };

    sheet.addRows(data);
    return workbook;
  }
};

module.exports = reportService;
