// routes/auth/utils.js
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc';
const axiosConfig = {
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: parseInt(process.env.API_TIMEOUT) || 10000
};

const handleApiError = (res, error, defaultMessage = "API request failed") => {
  console.error(`${defaultMessage}:`, error.message);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error Response Data:', error.response.data);
    console.error('Error Response Status:', error.response.status);
    console.error('Error Response Headers:', error.response.headers);
    
    const errorMessage = error.response.data?.ls_Message || 
                        error.response.data?.message || 
                        error.response.statusText || 
                        defaultMessage;
    
    return res.status(error.response.status).json({
      success: false,
      message: errorMessage,
      statusCode: error.response.status
    });
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    return res.status(504).json({
      success: false,
      message: "No response from upstream server. Please try again later.",
      error: "Gateway Timeout"
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
    return res.status(500).json({
      success: false,
      message: defaultMessage,
      error: error.message
    });
  }
};

module.exports = { BASE_URL, axiosConfig, handleApiError };