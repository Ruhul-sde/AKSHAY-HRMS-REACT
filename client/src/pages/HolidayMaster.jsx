import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  CalendarDays,
  PartyPopper,
  Building2,
  Grid3X3,
  List,
  FileText,
  Clock,
  Gift,
  Star,
  MapPin,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';

const HolidayMaster = ({ userData, setUserData }) => {
  const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    finYear: 'FY202526'
  });
  const [branchCode, setBranchCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards');

  const finYearOptions = [
    { value: 'FY202324', label: 'FY 2023-24' },
    { value: 'FY202425', label: 'FY 2024-25' },
    { value: 'FY202526', label: 'FY 2025-26' },
    { value: 'FY202627', label: 'FY 2026-27' }
  ];

  const fetchHolidayData = async () => {
    setLoading(true);
    setError('');

    // Check if we have branch ID from profile
    if (!userData?.ls_BrnchId) {
      setError('Branch ID not found in profile. Please contact administrator.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/holiday-report`,
        {
          params: {
            ls_BranchId: userData.ls_BrnchId, // Use branch ID from profile
            ls_FinYear: filters.finYear
          },
        }
      );

      if (res.data.success) {
        setHolidayData(res.data.holidayData || []);
      } else {
        setError(res.data.message || 'Failed to fetch holiday data');
      }
    } catch (err) {
      console.error('Holiday fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch holiday data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && userData.ls_EMPCODE) {
      fetchHolidayData();
    }
  }, [userData, filters.finYear]); // Re-fetch if userData or financial year changes

  const filteredHolidays = holidayData.filter(holiday =>
    holiday.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHolidayIcon = (reason) => {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('diwali') || lowerReason.includes('festival')) return Gift;
    if (lowerReason.includes('independence') || lowerReason.includes('republic')) return Star;
    if (lowerReason.includes('ganesh') || lowerReason.includes('holi')) return PartyPopper;
    if (lowerReason.includes('gandhi')) return MapPin;
    return CalendarDays;
  };

  const getHolidayColor = (reason) => {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('diwali')) return 'from-orange-500 to-red-500';
    if (lowerReason.includes('holi')) return 'from-pink-500 to-purple-500';
    if (lowerReason.includes('independence') || lowerReason.includes('republic')) return 'from-blue-500 to-green-500';
    if (lowerReason.includes('ganesh')) return 'from-yellow-500 to-orange-500';
    if (lowerReason.includes('gandhi')) return 'from-gray-500 to-blue-500';
    return 'from-indigo-500 to-purple-500';
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Holiday', 'Day'],
      ...filteredHolidays.map(holiday => [
        dayjs(holiday.holidayDate).format('DD-MM-YYYY'), // Proper date format
        holiday.reason,
        dayjs(holiday.holidayDate).format('dddd')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `holidays_${filters.finYear}_${userData?.ls_EMPCODE || 'N/A'}.csv`;
    link.click();
  };

  const HolidayCard = ({ holiday, index }) => {
    const HolidayIcon = getHolidayIcon(holiday.reason);
    const colorGradient = getHolidayColor(holiday.reason);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${colorGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorGradient} flex items-center justify-center shadow-lg`}>
              <HolidayIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {dayjs(holiday.holidayDate).format('DD')}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                {dayjs(holiday.holidayDate).format('MMM')}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
            {holiday.reason}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {dayjs(holiday.holidayDate).format('dddd')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {dayjs(holiday.holidayDate).format('YYYY')}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const HolidayTable = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Day
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Holiday
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredHolidays.map((holiday, index) => {
              const HolidayIcon = getHolidayIcon(holiday.reason);
              const colorGradient = getHolidayColor(holiday.reason);

              return (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorGradient} flex items-center justify-center`}>
                        <HolidayIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {dayjs(holiday.holidayDate).format('DD MMM YYYY')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-600">
                      {dayjs(holiday.holidayDate).format('dddd')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {holiday.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${colorGradient} text-white`}>
                      <Sparkles className="w-3 h-3 mr-1" />
                      Festival
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <CalendarDays className="w-7 h-7 text-white" />
                </div>
                Holiday Master
              </h1>
              <p className="text-gray-600 mt-2">Manage and view company holidays</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                disabled={loading || filteredHolidays.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>

              <button
                onClick={fetchHolidayData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Adjusted grid for one less filter */}

            {/* Financial Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Financial Year
              </label>
              <select
                value={filters.finYear}
                onChange={(e) => setFilters({ ...filters, finYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                {finYearOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Holidays
              </label>
              <input
                type="text"
                placeholder="Search by holiday name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">
                    Showing {filteredHolidays.length} of {holidayData.length} holidays
                  </span>
                </div>
                <div className="text-sm opacity-90">
                  {filters.finYear} • Branch {userData?.ls_BrnchId || 'N/A'} • Employee {userData?.ls_EMPCODE || 'N/A'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading holidays...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Holidays</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchHolidayData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : filteredHolidays.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Holidays Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            </motion.div>
          ) : viewMode === 'cards' ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredHolidays.map((holiday, index) => (
                <HolidayCard key={index} holiday={holiday} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HolidayTable />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HolidayMaster;