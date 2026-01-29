import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaveApply from './pages/LeaveApply';
import ChangePassword from './pages/ChangePassword';
import LeaveHistory from './pages/LeaveHistory';
import PendingLeaves from './pages/PendingLeaves';
import LoanApply from './pages/LoanApply';
import MonthlyAttendanceReport from './pages/MonthlyAttendanceReport';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Allowance from './pages/Allowance';
import Attendance from './pages/Attendance';
import LeaveReport from './pages/reports/Leave Report';
import PayStructureReport from './pages/reports/Pay Structure Report';
import AnnualSummaryReport from './pages/reports/Annual Summary Report';
import LoanReport from './pages/reports/Loan Report';
import RAWAttendanceReport from './pages/reports/RAWAttendanceReport';
import EmployeeDetailsReport from './pages/reports/Employee Details Report';
import OutDuty from './pages/OutDuty';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HolidayMaster from './pages/HolidayMaster';
import SalarySlip from './pages/SalarySlip';


const RequireAuth = ({ user, children }) => {
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  const [userData, setUserData] = useState(null);

  // Direct (no env) API base — use relative path so it works from other devices
  // (IIS will proxy /api -> node backend). If you prefer absolute, replace '/api' with 'http://49.249.199.62:85'
  const API_BASE = '/api';

  // Simple fetch wrapper that always targets the server (no env usage)
  const apiFetch = async (path, options = {}) => {
    const url = `${API_BASE}${path}`;
    try {
      const res = await fetch(url, options);
      // if caller expects raw Response they can handle it; here we try JSON by default
      const text = await res.text();
      // if response is JSON-like parse it, else return text
      try {
        return JSON.parse(text);
      } catch {
        // not JSON, return text or original response depending on status
        if (!res.ok) throw new Error(text || res.statusText);
        return text;
      }
    } catch (err) {
      // bubble up a descriptive error
      throw new Error(`apiFetch error (${url}): ${err.message}`);
    }
  };

  // On mount, load user data from sessionStorage (expires when browser closes)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Persist user data to sessionStorage whenever it changes
  useEffect(() => {
    if (userData) {
      sessionStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('empCode', userData?.ls_EMPCODE || '');
    } else {
      sessionStorage.removeItem('userData');
      localStorage.removeItem('empCode');
    }
  }, [userData]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData ? (
            <Navigate to="/dashboard" replace />
          ) : (
            // pass apiFetch so Login can call backend via the correct base
            <Login setUserData={setUserData} apiFetch={apiFetch} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuth user={userData}>
            <Dashboard userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/apply-leave"
        element={
          <RequireAuth user={userData}>
            <LeaveApply userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/change-password"
        element={
          <RequireAuth user={userData}>
            <ChangePassword userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/leave-history"
        element={
          <RequireAuth user={userData}>
            <LeaveHistory userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      {/* <Route
        path="/pending-leaves"
        element={
          <RequireAuth user={userData}>
            <PendingLeaves userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      /> */}

      <Route
        path="/apply-loan"
        element={
          <RequireAuth user={userData}>
            <LoanApply userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/monthly-attendance-report"
        element={
          <RequireAuth user={userData}>
            <MonthlyAttendanceReport userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/help"
        element={
          <RequireAuth user={userData}>
            <Help userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/attendance"
        element={
          <RequireAuth user={userData}>
            <Attendance userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />
      <Route
  path="/salary-slip"
  element={
    <RequireAuth user={userData}>
      <SalarySlip
        userData={userData}
        setUserData={setUserData}
        apiFetch={apiFetch}
      />
    </RequireAuth>
  }
/>


      <Route
        path="/profile"
        element={
          <RequireAuth user={userData}>
            <Profile userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/allowance"
        element={
          <RequireAuth user={userData}>
            <Allowance userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/leave-report"
        element={
          <RequireAuth user={userData}>
            <LeaveReport userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/pay-structure-report"
        element={
          <RequireAuth user={userData}>
            <PayStructureReport userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/annual-summary-report"
        element={
          <RequireAuth user={userData}>
            <AnnualSummaryReport userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      {/* <Route
        path="/loan-report"
        element={
          <RequireAuth user={userData}>
            <LoanReport userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      /> */}

      <Route
        path="/fulnfinal-report"
        element={
          <RequireAuth user={userData}>
            <RAWAttendanceReport userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/employee-details-report"
        element={
          <RequireAuth user={userData}>
            <EmployeeDetailsReport userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/out-duty"
        element={
          <RequireAuth user={userData}>
            <OutDuty userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/settings"
        element={
          <RequireAuth user={userData}>
            <Settings userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/privacy-policy"
        element={
          <RequireAuth user={userData}>
            <PrivacyPolicy userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/terms-of-service"
        element={
          <RequireAuth user={userData}>
            <TermsOfService userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/holiday-master"
        element={
          <RequireAuth user={userData}>
            <HolidayMaster userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to={userData ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default App;
