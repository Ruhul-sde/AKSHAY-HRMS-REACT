const express = require('express');
const loginRoutes = require('./login');
const leaveRoutes = require('./leave');
const loanRoutes = require('./loan');
const passwordRoutes = require('./password');
const attendanceRoutes = require('./attendance');
const employeeRoutes = require('./employee');
const outdutyRoutes = require('./outduty');
const holidayRoutes = require('./holiday');
const allowanceRoutes = require('./allowance');
const pendingLeaveRoutes = require('./pendingLeave');
const salarySlipRoutes = require('./salarySlip'); // ✅ ADD THIS

const router = express.Router();

// Use routes
router.use('/', loginRoutes);
router.use('/', employeeRoutes);
router.use('/', leaveRoutes);
router.use('/', pendingLeaveRoutes);
router.use('/', passwordRoutes);
router.use('/', attendanceRoutes);
router.use('/', loanRoutes);
router.use('/', outdutyRoutes);
router.use('/', holidayRoutes);
router.use('/', allowanceRoutes);
router.use('/', salarySlipRoutes); // ✅ ADD THIS

module.exports = router;
