const BASE_URL = "http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc";
const axiosConfig = {
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
};

const handleApiError = (res, error, defaultMessage = "API request failed") => {
  console.error(`${defaultMessage}:`, error.message);
  const statusCode = error.response?.status || 500;
  const errorMessage = error.response?.data?.ls_Message || error.response?.data?.message || defaultMessage;

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: error.message
  });
};

module.exports = { BASE_URL, axiosConfig, handleApiError }; 