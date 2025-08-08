import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HolidayMaster = ({ userData, setUserData }) => {
  const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch holiday data on component mount
  useEffect(() => {
    fetchHolidayData();
  }, []);

  const fetchHolidayData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/holiday-report', {
        params: {
          ls_Branch: 'PUNE',
          ls_FinYear: 'FY2025-26'
        }
      });

      if (response.data?.success) {
        setHolidayData(response.data.holidayData || []);
      }
    } catch (err) {
      console.error('Error fetching holiday data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD MMM YYYY');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setUserData={setUserData} userData={userData} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Holiday Master</h1>
          <p className="text-gray-600">View company holidays</p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Total Holidays: <span className="font-semibold text-gray-900">{holidayData.length}</span>
          </div>

          <button
            onClick={fetchHolidayData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Holidays List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading holidays...</p>
            </div>
          ) : holidayData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Holiday Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {holidayData.map((holiday, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {holiday.holidayName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(holiday.holidayDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {holiday.holidayType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md truncate">
                          {holiday.description}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No holidays found</h3>
              <p className="text-gray-500">No holidays available for the current period.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HolidayMaster;