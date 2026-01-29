import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Building2,
  TrendingUp,
  BarChart3,
  RefreshCw,
  FileText,
  Eye,
  Grid3X3,
  List
} from 'lucide-react';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Navbar from '../components/Navbar';

// Add custom parse format plugin to dayjs
dayjs.extend(customParseFormat);

const MonthlyAttendanceReport = ({ userData, setUserData }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Initialize with current month in DD-MM-YYYY format
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf('month').format('DD-MM-YYYY'),
    toDate: dayjs().endOf('month').format('DD-MM-YYYY')
  });
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  // Create axios instance with base URL configuration
  const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'https://49.249.199.62:89/api' 
      : '', // Empty for development (proxy will handle)
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const fetchMonthlyAttendance = async () => {
    if (!userData?.ls_EMPCODE) {
      setError('Employee Code missing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse dates from DD-MM-YYYY format
      const fromDate = dayjs(filters.fromDate, 'DD-MM-YYYY', true);
      const toDate = dayjs(filters.toDate, 'DD-MM-YYYY', true);
      
      if (!fromDate.isValid() || !toDate.isValid()) {
        setError('Invalid date format. Please use DD-MM-YYYY format.');
        setLoading(false);
        return;
      }
      
      // Convert to YYYYMMDD format for API
      const formattedFromDate = fromDate.format('YYYYMMDD');
      const formattedToDate = toDate.format('YYYYMMDD');
      
      console.log('Fetching attendance with dates:', { 
        fromDate: filters.fromDate, 
        toDate: filters.toDate,
        formattedFromDate, 
        formattedToDate 
      });
      
      // Use relative path - axios will use proxy in development
      const res = await api.get('/monthly-attendance', {
        params: {
          ls_FromDate: formattedFromDate,
          ls_ToDate: formattedToDate,
          ls_EmpCode: userData.ls_EMPCODE
        }
      });

      if (res.data.success) {
        setAttendanceData(res.data.attendanceData);
      } else {
        setError(res.data.message || 'Failed to fetch attendance data');
      }
    } catch (err) {
      console.error('Error fetching monthly attendance:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to fetch attendance data. Please check your connection.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.ls_EMPCODE) {
      fetchMonthlyAttendance();
    }
  }, [userData]);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFromCalendar && !event.target.closest('.from-calendar-container')) {
        setShowFromCalendar(false);
      }
      if (showToCalendar && !event.target.closest('.to-calendar-container')) {
        setShowToCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFromCalendar, showToCalendar]);

  const handleDateSelect = (date, isFromDate = true) => {
    const formattedDate = dayjs(date).format('DD-MM-YYYY');
    if (isFromDate) {
      setFilters(prev => ({ ...prev, fromDate: formattedDate }));
      setShowFromCalendar(false);
    } else {
      setFilters(prev => ({ ...prev, toDate: formattedDate }));
      setShowToCalendar(false);
    }
  };

  const generateCalendarDays = (dateString, isFromDate = true) => {
    const currentDate = dayjs(dateString, 'DD-MM-YYYY', true).isValid() 
      ? dayjs(dateString, 'DD-MM-YYYY')
      : dayjs();
    
    const monthStart = currentDate.startOf('month');
    const monthEnd = currentDate.endOf('month');
    const startDate = monthStart.startOf('week');
    const endDate = monthEnd.endOf('week');
    
    const calendarDays = [];
    let day = startDate;
    
    while (day <= endDate) {
      calendarDays.push(day);
      day = day.add(1, 'day');
    }
    
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => {
              const newDate = currentDate.subtract(1, 'month');
              const formattedDate = newDate.format('DD-MM-YYYY');
              if (isFromDate) {
                setFilters(prev => ({ ...prev, fromDate: formattedDate }));
              } else {
                setFilters(prev => ({ ...prev, toDate: formattedDate }));
              }
            }}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-sm font-semibold text-gray-700">
            {currentDate.format('MMMM YYYY')}
          </div>
          <button 
            onClick={() => {
              const newDate = currentDate.add(1, 'month');
              const formattedDate = newDate.format('DD-MM-YYYY');
              if (isFromDate) {
                setFilters(prev => ({ ...prev, fromDate: formattedDate }));
              } else {
                setFilters(prev => ({ ...prev, toDate: formattedDate }));
              }
            }}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const isCurrentMonth = day.month() === currentDate.month();
                const isSelected = day.format('DD-MM-YYYY') === (isFromDate ? filters.fromDate : filters.toDate);
                const isToday = day.isSame(dayjs(), 'day');
                
                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleDateSelect(day, isFromDate)}
                    disabled={!isCurrentMonth}
                    className={`
                      w-8 h-8 text-sm rounded-lg flex items-center justify-center
                      ${!isCurrentMonth ? 'text-gray-300 cursor-default' : ''}
                      ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                      ${isToday && !isSelected ? 'border-2 border-blue-400' : ''}
                      ${isCurrentMonth && !isSelected ? 'hover:bg-blue-50 hover:text-blue-700' : ''}
                    `}
                  >
                    {day.date()}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Selected:</span>
            <span className="text-sm font-medium text-gray-700">
              {isFromDate ? filters.fromDate : filters.toDate}
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleDateSelect(dayjs(), isFromDate)}
              className="flex-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 py-1.5 px-2 rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => {
                if (isFromDate) {
                  setFilters(prev => ({ ...prev, fromDate: dayjs().startOf('month').format('DD-MM-YYYY') }));
                  setShowFromCalendar(false);
                } else {
                  setFilters(prev => ({ ...prev, toDate: dayjs().endOf('month').format('DD-MM-YYYY') }));
                  setShowToCalendar(false);
                }
              }}
              className="flex-1 text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 py-1.5 px-2 rounded-lg"
            >
              {isFromDate ? 'Start of Month' : 'End of Month'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredData = attendanceData.filter(item =>
    item.empName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.dayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (item) => {
    let status, config;
    
    if (item.weekDay === 'WO') {
      if (item.inTime && item.outTime) {
        status = 'WO_PRESENT';
        config = { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Week Off (Present)' };
      } else {
        status = 'WO';
        config = { color: 'bg-gray-100 text-gray-800', icon: Calendar, label: 'Week Off' };
      }
    } else if (item.leaveType) {
      status = 'LEAVE';
      config = { color: 'bg-orange-100 text-orange-800', icon: Calendar, label: item.leaveType };
    } else if (item.inTime && item.outTime) {
      status = 'PRESENT';
      config = { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Present' };
    } else if (item.weekDay === 'WD') {
      status = 'ABSENT';
      config = { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Absent' };
    } else {
      status = 'UNKNOWN';
      config = { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'N/A' };
    }
    
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const calculateStats = () => {
    const stats = {
      totalDays: filteredData.length,
      presentDays: filteredData.filter(item => item.weekDay === 'WD' && item.inTime && item.outTime && !item.leaveType).length,
      absentDays: filteredData.filter(item => item.weekDay === 'WD' && !item.inTime && !item.outTime && !item.leaveType).length,
      leaveDays: filteredData.filter(item => item.leaveType).length,
      weekOffs: filteredData.filter(item => item.weekDay === 'WO' && !item.inTime && !item.outTime).length,
      weekOffPresent: filteredData.filter(item => item.weekDay === 'WO' && item.inTime && item.outTime).length,
      lateMarks: filteredData.filter(item => item.lateMark === 'Y').length,
      totalHours: filteredData.reduce((sum, item) => sum + (parseFloat(item.totalHours) || 0), 0)
    };
    return stats;
  };

  const stats = calculateStats();

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
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Monthly Attendance Report</h1>
                </div>
                <p className="text-blue-100">Track your daily attendance and work patterns</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <motion.button
                  onClick={fetchMonthlyAttendance}
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

        {/* Filters */}
        <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Date Input with Calendar */}
            <div className="from-calendar-container relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date (DD-MM-YYYY)</label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.fromDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                  placeholder="DD-MM-YYYY"
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowFromCalendar(!showFromCalendar);
                    setShowToCalendar(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Click calendar icon to select date</p>
              
              {/* Calendar Dropdown */}
              <AnimatePresence>
                {showFromCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 mt-2 w-72"
                  >
                    {generateCalendarDays(filters.fromDate, true)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* To Date Input with Calendar */}
            <div className="to-calendar-container relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date (DD-MM-YYYY)</label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.toDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                  placeholder="DD-MM-YYYY"
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowToCalendar(!showToCalendar);
                    setShowFromCalendar(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Click calendar icon to select date</p>
              
              {/* Calendar Dropdown */}
              <AnimatePresence>
                {showToCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 mt-2 w-72"
                  >
                    {generateCalendarDays(filters.toDate, false)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <motion.button
              onClick={fetchMonthlyAttendance}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search Attendance'}
            </motion.button>
            
            <motion.button
              onClick={() => {
                setFilters({
                  fromDate: dayjs().startOf('month').format('DD-MM-YYYY'),
                  toDate: dayjs().endOf('month').format('DD-MM-YYYY')
                });
              }}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Current Month
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={cardVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatsCard icon={Calendar} label="Total Days" value={stats.totalDays} color="text-blue-600" bgColor="bg-blue-50" />
          <StatsCard icon={CheckCircle} label="Present" value={stats.presentDays} color="text-green-600" bgColor="bg-green-50" />
          <StatsCard icon={XCircle} label="Absent" value={stats.absentDays} color="text-red-600" bgColor="bg-red-50" />
          <StatsCard icon={Calendar} label="On Leave" value={stats.leaveDays} color="text-orange-600" bgColor="bg-orange-50" />
          <StatsCard icon={Calendar} label="Week Offs" value={stats.weekOffs} color="text-gray-600" bgColor="bg-gray-50" />
          <StatsCard icon={AlertCircle} label="Late Marks" value={stats.lateMarks} color="text-yellow-600" bgColor="bg-yellow-50" />
          <StatsCard icon={TrendingUp} label="Total Hours" value={stats.totalHours.toFixed(2)} color="text-indigo-600" bgColor="bg-indigo-50" />
        </motion.div>

        {/* Search and View Controls */}
        <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search attendance records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid3X3 className="w-4 h-4" />
                Card View
              </button>
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
                <h3 className="text-xl font-semibold text-gray-700">Loading Attendance Data...</h3>
                <p className="text-gray-500 mt-2">Please wait while we fetch your records.</p>
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
                  onClick={fetchMonthlyAttendance}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : filteredData.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center"
              >
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Attendance Records Found</h3>
                <p className="text-gray-500">Try adjusting your filters or date range.</p>
              </motion.div>
            ) : viewMode === 'table' ? (
              <TableView data={filteredData} getStatusBadge={getStatusBadge} />
            ) : (
              <CardsView data={filteredData} getStatusBadge={getStatusBadge} />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Table View Component
const TableView = ({ data, getStatusBadge }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Day</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">In Time</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Out Time</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Hours</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Late Mark</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((item, i) => {
            const workDate = item.workDate || '';
            const displayDate = workDate.split(' ')[0];
            
            return (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {displayDate || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{item.dayName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(item)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.inTime || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.outTime || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.totalHours || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.lateMark === 'Y' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Late
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// Cards View Component
const CardsView = ({ data, getStatusBadge }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.map((item, i) => {
      const workDate = item.workDate || '';
      const displayDate = workDate.split(' ')[0];
      
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {displayDate || '-'}
              </h3>
              <p className="text-sm text-gray-500">{item.dayName}</p>
            </div>
            <div className="ml-3">
              {getStatusBadge(item)}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In Time:</span>
              <span className="font-medium text-gray-800">{item.inTime || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Out Time:</span>
              <span className="font-medium text-gray-800">{item.outTime || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Hours:</span>
              <span className="font-medium text-gray-800">{item.totalHours || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late Mark:</span>
              <span className="font-medium text-gray-800">
                {item.lateMark === 'Y' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Late
                  </span>
                ) : (
                  '-'
                )}
              </span>
            </div>
          </div>
        </motion.div>
      );
    })}
  </div>
);

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <motion.div 
    className={`${bgColor} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer`}
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="text-center">
      <div className={`p-2 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-xl mx-auto w-fit mb-2 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

export default MonthlyAttendanceReport;