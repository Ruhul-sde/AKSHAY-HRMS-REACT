
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
  Info,
  Plus,
  ChevronDown,
  Target,
  Zap,
  Star
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  const [showReasonField, setShowReasonField] = useState(false);

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
      setCurrentStep(2);
    }

    // For Full Day and Half Day, set both fromDate and toDate to the same date
    if (name === 'date' && ['fullDay', 'halfDay'].includes(updated.dayType)) {
      updated.fromDate = value;
      updated.toDate = value;
      setCurrentStep(3);
    }

    // Calculate half day duration based on time
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
          setCurrentStep(4);
        }
      }
    }

    // Handle date changes for multi-day
    if ((name === 'fromDate' || name === 'toDate') && updated.dayType === 'multiDay') {
      if (updated.fromDate && updated.toDate) {
        const start = dayjs(updated.fromDate);
        const end = dayjs(updated.toDate);
        updated.numDays = end.isBefore(start) ? 0 : end.diff(start, 'day') + 1;
        if (end.isBefore(start)) {
          setError('End date must be after start date');
        } else {
          setCurrentStep(4);
        }
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
        // For Full Day and Half Day, use the same date for both from and to
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
          dayType: 'fullDay',
          date: '',
          fromDate: '',
          toDate: '',
          fromTime: '',
          toTime: '',
          reason: '',
          numDays: 0
        });
        setCurrentStep(1);
        setShowReasonField(false);
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

  const getCompletionPercentage = () => {
    let completed = 0;
    if (form.leaveType) completed += 25;
    if (form.dayType) completed += 25;
    if (form.dayType === 'multiDay' && form.fromDate && form.toDate) completed += 25;
    if (['fullDay', 'halfDay'].includes(form.dayType) && form.date) {
      if (form.dayType === 'halfDay' && form.fromTime && form.toTime) completed += 25;
      if (form.dayType === 'fullDay') completed += 25;
    }
    if (form.numDays > 0) completed += 25;
    return Math.min(completed, 100);
  };

  const leaveTypeOptions = [
    { value: 'CL', label: 'Casual Leave', icon: '🏖️', description: 'For planned personal activities' },
    { value: 'SL', label: 'Sick Leave', icon: '🏥', description: 'For health-related absences' },
    { value: 'EL', label: 'Earned Leave', icon: '⭐', description: 'Annual earned time off' },
    { value: 'ML', label: 'Maternity Leave', icon: '👶', description: 'For new mothers' },
    { value: 'PL', label: 'Paternity Leave', icon: '👨‍👶', description: 'For new fathers' },
    { value: 'LWP', label: 'Leave Without Pay', icon: '💼', description: 'Unpaid leave period' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-4 mb-6"
            >
              <div className="relative">
                <div className="p-4 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-3xl shadow-2xl">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                >
                  <Star className="w-3 h-3 text-white" />
                </motion.div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Request Leave
                </h1>
                <p className="text-gray-600 text-lg mt-2">Your time off, simplified and streamlined</p>
              </div>
            </motion.div>
            
            {/* Progress Ring */}
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-violet-500"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - getCompletionPercentage() / 100) }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{getCompletionPercentage()}%</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alert Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-2xl shadow-lg"
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
              className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Step 1: Leave Type Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Choose Leave Type</h3>
                  <p className="text-gray-600">Select the category that best fits your request</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingLeaveTypes ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                  </div>
                ) : (
                  leaveTypes.map(type => {
                    const option = leaveTypeOptions.find(opt => opt.value === type.code) || 
                                 { icon: '📝', description: 'Standard leave option' };
                    return (
                      <motion.label
                        key={type.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                          form.leaveType === type.code
                            ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg shadow-violet-100'
                            : 'border-gray-200 hover:border-violet-300 hover:shadow-md bg-white/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="leaveType"
                          value={type.code}
                          checked={form.leaveType === type.code}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{option.icon}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            form.leaveType === type.code 
                              ? 'border-violet-500 bg-violet-500' 
                              : 'border-gray-300 group-hover:border-violet-400'
                          }`}>
                            {form.leaveType === type.code && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">{type.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        <div className="mt-auto">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {type.code}
                          </span>
                        </div>
                      </motion.label>
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* Step 2: Duration Type Selection */}
            <AnimatePresence>
              {form.leaveType && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Select Duration</h3>
                      <p className="text-gray-600">How much time do you need?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Full Day */}
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex flex-col p-8 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${
                        form.dayType === 'fullDay'
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl shadow-blue-100'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white/60'
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
                      <div className="flex items-center justify-between mb-4">
                        <Calendar className={`w-8 h-8 ${form.dayType === 'fullDay' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <Zap className={`w-6 h-6 ${form.dayType === 'fullDay' ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Full Day</h4>
                      <p className="text-gray-600 mb-4">Complete day off work</p>
                      <div className="mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-blue-600 bg-blue-100">
                          1 Day
                        </span>
                      </div>
                    </motion.label>

                    {/* Half Day */}
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex flex-col p-8 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${
                        form.dayType === 'halfDay'
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl shadow-purple-100'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white/60'
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
                      <div className="flex items-center justify-between mb-4">
                        <Timer className={`w-8 h-8 ${form.dayType === 'halfDay' ? 'text-purple-600' : 'text-gray-400'}`} />
                        <Star className={`w-6 h-6 ${form.dayType === 'halfDay' ? 'text-purple-600' : 'text-gray-400'}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Half Day</h4>
                      <p className="text-gray-600 mb-4">Custom time range</p>
                      <div className="mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-purple-600 bg-purple-100">
                          ≤ 0.5 Day
                        </span>
                      </div>
                    </motion.label>

                    {/* Multi-Day */}
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex flex-col p-8 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${
                        form.dayType === 'multiDay'
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl shadow-green-100'
                          : 'border-gray-200 hover:border-green-300 hover:shadow-lg bg-white/60'
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
                      <div className="flex items-center justify-between mb-4">
                        <CalendarDays className={`w-8 h-8 ${form.dayType === 'multiDay' ? 'text-green-600' : 'text-gray-400'}`} />
                        <Plus className={`w-6 h-6 ${form.dayType === 'multiDay' ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Multi-Day</h4>
                      <p className="text-gray-600 mb-4">Extended leave period</p>
                      <div className="mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-green-600 bg-green-100">
                          Multiple Days
                        </span>
                      </div>
                    </motion.label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Date and Time Selection */}
            <AnimatePresence>
              {form.leaveType && form.dayType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                      <CalendarDays className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Pick Your Dates</h3>
                      <p className="text-gray-600">When do you need time off?</p>
                    </div>
                  </div>

                  {/* Date Selection */}
                  {form.dayType === 'multiDay' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="fromDate"
                          value={form.fromDate}
                          onChange={handleChange}
                          min={today}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg font-medium"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="toDate"
                          value={form.toDate}
                          onChange={handleChange}
                          min={form.fromDate || today}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg font-medium"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-md">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Select Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        min={today}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                        required
                      />
                    </div>
                  )}

                  {/* Half Day Time Selection */}
                  {form.dayType === 'halfDay' && form.date && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-3xl p-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Timer className="w-6 h-6 text-purple-600" />
                        <h4 className="text-xl font-bold text-gray-800">Set Time Range</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            From Time
                          </label>
                          <input
                            type="time"
                            name="fromTime"
                            value={form.fromTime}
                            onChange={handleChange}
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-lg font-medium"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            To Time
                          </label>
                          <input
                            type="time"
                            name="toTime"
                            value={form.toTime}
                            onChange={handleChange}
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-lg font-medium"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      {form.fromTime && form.toTime && form.numDays > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-white border border-purple-200 rounded-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <Info className="w-5 h-5 text-purple-600" />
                            <p className="text-sm font-medium text-purple-800">
                              Duration: {form.fromTime} to {form.toTime} ({form.numDays} days)
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Summary Card */}
                  {((form.dayType === 'multiDay' && form.fromDate && form.toDate) || 
                    (['fullDay', 'halfDay'].includes(form.dayType) && form.date && (form.dayType === 'fullDay' || (form.fromTime && form.toTime)))) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-3xl p-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        <h4 className="text-xl font-bold text-gray-800">Leave Summary</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Type:</span>
                            <span className="font-bold text-gray-800">
                              {leaveTypes.find(t => t.code === form.leaveType)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Duration:</span>
                            <span className="font-bold text-blue-600">
                              {form.numDays} {form.numDays === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {form.dayType === 'multiDay' && form.fromDate && form.toDate && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium">Period:</span>
                              <span className="font-bold text-gray-800">
                                {dayjs(form.fromDate).format('MMM D')} - {dayjs(form.toDate).format('MMM D, YYYY')}
                              </span>
                            </div>
                          )}
                          {['fullDay', 'halfDay'].includes(form.dayType) && form.date && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium">Date:</span>
                              <span className="font-bold text-gray-800">
                                {dayjs(form.date).format('MMMM D, YYYY')}
                              </span>
                            </div>
                          )}
                          {form.dayType === 'halfDay' && form.fromTime && form.toTime && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium">Time:</span>
                              <span className="font-bold text-purple-600">
                                {form.fromTime} - {form.toTime}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optional Reason Section */}
            <AnimatePresence>
              {form.leaveType && form.dayType && form.numDays > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Add Details</h3>
                        <p className="text-gray-600">Optional reason for your leave</p>
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setShowReasonField(!showReasonField)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className={`w-4 h-4 transition-transform ${showReasonField ? 'rotate-45' : ''}`} />
                      {showReasonField ? 'Hide' : 'Add'} Reason
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showReasonField && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <textarea
                          name="reason"
                          placeholder="Brief description of your leave (optional)..."
                          value={form.reason}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 resize-none text-lg"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <AnimatePresence>
              {form.leaveType && form.dayType && form.numDays > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="pt-8"
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative w-full overflow-hidden py-6 px-8 rounded-3xl font-bold text-xl text-white transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-violet-500/25'
                    }`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-4">
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing Your Request...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          Submit Leave Application
                          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        </>
                      )}
                    </div>
                    {!isSubmitting && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default LeaveApply;
