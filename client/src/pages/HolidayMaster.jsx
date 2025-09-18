
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, AlertCircle, RefreshCw, User, FileText } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const HolidayMaster = ({ userData, setUserData }) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finYear, setFinYear] = useState(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const startYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    const endYear = startYear + 1;
    
    return `FY${startYear}_${endYear.toString().slice(-2)}`;
  });
  const [branchId, setBranchId] = useState('');

  const fetchHolidays = async () => {
    if (!userData?.ls_EMPCODE) {
      setError('Employee code not found. Please login again.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching holidays for:', { 
        empCode: userData.ls_EMPCODE, 
        finYear 
      });

      // Use the employee-specific endpoint that will fetch branch automatically
      const response = await axios.get('http://localhost:5000/api/auth/holiday-report-emp', {
        params: {
          ls_EmpCode: userData.ls_EMPCODE,
          ls_FinYear: finYear
        }
      });

      console.log('Holiday API Response:', response.data);

      if (response.data.success) {
        const holidayData = response.data.holidayData || [];
        console.log('Processed holiday data:', holidayData);
        
        setHolidays(holidayData);
        setBranchId(response.data.employeeBranch || response.data.branchName || '');
        
        if (holidayData.length === 0) {
          setError(`No holidays found for financial year ${finYear.replace('FY', 'FY ').replace('_', '-')}`);
        }
      } else {
        setError(response.data.message || 'Failed to fetch holidays');
      }
    } catch (err) {
      console.error('Error fetching holidays:', err);
      let errorMessage = 'Failed to fetch holiday data. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your employee code and try again.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please contact support if this persists.';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.ls_EMPCODE) {
      fetchHolidays();
    }
  }, [finYear, userData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Handle various date formats
      let date;
      
      if (dateString.includes('-') && dateString.includes(' ')) {
        // Format like "26-01-2025 00:00:00"
        const datePart = dateString.split(' ')[0];
        const [day, month, year] = datePart.split('-');
        date = new Date(year, month - 1, day);
      } else if (dateString.includes('/')) {
        // Format like "26/01/2025"
        const [day, month, year] = dateString.split('/');
        date = new Date(year, month - 1, day);
      } else if (dateString.length === 8) {
        // Format like "20250126"
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        date = new Date(year, month - 1, day);
      } else {
        // Try parsing directly
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getDayOfWeek = (dateString) => {
    if (!dateString) return '';
    try {
      let date;
      
      if (dateString.includes('-') && dateString.includes(' ')) {
        const datePart = dateString.split(' ')[0];
        const [day, month, year] = datePart.split('-');
        date = new Date(year, month - 1, day);
      } else if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        date = new Date(year, month - 1, day);
      } else if (dateString.length === 8) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return '';
      }
      
      return date.toLocaleDateString('en-IN', {
        weekday: 'long'
      });
    } catch {
      return '';
    }
  };

  const generateFinancialYearOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const options = [];
    
    for (let i = -2; i <= 2; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      const fyValue = `FY${startYear}_${endYear.toString().slice(-2)}`;
      const fyLabel = `FY ${startYear}-${endYear.toString().slice(-2)}`;
      options.push({ value: fyValue, label: fyLabel });
    }
    
    return options;
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Calendar className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-gray-800 mb-4"
              >
                Holiday Master
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 text-2xl font-semibold text-green-600 mb-6"
              >
                <FileText className="w-8 h-8" />
                <span>Company Holidays</span>
              </motion.div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Employee</p>
                    <p className="text-blue-800 font-semibold">{userData?.ls_EMPCODE || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Branch</p>
                    <p className="text-green-800 font-semibold">{branchId || 'Loading...'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Financial Year</p>
                    <p className="text-purple-800 font-semibold">{finYear.replace('FY', 'FY ').replace('_', '-')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <select
                value={finYear}
                onChange={(e) => setFinYear(e.target.value)}
                className="px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-center font-medium"
                disabled={loading}
              >
                {generateFinancialYearOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              
              <button
                onClick={fetchHolidays}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Unable to Load Holidays</h3>
                  <p className="text-red-600 mt-1">{error}</p>
                  <button
                    onClick={fetchHolidays}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Holiday Table */}
          {!error && (!holidays || !Array.isArray(holidays) || holidays.length === 0) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100 text-center"
            >
              <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-3">No Holidays Found</h3>
              <p className="text-gray-500 text-lg">No holidays are available for the selected financial year {finYear.replace('FY', 'FY ').replace('_', '-')}.</p>
            </motion.div>
          ) : !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Holiday Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Holiday Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {Array.isArray(holidays) && holidays.map((holiday, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-4">
                              <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-blue-600">
                                {formatDate(holiday.ls_HldDate || holiday.holidayDate)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">
                            {getDayOfWeek(holiday.ls_HldDate || holiday.holidayDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {holiday.ls_Reason || holiday.holidayName || holiday.description || 'Holiday'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {holiday.holidayType || 'Company Holiday'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {!error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl shadow-xl p-8 mt-8 border border-gray-100"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Holiday Summary</h3>
                <p className="text-gray-600 mb-4">Total holidays for {finYear.replace('FY', 'FY ').replace('_', '-')}</p>
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {Array.isArray(holidays) ? holidays.length : 0}
                </div>
                <p className="text-gray-500">Company Holidays</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HolidayMaster;
