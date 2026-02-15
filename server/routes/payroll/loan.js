const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const { BASE_URL, axiosConfig, handleApiError } = require('../auth/utils');
const router = express.Router();

// LOAN TYPES
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

// APPLY LOAN
router.post('/apply-loan', async (req, res) => {
  const required = ['ls_EmpCode', 'ls_LoanTyp', 'ls_ReqAmnt', 'ls_NoOfEmi', 'ls_Reason'];
  const missing = required.filter(key => !req.body[key]);
  if (missing.length > 0) {
    return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
  }
  // Log the incoming request body
  console.log('Incoming /apply-loan request body:', JSON.stringify(req.body, null, 2));
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
  // Log the payload being sent to the real API
  console.log('Backend Loan Payload:', JSON.stringify(payload, null, 2));
  try {
    const response = await axios.post(`${BASE_URL}/LoanApply`, payload, axiosConfig);
    // Log the response from the real API
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
        message: data?.ls_Message || "Loan application failed - please check your details and try again",
        apiResponse: data
      });
    }
  } catch (err) {
    // Log the error details
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

module.exports = router;