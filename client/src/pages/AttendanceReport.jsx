
import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Download, 
  RefreshCw, 
  Filter,
  Search,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  Zap,
  Eye,
  Calendar as CalendarIcon,
  Users,
  Activity
} from 'lucide-react';

const AttendanceReport = ({ userData }) => {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const fetchAttendance = async () => {
    if (!month) {
      setError("Month is required.");
      return;
    }

    const monthPattern = /^\d{4}-\d{2}$/;
    if (!monthPattern.test(month)) {
      setError("Please enter month in YYYY-MM format (e.g., 2025-06)");
      return;
    }

    if (!userData?.ls_EMPCODE) {
      setError('Employee code missing. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending attendance request with params:', {
        ls_EmpCode: userData.ls_EMPCODE,
        ls_Month: month
      });

      const res = await axios.get('http://localhost:5000/api/attendance', {
        params: {
          ls_EmpCode: userData.ls_EMPCODE,
          ls_Month: month
        }
      });

      if (res.data?.success) {
        setAttendanceData(res.data.attendanceData || []);
      } else {
        setError(res.data?.message || 'Failed to fetch attendance report.');
      }
    } catch (err) {
      console.error('Attendance fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch attendance report.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    if (time.length === 4) {
      return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
    }
    return time;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return dayjs(dateStr).format('DD-MM-YYYY');
    } catch {
      return dateStr;
    }
  };

  const getDayTypeBadge = (dayType) => {
    const typeMap = {
      'WD': { 
        label: 'Working Day', 
        class: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Activity,
        color: 'blue'
      },
      'WO': { 
        label: 'Week Off', 
        class: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: Coffee,
        color: 'purple'
      },
      'H': { 
        label: 'Holiday', 
        class: 'bg-red-100 text-red-800 border-red-200', 
        icon: CalendarIcon,
        color: 'red'
      },
      'L': { 
        label: 'Leave', 
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: User,
        color: 'yellow'
      }
    };

    const typeInfo = typeMap[dayType] || { 
      label: dayType || 'Unknown', 
      class: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: AlertCircle,
      color: 'gray'
    };

    const IconComponent = typeInfo.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${typeInfo.class} shadow-sm`}>
        <IconComponent className="w-3 h-3" />
        {typeInfo.label}
      </span>
    );
  };

  const getLateMarkBadge = (lateMark) => {
    return lateMark === 'Y' ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm">
        <XCircle className="w-3 h-3" />
        Late
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm">
        <CheckCircle className="w-3 h-3" />
        On Time
      </span>
    );
  };

  const getAttendanceStats = () => {
    if (!attendanceData.length) return null;

    const stats = {
      totalDays: attendanceData.length,
      workingDays: attendanceData.filter(item => item.dayType === 'WD').length,
      holidays: attendanceData.filter(item => item.dayType === 'H').length,
      weekOffs: attendanceData.filter(item => item.dayType === 'WO').length,
      leaves: attendanceData.filter(item => item.dayType === 'L').length,
      lateMarks: attendanceData.filter(item => item.lateMark === 'Y').length,
      onTime: attendanceData.filter(item => item.lateMark === 'N' && item.dayType === 'WD').length
    };

    return stats;
  };

  const filteredData = attendanceData.filter(item => {
    const matchesSearch = !searchTerm || 
      formatDate(item.manInDate).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dayType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'ALL' || item.dayType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar userData={userData} />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Enhanced Header */}
        <motion.div variants={cardVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Attendance Report
              </h1>
              <p className="text-gray-600">View detailed attendance records and insights</p>
            </div>
          </div>
          
          {/* Employee Info Card */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border border-gray-100"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Employee ID:</span>
            <span className="font-semibold text-gray-800">{userData?.ls_EMPCODE}</span>
          </motion.div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Month Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Select Month
              </label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="YYYY-MM"
                maxLength={7}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM</p>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Records
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search dates, types..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              >
                <option value="ALL">All Types</option>
                <option value="WD">Working Days</option>
                <option value="WO">Week Offs</option>
                <option value="H">Holidays</option>
                <option value="L">Leaves</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Eye className="w-4 h-4 inline mr-1" />
                View Mode
              </label>
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'cards' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              onClick={fetchAttendance}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  View Report
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div variants={cardVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-600">Total Days</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-600">Working</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.workingDays}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-600">On Time</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.onTime}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-gray-600">Late</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.lateMarks}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-gray-600">Leaves</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.leaves}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-gray-600">Week Off</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.weekOffs}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-gray-600">Holidays</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.holidays}</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="relative">
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-lg">Loading attendance report...</p>
          </motion.div>
        ) : (
          <motion.div variants={cardVariants}>
            <AnimatePresence mode="wait">
              {viewMode === 'table' ? (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  {filteredData.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
                      <p className="text-gray-500">No attendance data found for the selected criteria.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day Type</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manual In</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manual Out</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manual Hours</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System In</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System Out</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System Hours</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredData.map((item, idx) => (
                            <motion.tr 
                              key={idx} 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.02 }}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatDate(item.manInDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getDayTypeBadge(item.dayType)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getLateMarkBadge(item.lateMark)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {formatTime(item.manInTime)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {formatTime(item.manOutTime)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.manTotalTime || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {formatTime(item.sysInTime)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {formatTime(item.sysOutTime)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.sysTotalTime || '-'}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredData.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatDate(item.manInDate)}
                        </div>
                        <div className="flex gap-2">
                          {getDayTypeBadge(item.dayType)}
                          {getLateMarkBadge(item.lateMark)}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Manual Time:</span>
                          <span className="font-mono text-sm">
                            {formatTime(item.manInTime)} - {formatTime(item.manOutTime)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">System Time:</span>
                          <span className="font-mono text-sm">
                            {formatTime(item.sysInTime)} - {formatTime(item.sysOutTime)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700">Total Hours:</span>
                          <span className="font-semibold text-blue-600">
                            {item.manTotalTime || item.sysTotalTime || '-'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AttendanceReport;
