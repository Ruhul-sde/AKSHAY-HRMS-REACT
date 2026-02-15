const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('../auth/utils');
const router = express.Router();

// LEAVE HISTORY
router.get('/leave-history', async (req, res) => {
  const { ls_EmpCode, ls_DocDate, ls_Check, ls_Status } = req.query;
  if (!ls_EmpCode || !ls_DocDate) {
    return res.status(400).json({ success: false, message: "Employee code and date are required" });
  }
  const checked = ls_Check || 'N';
  const status = ls_Status || 'ALL';
  try {
    const url = `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetLeaveHistory?EMPCode=${ls_EmpCode}&Date=${ls_DocDate}&Checked=${checked}&Status=${status}`;
    const { data } = await axios.get(url);
    const { l_ClsErrorStatus, lst_ClsLeavHstryDtls = [] } = data;
    
    if (l_ClsErrorStatus?.li_ErrorCode !== 0) {
      return res.status(400).json({ success: false, message: l_ClsErrorStatus?.ls_Message || "Failed to fetch leave history" });
    }
    
    const history = lst_ClsLeavHstryDtls.map(item => ({
      leaveType: item.ls_LeavTyp,
      leaveName: item.ls_LeavName,
      status: item.ls_Status || '',
      fromDate: item.ls_FromDate || '',
      toDate: item.ls_ToDate || '',
      noOfDays: parseFloat(item.ls_NoOfDays) || 0
    }));
    
    return res.json({ success: true, message: "Leave history fetched successfully", leaveHistory: history });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch leave history");
  }
});

module.exports = router;