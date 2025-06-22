import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';

const LeaveHistory = ({ userData }) => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      if (!userData?.ls_EMPCODE) {
        setError('Employee Code missing.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const today = dayjs().format('YYYYMMDD');
        const res = await axios.get(
          `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetLeaveHistory`,
          {
            params: {
              EMPCode: userData.ls_EMPCODE,
              Date: today,
            },
          }
        );

        const list = res.data?.lst_ClsLeavHstryDtls;
        if (Array.isArray(list) && list.length > 0) {
          setLeaveData(list);
        } else {
          setLeaveData([]);
          setError('No leave history found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch leave history.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Leave History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Available</th>
                <th className="border px-4 py-2">Used</th>
                <th className="border px-4 py-2">Balance</th>
                <th className="border px-4 py-2">Last Used</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((item, i) => {
                const open = parseFloat(item.ls_OpenLeav || 0);
                const used = parseFloat(item.ls_UsedLeav || 0);
                const balance = (open - used).toFixed(2);

                return (
                  <tr key={i}>
                    <td className="border px-4 py-2">{item.ls_LeavName}</td>
                    <td className="border px-4 py-2">{open}</td>
                    <td className="border px-4 py-2">{used}</td>
                    <td className="border px-4 py-2">{balance}</td>
                    <td className="border px-4 py-2">
                      {item.ls_LeavDate ? dayjs(item.ls_LeavDate).format('DD MMM YYYY') : 'Never'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaveHistory;
