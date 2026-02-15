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
import ManualAttendance from './pages/ManualAttendance';
import LeaveReport from './pages/reports/Leave Report';
import PayStructureReport from './pages/reports/Pay Structure Report';
import AnnualSummaryReport from './pages/reports/Annual Summary Report';
import LoanReport from './pages/reports/Loan Report';
import FulNFinalReport from './pages/reports/FullFinalReport';
import EmployeeDetailsReport from './pages/reports/Employee Details Report';
import OutDuty from './pages/OutDuty';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HolidayMaster from './pages/HolidayMaster';
import SalarySlip from './pages/reports/SalarySlip';

const RequireAuth = ({ user, children }) => {
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  const [userData, setUserData] = useState(null);

  const API_BASE = '/api';

  // Simple fetch wrapper
  const apiFetch = async (path, options = {}) => {
    const url = `${API_BASE}${path}`;
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        if (!res.ok) throw new Error(text || res.statusText);
        return text;
      }
    } catch (err) {
      throw new Error(`apiFetch error (${url}): ${err.message}`);
    }
  };

  // Load user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Persist user session
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

      <Route
        path="/pending-leaves"
        element={
          <RequireAuth user={userData}>
            <PendingLeaves userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

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
        path="/attendance"
        element={
          <RequireAuth user={userData}>
            <Attendance userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      <Route
        path="/attendance-post"
        element={
          <RequireAuth user={userData}>
            <ManualAttendance userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
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
        path="/salary-slip"
        element={
          <RequireAuth user={userData}>
            <SalarySlip userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
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

      <Route
        path="/fulnfinal-report"
        element={
          <RequireAuth user={userData}>
            <FulNFinalReport userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
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

      <Route
        path="/help"
        element={
          <RequireAuth user={userData}>
            <Help userData={userData} setUserData={setUserData} apiFetch={apiFetch} />
          </RequireAuth>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={userData ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
}

export default App;
