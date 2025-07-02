const express = require('express');
const loginRoutes = require('./login');
const leaveRoutes = require('./leave');
const loanRoutes = require('./loan');
const passwordRoutes = require('./password');
const attendanceRoutes = require('./attendance');
const employeeRoutes = require('./employee');

const router = express.Router();

router.use(loginRoutes);
router.use(leaveRoutes);
router.use(loanRoutes);
router.use(passwordRoutes);
router.use(attendanceRoutes);
router.use(employeeRoutes);

module.exports = router; 