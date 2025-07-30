
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CalendarClock, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingDown,
  RefreshCw,
  User,
  Calendar,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Award,
  Info,
  FileText,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const PendingLeaves = ({ userData, setUserData }) => {
  // State management
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Get date in YYYYMMDD format
  const formatDateForAPI = (dateString) => {
    return dateString.replace(/-/g, '');
  };

  // Filter pending leaves based on search term
  const filteredLeaves = pendingLeaves.filter(leave =>
    leave.leaveName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch pending leaves data
  const fetchPendingLeaves = async (isRefresh = false) => {
    // Validate user data
    if (!userData?.ls_EMPCODE) {
      setError({
        type: 'validation',
        title: 'Authentication Required',
        message: 'Please log in to view your pending leaves.',
        action: 'Refresh the page and log in again.'
      });
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const formattedDate = formatDateForAPI(selectedDate);
      
      console.log('Fetching pending leaves for:', {
        empCode: userData.ls_EMPCODE,
        date: formattedDate
      });

      const response = await axios.get('http://localhost:5000/api/pending-leaves', {
        params: {
          ls_EmpCode: userData.ls_EMPCODE,
          ls_DocDate: formattedDate
        },
        timeout: 30000
      });

      console.log('API Response:', response.data);

      if (response.data?.success) {
        const leavesData = response.data.data?.pendingLeaves || [];
        setPendingLeaves(leavesData);
        setLastUpdated(new Date());
        
        if (leavesData.length === 0) {
          setError({
            type: 'info',
            title: 'No Data Found',
            message: 'No pending leaves found for the selected date.',
            action: 'Try selecting a different date or check if you have any leave applications.'
          });
        }
      } else {
        throw new Error(response.data?.message || 'Failed to fetch pending leaves');
      }

    } catch (err) {
      console.error('Error fetching pending leaves:', err);
      
      let errorInfo = {
        type: 'error',
        title: 'Unable to Load Data'
      };

      if (err.code === 'ECONNABORTED') {
        errorInfo.message = 'Request timeout. The server is taking too long to respond.';
        errorInfo.action = 'Check your internet connection and try again.';
      } else if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;
        
        if (status === 400) {
          errorInfo.message = errorData?.message || 'Invalid request. Please check your inputs.';
          errorInfo.action = 'Try refreshing the page or selecting a different date.';
        } else if (status === 503) {
          errorInfo.message = 'HR system is temporarily unavailable.';
          errorInfo.action = 'Please try again in a few minutes.';
        } else {
          errorInfo.message = errorData?.message || 'Server error occurred.';
          errorInfo.action = 'Please try again later.';
        }
      } else if (err.request) {
        errorInfo.message = 'Unable to connect to the server.';
        errorInfo.action = 'Please check your internet connection.';
      } else {
        errorInfo.message = 'An unexpected error occurred.';
        errorInfo.action = 'Please refresh the page and try again.';
      }

      setError(errorInfo);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPendingLeaves();
  }, [userData, selectedDate]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchPendingLeaves(true);
  };

  // Calculate totals
  const totals = pendingLeaves.reduce((acc, leave) => ({
    open: acc.open + (leave.openLeave || 0),
    used: acc.used + (leave.usedLeave || 0),
    pending: acc.pending + (leave.pendingLeave || 0),
    available: acc.available + (leave.availableLeave || 0)
  }), { open: 0, used: 0, pending: 0, available: 0 });

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

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar setUserData={setUserData} userData={userData} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div 
            className="flex justify-center items-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse mx-auto"></div>
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin absolute top-5 left-1/2 transform -translate-x-1/2" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Loading Pending Leaves</h3>
              <p className="text-gray-600">Fetching your leave information...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Header Section */}
        <motion.div variants={cardVariants} className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <CalendarClock className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Pending Leaves</h1>
                </div>
                <p className="text-blue-100">View and track your leave balance summary</p>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-blue-100">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{userData?.ls_EMPCODE}</span>
                </div>
                {lastUpdated && (
                  <div className="flex items-center gap-2 text-blue-200 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Controls Section */}
        <motion.div variants={cardVariants} className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Filters & Controls</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                />
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-1" />
                  Search Leaves
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by leave type or name..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Refresh Button */}
              <div className="flex items-end">
                <motion.button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              variants={cardVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  {error.type === 'error' && <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />}
                  {error.type === 'info' && <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />}
                  {error.type === 'validation' && <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />}
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{error.title}</h3>
                    <p className="text-gray-600 mb-2">{error.message}</p>
                    {error.action && (
                      <p className="text-sm text-gray-500 bg-white/50 rounded-lg px-3 py-2">
                        💡 {error.action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Summary Cards */}
        {filteredLeaves.length > 0 && (
          <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatsCard 
              icon={Award} 
              label="Total Open" 
              value={totals.open.toFixed(1)} 
              color="text-green-600"
              bgColor="bg-green-50"
              description="days allocated"
            />
            <StatsCard 
              icon={TrendingDown} 
              label="Total Used" 
              value={totals.used.toFixed(1)} 
              color="text-red-600"
              bgColor="bg-red-50"
              description="days consumed"
            />
            <StatsCard 
              icon={Clock} 
              label="Total Pending" 
              value={totals.pending.toFixed(1)} 
              color="text-yellow-600"
              bgColor="bg-yellow-50"
              description="days awaiting approval"
            />
            <StatsCard 
              icon={TrendingUp} 
              label="Available" 
              value={totals.available.toFixed(1)} 
              color="text-blue-600"
              bgColor="bg-blue-50"
              description="days remaining"
            />
          </motion.div>
        )}

        {/* Enhanced Data Table */}
        {filteredLeaves.length > 0 && (
          <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Leave Balance Summary
                </h3>
                <span className="text-gray-600 text-sm bg-white px-3 py-1 rounded-full border">
                  {filteredLeaves.length} of {pendingLeaves.length} records
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Leave Name
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Open
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Used
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Pending
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Available
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLeaves.map((leave, index) => (
                    <motion.tr 
                      key={leave.id || index} 
                      className="hover:bg-blue-50 transition-colors duration-200 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {leave.leaveName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                          {(leave.openLeave || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
                          {(leave.usedLeave || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                          {(leave.pendingLeave || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                          (leave.availableLeave || 0) >= 0 
                            ? 'bg-blue-100 text-blue-800 border-blue-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {(leave.availableLeave || 0).toFixed(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Enhanced Empty State */}
        {!error && filteredLeaves.length === 0 && pendingLeaves.length === 0 && (
          <motion.div variants={cardVariants} className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
              <CalendarClock className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Pending Leaves</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              No pending leave applications found for the selected date. 
              Try selecting a different date or check if you have any leave applications.
            </p>
            <motion.button
              onClick={handleRefresh}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </motion.button>
          </motion.div>
        )}

        {/* No Search Results */}
        {!error && filteredLeaves.length === 0 && pendingLeaves.length > 0 && (
          <motion.div variants={cardVariants} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-12 text-center">
            <Search className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Results</h3>
            <p className="text-gray-600 mb-4">
              No leaves found matching "{searchTerm}". Try adjusting your search.
            </p>
            <motion.button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear Search
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, bgColor, description }) => (
  <motion.div 
    className={`${bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer`}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium mb-1" style={{ color: color.replace('text-', '').replace('-600', '') }}>
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </motion.div>
);

export default PendingLeaves;
