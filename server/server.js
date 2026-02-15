// server.js
require('dotenv').config(); // load .env first
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route modules with updated paths
const loginRoutes = require('./routes/auth/login');
const passwordRoutes = require('./routes/auth/password');
const employeeImageRoutes = require('./routes/employee/image');
const leaveTypeRoutes = require('./routes/leave/leavetype');
const leaveApplyRoutes = require('./routes/leave/leaveapply');
const leaveHistoryRoutes = require('./routes/leave/leavehistory');
const pendingLeaveRoutes = require('./routes/leave/pendingleave');
const attendanceRoutes = require('./routes/attendance/attendance');
const outdutyRoutes = require('./routes/attendance/outduty');
const monthlyAttendanceRoutes = require('./routes/reports/monthly-attendance');
const loanRoutes = require('./routes/payroll/loan');
const allowanceRoutes = require('./routes/payroll/allowance');
const salarySlipRoutes = require('./routes/payroll/salaryslip');
const holidayRoutes = require('./routes/holiday/holiday');

console.log('Loaded ENV (sample):', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  BASE_URL: process.env.BASE_URL
});

const app = express();
const PORT = Number(process.env.PORT);

// Allowed origins - include your frontend public IP (change if different)
const allowedOrigins = [
  process.env.CLIENT_URL,                 // e.g. "http://49.249.199.62:85" or set in .env
  'http://localhost:85',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://hrms.miraclecables.com',
  'http://hrms.miraclecables.com',
  'https://ruhulamin.tech',
  'http://ruhulamin.tech',
  'http://127.0.0.1:85',
  `http://${process.env.PUBLIC_IP || '49.249.199.62'}:85`
].filter(Boolean);

// CORS options with dynamic origin checking
const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools (curl/postman) with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // for development you can enable wildcard by uncommenting the next line:
    // return callback(null, true);

    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send(`✅ Backend server is running on port ${PORT}`);
});

// API routes - Mount all routes individually
app.use('/api', loginRoutes);
app.use('/api', passwordRoutes);
app.use('/api', employeeImageRoutes);
app.use('/api', leaveTypeRoutes);
app.use('/api', leaveApplyRoutes);
app.use('/api', leaveHistoryRoutes);
app.use('/api', pendingLeaveRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', outdutyRoutes);
app.use('/api', monthlyAttendanceRoutes);
app.use('/api', loanRoutes);
app.use('/api', allowanceRoutes);
app.use('/api', salarySlipRoutes);
app.use('/api', holidayRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err && err.stack ? err.stack : err);
  // If CORS error comes from cors middleware, show meaningful message
  if (err && err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server listening on all interfaces so external devices can connect
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`🌐 Accessible (public) on: http://${process.env.PUBLIC_IP || '49.249.199.62'}:${PORT}`);
  console.log(`🎯 Client URL(s) allowed:`, allowedOrigins);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // List all loaded routes
  console.log('\n📁 Loaded API Routes:');
  console.log('├── POST /api/login');
  console.log('├── POST /api/change-password');
  console.log('├── GET  /api/employee-image');
  console.log('├── GET  /api/leave-types');
  console.log('├── POST /api/apply-leave');
  console.log('├── GET  /api/leave-history');
  console.log('├── GET  /api/pending-leave');
  console.log('├── GET  /api/attendance');
  console.log('├── POST /api/out-duty');
  console.log('├── GET  /api/monthly-attendance');
  console.log('├── GET  /api/allowance-types');
  console.log('├── POST /api/allowance-apply');
  console.log('├── GET  /api/loan-types');
  console.log('├── POST /api/apply-loan');
  console.log('├── GET  /api/holiday-report');
  console.log('└── POST /api/salary-slip/*');
});