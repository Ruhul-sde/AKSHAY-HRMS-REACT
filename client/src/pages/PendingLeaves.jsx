import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  Filter, 
  RefreshCw,
  FileText,
  Grid3X3,
  List,
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  CheckSquare,
  XSquare,
  PieChart,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Download
} from 'lucide-react';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Navbar from '../components/Navbar';

// Add custom parse format plugin to dayjs
dayjs.extend(customParseFormat);

const PendingLeaves = ({ userData, setUserData }) => {
  const [pendingLeavesData, setPendingLeavesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Initialize with current date in DD-MM-YYYY format
  const [filters, setFilters] = useState({
    date: dayjs().format('DD-MM-YYYY')
  });
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateCalendar, setShowDateCalendar] = useState(false);

  const fetchPendingLeaves = async () => {
    if (!userData?.ls_EMPCODE) {
      setError('Employee Code missing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse date from DD-MM-YYYY format
      const selectedDate = dayjs(filters.date, 'DD-MM-YYYY', true);
      
      if (!selectedDate.isValid()) {
        setError('Invalid date format. Please use DD-MM-YYYY format.');
        setLoading(false);
        return;
      }
      
      // Convert to YYYYMMDD format for API
      const formattedDate = selectedDate.format('YYYYMMDD');
      
      console.log('Fetching pending leaves with params:', { 
        ls_EmpCode: userData.ls_EMPCODE,
        ls_DocDate: formattedDate 
      });
      
      const res = await axios.get(
        `/api/pending-leaves`,
        {
          params: {
            ls_EmpCode: userData.ls_EMPCODE,
            ls_DocDate: formattedDate
          },
        }
      );

      console.log('API Response:', res.data);

      if (res.data.success) {
        setPendingLeavesData(res.data.pendingLeavesData || []);
      } else {
        setError(res.data.message || 'Failed to fetch pending leaves data');
      }
    } catch (err) {
      console.error('Error fetching pending leaves:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending leaves data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.ls_EMPCODE) {
      fetchPendingLeaves();
    }
  }, [userData]);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDateCalendar && !event.target.closest('.date-calendar-container')) {
        setShowDateCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateCalendar]);

  const handleDateSelect = (date) => {
    const formattedDate = dayjs(date).format('DD-MM-YYYY');
    setFilters(prev => ({ ...prev, date: formattedDate }));
    setShowDateCalendar(false);
  };

  const generateCalendarDays = (dateString) => {
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
              setFilters(prev => ({ ...prev, date: formattedDate }));
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
              setFilters(prev => ({ ...prev, date: formattedDate }));
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
                const isSelected = day.format('DD-MM-YYYY') === filters.date;
                const isToday = day.isSame(dayjs(), 'day');
                
                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleDateSelect(day)}
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
              {filters.date}
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleDateSelect(dayjs())}
              className="flex-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 py-1.5 px-2 rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, date: dayjs().format('DD-MM-YYYY') }));
                setShowDateCalendar(false);
              }}
              className="flex-1 text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 py-1.5 px-2 rounded-lg"
            >
              Current Date
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredData = pendingLeavesData.filter(item =>
    item.leaveName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateStats = () => {
    const stats = {
      totalLeaveTypes: filteredData.length,
      totalOpenLeaves: filteredData.reduce((sum, item) => sum + parseFloat(item.openLeaves || 0), 0),
      totalUsedLeaves: filteredData.reduce((sum, item) => sum + parseFloat(item.usedLeaves || 0), 0),
      totalPendingLeaves: filteredData.reduce((sum, item) => sum + parseFloat(item.pendingLeaves || 0), 0),
      totalRejectedLeaves: filteredData.reduce((sum, item) => sum + parseFloat(item.rejectedLeaves || 0), 0),
      totalClosedLeaves: filteredData.reduce((sum, item) => sum + parseFloat(item.closedLeaves || 0), 0),
      totalAvailable: filteredData.reduce((sum, item) => {
        const open = parseFloat(item.openLeaves || 0);
        const used = parseFloat(item.usedLeaves || 0);
        const pending = parseFloat(item.pendingLeaves || 0);
        return sum + (open - used - pending);
      }, 0)
    };
    return stats;
  };

  const stats = calculateStats();

  const getLeaveTypeBadge = (leaveType) => {
    let config;
    
    switch(leaveType) {
      case 'CL':
        config = { 
          color: 'bg-blue-100 text-blue-800', 
          icon: 'C',
          label: 'Casual Leave',
          fullName: 'Casual Leave'
        };
        break;
      case 'PL':
        config = { 
          color: 'bg-green-100 text-green-800', 
          icon: 'P',
          label: 'Privilege Leave',
          fullName: 'Privilege Leave'
        };
        break;
      case 'LWP':
        config = { 
          color: 'bg-red-100 text-red-800', 
          icon: 'L',
          label: 'Leave Without Pay',
          fullName: 'Leave Without Pay'
        };
        break;
      default:
        config = { 
          color: 'bg-gray-100 text-gray-800', 
          icon: leaveType?.charAt(0) || '?',
          label: leaveType || 'Unknown',
          fullName: leaveType || 'Unknown Leave'
        };
    }
    
    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${config.color.replace('bg-', 'bg-').replace('text-', 'text-')}`}>
          {config.icon}
        </span>
        <span className="font-medium">{config.label}</span>
      </div>
    );
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    
    const headers = ['Leave Type', 'Leave Name', 'Open Leaves', 'Used Leaves', 'Pending Leaves', 'Rejected Leaves', 'Closed Leaves'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.leaveType,
        `"${item.leaveName}"`,
        item.openLeaves,
        item.usedLeaves,
        item.pendingLeaves,
        item.rejectedLeaves,
        item.closedLeaves
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pending-leaves-${filters.date.replace(/-/g, '')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Pending Leaves</h1>
                </div>
                <p className="text-indigo-100">Track your leave balances and pending approvals</p>
                <p className="text-indigo-200 text-sm mt-1">
                  Employee: {userData?.ls_EMPCODE || 'N/A'} | Date: {filters.date}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <motion.button
                  onClick={exportToCSV}
                  disabled={filteredData.length === 0}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
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

        {/* Filters */}
        <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Date Input with Calendar */}
            <div className="date-calendar-container relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">As of Date (DD-MM-YYYY)</label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="DD-MM-YYYY"
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowDateCalendar(!showDateCalendar)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Click calendar icon to select date</p>
              
              {/* Calendar Dropdown */}
              <AnimatePresence>
                {showDateCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 mt-2 w-72"
                  >
                    {generateCalendarDays(filters.date)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <motion.button
              onClick={fetchPendingLeaves}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search className="w-4 h-4" />
              {loading ? 'Loading...' : 'Load Leave Data'}
            </motion.button>
            
            <motion.button
              onClick={() => {
                setFilters({ date: dayjs().format('DD-MM-YYYY') });
              }}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Today
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={cardVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          <StatsCard icon={CalendarIcon} label="Leave Types" value={stats.totalLeaveTypes} color="text-indigo-600" bgColor="bg-indigo-50" />
          <StatsCard icon={CheckSquare} label="Open Leaves" value={stats.totalOpenLeaves.toFixed(1)} color="text-blue-600" bgColor="bg-blue-50" />
          <StatsCard icon={Clock} label="Available" value={stats.totalAvailable.toFixed(1)} color="text-green-600" bgColor="bg-green-50" />
          <StatsCard icon={AlertTriangle} label="Used Leaves" value={stats.totalUsedLeaves.toFixed(1)} color="text-orange-600" bgColor="bg-orange-50" />
          <StatsCard icon={BarChart3} label="Pending" value={stats.totalPendingLeaves.toFixed(1)} color="text-yellow-600" bgColor="bg-yellow-50" />
          <StatsCard icon={XSquare} label="Rejected" value={stats.totalRejectedLeaves.toFixed(1)} color="text-red-600" bgColor="bg-red-50" />
          <StatsCard icon={PieChart} label="Closed" value={stats.totalClosedLeaves.toFixed(1)} color="text-purple-600" bgColor="bg-purple-50" />
        </motion.div>

        {/* Search and View Controls */}
        <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leave types or names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${viewMode === 'cards' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
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
                <RefreshCw className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-700">Loading Leave Data...</h3>
                <p className="text-gray-500 mt-2">Please wait while we fetch your leave records.</p>
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
            ) : filteredData.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center"
              >
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Leave Records Found</h3>
                <p className="text-gray-500">Try adjusting your date filter or contact HR.</p>
              </motion.div>
            ) : viewMode === 'table' ? (
              <TableView data={filteredData} getLeaveTypeBadge={getLeaveTypeBadge} />
            ) : (
              <CardsView data={filteredData} getLeaveTypeBadge={getLeaveTypeBadge} />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Table View Component
const TableView = ({ data, getLeaveTypeBadge }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Type</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Open Leaves</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Used Leaves</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pending Leaves</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rejected Leaves</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Closed Leaves</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Available</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((item, i) => {
            const available = parseFloat(item.openLeaves || 0) - parseFloat(item.usedLeaves || 0) - parseFloat(item.pendingLeaves || 0);
            
            return (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {getLeaveTypeBadge(item.leaveType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.leaveName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-blue-600">{item.openLeaves}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-orange-600">{item.usedLeaves}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-yellow-600">{item.pendingLeaves}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-red-600">{item.rejectedLeaves}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-purple-600">{item.closedLeaves}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-lg font-bold ${available >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {available.toFixed(1)}
                  </div>
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
const CardsView = ({ data, getLeaveTypeBadge }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.map((item, i) => {
      const available = parseFloat(item.openLeaves || 0) - parseFloat(item.usedLeaves || 0) - parseFloat(item.pendingLeaves || 0);
      
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
              {getLeaveTypeBadge(item.leaveType)}
              <h3 className="text-xl font-semibold text-gray-900 mt-2 group-hover:text-indigo-600 transition-colors">
                {item.leaveName}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Open Leaves</p>
                <p className="text-xl font-bold text-blue-600">{item.openLeaves}</p>
              </div>
              <div className={`p-3 rounded-lg ${available >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-xs text-gray-500 mb-1">Available</p>
                <p className={`text-xl font-bold ${available >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {available.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <p className="text-xs text-gray-500">Used</p>
                <p className="text-sm font-bold text-orange-600">{item.usedLeaves}</p>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-sm font-bold text-yellow-600">{item.pendingLeaves}</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <p className="text-xs text-gray-500">Rejected</p>
                <p className="text-sm font-bold text-red-600">{item.rejectedLeaves}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Closed Leaves:</span>
                <span className="font-bold text-purple-600 text-lg">{item.closedLeaves}</span>
              </div>
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

export default PendingLeaves;