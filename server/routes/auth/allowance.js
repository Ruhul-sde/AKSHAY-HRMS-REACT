
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/allowance');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only specific file types
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents are allowed!'));
    }
  }
});

// GET ALLOWANCE TYPES
router.get('/allowance-types', async (req, res) => {
  try {
    const apiUrl = 'http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetAllowenceTypes';
    const { data } = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
router.post('/allowance-apply', upload.any(), async (req, res) => {
  try {
    let { ls_MONTH, lst_ClsAllowenceApplyDtl } = req.body;
    
    // Parse JSON string if it exists
    if (typeof lst_ClsAllowenceApplyDtl === 'string') {
      lst_ClsAllowenceApplyDtl = JSON.parse(lst_ClsAllowenceApplyDtl);
    }
    
    if (!ls_MONTH) {
      return res.status(400).json({ 
        success: false, 
        message: "Month is required" 
      });
    }

    if (!lst_ClsAllowenceApplyDtl || !Array.isArray(lst_ClsAllowenceApplyDtl) || lst_ClsAllowenceApplyDtl.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one allowance entry is required" 
      });
    }

    // Validate required fields
    for (let i = 0; i < lst_ClsAllowenceApplyDtl.length; i++) {
      const entry = lst_ClsAllowenceApplyDtl[i];
      if (!entry.ls_EXTYPE || entry.ls_EXTYPE.trim() === '') {
        return res.status(400).json({ 
          success: false, 
          message: `Allowance type is required for entry ${i + 1}` 
        });
      }
      if (!entry.ld_AMT || parseFloat(entry.ld_AMT) <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Valid amount is required for entry ${i + 1}` 
        });
      }
      if (!entry.ls_APLYDATE || entry.ls_APLYDATE.trim() === '') {
        return res.status(400).json({ 
          success: false, 
          message: `Date is required for entry ${i + 1}` 
        });
      }
    }

    console.log('Incoming /allowance-apply request:', { 
      ls_MONTH, 
      entriesCount: lst_ClsAllowenceApplyDtl.length,
      hasFiles: req.files ? req.files.length : 0,
      fileFields: req.files ? req.files.map(f => f.fieldname) : []
    });

    // Process entries to match API format
    const processedEntries = lst_ClsAllowenceApplyDtl.map((entry, index) => {
      let fileDetails = [];
      
      // Process files if they exist
      if (entry.lst_ClsAllowenceFileDtl && entry.lst_ClsAllowenceFileDtl.length > 0) {
        entry.lst_ClsAllowenceFileDtl.forEach(fileRef => {
          // Find the uploaded file by the reference key (fieldname from frontend)
          const uploadedFile = req.files ? req.files.find(f => f.fieldname === fileRef.ls_FILEPATH) : null;
          
          if (uploadedFile) {
            // Use the uploaded file's path in the expected format
            fileDetails.push({
              ls_FILEPATH: `D:\\Allowence\\${entry.ls_EXTYPE}\\${uploadedFile.filename}`,
              ls_REMARKS: fileRef.ls_REMARKS || entry.ls_REMARKS || 'File attachment'
            });
          }
        });
      }

      // Ensure all required fields are properly formatted
      const processedEntry = {
        li_LineId: parseInt(entry.li_LineId) || (index + 1),
        ls_EMPCODE: entry.ls_EMPCODE?.toString() || '',
        ls_EXTYPE: entry.ls_EXTYPE?.toString() || '',
        ls_APLYDATE: entry.ls_APLYDATE?.toString() || '',
        ld_AMT: parseFloat(entry.ld_AMT) || 0,
        ls_REMARKS: entry.ls_REMARKS?.toString() || '',
        lst_ClsAllowenceFileDtl: fileDetails
      };

      console.log(`Processed Entry ${index + 1}:`, JSON.stringify(processedEntry, null, 2));
      return processedEntry;
    });

    // Format the payload to match the API requirements exactly
    const payload = {
      ls_MONTH,
      lst_ClsAllowenceApplyDtl: processedEntries
    };

    // Log the payload being sent to the real API
    console.log('Backend Allowance Payload:', JSON.stringify(payload, null, 2));

    // Use the correct API endpoint
    const apiUrl = 'http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/AllowenceApply';
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Log the response from the real API
    console.log('Allowance API Response:', JSON.stringify(response.data, null, 2));
    
    const { data } = response;
    
    // Handle different response formats more robustly
    let isSuccess = false;
    let message = '';
    
    if (data) {
      // Check for different success indicators
      if (data.ls_Status === "S" || data.ls_Status === "Success") {
        isSuccess = true;
        message = data.ls_Message || "Allowance applied successfully";
      } else if (data.l_ClsErrorStatus && data.l_ClsErrorStatus.ls_Status === "S") {
        isSuccess = true;
        message = data.l_ClsErrorStatus.ls_Message || "Allowance applied successfully";
      } else {
        // Get error message from various possible locations
        message = data.ls_Message || 
                 data.l_ClsErrorStatus?.ls_Message || 
                 data.message || 
                 "Allowance application failed - please check your details and try again";
      }
    } else {
      message = "No response data received from API";
    }
    
    if (isSuccess) {
      return res.json({ 
        success: true, 
        message: message, 
        data: data 
      });
    } else {
      // API returned an error status
      console.error('Allowance API Error Response:', data);
      return res.status(400).json({ 
        success: false, 
        message: message,
        apiResponse: data
      });
    }
  } catch (err) {
    // Log the error details
    console.error('Allowance Application Error:', err.response?.data || err.message);
    
    // If there's a response from the API with error details
    if (err.response?.data) {
      const errorData = err.response.data;
      const errorMessage = errorData.ls_Message || 
                          errorData.l_ClsErrorStatus?.ls_Message || 
                          errorData.message || 
                          "Allowance application failed";
      
      return res.status(400).json({
        success: false,
        message: errorMessage,
        error: errorData
      });
    }
    
    return handleApiError(res, err, "Allowance application failed");
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
    
    const apiUrl = 'http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/AllowenceDelete';
    const { data } = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Handle both response formats for delete
    const isSuccess = (data && data.ls_Status === "S") || (data && data.l_ClsErrorStatus?.ls_Status === "S");
    const message = data?.ls_Message || data?.l_ClsErrorStatus?.ls_Message;
    
    if (isSuccess) {
      return res.json({ 
        success: true, 
        message: message || "Allowance deleted successfully",
        data: data
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: message || "Failed to delete allowance" 
      });
    }
  } catch (err) {
    return handleApiError(res, err, "Failed to delete allowance");
  }
});

module.exports = router;
