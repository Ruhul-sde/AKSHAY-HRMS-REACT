
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  Clock, 
  Briefcase, 
  Building2, 
  FileText, 
  History, 
  BarChart3, 
  Banknote, 
  Lock,
  Calendar,
  Mail,
  Phone,
  User,
  MapPin,
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const Dashboard = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set greeting based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [currentTime]);

  // Format date to "DD-MM-YYYY" from "DD-MM-YYYY HH:mm:ss"
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dateStr.split(' ')[0]; // Strip time
  };

  // Get profile picture URL - fallback to default if not available
  const getProfilePicture = () => {
    if (userData?.ls_EMPCODE) {
      return `http://localhost:5000/api/employee-image/${userData.ls_EMPCODE}`;
    }
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const quickActions = [
    { icon: FileText, label: 'Apply for Leave', path: '/apply-leave', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { icon: History, label: 'Leave History', path: '/leave-history', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
    // { icon: BarChart3, label: 'Attendance Report', path: '/attendance-report', color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
    { icon: Banknote, label: 'Apply for Loan', path: '/apply-loan', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
    { icon: Lock, label: 'Change Password', path: '/change-password', color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      <Navbar setUserData={setUserData} userData={userData} />

      <motion.main 
        className="p-4 sm:p-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Welcome Section */}
        <motion.div 
          variants={cardVariants}
          className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl overflow-hidden"
        >
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-10 -mb-10"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {greeting}, {userData?.ls_EMPNAME?.split(' ')[0] || 'Employee'}!
                  </h2>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-blue-100 text-sm sm:text-base"
                >
                  Welcome to your personalized HR dashboard
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-right"
              >
                <div className="text-lg font-semibold">
                  {currentTime.toLocaleDateString('en-GB')}
                </div>
                <div className="text-blue-200 text-sm">
                  {currentTime.toLocaleTimeString('en-GB', { 
                    hour12: true, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={cardVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
        >
          <StatsCard 
            icon={UserCircle} 
            label="Employee ID" 
            value={userData?.ls_EMPCODE} 
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatsCard 
            icon={Building2} 
            label="Department" 
            value={userData?.ls_Department} 
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatsCard 
            icon={Briefcase} 
            label="Designation" 
            value={userData?.ls_Designation || 'Not Assigned'} 
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatsCard 
            icon={Calendar} 
            label="Joining Date" 
            value={formatDate(userData?.ls_JoinDate)} 
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Enhanced Profile Card */}
          <motion.div 
            variants={cardVariants}
            className="xl:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Employee Profile</h3>
                <p className="text-gray-500">Your personal information</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Image */}
              <motion.div 
                className="flex-shrink-0 text-center lg:text-left"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative inline-block">
                  <img
                    src={getProfilePicture()}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Profile Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileDetail icon={User} label="Full Name" value={userData?.ls_EMPNAME} />
                <ProfileDetail icon={Mail} label="Email" value={userData?.ls_Email} />
                <ProfileDetail icon={Phone} label="Mobile" value={userData?.ls_Mobile} />
                <ProfileDetail icon={Calendar} label="Date of Birth" value={formatDate(userData?.ls_BirthDate)} />
                <ProfileDetail icon={Activity} label="Gender" value={userData?.ls_Gender} />
                <ProfileDetail icon={TrendingUp} label="Employee Type" value={userData?.ls_EMPTYPE} />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Quick Actions */}
          <motion.div 
            variants={cardVariants}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Quick Actions</h3>
                <p className="text-gray-500">Frequently used features</p>
              </div>
            </div>

            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`w-full group flex items-center gap-4 p-4 rounded-xl ${action.bg} hover:bg-opacity-80 transition-all duration-200 border border-transparent hover:border-gray-200`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className={`p-2 bg-gradient-to-r ${action.color} rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-gray-900 flex-1 text-left">
                    {action.label}
                  </span>
                  <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all">
                    →
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <motion.div 
    className={`${bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer`}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-xl group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  </motion.div>
);

// Enhanced Profile Detail Component
const ProfileDetail = ({ icon: Icon, label, value }) => (
  <motion.div 
    className="group p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center gap-3 mb-2">
      <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
    <p className="text-gray-800 font-semibold ml-7">{value || 'N/A'}</p>
  </motion.div>
);

export default Dashboard;
