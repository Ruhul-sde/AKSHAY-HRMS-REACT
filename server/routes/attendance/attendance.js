const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('../auth/utils');
const router = express.Router();

// GET ATTENDANCE
router.get('/attendance', async (req, res) => {
  const { ls_EmpCode, ls_Month } = req.query;
  console.log('Attendance API - Received params:', { ls_EmpCode, ls_Month });
  if (!ls_EmpCode || !ls_Month) {
    return res.status(400).json({ success: false, message: "EMPCode and Month are required." });
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/GetAttendanceRpt?Month=${ls_Month}&EMPCode=${ls_EmpCode}`);
    const { l_ClsErrorStatus, lst_ClsAttndncRptDtls = [] } = data;
    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch attendance report" 
      });
    }
    const attendanceData = lst_ClsAttndncRptDtls.map(item => ({
      empCode: item.ls_EmpCode,
      empName: item.ls_EmpName,
      dayType: item.ls_DayType,
      lateMark: item.ls_LateMark,
      manInDate: item.ls_ManInDt,
      manInTime: item.ls_ManInTm,
      manOutDate: item.ls_ManOutDt,
      manOutTime: item.ls_ManOutTm,
      manTotalTime: item.ls_ManTotTm,
      sysInDate: item.ls_SysInDt,
      sysInTime: item.ls_SysInTm,
      sysOutDate: item.ls_SysOutDt,
      sysOutTime: item.ls_SysOutTm,
      sysTotalTime: item.ls_SysTotTm
    }));
    return res.json({
      success: true,
      message: "Attendance report fetched successfully",
      attendanceData
    });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch attendance report");
  }
});

module.exports = router;