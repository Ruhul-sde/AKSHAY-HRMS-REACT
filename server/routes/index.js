const express = require('express');
const loginRoutes = require('./auth/login');
const passwordRoutes = require('./auth/password');
const attendanceRoutes = require('./attendance/attendance');
const outdutyRoutes = require('./attendance/outduty');
const monthlyAttendanceRoutes = require('./reports/monthly-attendance'); 
const employeeImageRoutes = require('./employee/image');
const leaveTypeRoutes = require('./leave/leavetype');
const leaveApplyRoutes = require('./leave/leaveapply');
const leaveHistoryRoutes = require('./leave/leavehistory');
const pendingLeaveRoutes = require('./leave/pendingleave');
const loanRoutes = require('./payroll/loan');
const holidayRoutes = require('./holiday/holiday');
const allowanceRoutes = require('./payroll/allowance');
const salarySlipRoutes = require('./payroll/salaryslip');

const router = express.Router();

// Use routes
router.use('/', loginRoutes);
router.use('/', passwordRoutes);
router.use('/', employeeImageRoutes);
router.use('/', leaveTypeRoutes);
router.use('/', leaveApplyRoutes);
router.use('/', leaveHistoryRoutes);
router.use('/', pendingLeaveRoutes);
router.use('/', attendanceRoutes);
router.use('/', outdutyRoutes); 
router.use('/', monthlyAttendanceRoutes); 
router.use('/', loanRoutes);
router.use('/', holidayRoutes);
router.use('/', allowanceRoutes);
router.use('/', salarySlipRoutes);

module.exports = router;