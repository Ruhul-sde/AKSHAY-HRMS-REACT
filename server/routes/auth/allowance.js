
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
      if (!entry.ls_EXTYPE) {
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
      if (!entry.ls_APLYDATE) {
        return res.status(400).json({ 
          success: false, 
          message: `Date is required for entry ${i + 1}` 
        });
      }
    }

    console.log('Incoming /allowance-apply request:', { ls_MONTH, entriesCount: lst_ClsAllowenceApplyDtl.length });

    // Process entries to match API format
    const processedEntries = lst_ClsAllowenceApplyDtl.map((entry, index) => {
      let fileDetails = null;
      
      // Process files if they exist
      if (entry.lst_ClsAllowenceFileDtl && entry.lst_ClsAllowenceFileDtl.length > 0) {
        fileDetails = entry.lst_ClsAllowenceFileDtl.map(fileRef => {
          // Find the uploaded file by the reference key
          const uploadedFile = req.files ? req.files.find(f => f.fieldname === fileRef.ls_FILEPATH) : null;
          
          if (uploadedFile) {
            // Use the uploaded file's path
            return {
              ls_FILEPATH: uploadedFile.path || uploadedFile.filename,
              ls_REMARKS: fileRef.ls_REMARKS || entry.ls_REMARKS || 'File attachment'
            };
          } else {
            // Fallback to default path if no file uploaded
            return {
              ls_FILEPATH: `D:\\Allowence\\${entry.ls_EXTYPE}\\sample.pdf`,
              ls_REMARKS: fileRef.ls_REMARKS || entry.ls_REMARKS || 'File attachment'
            };
          }
        });
      }

      return {
        li_LineId: parseInt(entry.li_LineId) || (index + 1),
        ls_EMPCODE: entry.ls_EMPCODE?.toString() || '',
        ls_EXTYPE: entry.ls_EXTYPE || '',
        ls_APLYDATE: entry.ls_APLYDATE || '',
        ld_AMT: parseFloat(entry.ld_AMT) || 0,
        ls_REMARKS: entry.ls_REMARKS || '',
        lst_ClsAllowenceFileDtl: fileDetails
      };
    });

    // Format the payload to match the API requirements exactly
    const payload = {
      ls_MONTH,
      lst_ClsAllowenceApplyDtl: processedEntries
    };

    // Log the payload being sent to the real API
    console.log('Backend Allowance Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(`${BASE_URL}/AllowenceApply`, payload, axiosConfig);
    
    // Log the response from the real API
    console.log('Allowance API Response:', JSON.stringify(response.data, null, 2));
    
    const { data } = response;
    
    // Check if the response indicates success
    if (data && data.l_ClsErrorStatus?.ls_Status === "S") {
      return res.json({ 
        success: true, 
        message: data.l_ClsErrorStatus.ls_Message || "Allowance applied successfully", 
        data: data 
      });
    } else {
      // API returned an error status
      console.error('Allowance API Error Response:', data);
      return res.status(400).json({ 
        success: false, 
        message: data?.l_ClsErrorStatus?.ls_Message || "Allowance application failed - please check your details and try again",
        apiResponse: data
      });
    }
  } catch (err) {
    // Log the error details
    console.error('Allowance Application Error:', err.response?.data || err.message);
    
    // If there's a response from the API with error details
    if (err.response?.data) {
      return res.status(400).json({
        success: false,
        message: err.response.data.l_ClsErrorStatus?.ls_Message || err.response.data.message || "Allowance application failed",
        error: err.response.data
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
