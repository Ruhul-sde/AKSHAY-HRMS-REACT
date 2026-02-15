const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { BASE_URL, axiosConfig } = require('../auth/utils');

const router = express.Router();

/**
 * =====================================
 * GENERATE SALARY SLIP (WCF)
 * =====================================
 */
router.post('/salary-slip/generate', async (req, res) => {
  const { ls_Month, ls_EmpCode } = req.body;

  if (!ls_Month || !ls_EmpCode) {
    return res.status(400).json({
      success: false,
      message: 'Month and Employee Code are required'
    });
  }

  try {
    const apiResponse = await axios.post(
      `${BASE_URL}/PaySlipGenerate`,
      { ls_Month, ls_EmpCode },
      {
        ...axiosConfig,
        timeout: 300000 // 5 minutes
      }
    );

    const data = apiResponse.data;

    console.log('WCF RESPONSE:', JSON.stringify(data, null, 2));

    // ✅ EXACT MATCH WITH WCF RESPONSE
    if (
      data?.l_ClsErrorStatus?.li_ErrorCode === 0 &&
      typeof data?.ls_Path === 'string'
    ) {
      return res.status(200).json({
        success: true,
        ls_Path: data.ls_Path, // 🔥 MUST BE RETURNED
        message: data.l_ClsErrorStatus.ls_Message
      });
    }

    return res.status(400).json({
      success: false,
      message: data?.l_ClsErrorStatus?.ls_Message || 'PDF not generated'
    });
  } catch (err) {
    console.error('Salary slip generation error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Salary slip generation failed'
    });
  }
});

/**
 * =====================================
 * VIEW SALARY SLIP (DELETE AFTER OPEN)
 * =====================================
 */
router.get('/salary-slip/view', (req, res) => {
  const filePath = decodeURIComponent(req.query.filePath || '');

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).send('PDF file not found');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');

  const stream = fs.createReadStream(filePath);

  stream.pipe(res);

  // 🔥 DELETE AFTER STREAM ENDS
  stream.on('close', () => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete PDF:', err.message);
      } else {
        console.log('PDF deleted after view:', filePath);
      }
    });
  });
});

/**
 * =====================================
 * DOWNLOAD SALARY SLIP (DELETE AFTER DOWNLOAD)
 * =====================================
 */
router.get('/salary-slip/download', (req, res) => {
  const filePath = decodeURIComponent(req.query.filePath || '');

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).send('PDF file not found');
  }

  const fileName = path.basename(filePath);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  // 🔥 DELETE AFTER DOWNLOAD
  stream.on('close', () => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete PDF:', err.message);
      } else {
        console.log('PDF deleted after download:', filePath);
      }
    });
  });
});

module.exports = router;