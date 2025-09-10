import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  RefreshCw
} from 'lucide-react';
import api from '../api';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HolidayMaster = ({ userData, setUserData }) => {
  const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFinYear, setSelectedFinYear] = useState('FY2025_26');
  
  const financialYears = [
    { value: 'FY2024_25', label: 'FY 2024-25' },
    { value: 'FY2025_26', label: 'FY 2025-26' },
    { value: 'FY2026_27', label: 'FY 2026-27' }
  ];

  // Fetch holiday data on component mount and when financial year changes
  useEffect(() => {
    fetchHolidayData();
  }, [selectedFinYear]);

  const fetchHolidayData = async () => {
    if (!userData?.ls_BrnchId) {
      console.error('Branch ID not available in user data');
      return;
    }

    setLoading(true);
    try {
      // Call external WCF API directly
      const response = await fetch(
        `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetHolidayRpt?Branch=${userData.ls_BrnchId}&FinYear=${selectedFinYear}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('External API response:', data);

      // Check for error status like other WCF APIs
      const { l_ClsErrorStatus, lst_ClsHolidayRptDtls = [] } = data;
      
      if (l_ClsErrorStatus?.ls_Status !== "S") {
        console.error('Holiday API error:', l_ClsErrorStatus?.ls_Message);
        setHolidayData([]);
        return;
      }

      // Map the API response to the expected format
      const holidayData = lst_ClsHolidayRptDtls.map(item => ({
        holidayId: item.ls_HolidayId,
        holidayName: item.ls_HolidayName,
        holidayDate: item.ls_HolidayDate,
        holidayType: item.ls_HolidayType,
        description: item.ls_Description,
        branch: item.ls_Branch,
        finYear: item.ls_FinYear,
        dayOfWeek: item.ls_DayOfWeek,
        isOptional: item.ls_IsOptional,
        category: item.ls_Category
      }));

      setHolidayData(holidayData);
      console.log('Holiday data loaded:', holidayData);

    } catch (err) {
      console.error('Error fetching holiday data:', err.message);
      setHolidayData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Handle different date formats that might come from the API
    try {
      // If it's in YYYYMMDD format, convert it
      if (dateString.length === 8 && !isNaN(dateString)) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return dayjs(`${year}-${month}-${day}`).format('DD MMM YYYY');
      }
      
      // Otherwise use dayjs directly
      return dayjs(dateString).format('DD MMM YYYY');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="text-sm text-gray-600">
            Total Holidays: <span className="font-semibold text-gray-900">{holidayData.length}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Financial Year Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Financial Year:</label>
              <select
                value={selectedFinYear}
                onChange={(e) => setSelectedFinYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {financialYears.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
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
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Optional
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {holidayData.map((holiday, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {holiday.holidayName || 'N/A'}
                        </div>
                        {holiday.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {holiday.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(holiday.holidayDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {holiday.dayOfWeek || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          holiday.category === 'NATIONAL' 
                            ? 'bg-red-100 text-red-800' 
                            : holiday.category === 'REGIONAL'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {holiday.holidayType || holiday.category || 'Holiday'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          holiday.isOptional === 'Y' || holiday.isOptional === true
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {holiday.isOptional === 'Y' || holiday.isOptional === true ? 'Optional' : 'Mandatory'}
                        </span>
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