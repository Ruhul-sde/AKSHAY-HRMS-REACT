const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');

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
  const { ls_EmpCode, ls_DocDate } = req.query;
  if (!ls_EmpCode || !ls_DocDate) {
    return res.status(400).json({ success: false, message: "Employee code and date are required" });
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/GetLeaveHistory?EMPCode=${ls_EmpCode}&Date=${ls_DocDate}`);
    const { l_ClsErrorStatus, lst_ClsLeavHstryDtls = [] } = data;

    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ success: false, message: l_ClsErrorStatus?.ls_Message || "Failed to fetch leave history" });
    }

    const history = lst_ClsLeavHstryDtls.map(item => ({
      leaveType: item.ls_LeavTyp,
      leaveName: item.ls_LeavName,
      leaveDate: item.ls_LeavDate?.split(' ')[0],
      openLeave: parseFloat(item.ls_OpenLeav) || 0,
      usedLeave: parseFloat(item.ls_UsedLeav) || 0
    }));

    return res.json({ success: true, message: "Leave history fetched successfully", leaveHistory: history });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch leave history");
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
    const { lst_ClsMstrLoanTypDtls = [] } = data;

    return res.json({ success: true, message: "Loan types fetched successfully", loanTypes: lst_ClsMstrLoanTypDtls });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch loan types");
  }
});

// ---------------- APPLY LOAN ----------------
router.post('/apply-loan', async (req, res) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/LoanApply`, req.body, axiosConfig);
    if (data.ls_Status === "S") {
      return res.json({ success: true, message: data.ls_Message || "Loan applied successfully", data });
    }
    return res.status(400).json({ success: false, message: data.ls_Message || "Loan application failed" });
  } catch (err) {
    return handleApiError(res, err, "Loan application failed");
  }
});

module.exports = router;
