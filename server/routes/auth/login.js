const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');
const router = express.Router();

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { ls_EmpCode, ls_Password } = req.body;

  // Log incoming request
  console.log('Received login request:', { ls_EmpCode, ls_Password });

  // Validate input
  if (!ls_EmpCode || !ls_Password) {
    console.warn('Missing employee code or password');
    return res.status(400).json({
      success: false,
      message: 'Employee code and password are required'
    });
  }

  try {
    // Call WCF API for login
    const loginUrl = `${BASE_URL}/EmpLogin`;
    console.log('Sending POST request to:', loginUrl);
    console.log('Axios timeout is:', axiosConfig.timeout);
    const loginResponse = await axios.post(loginUrl, { ls_EmpCode, ls_Password }, axiosConfig);
    console.log('Login API response:', loginResponse.data);

    // Check login status
    if (loginResponse.data.ls_Status !== 'S') {
      console.warn('Login failed:', loginResponse.data.ls_Message);
      return res.status(401).json({
        success: false,
        message: loginResponse.data.ls_Message || 'Authentication failed'
      });
    }

    // Call WCF API to get employee details
    const empDetailUrl = `${BASE_URL}/GetEmpDetail?EmpCode=${ls_EmpCode}`;
    console.log('Fetching employee details from:', empDetailUrl);

    const empResponse = await axios.get(empDetailUrl, axiosConfig);
    console.log('Employee details response:', empResponse.data);

    // Respond to frontend
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        ...empResponse.data,
        ls_EMPCODE: ls_EmpCode
      }
    });

  } catch (err) {
    console.error('Login failed with error:', err.message);
    return handleApiError(res, err, 'Login failed');
  }
});

module.exports = router;