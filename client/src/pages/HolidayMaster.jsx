
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
  const [useDemoData, setUseDemoData] = useState(true);
  const [finYear, setFinYear] = useState(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const startYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    const endYear = startYear + 1;
    
    return `FY${startYear}_${endYear.toString().slice(-2)}`;
  });
  const [branchId, setBranchId] = useState('');

  // Demo holiday data
  const demoHolidays = [
    {
      "ls_HldDate": "26-01-2025 00:00:00",
      "ls_Reason": "Republic Day"
    },
    {
      "ls_HldDate": "14-03-2025 00:00:00",
      "ls_Reason": "Holi"
    },
    {
      "ls_HldDate": "01-05-2025 00:00:00",
      "ls_Reason": "Maharashtra Din"
    },
    {
      "ls_HldDate": "15-08-2025 00:00:00",
      "ls_Reason": "Independence Day"
    },
    {
      "ls_HldDate": "27-08-2025 00:00:00",
      "ls_Reason": "Ganesh Chaturthi"
    },
    {
      "ls_HldDate": "02-10-2025 00:00:00",
      "ls_Reason": "Mahatma Gandhi Jayanti"
    },
    {
      "ls_HldDate": "02-10-2025 00:00:00",
      "ls_Reason": "Dassera"
    },
    {
      "ls_HldDate": "21-10-2025 00:00:00",
      "ls_Reason": "Diwali Amavasya"
    },
    {
      "ls_HldDate": "22-10-2025 00:00:00",
      "ls_Reason": "Diwali Bali Pratipada"
    }
  ];

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);
    
    // Always use demo data
    setTimeout(() => {
      setHolidays(demoHolidays);
      setBranchId('01');
      setLoading(false);
    }, 500); // Simulate loading time
  };

  useEffect(() => {
    fetchHolidays();
  }, [finYear]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Handle date format like "26-01-2025 00:00:00"
      const datePart = dateString.split(' ')[0];
      const [day, month, year] = datePart.split('-');
      const date = new Date(year, month - 1, day);
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
      // Handle date format like "26-01-2025 00:00:00"
      const datePart = dateString.split(' ')[0];
      const [day, month, year] = datePart.split('-');
      const date = new Date(year, month - 1, day);
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
    
    for (let i = -1; i <= 1; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      const fyValue = `FY${startYear}_${endYear.toString().slice(-2)}`;
      const fyLabel = `FY ${startYear}-${endYear.toString().slice(-2)}`;
      options.push({ value: fyValue, label: fyLabel });
    }
    
    return options;
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchHolidays} />;

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
                    <p className="text-green-800 font-semibold">{branchId || 'N/A'}</p>
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

          {/* Holiday Table */}
          {(!holidays || !Array.isArray(holidays) || holidays.length === 0) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100 text-center"
            >
              <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-3">No Holidays Found</h3>
              <p className="text-gray-500 text-lg">No holidays are available for the selected financial year.</p>
            </motion.div>
          ) : (
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
                                {formatDate(holiday.ls_HldDate)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">
                            {getDayOfWeek(holiday.ls_HldDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {holiday.ls_Reason || 'Holiday'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Company Holiday
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
        </motion.div>
      </div>
    </div>
  );
};

export default HolidayMaster;
