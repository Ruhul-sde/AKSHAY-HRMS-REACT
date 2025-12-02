
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Loader2, AlertCircle, RefreshCw, ChevronRight, Clock, CalendarDays } from 'lucide-react';

const HolidayMaster = ({ userData, setUserData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState('');

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const fetchFinancialYears = async () => {
    setLoading(true);
    setError('');

    try {
      const currentDate = dayjs().format('YYYYMMDD');
      const res = await axios.get(
        `http://localhost:5000/api/holiday/financial-year?ls_Date=${currentDate}`,
        { timeout: 10000 }
      );

      if (res.data.success) {
        setFinancialYears(res.data.financialYears);
        if (res.data.financialYears.length > 0) {
          setSelectedFinYear(res.data.financialYears[0].finYear);
        }
      } else {
        setError(res.data.message || 'Failed to fetch financial years');
      }
    } catch (err) {
      console.error('Error fetching financial years:', err);
      setError(err.response?.data?.message || 'Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dayjs(dateStr, 'YYYYMMDD').format('DD MMM YYYY');
  };

  const calculateDuration = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 'N/A';
    const from = dayjs(fromDate, 'YYYYMMDD');
    const to = dayjs(toDate, 'YYYYMMDD');
    const days = to.diff(from, 'day') + 1;
    return `${days} days`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Calendar className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Holiday Master
            </h1>
            <p className="text-gray-600 text-lg">View and manage company holidays and financial years</p>
          </motion.div>

          {/* Main Content Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Financial Year Details</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Select a financial year to view details</p>
                  </div>
                </div>

                {/* Financial Year Selector */}
                {!loading && financialYears.length > 0 && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Financial Year:
                    </label>
                    <select
                      value={selectedFinYear}
                      onChange={(e) => setSelectedFinYear(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:border-blue-400 transition-colors min-w-[180px]"
                    >
                      {financialYears.map((fy) => (
                        <option key={fy.finYear} value={fy.finYear}>
                          {fy.finYear}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="relative">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                      <motion.div
                        className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mt-6">Loading Financial Years</h3>
                    <p className="text-gray-500 mt-2">Please wait while we fetch the data...</p>
                  </motion.div>
                )}

                {error && !loading && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-center py-16"
                  >
                    <div className="text-center max-w-md">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <AlertCircle className="w-10 h-10 text-red-600" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Unable to Load Financial Years</h3>
                      <p className="text-gray-600 mb-6">{error}</p>
                      <motion.button
                        onClick={fetchFinancialYears}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {!loading && !error && financialYears.length > 0 && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {financialYears.map((fy) => 
                      fy.finYear === selectedFinYear && (
                        <motion.div
                          key={fy.finYear}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-6"
                        >
                          {/* Info Cards Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Financial Year Card */}
                            <motion.div
                              whileHover={{ y: -4 }}
                              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-blue-900">Financial Year</h3>
                              </div>
                              <p className="text-2xl font-bold text-blue-900">{fy.finYear}</p>
                            </motion.div>

                            {/* Start Date Card */}
                            <motion.div
                              whileHover={{ y: -4 }}
                              className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                  <ChevronRight className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-green-900">Start Date</h3>
                              </div>
                              <p className="text-xl font-bold text-green-900">{formatDate(fy.fromDate)}</p>
                            </motion.div>

                            {/* End Date Card */}
                            <motion.div
                              whileHover={{ y: -4 }}
                              className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                  <Clock className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-purple-900">End Date</h3>
                              </div>
                              <p className="text-xl font-bold text-purple-900">{formatDate(fy.toDate)}</p>
                            </motion.div>
                          </div>

                          {/* Detailed Information */}
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <CalendarDays className="w-5 h-5 text-gray-600" />
                              Period Summary
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Duration</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {calculateDuration(fy.fromDate, fy.toDate)}
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <p className="text-lg font-semibold text-green-600 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                  Active
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                )}

                {!loading && !error && financialYears.length === 0 && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Financial Years Found</h3>
                    <p className="text-gray-500 mb-6">There are no financial years available at the moment.</p>
                    <motion.button
                      onClick={fetchFinancialYears}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default HolidayMaster;
