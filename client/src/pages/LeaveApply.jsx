import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';

const LeaveApply = ({ userData }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    leaveType: '',
    dayType: 'fullDay',
    date: '',
    fromDate: '',
    toDate: '',
    halfDayPeriod: 'AM', // AM or PM for half day
    reason: '',
    numDays: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      if (!userData?.ls_EMPTYPE) {
        setError('Employee data not available.');
        setLoadingLeaveTypes(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/leave-types?empType=${userData.ls_EMPTYPE}`);
        if (res.data?.success) {
          setLeaveTypes(res.data.leaveTypes);
        } else {
          setError(res.data.message || 'No leave types found.');
        }
      } catch (err) {
        setError('Failed to load leave types.');
      } finally {
        setLoadingLeaveTypes(false);
      }
    };
    fetchLeaveTypes();
  }, [userData]);

  const formatDate = (date) => dayjs(date).format('YYYYMMDD');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };
    setError('');
    setSuccess('');

    if (name === 'dayType') {
      updated = {
        ...updated,
        fromDate: '',
        toDate: '',
        date: '',
        numDays: value === 'halfDay' ? 0.5 : value === 'fullDay' ? 1 : 0
      };
    }

    if (name === 'date' && ['fullDay', 'halfDay'].includes(form.dayType)) {
      updated.fromDate = value;
      updated.toDate = value;
    }

    if ((name === 'fromDate' || name === 'toDate') && form.dayType === 'multiDay') {
      if (updated.fromDate && updated.toDate) {
        const start = dayjs(updated.fromDate);
        const end = dayjs(updated.toDate);
        updated.numDays = end.isBefore(start) ? 0 : end.diff(start, 'day') + 1;
        if (end.isBefore(start)) setError('End date must be after start date');
      }
    }

    setForm(updated);
  };

  const validateForm = () => {
    if (!form.leaveType) {
      setError('Please select a leave type');
      return false;
    }
    
    if (['fullDay', 'halfDay'].includes(form.dayType) && !form.date) {
      setError('Please select a date');
      return false;
    }
    
    if (form.dayType === 'multiDay' && (!form.fromDate || !form.toDate)) {
      setError('Please select both start and end dates');
      return false;
    }
    
    if (form.numDays <= 0) {
      setError('Invalid leave duration');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Set default times based on half day period
      let fromTime = '09:00';
      let toTime = '18:00';
      
      if (form.dayType === 'halfDay') {
        fromTime = form.halfDayPeriod === 'AM' ? '09:00' : '13:00';
        toTime = form.halfDayPeriod === 'AM' ? '13:00' : '18:00';
      }

      const res = await axios.post('http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/LeavApply', {
        ls_EmpCode: userData.ls_EMPCODE.toString(),
        ls_FromDate: formatDate(form.dayType === 'multiDay' ? form.fromDate : form.date),
        ls_ToDate: formatDate(form.dayType === 'multiDay' ? form.toDate : form.date),
        ls_DocDate: formatDate(dayjs()),
        ls_NofDays: form.numDays.toString(),
        ls_FromTime: form.dayType === 'halfDay' ? fromTime : '',
        ls_ToTime: form.dayType === 'halfDay' ? toTime : '',
        ls_LeavTyp: form.leaveType,
        ls_Reason: form.reason,
        ls_Status: 'A',
        ls_GrpNo: '5'
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });

      if (res.data?.li_ErrorCode === 0) {
        setSuccess(res.data.ls_Message || 'Leave applied successfully');
        // Reset form but keep the dayType selection
        setForm({
          leaveType: '',
          dayType: form.dayType,
          date: '',
          fromDate: '',
          toDate: '',
          halfDayPeriod: 'AM',
          reason: '',
          numDays: 0
        });
      } else {
        setError(res.data?.ls_Message || 'Application failed. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        // Server responded with non-2xx status
        setError(err.response.data?.message || 'Server error occurred');
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection and CORS configuration.');
      } else {
        // Something else happened
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }} 
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Apply for Leave</h1>
            <p className="text-gray-600 mt-2">Submit your leave request for approval</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <p className="font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={loadingLeaveTypes || isSubmitting}
                required
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map(type => (
                  <option key={type.code} value={type.code}>
                    {type.name} ({type.code})
                  </option>
                ))}
              </select>
              {loadingLeaveTypes && (
                <p className="mt-1 text-sm text-gray-500">Loading leave types...</p>
              )}
            </div>

            {/* Duration Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duration Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Full Day Option */}
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition ${form.dayType === 'fullDay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="dayType"
                    value="fullDay"
                    checked={form.dayType === 'fullDay'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mb-2 ${form.dayType === 'fullDay' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                    {form.dayType === 'fullDay' && <div className="w-3 h-3 rounded-full bg-white"></div>}
                  </div>
                  <span className="font-medium">Full Day</span>
                  <span className="text-sm text-gray-500 mt-1">1 day</span>
                </label>

                {/* Half Day Option */}
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition ${form.dayType === 'halfDay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="dayType"
                    value="halfDay"
                    checked={form.dayType === 'halfDay'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mb-2 ${form.dayType === 'halfDay' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                    {form.dayType === 'halfDay' && <div className="w-3 h-3 rounded-full bg-white"></div>}
                  </div>
                  <span className="font-medium">Half Day</span>
                  <span className="text-sm text-gray-500 mt-1">0.5 day</span>
                </label>

                {/* Multi-Day Option */}
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition ${form.dayType === 'multiDay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="dayType"
                    value="multiDay"
                    checked={form.dayType === 'multiDay'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mb-2 ${form.dayType === 'multiDay' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                    {form.dayType === 'multiDay' && <div className="w-3 h-3 rounded-full bg-white"></div>}
                  </div>
                  <span className="font-medium">Multi-Day</span>
                  <span className="text-sm text-gray-500 mt-1">Bulk leave</span>
                </label>
              </div>
            </div>

            {/* Half Day Period Selection (only shown when halfDay is selected) */}
            {form.dayType === 'halfDay' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Half Day Period <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${form.halfDayPeriod === 'AM' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="halfDayPeriod"
                      value="AM"
                      checked={form.halfDayPeriod === 'AM'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${form.halfDayPeriod === 'AM' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                        {form.halfDayPeriod === 'AM' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span>Morning (9 AM - 1 PM)</span>
                    </div>
                  </label>
                  <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${form.halfDayPeriod === 'PM' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="halfDayPeriod"
                      value="PM"
                      checked={form.halfDayPeriod === 'PM'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${form.halfDayPeriod === 'PM' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                        {form.halfDayPeriod === 'PM' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span>Afternoon (1 PM - 6 PM)</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Date Selection */}
            {form.dayType === 'multiDay' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={form.fromDate}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={form.toDate}
                    onChange={handleChange}
                    min={form.fromDate || today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                {form.fromDate && form.toDate && (
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-lg">
                    <p className="text-sm font-medium">
                      Total leave days: <span className="font-bold">{form.numDays}</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
                {form.date && (
                  <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-lg">
                    <p className="text-sm font-medium">
                      {form.dayType === 'halfDay' ? 
                        `Half day (${form.halfDayPeriod === 'AM' ? 'Morning' : 'Afternoon'}) leave on ${dayjs(form.date).format('MMMM D, YYYY')}` : 
                        `Full day leave on ${dayjs(form.date).format('MMMM D, YYYY')}`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                name="reason"
                placeholder="Enter reason for leave (optional)"
                value={form.reason}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Apply for Leave'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveApply;