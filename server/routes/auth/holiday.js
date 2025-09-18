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
        message: `Employee API error: ${empErrorStatus?.ls_Message || 'Unknown error'}` 
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
        message: "Employee branch ID not found in employee details" 
      });
    }

    // Now call the holiday API with the branch ID
    const holidayApiUrl = `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetHolidayRpt?Branch=${employeeBranchId}&FinYear=${ls_FinYear}`;
    console.log('Calling Holiday API with URL:', holidayApiUrl);

    const { data } = await axios.get(holidayApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Holiday API response:', JSON.stringify(data, null, 2));

    const { l_ClsErrorStatus, lst_ClsHolidayRptDtls = [] } = data;

    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch holiday report" 
      });
    }

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
      totalHolidays: holidayData.length,
      employeeBranch: employeeBranchId
    });

  } catch (err) {
    console.error('Holiday API error:', err.response?.data || err.message);
    return handleApiError(res, err, "Failed to fetch holiday report");
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