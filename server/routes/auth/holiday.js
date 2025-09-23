
const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');

const router = express.Router();

// GET HOLIDAY REPORT
router.get('/holiday-report', async (req, res) => {
  const { ls_BranchId, ls_FinYear } = req.query;
  console.log('Holiday Report API - Received params:', { ls_BranchId, ls_FinYear });
  
  if (!ls_BranchId || !ls_FinYear) {
    return res.status(400).json({ 
      success: false, 
      message: "Branch ID and Financial Year are required." 
    });
  }

  try {
    const branchId = ls_BranchId;

    const { data } = await axios.get(`${BASE_URL}/GetHolidayRpt?Branch=${branchId}&FinYear=${ls_FinYear}`);
    
    const { l_ClsErrorStatus, lst_ClsHolidayRptDtls = [] } = data;
    
    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch holiday report" 
      });
    }

    const holidayData = lst_ClsHolidayRptDtls.map(item => {
      // Parse the date format "26-01-2025 00:00:00" to proper date
      const datePart = item.ls_HldDate.split(' ')[0]; // Get "26-01-2025"
      const [day, month, year] = datePart.split('-');
      const formattedDate = `${year}-${month}-${day}`; // Convert to "2025-01-26"
      
      return {
        holidayDate: formattedDate,
        reason: item.ls_Reason
      };
    });

    return res.json({
      success: true,
      message: "Holiday report fetched successfully",
      holidayData,
      branchId: branchId
    });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch holiday report");
  }
});

module.exports = router;
