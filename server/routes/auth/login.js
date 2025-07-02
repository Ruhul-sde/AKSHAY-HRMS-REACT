const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');
const router = express.Router();

// LOGIN
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

module.exports = router; 