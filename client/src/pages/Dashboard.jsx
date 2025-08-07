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
  CheckCircle,
  Navigation,
  AlertCircle,
  Loader,
  MessageSquare,
  Timer,
  Users,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import api from '../api';
import Footer from '../components/Footer'; // Assuming Footer component is in ../components/Footer

const Dashboard = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [latestOutDuty, setLatestOutDuty] = useState([]);
  const [outDutyLoading, setOutDutyLoading] = useState(true);

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

  // Fetch latest out-duty data
  useEffect(() => {
    const fetchLatestOutDuty = async () => {
      if (!userData?.ls_EMPCODE) return;

      setOutDutyLoading(true);
      try {
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const response = await api.get(`/latest-out-duty?empCode=${userData.ls_EMPCODE}&date=${currentDate}`);

        if (response.data.success) {
          setLatestOutDuty(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching latest out-duty data:', error);
        setLatestOutDuty([]);
      } finally {
        setOutDutyLoading(false);
      }
    };

    fetchLatestOutDuty();
  }, [userData]);

  // Enhanced time formatting
  const formatTime = (date) => {
    return {
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      }),
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      shortDate: date.toLocaleDateString('en-GB'),
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  // Format date from API response
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dateStr.split(' ')[0];
  };

  // Format time from API response (HHMM to HH:MM AM/PM)
  const formatApiTime = (timeStr) => {
    if (!timeStr || timeStr.length !== 4) return timeStr;
    const hours = parseInt(timeStr.substring(0, 2));
    const minutes = timeStr.substring(2);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHour}:${minutes} ${period}`;
  };

  const timeData = formatTime(currentTime);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const quickActions = [
    { icon: FileText, label: 'Apply for Leave', path: '/apply-leave', color: 'from-blue-500 to-blue-600', bg: 'bg-gradient-to-br from-blue-50 to-blue-100', shadow: 'shadow-blue-200' },
    { icon: History, label: 'Leave History', path: '/leave-history', color: 'from-purple-500 to-purple-600', bg: 'bg-gradient-to-br from-purple-50 to-purple-100', shadow: 'shadow-purple-200' },
    { icon: MapPin, label: 'Out-Duty Tracking', path: '/out-duty', color: 'from-green-500 to-green-600', bg: 'bg-gradient-to-br from-green-50 to-green-100', shadow: 'shadow-green-200' },
    { icon: Banknote, label: 'Apply for Loan', path: '/apply-loan', color: 'from-orange-500 to-orange-600', bg: 'bg-gradient-to-br from-orange-50 to-orange-100', shadow: 'shadow-orange-200' },
    { icon: Lock, label: 'Change Password', path: '/change-password', color: 'from-red-500 to-red-600', bg: 'bg-gradient-to-br from-red-50 to-red-100', shadow: 'shadow-red-200' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans">
      <Navbar setUserData={setUserData} userData={userData} />

      <motion.main 
        className="p-3 sm:p-4 lg:p-5 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Welcome Section with improved time display */}
        <motion.div 
          variants={cardVariants}
          className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white rounded-2xl p-4 sm:p-5 lg:p-6 mb-6 shadow-xl overflow-hidden"
        >
          {/* Enhanced Background Decorations */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-14 -mt-14"></div>
          <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/10 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {greeting}, {userData?.ls_EMPNAME?.split(' ')[0] || 'Employee'}!
                  </h2>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-blue-100 text-sm sm:text-base font-medium"
                >
                  Welcome to your personalized HR dashboard
                </motion.p>
              </div>

              {/* Enhanced Time Display */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Timer className="w-4 h-4 text-yellow-300" />
                    <span className="text-blue-100 text-xs font-medium">Current Time</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold mb-1">
                    {timeData.time}
                  </div>
                  <div className="text-blue-200 text-xs">
                    {timeData.date}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          variants={cardVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
        >
          <StatsCard 
            icon={UserCircle} 
            label="Employee ID" 
            value={userData?.ls_EMPCODE} 
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
            shadowColor="shadow-blue-200"
          />
          <StatsCard 
            icon={Building2} 
            label="Department" 
            value={userData?.ls_Department} 
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
            shadowColor="shadow-purple-200"
          />
          <StatsCard 
            icon={Briefcase} 
            label="Designation" 
            value={userData?.ls_Designation || 'Not Assigned'} 
            color="text-green-600"
            bgColor="bg-gradient-to-br from-green-50 to-green-100"
            shadowColor="shadow-green-200"
          />
          <StatsCard 
            icon={Calendar} 
            label="Joining Date" 
            value={formatDate(userData?.ls_JoinDate)} 
            color="text-orange-600"
            bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
            shadowColor="shadow-orange-200"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Enhanced Latest Out-Duty Card */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-1 xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Latest Out-Duty Activity</h3>
                <p className="text-sm text-gray-500 font-medium">Your recent client visits and locations</p>
              </div>
            </div>

            {outDutyLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                  <span className="text-sm text-gray-600 font-medium">Loading out-duty data...</span>
                </div>
              </div>
            ) : latestOutDuty.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {latestOutDuty.map((duty, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-blue-50 via-white to-green-50 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg shadow-md ${duty.ls_Type === 'I' ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`}>
                          {duty.ls_Type === 'I' ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Clock className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          duty.ls_Type === 'I' 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                            : 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800'
                        }`}>
                          {duty.ls_Type === 'I' ? 'Check In' : 'Check Out'}
                        </span>
                      </div>
                      <div className="text-right bg-gray-50 p-2 rounded-lg">
                        <p className="text-xs font-bold text-gray-800">{duty.ls_Date}</p>
                        <p className="text-xs text-gray-600 font-medium">{formatApiTime(duty.ls_Time)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <OutDutyDetail icon={Building2} label="Client" value={duty.ls_ClientNm} />
                      <OutDutyDetail icon={MapPin} label="Location" value={duty.ls_Location} />
                      <OutDutyDetail icon={FileText} label="Reason" value={duty.ls_ReasonVisit} />
                      <OutDutyDetail icon={MessageSquare} label="Manual Location" value={duty.ls_LocManual} />
                    </div>

                    {duty.ls_Remark && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-700 font-medium">
                          <span className="font-bold text-gray-800">Remarks:</span> {duty.ls_Remark}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-4 shadow-inner">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">No Out-Duty Records</h4>
                <p className="text-sm text-gray-500 mb-4 max-w-md">You haven't recorded any out-duty activities today. Start tracking your client visits now!</p>
                <motion.button
                  onClick={() => navigate('/out-duty')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Out-Duty Tracking
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Enhanced Quick Actions */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-1 xl:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Quick Actions</h3>
                <p className="text-sm text-gray-500 font-medium">Frequently used features</p>
              </div>
            </div>

            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`w-full group flex items-center gap-3 p-3 rounded-xl ${action.bg} hover:bg-opacity-80 transition-all duration-300 border border-transparent hover:border-gray-200 ${action.shadow} hover:shadow-lg`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className={`p-2 bg-gradient-to-r ${action.color} rounded-lg text-white group-hover:scale-110 transition-transform shadow-md`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-gray-900 flex-1 text-left text-sm">
                    {action.label}
                  </span>
                  <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all text-sm">
                    →
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>


      </motion.main>
      <Footer />
    </div>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, bgColor, shadowColor }) => (
  <motion.div 
    className={`${bgColor} p-4 rounded-xl shadow-lg hover:shadow-xl ${shadowColor} transition-all duration-300 border border-gray-100 group cursor-pointer`}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg group-hover:scale-110 transition-transform shadow-md`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 font-semibold mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-800 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  </motion.div>
);

// Enhanced Out-Duty Detail Component
const OutDutyDetail = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100">
    <div className="p-1.5 bg-gray-50 rounded">
      <Icon className="w-3 h-3 text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-xs font-semibold text-gray-800 mt-0.5">{value || 'N/A'}</p>
    </div>
  </div>
);

export default Dashboard;