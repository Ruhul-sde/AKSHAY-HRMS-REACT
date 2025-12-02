const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');
const router = express.Router();

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