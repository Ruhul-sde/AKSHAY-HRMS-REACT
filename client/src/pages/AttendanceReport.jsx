import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import { Calendar, Clock, User, Download, RefreshCw } from 'lucide-react';

const AttendanceReport = ({ userData }) => {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    if (!month) {
      setError("Month is required.");
      return;
    }

    // Validate month format
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
      'WD': { label: 'Working Day', class: 'bg-blue-100 text-blue-800' },
      'WO': { label: 'Week Off', class: 'bg-gray-100 text-gray-800' },
      'H': { label: 'Holiday', class: 'bg-red-100 text-red-800' },
      'L': { label: 'Leave', class: 'bg-yellow-100 text-yellow-800' }
    };

    const typeInfo = typeMap[dayType] || { label: dayType || 'Unknown', class: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.class}`}>
        {typeInfo.label}
      </span>
    );
  };

  const getLateMarkBadge = (lateMark) => {
    return lateMark === 'Y' ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Late
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        On Time
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userData={userData} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Report</h1>
          <p className="text-gray-600">View detailed attendance records for the selected month</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Month Selection</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month (YYYY-MM)
              </label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="2025-06"
                maxLength={7}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM (e.g., 2025-06)</p>
            </div>

            <button
              onClick={fetchAttendance}
              disabled={loading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              {loading ? 'Loading...' : 'View Report'}
            </button>
          </div>
        </div>

        {/* Employee Info */}
        {attendanceData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">
                {attendanceData[0].empName} ({attendanceData[0].empCode})
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Attendance Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading attendance report...</span>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {attendanceData.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No attendance data found for the selected month.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Day Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Late Mark
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manual In
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manual Out
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manual Hours
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        System In
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        System Out
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        System Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatDate(item.manInDate)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getDayTypeBadge(item.dayType)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getLateMarkBadge(item.lateMark)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(item.manInTime)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(item.manOutTime)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.manTotalTime || '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(item.sysInTime)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(item.sysOutTime)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.sysTotalTime || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;