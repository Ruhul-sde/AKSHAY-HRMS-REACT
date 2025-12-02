
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  RefreshCw, 
  XCircle, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';

const PendingLeaves = ({ userData, setUserData }) => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPendingLeaves = async () => {
    if (!userData?.ls_EMPCODE) {
      setError('Employee code is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const currentDate = dayjs().format('YYYYMMDD');
      
      console.log('Fetching pending leaves with params:', {
        ls_EmpCode: userData.ls_EMPCODE,
        ls_Date: currentDate
      });
      
      const res = await axios.get('/api/pending-leaves', {
        params: {
          ls_EmpCode: userData.ls_EMPCODE,
          ls_Date: currentDate
        }
      });

      console.log('Response:', res.data);

      if (res.data.success) {
        setPendingLeaves(res.data.pendingLeaves);
      } else {
        setError(res.data.message || 'Failed to fetch pending leaves');
      }
    } catch (err) {
      console.error('Error fetching pending leaves:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.ls_EMPCODE) {
      fetchPendingLeaves();
    }
  }, [userData]);

  const getLeaveTypeColor = (leaveType) => {
    const colors = {
      'CL': 'bg-blue-100 text-blue-800',
      'PL': 'bg-green-100 text-green-800',
      'LWP': 'bg-orange-100 text-orange-800',
      'SL': 'bg-purple-100 text-purple-800',
      'ML': 'bg-pink-100 text-pink-800',
    };
    return colors[leaveType] || 'bg-gray-100 text-gray-800';
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Pending Leaves</h1>
                </div>
                <p className="text-blue-100">View your leave balance and pending requests</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <motion.button
                  onClick={fetchPendingLeaves}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Display */}
        <motion.div variants={cardVariants}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
              >
                <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-700">Loading Pending Leaves...</h3>
                <p className="text-gray-500 mt-2">Please wait while we fetch your data.</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
              >
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Data</h3>
                <p className="text-red-600">{error}</p>
                <motion.button
                  onClick={fetchPendingLeaves}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : pendingLeaves.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center"
              >
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Leave Data Found</h3>
                <p className="text-gray-500">You don't have any leave records at the moment.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingLeaves.map((leave, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {leave.leaveName}
                        </h3>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                          {leave.leaveType}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Opening Balance:
                        </span>
                        <span className="font-semibold text-gray-800">{leave.openLeave}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Used Leave:
                        </span>
                        <span className="font-semibold text-green-600">{leave.usedLeave}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          Pending Leave:
                        </span>
                        <span className="font-semibold text-orange-600">{leave.pendLeave}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Rejected Leave:
                        </span>
                        <span className="font-semibold text-red-600">{leave.rejLeave}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Closing Balance:</span>
                          <span className="text-xl font-bold text-blue-600">{leave.closeLeave}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PendingLeaves;
