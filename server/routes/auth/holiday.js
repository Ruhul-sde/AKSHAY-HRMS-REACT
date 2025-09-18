const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');

const router = express.Router();

// GET HOLIDAY REPORT
router.get('/holiday-report', async (req, res) => {
  const { ls_Branch, ls_FinYear } = req.query;

  console.log('Holiday Report API - Received params:', { ls_Branch, ls_FinYear });

  if (!ls_Branch || !ls_FinYear) {
    return res.status(400).json({ 
      success: false, 
      message: "Branch and Financial Year are required." 
    });
  }

  try {
    // Call the holiday API with the correct format
    const holidayApiUrl = `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetHolidayRpt?Branch=${ls_Branch}&FinYear=${ls_FinYear}`;
    console.log('Calling Holiday API with URL:', holidayApiUrl);

    const { data } = await axios.get(holidayApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Holiday API Response:', JSON.stringify(data, null, 2));

    // Check for error status like other APIs
    const { l_ClsErrorStatus, lst_ClsHolidayRptDtls = [] } = data;

    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch holiday report" 
      });
    }

    // Map the holiday data to match frontend expectations
    const holidayData = lst_ClsHolidayRptDtls.map(item => ({
      ls_HldDate: item.ls_HldDate || item.ls_HolidayDate,
      ls_Reason: item.ls_Reason || item.ls_HolidayName || item.ls_Description,
      holidayId: item.ls_HolidayId,
      holidayName: item.ls_HolidayName,
      holidayDate: item.ls_HolidayDate,
      holidayType: item.ls_HolidayType,
      description: item.ls_Description,
      branch: item.ls_Branch,
      finYear: item.ls_FinYear,
      dayOfWeek: item.ls_DayOfWeek,
      isOptional: item.ls_IsOptional,
      category: item.ls_Category
    }));

    return res.json({
      success: true,
      message: "Holiday report fetched successfully",
      holidayData,
      totalHolidays: holidayData.length
    });

  } catch (err) {
    console.error('Holiday API error:', err.response?.data || err.message);
    return handleApiError(res, err, "Failed to fetch holiday report");
  }
});

// GET HOLIDAY REPORT FOR EMPLOYEE (automatically fetch branch from employee details)
router.get('/holiday-report-emp', async (req, res) => {
  const { ls_EmpCode, ls_FinYear } = req.query;

  console.log('Holiday Report for Employee - Received params:', { ls_EmpCode, ls_FinYear });

  if (!ls_EmpCode || !ls_FinYear) {
    return res.status(400).json({ 
      success: false, 
      message: "Employee Code and Financial Year are required." 
    });
  }

  try {
    // First get employee details to fetch branch ID
    console.log(`Calling GetEmpDtls with: ${BASE_URL}/GetEmpDtls?EMPCode=${ls_EmpCode}`);
    const empResponse = await axios.get(`${BASE_URL}/GetEmpDtls?EMPCode=${ls_EmpCode}`, axiosConfig);

    console.log('Employee Details API response:', JSON.stringify(empResponse.data, null, 2));

    const { l_ClsErrorStatus: empErrorStatus, lst_ClsEmpDtls } = empResponse.data;

    if (empErrorStatus?.ls_Status !== "S") {
      console.log('Employee API error status:', empErrorStatus);
      return res.status(400).json({ 
        success: false, 
        message: `Employee not found: ${empErrorStatus?.ls_Message || 'Invalid employee code'}` 
      });
    }

    if (!lst_ClsEmpDtls || lst_ClsEmpDtls.length === 0) {
      console.log('No employee details found in response');
      return res.status(400).json({ 
        success: false, 
        message: "No employee details found for the given employee code" 
      });
    }

    const employeeBranchId = lst_ClsEmpDtls[0].ls_BrnchId;
    console.log('Employee Branch ID from GetEmpDtls:', employeeBranchId);

    if (!employeeBranchId) {
      console.log('Branch ID is empty or undefined');
      return res.status(400).json({ 
        success: false, 
        message: "Employee branch information not available" 
      });
    }

    // Now call the holiday API with the branch ID - ensure proper URL encoding
    const holidayApiUrl = `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetHolidayRpt?Branch=${encodeURIComponent(employeeBranchId)}&FinYear=${encodeURIComponent(ls_FinYear)}`;
    console.log('Calling Holiday API with URL:', holidayApiUrl);

    const holidayResponse = await axios.get(holidayApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('Holiday API response:', JSON.stringify(holidayResponse.data, null, 2));

    const { l_ClsErrorStatus, lst_ClsHolidayRptDtls = [] } = holidayResponse.data;

    if (l_ClsErrorStatus?.ls_Status !== "S") {
      console.log('Holiday API error status:', l_ClsErrorStatus);
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch holiday report for this branch/year" 
      });
    }

    // Map the holiday data with proper field handling
    const holidayData = lst_ClsHolidayRptDtls.map(item => {
      // Handle different possible field names from the API
      const holidayDate = item.ls_HldDate || item.ls_HolidayDate || item.holidayDate;
      const holidayName = item.ls_Reason || item.ls_HolidayName || item.ls_Description || item.description;
      
      return {
        ls_HldDate: holidayDate,
        ls_Reason: holidayName,
        holidayId: item.ls_HolidayId || item.holidayId,
        holidayName: holidayName,
        holidayDate: holidayDate,
        holidayType: item.ls_HolidayType || item.holidayType || 'Company Holiday',
        description: item.ls_Description || item.description || holidayName,
        branch: item.ls_Branch || item.branch || employeeBranchId,
        finYear: item.ls_FinYear || item.finYear || ls_FinYear,
        dayOfWeek: item.ls_DayOfWeek || item.dayOfWeek,
        isOptional: item.ls_IsOptional || item.isOptional || false,
        category: item.ls_Category || item.category || 'Regular'
      };
    });

    console.log('Processed holiday data:', holidayData);

    return res.json({
      success: true,
      message: `Holiday report fetched successfully for ${ls_FinYear}`,
      holidayData,
      totalHolidays: holidayData.length,
      employeeBranch: employeeBranchId,
      branchName: lst_ClsEmpDtls[0].ls_BrnchName || employeeBranchId
    });

  } catch (err) {
    console.error('Holiday API error:', err.response?.data || err.message);
    
    let errorMessage = "Failed to fetch holiday report";
    
    if (err.code === 'ECONNREFUSED') {
      errorMessage = "Holiday service is currently unavailable";
    } else if (err.code === 'ETIMEDOUT') {
      errorMessage = "Request timeout - holiday service is taking too long to respond";
    } else if (err.response?.status === 404) {
      errorMessage = "Holiday API endpoint not found";
    } else if (err.response?.status === 500) {
      errorMessage = "Holiday service internal error";
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// GET AVAILABLE BRANCHES
router.get('/branches', async (req, res) => {
  try {
    const branches = [
      { value: '01', label: 'Branch 01' },
      { value: '02', label: 'Branch 02' },
      { value: '03', label: 'Branch 03' },
      { value: '04', label: 'Branch 04' },
      { value: '05', label: 'Branch 05' }
    ];

    return res.json({
      success: true,
      message: "Branches fetched successfully",
      branches
    });

  } catch (err) {
    console.error('Branches API error:', err);
    return handleApiError(res, err, "Failed to fetch branches");
  }
});

// GET AVAILABLE FINANCIAL YEARS
router.get('/financial-years', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const financialYears = [
      { value: `FY${currentYear-1}_${(currentYear).toString().slice(-2)}`, label: `FY ${currentYear-1}-${currentYear}` },
      { value: `FY${currentYear}_${(currentYear+1).toString().slice(-2)}`, label: `FY ${currentYear}-${currentYear+1}` },
      { value: `FY${currentYear+1}_${(currentYear+2).toString().slice(-2)}`, label: `FY ${currentYear+1}-${currentYear+2}` }
    ];

    return res.json({
      success: true,
      message: "Financial years fetched successfully",
      financialYears
    });

  } catch (err) {
    console.error('Financial years API error:', err);
    return handleApiError(res, err, "Failed to fetch financial years");
  }
});

module.exports = router;