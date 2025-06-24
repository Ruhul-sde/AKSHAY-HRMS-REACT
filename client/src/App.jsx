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

const RequireAuth = ({ user, children }) => {
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  const [userData, setUserData] = useState(null);

  // On mount, load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Persist user data to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('empCode', userData?.ls_EMPCODE || '');
    } else {
      localStorage.removeItem('userData');
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
            <LeaveApply userData={userData} />
          </RequireAuth>
        }
      />

      <Route
        path="/change-password"
        element={
          <RequireAuth user={userData}>
            <ChangePassword userData={userData} />
          </RequireAuth>
        }
      />

      <Route
        path="/leave-history"
        element={
          <RequireAuth user={userData}>
            <LeaveHistory userData={userData} />
          </RequireAuth>
        }
      />

      <Route
        path="/pending-leaves"
        element={
          <RequireAuth user={userData}>
            <PendingLeaves userData={userData} />
          </RequireAuth>
        }
      />

      <Route
        path="/apply-loan"
        element={
          <RequireAuth user={userData}>
            <LoanApply userData={userData} />
          </RequireAuth>
        }
      />

      <Route
        path="/attendance-report"
        element={
          <RequireAuth user={userData}>
            <AttendanceReport userData={userData} />
          </RequireAuth>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to={userData ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default App;
