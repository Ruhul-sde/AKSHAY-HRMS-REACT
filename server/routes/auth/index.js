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

const router = express.Router();

// Use routes
router.use('/', loginRoutes);
router.use('/', employeeRoutes);
router.use('/', leaveRoutes);
router.use('/', passwordRoutes);
router.use('/', attendanceRoutes);
router.use('/', loanRoutes);
router.use('/', outdutyRoutes);
router.use('/', holidayRoutes);
router.use('/', allowanceRoutes);

module.exports = router;