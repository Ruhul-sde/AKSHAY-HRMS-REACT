import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceReport = ({ empCode }) => {
  const [month, setMonth] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set current month in yyyy-mm format on initial render
  useEffect(() => {
    const now = new Date();
    const formattedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setMonth(formattedMonth);
  }, []);

  const fetchAttendanceData = async () => {
    if (!empCode || !month) {
      setError('Missing Employee Code or Month.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        'http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetAttendanceRpt',
        {
          params: {
            Month: month,
            EMPCode: empCode,
          },
        }
      );

      console.log("📦 API Raw Response:", response.data);

      const errorStatus = response.data?.l_ClsErrorStatus;
      const reportData = response.data?.lst_ClsAttndncRptDtls;

      if (!errorStatus || errorStatus.ErrorCode !== '0') {
        const message = errorStatus?.ErrorMessage || 'Unknown error from API';
        throw new Error(`API Error: ${message}`);
      }

      setData(reportData || []);
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (month && empCode) {
      fetchAttendanceData();
    }
  }, [month, empCode]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Attendance Report</h1>

      <div className="mb-4 flex gap-4 items-center">
        <label htmlFor="month" className="font-medium">
          Select Month:
        </label>
        <input
          type="month"
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchAttendanceData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-blue-600">Loading attendance data...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p className="text-gray-500">No attendance data available.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">In Time</th>
                <th className="border px-3 py-2">Out Time</th>
                <th className="border px-3 py-2">Total Time</th>
                <th className="border px-3 py-2">Late Mark</th>
                <th className="border px-3 py-2">Day Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={index} className="text-sm">
                  <td className="border px-2 py-1">{record.ls_SysInDt?.split('T')[0] || '-'}</td>
                  <td className="border px-2 py-1">{record.ls_SysInTm || '-'}</td>
                  <td className="border px-2 py-1">{record.ls_SysOutTm || '-'}</td>
                  <td className="border px-2 py-1">{record.ls_SysTotTm || '-'}</td>
                  <td className="border px-2 py-1">{record.ls_LateMark || '-'}</td>
                  <td className="border px-2 py-1">{record.ls_DayType || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
