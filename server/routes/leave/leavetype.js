const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('../auth/utils');
const router = express.Router();

// Leave Types
router.get('/leave-types', async (req, res) => {
  const { empType, bplId } = req.query;
  if (!empType) return res.status(400).json({ success: false, message: "Employee type (empType) is required" });
  if (!bplId) return res.status(400).json({ success: false, message: "Branch ID (bplId) is required" });

  try {
    const url = `${BASE_URL}/GetLeaveTypes?EmpType=${encodeURIComponent(empType)}&BPLID=${encodeURIComponent(bplId)}`;
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
      code: item.ls_CODE || "",
      name: item.ls_NAME || "",
      description: item.ls_DESC || ""
    }));

    console.log('Mapped leave types:', leaveTypes);
    return res.json({ success: true, message: "Leave types fetched successfully", leaveTypes });
  } catch (err) {
    // handleApiError should log error details and send a safe message
    return handleApiError(res, err, "Failed to fetch leave types");
  }
});

module.exports = router;