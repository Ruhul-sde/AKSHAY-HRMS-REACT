import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Clock, Briefcase, Building2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  // Format date to "DD-MM-YYYY" from "DD-MM-YYYY HH:mm:ss"
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dateStr.split(' ')[0]; // Strip time
  };

  // Get profile picture URL - fallback to default if not available
  const getProfilePicture = () => {
    if (userData?.ls_Picture) {
      // If the picture path is already a full URL, use it directly
      if (userData.ls_Picture.startsWith('http')) {
        return userData.ls_Picture;
      }
      // Otherwise, assume it's a relative path from your API
      // Replace this with your actual API base URL or relative path
      return `/api/uploads/${userData.ls_Picture}`;
    }
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white font-sans">
      <Navbar setUserData={setUserData} />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 mb-6 shadow text-center">
          <h2 className="text-3xl font-semibold">
            Welcome, {userData?.ls_EMPNAME || 'Employee'}!
          </h2>
          <p className="text-sm mt-1 opacity-90">Here's your personalized HR dashboard</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <InfoCard icon={<UserCircle />} label="Employee ID" value={userData?.ls_EMPCODE} />
          <InfoCard icon={<Building2 />} label="Department" value={userData?.ls_Department} />
          <InfoCard icon={<Briefcase />} label="Designation" value={userData?.ls_Designation} />
          <InfoCard icon={<Clock />} label="Joining Date" value={formatDate(userData?.ls_JoinDate)} />
        </div>

        {/* Main Section: Profile & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">Employee Profile</h3>
            <div className="flex gap-6">
              <img
                src={getProfilePicture()}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
              <div className="grid grid-cols-2 gap-4 text-sm w-full">
                <LabelValue label="Full Name" value={userData?.ls_EMPNAME} />
                <LabelValue label="Email" value={userData?.ls_Email} />
                <LabelValue label="Mobile" value={userData?.ls_Mobile} />
                <LabelValue label="Date of Birth" value={formatDate(userData?.ls_BirthDate)} />
                <LabelValue label="Gender" value={userData?.ls_Gender} />
                <LabelValue label="Employee Type" value={userData?.ls_EMPTYPE} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <ModernAction label="📝 Apply for Leave" onClick={() => navigate('/apply-leave')} />
              <ModernAction label="📜 Leave History" onClick={() => navigate('/leave-history')} />
              <ModernAction label="🏦 Apply for Loan" onClick={() => navigate('/apply-loan')} />
              <ModernAction label="🔒 Change Password" onClick={() => navigate('/change-password')} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Info Card
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-4">
    <div className="text-blue-600 text-xl">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold text-gray-800 text-lg">{value || 'N/A'}</p>
    </div>
  </div>
);

// Reusable Label & Value display
const LabelValue = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="text-gray-800 font-medium text-sm">{value || 'N/A'}</p>
  </div>
);

// Reusable Quick Action Button
const ModernAction = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-900 px-5 py-3 rounded-xl font-medium shadow-sm border border-blue-200 hover:shadow-md transition-all"
  >
    <span>{label}</span>
    <span className="text-lg">→</span>
  </button>
);

export default Dashboard;