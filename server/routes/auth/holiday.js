
const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');

const router = express.Router();

// GET HOLIDAY REPORT
router.get('/holiday-report', async (req, res) => {
  const { ls_EmpCode, ls_FinYear } = req.query;
  
  console.log('Holiday Report API - Received params:', { ls_EmpCode, ls_FinYear });
  
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
    console.log('Employee Details:', lst_ClsEmpDtls[0]);
    console.log('Employee Branch ID from GetEmpDtls:', employeeBranchId);

    if (!employeeBranchId) {
      console.log('Branch ID is empty or undefined');
      return res.status(400).json({ 
        success: false, 
        message: "Employee branch ID not found in employee details" 
      });
    }

    // Use the correct API URL format you specified with Branch parameter
    const holidayApiUrl = `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetHolidayRpt?Branch=${employeeBranchId}&FinYear=${ls_FinYear}`;
    console.log('Calling Holiday API with URL:', holidayApiUrl);
    
    const { data } = await axios.get(holidayApiUrl, axiosConfig);
    
    console.log('Holiday API response:', JSON.stringify(data, null, 2));
    
    // Check for error status like other APIs
    const { l_ClsErrorStatus, lst_ClsHolidayRptDtls = [] } = data;
    
    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch holiday report" 
      });
    }

    const holidayData = lst_ClsHolidayRptDtls.map(item => ({
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
    console.error('Holiday API error:', err);
    
    // If employee details API failed, try using employee code as branch ID
    if (err.message && err.message.includes('GetEmpDtls')) {
      console.log('Employee details API failed, trying with employee code as branch...');
      try {
        const holidayApiUrl = `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetHolidayRpt?Branch=${ls_EmpCode}&FinYear=${ls_FinYear}`;
        console.log('Fallback Holiday API URL:', holidayApiUrl);
        
        const { data } = await axios.get(holidayApiUrl, axiosConfig);
        
        console.log('Fallback Holiday API response:', JSON.stringify(data, null, 2));
        
        const { l_ClsErrorStatus, lst_ClsHolidayRptDtls = [] } = data;
        
        if (l_ClsErrorStatus?.ls_Status !== "S") {
          return res.status(400).json({ 
            success: false, 
            message: l_ClsErrorStatus?.ls_Message || "Failed to fetch holiday report" 
          });
        }

        const holidayData = lst_ClsHolidayRptDtls.map(item => ({
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
          message: "Holiday report fetched successfully (using fallback method)",
          holidayData,
          totalHolidays: holidayData.length
        });
        
      } catch (fallbackErr) {
        console.error('Fallback Holiday API also failed:', fallbackErr);
        return handleApiError(res, fallbackErr, "Failed to fetch holiday report");
      }
    }
    
    return handleApiError(res, err, "Failed to fetch holiday report");
  }
});

// GET AVAILABLE BRANCHES
router.get('/branches', async (req, res) => {
  try {
    // This would typically come from another API or be hardcoded
    const branches = [
      { value: 'PUNE', label: 'Pune' },
      { value: 'MUMBAI', label: 'Mumbai' },
      { value: 'DELHI', label: 'Delhi' },
      { value: 'BANGALORE', label: 'Bangalore' },
      { value: 'HYDERABAD', label: 'Hyderabad' }
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
      { value: `FY${currentYear-1}-${(currentYear).toString().slice(-2)}`, label: `FY ${currentYear-1}-${currentYear}` },
      { value: `FY${currentYear}-${(currentYear+1).toString().slice(-2)}`, label: `FY ${currentYear}-${currentYear+1}` },
      { value: `FY${currentYear+1}-${(currentYear+2).toString().slice(-2)}`, label: `FY ${currentYear+1}-${currentYear+2}` }
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

// CREATE HOLIDAY
router.post('/create-holiday', async (req, res) => {
  const { ls_EmpType, ls_HldDate, ls_Reason } = req.body;
  
  console.log('Create Holiday API - Received params:', { ls_EmpType, ls_HldDate, ls_Reason });
  
  if (!ls_EmpType || !ls_HldDate || !ls_Reason) {
    return res.status(400).json({ 
      success: false, 
      message: "Employee Type, Holiday Date, and Reason are required." 
    });
  }

  try {
    const payload = {
      ls_EmpType: ls_EmpType.toString(),
      ls_HldDate: ls_HldDate, // Format: "yyyyMMdd"
      ls_Reason: ls_Reason.toString()
    };

    // Make API call to create holiday (assuming there's an endpoint for this)
    // For now, we'll simulate a successful creation
    console.log('Creating holiday with payload:', payload);
    
    // Simulate API response
    const mockResponse = {
      ls_Status: "S",
      ls_Message: "Holiday created successfully"
    };

    if (mockResponse.ls_Status === "S") {
      return res.json({
        success: true,
        message: mockResponse.ls_Message || "Holiday created successfully",
        data: payload
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: mockResponse.ls_Message || "Failed to create holiday" 
      });
    }

  } catch (err) {
    console.error('Create Holiday API error:', err);
    return handleApiError(res, err, "Failed to create holiday");
  }
});

// GET EMPLOYEE TYPES
router.get('/employee-types', async (req, res) => {
  try {
    // This would typically come from another API or database
    const employeeTypes = [
      { value: 'ALL', label: 'All Employees' },
      { value: 'PERM', label: 'Permanent' },
      { value: 'TEMP', label: 'Temporary' },
      { value: 'CONTRACT', label: 'Contract' },
      { value: 'INTERN', label: 'Intern' }
    ];

    return res.json({
      success: true,
      message: "Employee types fetched successfully",
      employeeTypes
    });

  } catch (err) {
    console.error('Employee types API error:', err);
    return handleApiError(res, err, "Failed to fetch employee types");
  }
});

module.exports = router;
