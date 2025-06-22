import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import { Loader2, AlertTriangle, CheckCircle, Calendar, Clock, ChevronDown } from 'lucide-react';

const LeaveApply = ({ userData }) => {
  const [leaveTypes, setLeaveTypes] = useState([
    { code: 'CL', name: 'Casual Leave' },
    { code: 'SL', name: 'Sick Leave' },
    { code: 'EL', name: 'Earned Leave' },
    { code: 'LWP', name: 'Leave Without Pay' }
  ]);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date) => dayjs(date).format('YYYYMMDD');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };
    setError('');
    setSuccess('');

    if (name === 'dayType') {
      updated = {
        ...updated,
        fromTime: '',
        toTime: '',
        numDays: value === 'halfDay' ? 0.5 : value === 'fullDay' ? 1 : 0
      };
      if (value !== 'multiDay') {
        updated.fromDate = form.date;
        updated.toDate = form.date;
      }
    }

    if (name === 'date' && form.dayType !== 'multiDay') {
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

    if ((name === 'fromTime' || name === 'toTime') && form.dayType === 'custom') {
      const [fh, fm] = updated.fromTime.split(':').map(Number);
      const [th, tm] = updated.toTime.split(':').map(Number);
      const minutes = (th * 60 + tm) - (fh * 60 + fm);
      if (minutes <= 0) {
        setError('End time must be after start time');
        updated.numDays = 0;
      } else {
        updated.numDays = minutes / 480; // 8 hrs = 480 mins
      }
    }

    setForm(updated);
  };

  const validate = () => {
    if (!form.leaveType) return setError('Please select a leave type'), false;
    if ((form.dayType === 'fullDay' || form.dayType === 'halfDay') && !form.date) 
      return setError('Please select a date'), false;
    if (form.dayType === 'multiDay' && (!form.fromDate || !form.toDate)) 
      return setError('Please select both start and end dates'), false;
    if (form.dayType === 'custom' && (!form.fromTime || !form.toTime)) 
      return setError('Please select time range'), false;
    if (form.numDays <= 0) 
      return setError('Invalid leave duration'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate realistic leave application number
      const leaveNumber = `LV-${dayjs().format('YYMMDD')}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      setSuccess(`Leave application submitted successfully! Reference #${leaveNumber}`);
      
      // Reset form
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
    } catch (err) {
      setError('Error processing leave application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }} 
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Apply for Leave</h1>
            <p className="text-sm text-gray-500 mt-1">Fill out the form to request time off</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-start p-4 rounded-lg bg-red-50 border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="flex items-start p-4 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-green-700 font-medium">{success}</p>
                  <p className="text-green-600 text-sm mt-1">
                    Your manager will review the request and notify you of the status.
                  </p>
                </div>
              </div>
            )}

            {/* Leave Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  disabled={isSubmitting}
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map(type => (
                    <option key={type.code} value={type.code}>
                      {type.name} ({type.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Duration Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Duration <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'fullDay', label: 'Full Day' },
                  { value: 'halfDay', label: 'Half Day' },
                  { value: 'custom', label: 'Custom Hours' },
                  { value: 'multiDay', label: 'Multiple Days' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="dayType"
                      value={type.value}
                      checked={form.dayType === type.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Fields */}
            {form.dayType === 'multiDay' ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="fromDate"
                      value={form.fromDate}
                      onChange={handleChange}
                      min={today}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                      disabled={isSubmitting}
                    />
                    <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="toDate"
                      value={form.toDate}
                      onChange={handleChange}
                      min={form.fromDate || today}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                      disabled={isSubmitting}
                    />
                    <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                    disabled={isSubmitting}
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* Time Fields */}
            {form.dayType === 'custom' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    From Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="fromTime"
                      value={form.fromTime}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                      disabled={isSubmitting}
                    />
                    <Clock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    To Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="toTime"
                      value={form.toTime}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                      disabled={isSubmitting}
                    />
                    <Clock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Duration Summary */}
            {(form.numDays > 0 || form.dayType === 'custom') && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Leave Duration:</span> {form.numDays} day(s)
                  {form.dayType === 'custom' && form.fromTime && form.toTime && (
                    <span className="block mt-1">
                      {form.fromTime} to {form.toTime}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Briefly explain the reason for your leave..."
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Leave Application'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveApply;