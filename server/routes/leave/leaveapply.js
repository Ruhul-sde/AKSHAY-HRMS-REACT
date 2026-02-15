const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const { BASE_URL, axiosConfig, handleApiError } = require('../auth/utils');
const router = express.Router();

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

module.exports = router;