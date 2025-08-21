
const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');

const router = express.Router();

// GET ALLOWANCE TYPES
router.get('/allowance-types', async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/GetAllowenceTypes`, axiosConfig);
    const { l_ClsErrorStatus, lst_ClsMstrAllowenceTypDtls = [] } = data;
    
    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch allowance types" 
      });
    }
    
    const allowanceTypes = lst_ClsMstrAllowenceTypDtls.map(item => ({
      code: item.ls_CODE,
      name: item.ls_NAME,
      filePath: item.ls_FinalFilePath
    }));
    
    return res.json({ 
      success: true, 
      message: "Allowance types fetched successfully", 
      allowanceTypes 
    });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch allowance types");
  }
});

// APPLY ALLOWANCE
router.post('/allowance-apply', async (req, res) => {
  try {
    const { ls_MONTH, lst_ClsAllowenceApplyDtl } = req.body;
    
    if (!ls_MONTH || !lst_ClsAllowenceApplyDtl || !Array.isArray(lst_ClsAllowenceApplyDtl)) {
      return res.status(400).json({ 
        success: false, 
        message: "Month and allowance details are required" 
      });
    }
    
    const payload = {
      ls_MONTH,
      lst_ClsAllowenceApplyDtl
    };
    
    const { data } = await axios.post(`${BASE_URL}/AllowenceApply`, payload, axiosConfig);
    
    if (data?.l_ClsErrorStatus?.ls_Status === "S") {
      return res.json({ 
        success: true, 
        message: data.l_ClsErrorStatus.ls_Message || "Allowance applied successfully",
        data: data
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: data?.l_ClsErrorStatus?.ls_Message || "Failed to apply allowance" 
      });
    }
  } catch (err) {
    return handleApiError(res, err, "Failed to apply allowance");
  }
});

// DELETE ALLOWANCE
router.post('/allowance-delete', async (req, res) => {
  try {
    const { ls_DocEntry } = req.body;
    
    if (!ls_DocEntry) {
      return res.status(400).json({ 
        success: false, 
        message: "Document entry is required" 
      });
    }
    
    const payload = { ls_DocEntry };
    
    const { data } = await axios.post(`${BASE_URL}/AllowenceDelete`, payload, axiosConfig);
    
    if (data?.l_ClsErrorStatus?.ls_Status === "S") {
      return res.json({ 
        success: true, 
        message: data.l_ClsErrorStatus.ls_Message || "Allowance deleted successfully",
        data: data
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: data?.l_ClsErrorStatus?.ls_Message || "Failed to delete allowance" 
      });
    }
  } catch (err) {
    return handleApiError(res, err, "Failed to delete allowance");
  }
});

module.exports = router;
