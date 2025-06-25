const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const BASE_URL = "http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc";
const axiosConfig = {
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
};

const handleApiError = (res, error, defaultMessage = "API request failed") => {
  console.error(`${defaultMessage}:`, error.message);
  const statusCode = error.response?.status || 500;
  const errorMessage = error.response?.data?.ls_Message || error.response?.data?.message || defaultMessage;

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: error.message
  });
};

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  const { ls_EmpCode, ls_Password } = req.body;
  if (!ls_EmpCode || !ls_Password) {
    return res.status(400).json({
      success: false,
      message: "Employee code and password are required"
    });
  }

  try {
    const loginRes = await axios.post(`${BASE_URL}/EmpLogin`, { ls_EmpCode, ls_Password }, axiosConfig);

    if (loginRes.data.ls_Status !== "S") {
      return res.status(401).json({
        success: false,
        message: loginRes.data.ls_Message || "Authentication failed"
      });
    }

    const empRes = await axios.get(`${BASE_URL}/GetEmpDetail?EmpCode=${ls_EmpCode}`);
    return res.json({
      success: true,
      message: "Login successful",
      data: {
        ...empRes.data,
        ls_EMPCODE: ls_EmpCode
      }
    });
  } catch (err) {
    return handleApiError(res, err, "Login failed");
  }
});

// ---------------- LEAVE TYPES ----------------
router.get('/leave-types', async (req, res) => {
  const { empType } = req.query;
  if (!empType) {
    return res.status(400).json({ success: false, message: "Employee type (empType) is required" });
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/GetLeaveTypes?EmpType=${empType}`);
    const { l_ClsErrorStatus, lst_ClsMstrLeavTypDtls = [] } = data;

    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ success: false, message: l_ClsErrorStatus?.ls_Message || "Failed to fetch leave types" });
    }

    const leaveTypes = lst_ClsMstrLeavTypDtls.map(item => ({
      code: item.ls_CODE,
      name: item.ls_NAME,
      description: item.ls_DESC || ""
    }));

    return res.json({ success: true, message: "Leave types fetched successfully", leaveTypes });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch leave types");
  }
});

// ---------------- APPLY LEAVE ----------------
router.post('/apply-leave', async (req, res) => {
  const required = ['ls_EmpCode', 'ls_FromDate', 'ls_ToDate', 'ls_LeavTyp', 'ls_GrpNo'];
  const missing = required.filter(key => !req.body[key]);

  if (missing.length > 0) {
    return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
  }

  const payload = {
    ls_EmpCode: req.body.ls_EmpCode.toString(),
    ls_FromDate: req.body.ls_FromDate,
    ls_ToDate: req.body.ls_ToDate,
    ls_DocDate: req.body.ls_DocDate || dayjs().format('YYYYMMDD'),
    ls_NofDays: req.body.ls_NofDays?.toString() || "1",
    ls_FromTime: req.body.ls_FromTime || "",
    ls_ToTime: req.body.ls_ToTime || "",
    ls_LeavTyp: req.body.ls_LeavTyp,
    ls_GrpNo: req.body.ls_GrpNo.toString(),
    ls_Reason: req.body.ls_Reason || ""
  };

  try {
    const { data } = await axios.post(`${BASE_URL}/LeavApply`, payload, axiosConfig);
    if (data?.ls_Status === "S") {
      return res.json({ success: true, message: data.ls_Message || "Leave applied successfully", data });
    } else {
      return res.status(400).json({ success: false, message: data?.ls_Message || "Leave application failed", data });
    }
  } catch (err) {
    return handleApiError(res, err, "Leave application failed");
  }
});

// ---------------- LEAVE HISTORY ----------------
router.get('/leave-history', async (req, res) => {
  const { ls_EmpCode, ls_DocDate, ls_Check, ls_Status } = req.query;
  if (!ls_EmpCode || !ls_DocDate) {
    return res.status(400).json({ success: false, message: "Employee code and date are required" });
  }

  // Set default values if not provided
  const checked = ls_Check || 'N';
  const status = ls_Status || 'ALL';

  try {
    const { data } = await axios.get(`${BASE_URL}/GetLeaveHistory?EMPCode=${ls_EmpCode}&Date=${ls_DocDate}&Checked=${checked}&Status=${status}`);
    const { l_ClsErrorStatus, lst_ClsLeavHstryDtls = [] } = data;

    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ success: false, message: l_ClsErrorStatus?.ls_Message || "Failed to fetch leave history" });
    }

    const history = lst_ClsLeavHstryDtls.map(item => ({
      leaveType: item.ls_LeavTyp,
      leaveName: item.ls_LeavName,
      leaveDate: item.ls_LeavDate?.split(' ')[0],
      openLeave: parseFloat(item.ls_OpenLeav) || 0,
      usedLeave: parseFloat(item.ls_UsedLeav) || 0,
      status: item.ls_Status || '',
      fromDate: item.ls_FromDate || '',
      toDate: item.ls_ToDate || '',
      reason: item.ls_Reason || ''
    }));

    return res.json({ success: true, message: "Leave history fetched successfully", leaveHistory: history });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch leave history");
  }
});

// ---------------- PENDING LEAVES ----------------
router.get('/pending-leaves', async (req, res) => {
  const { ls_EmpCode, ls_DocDate } = req.query;
  if (!ls_EmpCode || !ls_DocDate) {
    return res.status(400).json({ success: false, message: "Employee code and date are required" });
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/GetPendingLeave?EMPCode=${ls_EmpCode}&Date=${ls_DocDate}`);
    const { l_ClsErrorStatus, lst_ClsPendingLeavDtls = [] } = data;

    if (l_ClsErrorStatus?.ls_ErrorCode !== '0') {
      return res.status(400).json({ success: false, message: l_ClsErrorStatus?.ls_Message || "Failed to fetch pending leaves" });
    }

    const pendingLeaves = lst_ClsPendingLeavDtls.map(item => ({
      leaveType: item.ls_LeavTyp,
      leaveName: item.ls_LeavName,
      openLeave: item.ls_OpenLeav,
      usedLeave: item.ls_UsedLeav,
      pendingLeave: item.ls_PendLeav
    }));

    return res.json({ success: true, message: "Pending leaves fetched successfully", pendingLeaves });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch pending leaves");
  }
});

// ---------------- CHANGE PASSWORD ----------------
router.post('/change-password', async (req, res) => {
  const { ls_EmpCode, ls_OldPassword, ls_NewPassword } = req.body;
  if (!ls_EmpCode || !ls_OldPassword || !ls_NewPassword) {
    return res.status(400).json({ success: false, message: "All password fields are required" });
  }

  try {
    const { data } = await axios.post(`${BASE_URL}/EmpPswdChang`, { ls_EmpCode, ls_OldPassword, ls_NewPassword }, axiosConfig);
    if (data.ls_Status === "S") {
      return res.json({ success: true, message: data.ls_Message || "Password changed successfully" });
    }
    return res.status(400).json({ success: false, message: data.ls_Message || "Password change failed" });
  } catch (err) {
    return handleApiError(res, err, "Password change failed");
  }
});

// ---------------- LOAN TYPES ----------------
router.get('/loan-types', async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/GetLoanTypes`);
    console.log('Loan Types API Response:', JSON.stringify(data, null, 2));

    const { lst_ClsMstrLoanTypDtls = [] } = data;

    if (!lst_ClsMstrLoanTypDtls || lst_ClsMstrLoanTypDtls.length === 0) {
      return res.json({ success: false, message: "No loan types available", loanTypes: [] });
    }

    return res.json({ success: true, message: "Loan types fetched successfully", loanTypes: lst_ClsMstrLoanTypDtls });
  } catch (err) {
    console.error('Loan Types API Error:', err.message);
    return handleApiError(res, err, "Failed to fetch loan types");
  }
});

// ---------------- APPLY LOAN ----------------
router.post('/apply-loan', async (req, res) => {
  const required = ['ls_EmpCode', 'ls_LoanTyp', 'ls_ReqAmnt', 'ls_NoOfEmi', 'ls_Reason'];
  const missing = required.filter(key => !req.body[key]);

  if (missing.length > 0) {
    return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
  }

  // Format the payload to match the API requirements exactly
  const payload = {
    ls_EmpCode: req.body.ls_EmpCode.toString(),
    ls_LoanTyp: req.body.ls_LoanTyp,
    ls_ReqDate: req.body.ls_ReqDate || dayjs().format('YYYYMMDD'),
    ls_ReqAmnt: req.body.ls_ReqAmnt.toString(),
    ls_Intrst: req.body.ls_Intrst || "0",
    ls_FinlAmnt: req.body.ls_FinlAmnt || "0",
    ls_NoOfEmi: req.body.ls_NoOfEmi.toString(),
    ls_EmiAmnt: req.body.ls_EmiAmnt || "0",
    ls_Reason: req.body.ls_Reason
  };

  console.log('Backend Loan Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(`${BASE_URL}/LoanApply`, payload, axiosConfig);
    console.log('Loan API Response:', JSON.stringify(response.data, null, 2));

    const { data } = response;

    // Check if the response indicates success
    if (data && data.ls_Status === "S") {
      return res.json({ 
        success: true, 
        message: data.ls_Message || "Loan application submitted successfully", 
        data: data 
      });
    } else {
      // API returned an error status
      console.error('Loan API Error Response:', data);
      return res.status(400).json({ 
        success: false, 
        message: data?.ls_Message || "Loan application failed - please check your details and try again" 
      });
    }
  } catch (err) {
    console.error('Loan Application Error:', err.response?.data || err.message);

    // If there's a response from the API with error details
    if (err.response?.data) {
      return res.status(400).json({
        success: false,
        message: err.response.data.ls_Message || err.response.data.message || "Loan application failed",
        error: err.response.data
      });
    }

    return handleApiError(res, err, "Loan application failed");
  }
});

// ---------------- GET ATTENDANCE ----------------
router.get('/attendance', async (req, res) => {
  const { ls_EmpCode, ls_Month } = req.query;

  console.log('Attendance API - Received params:', { ls_EmpCode, ls_Month });

  if (!ls_EmpCode || !ls_Month) {
    return res.status(400).json({ success: false, message: "EMPCode and Month are required." });
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/GetAttendanceRpt?Month=${ls_Month}&EMPCode=${ls_EmpCode}`);
    const { l_ClsErrorStatus, lst_ClsAttndncRptDtls = [] } = data;

    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch attendance report" 
      });
    }

    const attendanceData = lst_ClsAttndncRptDtls.map(item => ({
      empCode: item.ls_EmpCode,
      empName: item.ls_EmpName,
      dayType: item.ls_DayType,
      lateMark: item.ls_LateMark,
      manInDate: item.ls_ManInDt,
      manInTime: item.ls_ManInTm,
      manOutDate: item.ls_ManOutDt,
      manOutTime: item.ls_ManOutTm,
      manTotalTime: item.ls_ManTotTm,
      sysInDate: item.ls_SysInDt,
      sysInTime: item.ls_SysInTm,
      sysOutDate: item.ls_SysOutDt,
      sysOutTime: item.ls_SysOutTm,
      sysTotalTime: item.ls_SysTotTm
    }));

    return res.json({
      success: true,
      message: "Attendance report fetched successfully",
      attendanceData
    });

  } catch (err) {
    return handleApiError(res, err, "Failed to fetch attendance report");
  }
});

// ---------------- EMPLOYEE IMAGE ----------------
router.get('/employee-image', async (req, res) => {
  const { imagePath } = req.query;

  if (!imagePath) {
    return res.status(400).json({ success: false, message: "Image path is required" });
  }

  // Construct the absolute path to the image
  const absoluteImagePath = imagePath;  // Assuming the path is already absolute

  // Check if the file exists
  if (!fs.existsSync(absoluteImagePath)) {
    return res.status(404).json({ success: false, message: "Image not found" });
  }

  // Send the image file
  res.sendFile(absoluteImagePath);
});


module.exports = router;