import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Send,
  User,
  CalendarDays,
  Timer,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import Navbar from '../components/Navbar';

const LeaveApply = ({ userData, setUserData }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    leaveType: '',
    dayType: 'fullDay',
    date: '',
    fromDate: '',
    toDate: '',
    fromTime: '',
    toTime: '',
    reason: '',
    numDays: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
        fromTime: '',
        toTime: '',
        numDays: value === 'halfDay' ? 0.5 : value === 'fullDay' ? 1 : 0
      };
    }

    // Auto-set dates for full day leave
    if (name === 'date' && updated.dayType === 'fullDay') {
      updated.fromDate = value;
      updated.toDate = value;
      updated.numDays = 1;
    }

    // Calculate half day duration
    if ((name === 'fromTime' || name === 'toTime') && form.dayType === 'halfDay') {
      if (updated.fromTime && updated.toTime) {
        const [fh, fm] = updated.fromTime.split(':').map(Number);
        const [th, tm] = updated.toTime.split(':').map(Number);
        const fromMinutes = fh * 60 + fm;
        const toMinutes = th * 60 + tm;
        const duration = toMinutes - fromMinutes;
        
        if (duration <= 0) {
          setError('End time must be after start time');
          updated.numDays = 0;
        } else {
          updated.numDays = Math.min(duration / 480, 0.5);
        }
      }
    }

    // Handle date changes for multi-day
    if ((name === 'fromDate' || name === 'toDate') && updated.dayType === 'multiDay') {
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

    if (form.dayType === 'halfDay' && (!form.fromTime || !form.toTime)) {
      setError('Please select both start and end times for half day');
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
      let fromTime = '';
      let toTime = '';

      if (form.dayType === 'halfDay') {
        fromTime = form.fromTime;
        toTime = form.toTime;
      }

      let finalFromDate, finalToDate;
      if (form.dayType === 'multiDay') {
        finalFromDate = form.fromDate;
        finalToDate = form.toDate;
      } else {
        finalFromDate = form.date;
        finalToDate = form.date;
      }

      const res = await axios.post('http://localhost:5000/api/apply-leave', {
        ls_EmpCode: userData.ls_EMPCODE.toString(),
        ls_FromDate: formatDate(finalFromDate),
        ls_ToDate: formatDate(finalToDate),
        ls_DocDate: formatDate(dayjs()),
        ls_NofDays: form.numDays.toString(),
        ls_FromTime: form.dayType === 'halfDay' ? fromTime : '',
        ls_ToTime: form.dayType === 'halfDay' ? toTime : '',
        ls_LeavTyp: form.leaveType,
        ls_Reason: form.reason,
        ls_GrpNo: '5'
      });

      if (res.data?.success) {
        setSuccess(res.data.message || 'Leave applied successfully');
        setForm({
          leaveType: '',
          dayType: form.dayType,
          date: '',
          fromDate: '',
          toDate: '',
          fromTime: '',
          toTime: '',
          reason: '',
          numDays: 0
        });
      } else {
        setError(res.data?.message || 'Application failed. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Server error occurred');
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = dayjs().format('YYYY-MM-DD');

  const getStepProgress = () => {
    if (form.leaveType && form.dayType) {
      if (form.dayType === 'multiDay' && form.fromDate && form.toDate) return 3;
      if (['fullDay', 'halfDay'].includes(form.dayType) && form.date) {
        if (form.dayType === 'halfDay' && form.fromTime && form.toTime) return 3;
        if (form.dayType === 'fullDay') return 3;
      }
      return 2;
    }
    if (form.leaveType) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Apply for Leave
              </h1>
              <p className="text-gray-600 mt-1">Submit your time-off request with ease</p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    getStepProgress() >= step
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {getStepProgress() >= step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded transition-all duration-300 ${
                    getStepProgress() > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-8 mt-4 text-sm">
            <span className={getStepProgress() >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Leave Type</span>
            <span className={getStepProgress() >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Duration</span>
            <span className={getStepProgress() >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Review</span>
          </div>
        </div>

        {/* Alert Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Step 1: Leave Type Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Select Leave Type</h3>
                  <p className="text-gray-500 text-sm">Choose the type of leave you want to apply for</p>
                </div>
              </div>
              
              <div className="relative">
                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white text-lg font-medium appearance-none cursor-pointer"
                  disabled={loadingLeaveTypes || isSubmitting}
                  required
                >
                  <option value="">
                    {loadingLeaveTypes ? 'Loading leave types...' : 'Select Leave Type'}
                  </option>
                  {leaveTypes.map(type => (
                    <option key={type.code} value={type.code}>
                      {type.name} ({type.code})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                </div>
              </div>
            </div>

            {/* Step 2: Duration Type Selection */}
            {form.leaveType && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <CalendarDays className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Choose Duration</h3>
                    <p className="text-gray-500 text-sm">Select how long you need to be away</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Full Day Option */}
                  <label 
                    className={`group relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      form.dayType === 'fullDay' 
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dayType"
                      value="fullDay"
                      checked={form.dayType === 'fullDay'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-3">
                      <Calendar className={`w-6 h-6 ${form.dayType === 'fullDay' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.dayType === 'fullDay' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {form.dayType === 'fullDay' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Full Day</h4>
                    <p className="text-sm text-gray-500">Complete day off</p>
                    <div className="mt-3 text-xs font-medium text-blue-600">1 day</div>
                  </label>

                  {/* Half Day Option */}
                  <label 
                    className={`group relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      form.dayType === 'halfDay' 
                        ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-100' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dayType"
                      value="halfDay"
                      checked={form.dayType === 'halfDay'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-3">
                      <Timer className={`w-6 h-6 ${form.dayType === 'halfDay' ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.dayType === 'halfDay' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                      }`}>
                        {form.dayType === 'halfDay' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Half Day</h4>
                    <p className="text-sm text-gray-500">Custom time range</p>
                    <div className="mt-3 text-xs font-medium text-purple-600">≤ 0.5 day</div>
                  </label>

                  {/* Multi-Day Option */}
                  <label 
                    className={`group relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      form.dayType === 'multiDay' 
                        ? 'border-green-500 bg-green-50 shadow-lg shadow-green-100' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dayType"
                      value="multiDay"
                      checked={form.dayType === 'multiDay'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-3">
                      <CalendarDays className={`w-6 h-6 ${form.dayType === 'multiDay' ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.dayType === 'multiDay' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}>
                        {form.dayType === 'multiDay' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Multi-Day</h4>
                    <p className="text-sm text-gray-500">Extended leave</p>
                    <div className="mt-3 text-xs font-medium text-green-600">Multiple days</div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Date and Time Selection */}
            {form.leaveType && form.dayType && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Select Dates & Times</h3>
                    <p className="text-gray-500 text-sm">Specify when you need time off</p>
                  </div>
                </div>

                {/* Half Day Time Selection */}
                {form.dayType === 'halfDay' && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Timer className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-800">Custom Time Range</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Time
                        </label>
                        <input
                          type="time"
                          name="fromTime"
                          value={form.fromTime}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          To Time
                        </label>
                        <input
                          type="time"
                          name="toTime"
                          value={form.toTime}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    {form.fromTime && form.toTime && (
                      <div className="mt-4 p-3 bg-white border border-purple-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-purple-600" />
                          <p className="text-sm font-medium text-purple-800">
                            Half day from {form.fromTime} to {form.toTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Date Selection */}
                {form.dayType === 'multiDay' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        name="fromDate"
                        value={form.fromDate}
                        onChange={handleChange}
                        min={today}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        name="toDate"
                        value={form.toDate}
                        onChange={handleChange}
                        min={form.fromDate || today}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={today}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                )}

                {/* Summary Card */}
                {((form.dayType === 'multiDay' && form.fromDate && form.toDate) || 
                  (['fullDay', 'halfDay'].includes(form.dayType) && form.date)) && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-800">Leave Summary</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-800">
                          {form.numDays} {form.numDays === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-semibold text-gray-800">
                          {form.dayType === 'fullDay' ? 'Full Day' : 
                           form.dayType === 'halfDay' ? 'Half Day' : 'Multi-Day'}
                        </span>
                      </div>
                      {form.dayType === 'fullDay' && form.date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold text-gray-800">
                            {dayjs(form.date).format('MMMM D, YYYY')}
                          </span>
                        </div>
                      )}
                      {form.dayType === 'halfDay' && form.fromTime && form.toTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-semibold text-gray-800">
                            {form.fromTime} - {form.toTime}
                          </span>
                        </div>
                      )}
                      {form.dayType === 'multiDay' && form.fromDate && form.toDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dates:</span>
                          <span className="font-semibold text-gray-800">
                            {dayjs(form.fromDate).format('MMM D')} - {dayjs(form.toDate).format('MMM D, YYYY')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reason Section */}
            {form.leaveType && form.dayType && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Reason (Optional)</h3>
                    <p className="text-gray-500 text-sm">Brief description of your leave</p>
                  </div>
                </div>
                <textarea
                  name="reason"
                  placeholder="Enter reason for leave (optional)"
                  value={form.reason}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 resize-none"
                />
              </div>
            )}

            {/* Submit Button */}
            {form.leaveType && form.dayType && (
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full group relative overflow-hidden py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Submit Leave Application
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApply;