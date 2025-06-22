import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const AttendanceReport = ({ userData }) => {
  const [month, setMonth] = useState(dayjs().format('MM-YYYY'));
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    if (!month) {
      return setError("Month is required.");
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`/api/attendance?EMPCode=${userData.ls_EMPCODE}&Month=${month}`);
      setAttendanceData(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch attendance report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-4 py-10">
      <motion.div
        className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">Attendance Report</h2>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <label className="text-sm font-medium text-gray-700">Select Month (MM-YYYY)</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="e.g. 06-2025"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <button
            onClick={fetchAttendance}
            className="mt-2 md:mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            View Report
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm border border-gray-200">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-3 py-2 border">Date</th>
                  <th className="px-3 py-2 border">Day Type</th>
                  <th className="px-3 py-2 border">Late Mark</th>
                  <th className="px-3 py-2 border">Sys In</th>
                  <th className="px-3 py-2 border">Sys Out</th>
                  <th className="px-3 py-2 border">Sys Time</th>
                  <th className="px-3 py-2 border">Manual In</th>
                  <th className="px-3 py-2 border">Manual Out</th>
                  <th className="px-3 py-2 border">Manual Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((item, idx) => (
                    <tr key={idx} className="text-center hover:bg-gray-50">
                      <td className="border px-2 py-1">{dayjs(item.ls_SysInDt).format('DD-MM-YYYY')}</td>
                      <td className="border px-2 py-1">{item.ls_DayType}</td>
                      <td className="border px-2 py-1">{item.ls_LateMark}</td>
                      <td className="border px-2 py-1">{item.ls_SysInTm}</td>
                      <td className="border px-2 py-1">{item.ls_SysOutTm}</td>
                      <td className="border px-2 py-1">{item.ls_SysTotTm}</td>
                      <td className="border px-2 py-1">{item.ls_ManInTm}</td>
                      <td className="border px-2 py-1">{item.ls_ManOutTm}</td>
                      <td className="border px-2 py-1">{item.ls_ManTotTm}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AttendanceReport;
