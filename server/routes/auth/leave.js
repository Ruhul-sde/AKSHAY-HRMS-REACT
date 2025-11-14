const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');
const router = express.Router();
// Leave Types
router.get('/leave-types', async (req, res) => {
  const { empType } = req.query;
  if (!empType) return res.status(400).json({ success: false, message: "Employee type (empType) is required" });

  try {
    const url = `${BASE_URL}/GetLeaveTypes?EmpType=${encodeURIComponent(empType)}`;
    const { data } = await axios.get(url, { timeout: 5000 });

    const { l_ClsErrorStatus, lst_ClsMstrLeavTypDtls = [] } = data || {};

    if (l_ClsErrorStatus?.ls_Status !== "S") {
      // map upstream failure to 502 Bad Gateway (more accurate)
      return res.status(502).json({
        success: false,
        message: l_ClsErrorStatus?.ls_Message || "Upstream service failed to provide leave types"
      });
    }

    const leaveTypes = (lst_ClsMstrLeavTypDtls || []).map(item => ({
      code: item.ls_CODE,
      name: item.ls_NAME,
      description: item.ls_DESC || ""
    }));

    return res.json({ success: true, message: "Leave types fetched successfully", leaveTypes });
  } catch (err) {
    // handleApiError should log error details and send a safe message
    return handleApiError(res, err, "Failed to fetch leave types");
  }
});

// APPLY LEAVE
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

// LEAVE HISTORY
router.get('/leave-history', async (req, res) => {
  const { ls_EmpCode, ls_DocDate, ls_Check, ls_Status } = req.query;
  if (!ls_EmpCode || !ls_DocDate) {
    return res.status(400).json({ success: false, message: "Employee code and date are required" });
  }
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

// PENDING LEAVES
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

module.exports = router; 