const express = require('express');
const axios = require('axios');
const { BASE_URL, handleApiError } = require('../auth/utils');
const router = express.Router();

// GET PENDING LEAVE / LEAVE BALANCE REPORT
router.get('/pending-leave', async (req, res) => {
  const { ls_EmpCode, ls_Date } = req.query;
  
  console.log('Pending Leave API - Received params:', { ls_EmpCode, ls_Date });
  
  if (!ls_EmpCode || !ls_Date) {
    return res.status(400).json({ 
      success: false, 
      message: "EMPCode and Date are required." 
    });
  }

  try {
    // API Expects Date usually in YYYYMMDD format based on your previous examples
    const { data } = await axios.get(
      `${BASE_URL}/GetPendingLeave?EMPCode=${ls_EmpCode}&Date=${ls_Date}`
    );
    
    // Check for array existence in the response
    const rawData = data.lst_ClsPendingLeavDtls || [];
    
    // Map Hungarian notation to clean CamelCase for frontend
    const leaveData = rawData.map(item => ({
      leaveName: item.ls_LeavName,
      leaveType: item.ls_LeavTyp, // e.g., CL, PL, LWP
      openingBalance: parseFloat(item.ls_OpenLeav) || 0,
      used: parseFloat(item.ls_UsedLeav) || 0,
      pending: parseFloat(item.ls_PendLeav) || 0,
      rejected: parseFloat(item.ls_RejLeav) || 0,
      closingBalance: parseFloat(item.ls_CloseLeav) || 0
    }));

    // Calculate total stats for the summary header
    const stats = {
      totalOpening: leaveData.reduce((acc, curr) => acc + curr.openingBalance, 0),
      totalClosing: leaveData.reduce((acc, curr) => acc + curr.closingBalance, 0),
      totalPending: leaveData.reduce((acc, curr) => acc + curr.pending, 0)
    };

    return res.json({
      success: true,
      message: "Pending leave report fetched successfully",
      leaveData,
      stats
    });

  } catch (err) {
    return handleApiError(res, err, "Failed to fetch pending leave report");
  }
});

module.exports = router;