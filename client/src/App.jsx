import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaveApply from './pages/LeaveApply';
import ChangePassword from './pages/ChangePassword';
import LeaveHistory from './pages/LeaveHistory';
import PendingLeaves from './pages/PendingLeaves';
import LoanApply from './pages/LoanApply';
import AttendanceReport from './pages/AttendanceReport';
import Help from './pages/Help';

const RequireAuth = ({ user, children }) => {
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  const [userData, setUserData] = useState(null);

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
            <Login setUserData={setUserData} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuth user={userData}>
            <Dashboard userData={userData} setUserData={setUserData} />
          </RequireAuth>
        }
      />

      <Route
        path="/apply-leave"
        element={
          <RequireAuth user={userData}>
            <LeaveApply userData={userData} setUserData={setUserData} />
          </RequireAuth>
        }
      />

      <Route
        path="/change-password"
        element={
          <RequireAuth user={userData}>
            <ChangePassword userData={userData} setUserData={setUserData} />
          </RequireAuth>
        }
      />

      <Route
        path="/leave-history"
        element={
          <RequireAuth user={userData}>
            <LeaveHistory userData={userData} setUserData={setUserData} />
          </RequireAuth>
        }
      />

      <Route
        path="/pending-leaves"
        element={
          <RequireAuth user={userData}>
            <PendingLeaves userData={userData} setUserData={setUserData} />
          </RequireAuth>
        }
      />

      <Route
        path="/apply-loan"
        element={
          <RequireAuth user={userData}>
            <LoanApply userData={userData} setUserData={setUserData} />
          </RequireAuth>
        }
      />

      <Route
        path="/reports"
        element={
          <RequireAuth user={userData}>
            <AttendanceReport userData={userData} setUserData={setUserData} />
          </RequireAuth>
        }
      />

      <Route
        path="/help"
        element={
          <RequireAuth user={userData}>
            <Help userData={userData} setUserData={setUserData} />
          </RequireAuth>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to={userData ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default App;
