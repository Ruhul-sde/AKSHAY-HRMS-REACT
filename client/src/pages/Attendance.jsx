import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Users,
  MapPin,
  Building2,
  MessageSquare,
  FileText,
  CheckCircle,
  X,
  Loader,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const Attendance = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [outDutyHistory, setOutDutyHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const recordsPerPage = 5;

  // Format time from API format (HHMM) to readable format
  const formatApiTime = (timeString) => {
    if (!timeString || timeString.length !== 4) return timeString;
    const hours = timeString.slice(0, 2);
    const minutes = timeString.slice(2, 4);
    return `${hours}:${minutes}`;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [day, month, year] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Fetch out-duty history
  const fetchOutDutyHistory = async () => {
    if (!userData?.ls_EMPCODE) return;
    
    setHistoryLoading(true);
    try {
      const formattedDate = selectedDate.replace(/-/g, '');
      const response = await api.get(`/out-duty-history?empCode=${userData.ls_EMPCODE}&date=${formattedDate}`);
      
      if (response.data.success) {
        setOutDutyHistory(response.data.data || []);
      } else {
        setOutDutyHistory([]);
      }
    } catch (error) {
      console.error('Error fetching out-duty history:', error);
      setOutDutyHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch history on component mount and when date changes
  useEffect(() => {
    fetchOutDutyHistory();
  }, [userData, selectedDate]);

  // Pagination calculations
  const totalPages = Math.ceil(outDutyHistory.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = outDutyHistory.slice(startIndex, endIndex);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Attendance & Out-Duty</h1>
              <p className="text-blue-100">Manage your attendance and track out-duty activities</p>
            </div>
          </div>
        </motion.div>

        {/* Main Options */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Manual Attendance Entry Option */}
          <motion.div
            variants={cardVariants}
            className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/attendance-post')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full mb-4 group-hover:from-orange-200 group-hover:to-yellow-200 transition-colors">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Manual Attendance</h3>
              <p className="text-gray-600">Post or update punch miss records</p>
            </div>
          </motion.div>

          {/* Out-Duty Tracking Option */}
          <motion.div
            variants={cardVariants}
            className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/out-duty')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                <Navigation className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Out-Duty Tracking</h3>
              <p className="text-gray-600">Track your client visits and locations</p>
            </div>
          </motion.div>
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
        >
          {/* History Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Out-Duty History</h3>
                <p className="text-gray-600 text-sm">View your past out-duty records</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button
                onClick={fetchOutDutyHistory}
                disabled={historyLoading}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                {historyLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* History Content */}
          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                <span className="text-gray-600">Loading history...</span>
              </div>
            </div>
          ) : currentRecords.length > 0 ? (
            <>
              <div className="space-y-4">
                {currentRecords.map((record, index) => (
                  <motion.div
                    key={record.ls_Code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${record.ls_Type === 'I' ? 'bg-green-100' : 'bg-orange-100'}`}>
                          {record.ls_Type === 'I' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              record.ls_Type === 'I' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {record.ls_Type === 'I' ? 'Check In' : 'Check Out'}
                            </span>
                            <span className="text-sm font-medium text-gray-800">{record.ls_ClientNm}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {formatDisplayDate(record.ls_Date)} at {formatApiTime(record.ls_Time)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedRecord(expandedRecord === record.ls_Code ? null : record.ls_Code)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedRecord === record.ls_Code && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Location</p>
                                <p className="text-xs text-gray-800">{record.ls_Location}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3 h-3 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Manual Location</p>
                                <p className="text-xs text-gray-800">{record.ls_LocManual}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Reason</p>
                                <p className="text-xs text-gray-800">{record.ls_ReasonVisit}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-3 h-3 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Remarks</p>
                                <p className="text-xs text-gray-800">{record.ls_Remark || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, outDutyHistory.length)} of {outDutyHistory.length} records
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">No Records Found</h4>
              <p className="text-gray-600 mb-4">No out-duty records found for {formatDisplayDate(selectedDate.split('-').reverse().join('-'))}</p>
              <button
                onClick={() => navigate('/out-duty')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Out-Duty Tracking
              </button>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Attendance;