const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');
const router = express.Router();

// CHANGE PASSWORD
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

module.exports = router;