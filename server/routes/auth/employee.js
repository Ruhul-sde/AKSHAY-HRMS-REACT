const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// EMPLOYEE IMAGE
router.get('/employee-image', async (req, res) => {
  const { imagePath } = req.query;
  if (!imagePath) {
    return res.status(400).json({ success: false, message: "Image path is required" });
  }
  // Construct the absolute path to the image
  const absoluteImagePath = imagePath;  // Assuming the path is already absolute
  // Check if the file exists
  if (!fs.existsSync(absoluteImagePath)) {
    return res.status(404).json({ success: false, message: "Image not found" });
  }
  // Send the image file
  res.sendFile(absoluteImagePath);
});

module.exports = router; 