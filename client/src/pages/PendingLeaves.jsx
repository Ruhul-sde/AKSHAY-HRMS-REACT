import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

// Move AuthContext to a separate file
import { useAuth } from '../context/AuthContext';

const PendingLeaves = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const { userData } = useAuth();

  const formatDateForAPI = (date) => {
    return format(date, 'yyyyMMdd');
  };

  const fetchPendingLeaves = async () => {
    if (!userData?.ls_EMPCODE) {
      setError('Authentication required');
      return;
    }

    try {
      setLoading(true);
      const formattedDate = formatDateForAPI(selectedDate);
      
      const response = await axios.get(
        `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetPendingLeave`,
        {
          params: {
            EMPCode: userData.ls_EMPCODE,
            Date: formattedDate
          }
        }
      );

      if (response.data?.lst_ClsPendingLeavDtls) {
        setPendingLeaves(response.data.lst_ClsPendingLeavDtls);
      } else {
        throw new Error('No leave data found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, [selectedDate, userData]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Leaves</h1>
      
      <div className="mb-4 flex gap-4">
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchPendingLeaves}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Leave Type</th>
              <th className="border p-2">Leave Name</th>
              <th className="border p-2">Open Leave</th>
              <th className="border p-2">Used Leave</th>
              <th className="border p-2">Pending Leave</th>
              <th className="border p-2">Rejected Leave</th>
            </tr>
          </thead>
          <tbody>
            {pendingLeaves.map((leave, index) => (
              <tr key={index}>
                <td className="border p-2">{leave.ls_LeavTyp}</td>
                <td className="border p-2">{leave.ls_LeavName}</td>
                <td className="border p-2">{leave.ls_OpenLeav}</td>
                <td className="border p-2">{leave.ls_UsedLeav}</td>
                <td className="border p-2">{leave.ls_PendLeav}</td>
                <td className="border p-2">{leave.ls_RejLeav}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingLeaves;