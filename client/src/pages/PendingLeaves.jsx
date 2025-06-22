import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { Loader2, AlertTriangle, CalendarClock } from 'lucide-react';

const PendingLeaves = () => {
  const [empCode, setEmpCode] = useState('');
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const storedEmpCode = localStorage.getItem('empCode');

    if (!storedEmpCode) {
      setError('Employee code not found. Please log in again.');
      setLoading(false);
      return;
    }

    setEmpCode(storedEmpCode);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetPendingLeave?EMPCode=${storedEmpCode}&Date=${today}`
        );

        const { l_ClsErrorStatus, lst_ClsPendingLeavDtls } = response.data;

        if (l_ClsErrorStatus?.ls_ErrorCode === '0' && Array.isArray(lst_ClsPendingLeavDtls)) {
          setPendingLeaves(lst_ClsPendingLeavDtls);
        } else {
          setPendingLeaves([]);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load pending leaves. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <CalendarClock className="w-7 h-7 text-blue-600" />
          Pending Leaves
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex items-center text-red-600 bg-red-100 p-4 rounded-md">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        ) : pendingLeaves.length === 0 ? (
          <div className="text-gray-600 text-center bg-white py-10 rounded-lg shadow">
            <p>No pending leaves found.</p>
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 font-medium">Leave Type</th>
                    <th className="px-4 py-3 font-medium">Leave Name</th>
                    <th className="px-4 py-3 font-medium text-center">Open</th>
                    <th className="px-4 py-3 font-medium text-center">Used</th>
                    <th className="px-4 py-3 font-medium text-center">Pending</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pendingLeaves.map((leave, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all">
                      <td className="px-4 py-2">{leave.ls_LeavTyp}</td>
                      <td className="px-4 py-2">{leave.ls_LeavName}</td>
                      <td className="px-4 py-2 text-center">{leave.ls_OpenLeav}</td>
                      <td className="px-4 py-2 text-center">{leave.ls_UsedLeav}</td>
                      <td className="px-4 py-2 text-center font-semibold text-blue-600">
                        {leave.ls_PendLeav}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PendingLeaves;
