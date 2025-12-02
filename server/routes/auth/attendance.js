const express = require('express');
const axios = require('axios');
const { BASE_URL, axiosConfig, handleApiError } = require('./utils');
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

// GET MONTHLY ATTENDANCE REPORT
router.get('/monthly-attendance', async (req, res) => {
  const { ls_FromDate, ls_ToDate, ls_EmpCode } = req.query;
  console.log('Monthly Attendance API - Received params:', { ls_FromDate, ls_ToDate, ls_EmpCode });
  
  if (!ls_FromDate || !ls_ToDate || !ls_EmpCode) {
    return res.status(400).json({ 
      success: false, 
      message: "FromDate, ToDate, and EMPCode are required." 
    });
  }

  try {
    const { data } = await axios.get(
      `${BASE_URL}/GetMnthlyAttndRpt?FromDate=${ls_FromDate}&ToDate=${ls_ToDate}&EMPCode=${ls_EmpCode}`
    );
    
    const { l_ClsErrorStatus, lst_ClsMnthlyAttndncRptDtls = [] } = data;
    
    if (l_ClsErrorStatus?.ls_Status !== "S") {
      return res.status(400).json({ 
        success: false, 
        message: l_ClsErrorStatus?.ls_Message || "Failed to fetch monthly attendance report" 
      });
    }

    const attendanceData = lst_ClsMnthlyAttndncRptDtls.map(item => ({
      empCode: item.ls_EmpCode,
      empName: item.ls_EmpName,
      empType: item.ls_EmpType,
      department: item.ls_Department,
      bplId: item.ls_BPLID,
      bplName: item.ls_BPLNAME,
      workDate: item.ls_WorkDate,
      dayName: item.ls_DayName,
      weekDay: item.ls_WeekDay,
      leaveType: item.ls_LeaveType || '',
      inTime: item.ls_InTm || '',
      outTime: item.ls_OutTm || '',
      totalHours: item.ls_Tothrs || '0',
      lateMark: item.ls_LateMark || '',
      attendanceStatus: item.ls_AttndStatus || ''
    }));

    return res.json({
      success: true,
      message: "Monthly attendance report fetched successfully",
      attendanceData
    });
  } catch (err) {
    return handleApiError(res, err, "Failed to fetch monthly attendance report");
  }
});

module.exports = router; 