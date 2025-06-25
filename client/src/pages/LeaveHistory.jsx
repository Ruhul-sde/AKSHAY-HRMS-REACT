
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import { 
  Search, 
  Filter, 
  Calendar, 
  CheckSquare, 
  Square, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  Users,
  FileText,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeaveHistory = ({ userData }) => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    checked: false,
    status: 'ALL',
    date: dayjs().format('YYYY-MM-DD')
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'ALL', label: 'All Status', icon: FileText, color: 'gray' },
    { value: 'A', label: 'Approved', icon: CheckCircle, color: 'green' },
    { value: 'P', label: 'Pending', icon: Clock, color: 'yellow' },
    { value: 'R', label: 'Rejected', icon: XCircle, color: 'red' }
  ];

  const fetchLeaveHistory = async () => {
    if (!userData?.ls_EMPCODE) {
      setError('Employee Code missing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedDate = dayjs(filters.date).format('YYYYMMDD');
      const checkedValue = filters.checked ? 'Y' : 'N';
      
      const res = await axios.get(
        `http://localhost:5000/api/leave-history`,
        {
          params: {
            ls_EmpCode: userData.ls_EMPCODE,
            ls_DocDate: formattedDate,
            ls_Check: checkedValue,
            ls_Status: filters.status,
          },
        }
      );

      if (res.data?.success) {
        const history = res.data.leaveHistory;
        if (Array.isArray(history) && history.length > 0) {
          setLeaveData(history);
        } else {
          setLeaveData([]);
          setError('No leave history found for the selected criteria.');
        }
      } else {
        setError(res.data?.message || 'Failed to fetch leave history.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, [userData, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'A': { 
        label: 'Approved', 
        class: 'bg-green-100 text-green-800 border border-green-200',
        icon: CheckCircle,
        color: 'text-green-600'
      },
      'P': { 
        label: 'Pending', 
        class: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        icon: Clock,
        color: 'text-yellow-600'
      },
      'R': { 
        label: 'Rejected', 
        class: 'bg-red-100 text-red-800 border border-red-200',
        icon: XCircle,
        color: 'text-red-600'
      }
    };
    
    const statusInfo = statusMap[status] || { 
      label: status || 'Unknown', 
      class: 'bg-gray-100 text-gray-800 border border-gray-200',
      icon: AlertCircle,
      color: 'text-gray-600'
    };
    
    const IconComponent = statusInfo.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        <IconComponent className={`w-3.5 h-3.5 ${statusInfo.color}`} />
        {statusInfo.label}
      </span>
    );
  };

  const filteredData = leaveData.filter(item =>
    item.leaveName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateStats = () => {
    const stats = {
      total: filteredData.length,
      approved: filteredData.filter(item => item.status === 'A').length,
      pending: filteredData.filter(item => item.status === 'P').length,
      rejected: filteredData.filter(item => item.status === 'R').length,
      totalUsed: filteredData.reduce((sum, item) => sum + (parseFloat(item.usedLeave) || 0), 0),
      totalAvailable: filteredData.reduce((sum, item) => sum + (parseFloat(item.openLeave) || 0), 0)
    };
    stats.totalBalance = stats.totalAvailable - stats.totalUsed;
    return stats;
  };

  const stats = calculateStats();

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Header */}
        <motion.div variants={cardVariants} className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Leave History</h1>
                </div>
                <p className="text-blue-100">Track and analyze your leave applications</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <motion.button
                  onClick={() => fetchLeaveHistory()}
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

        {/* Stats Cards */}
        <motion.div variants={cardVariants} className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard icon={FileText} label="Total Leaves" value={stats.total} color="blue" />
          <StatsCard icon={CheckCircle} label="Approved" value={stats.approved} color="green" />
          <StatsCard icon={Clock} label="Pending" value={stats.pending} color="yellow" />
          <StatsCard icon={XCircle} label="Rejected" value={stats.rejected} color="red" />
          <StatsCard icon={TrendingUp} label="Total Used" value={stats.totalUsed.toFixed(1)} color="purple" />
          <StatsCard icon={Sparkles} label="Balance" value={stats.totalBalance.toFixed(1)} color="indigo" />
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
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Leaves
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by leave type, name, or reason..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
            {/* Checked Filter */}
            <div className="flex items-center">
              <motion.button
                onClick={() => handleFilterChange('checked', !filters.checked)}
                className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {filters.checked ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium">Show additional details</span>
              </motion.button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'table' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'cards' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={cardVariants}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-16"
              >
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-lg font-medium">Loading leave history...</span>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
              >
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
                <p className="text-red-600">{error}</p>
              </motion.div>
            ) : filteredData.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center"
              >
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Leave History Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
              </motion.div>
            ) : viewMode === 'table' ? (
              <TableView data={filteredData} filters={filters} getStatusBadge={getStatusBadge} />
            ) : (
              <CardsView data={filteredData} filters={filters} getStatusBadge={getStatusBadge} />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl border ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Table View Component
const TableView = ({ data, filters, getStatusBadge }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
  >
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Leave Details
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Available
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Used
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Last Used
            </th>
            {filters.checked && (
              <>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date Range
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reason
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((item, i) => {
            const open = parseFloat(item.openLeave || 0);
            const used = parseFloat(item.usedLeave || 0);
            const balance = (open - used).toFixed(2);

            return (
              <motion.tr 
                key={i} 
                className="hover:bg-gray-50 transition-colors group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.leaveName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.leaveType}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-gray-900">{open}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-gray-900">{used}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balance}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {item.leaveDate ? dayjs(item.leaveDate).format('DD MMM YYYY') : 'Never'}
                  </span>
                </td>
                {filters.checked && (
                  <>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.fromDate && item.toDate ? (
                          <div>
                            <div>{dayjs(item.fromDate).format('DD MMM YYYY')}</div>
                            {item.fromDate !== item.toDate && (
                              <div className="text-gray-500">to {dayjs(item.toDate).format('DD MMM YYYY')}</div>
                            )}
                          </div>
                        ) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 max-w-xs truncate block">
                        {item.reason || '-'}
                      </span>
                    </td>
                  </>
                )}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// Cards View Component
const CardsView = ({ data, filters, getStatusBadge }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.map((item, i) => {
      const open = parseFloat(item.openLeave || 0);
      const used = parseFloat(item.usedLeave || 0);
      const balance = (open - used).toFixed(2);

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
                {item.leaveName}
              </h3>
              <p className="text-sm text-gray-500">{item.leaveType}</p>
            </div>
            {filters.checked && item.status && (
              <div className="ml-3">
                {getStatusBadge(item.status)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="text-sm text-blue-600 font-medium">Available</div>
              <div className="text-lg font-bold text-blue-700">{open}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <div className="text-sm text-orange-600 font-medium">Used</div>
              <div className="text-lg font-bold text-orange-700">{used}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-sm text-green-600 font-medium">Balance</div>
              <div className={`text-lg font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {balance}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Used:</span>
              <span className="font-medium text-gray-800">
                {item.leaveDate ? dayjs(item.leaveDate).format('DD MMM YYYY') : 'Never'}
              </span>
            </div>

            {filters.checked && (
              <>
                {item.fromDate && item.toDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date Range:</span>
                    <span className="font-medium text-gray-800">
                      {dayjs(item.fromDate).format('DD MMM YYYY')}
                      {item.fromDate !== item.toDate && ` - ${dayjs(item.toDate).format('DD MMM YYYY')}`}
                    </span>
                  </div>
                )}
                {item.reason && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-gray-600">Reason:</span>
                    <p className="text-gray-800 mt-1 text-sm">{item.reason}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default LeaveHistory;
