import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Send,
  User,
  Calendar,
  Timer,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Info,
  Search,
  Edit3,
  Save,
  XCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api';

const ManualAttendance = ({ userData, setUserData }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [form, setForm] = useState({
    ls_Code: '',
    ls_EmpCode: '',
    ls_AttendDt: dayjs().format('YYYY-MM-DD'),
    ls_InTime: '',
    ls_OutTime: '',
    ls_TotalTime: 0,
    ls_Remark: '',
    ls_Status: 'P' // P = Present, A = Absent, L = Late, HD = Half Day
  });
  const [searchParams, setSearchParams] = useState({
    ls_EmpCode: '',
    ls_Date: dayjs().format('YYYY-MM-DD')
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  /* ======================= STATUS OPTIONS ======================= */
  const statusOptions = [
    { value: 'P', label: 'Present', color: 'green' },
    { value: 'A', label: 'Absent', color: 'red' },
    { value: 'L', label: 'Late', color: 'yellow' },
    { value: 'HD', label: 'Half Day', color: 'orange' }
  ];

  /* ======================= INITIALIZE EMPLOYEE CODE ======================= */
  useEffect(() => {
    if (userData?.ls_EMPCODE) {
      setSearchParams(prev => ({
        ...prev,
        ls_EmpCode: userData.ls_EMPCODE
      }));
      setForm(prev => ({
        ...prev,
        ls_EmpCode: userData.ls_EMPCODE
      }));
    }
  }, [userData]);

  /* ======================= SEARCH ATTENDANCE ======================= */
  const handleSearch = async (e) => {
    e?.preventDefault();
    
    if (!searchParams.ls_EmpCode || !searchParams.ls_Date) {
      setError('Employee Code and Date are required');
      return;
    }

    setIsSearching(true);
    setError('');
    setSuccess('');

    try {
      const formattedDate = dayjs(searchParams.ls_Date).format('YYYYMMDD');
      
      console.log('Searching attendance:', {
        ls_EmpCode: searchParams.ls_EmpCode,
        ls_Date: formattedDate
      });

      const res = await api.get('/manual-attendance', {
        params: {
          ls_EmpCode: searchParams.ls_EmpCode,
          ls_Date: formattedDate
        }
      });

      console.log('Search Response:', res.data);

      // Check if we got a valid response
      if (res.data && typeof res.data === 'object') {
        // If it's an array, set directly
        if (Array.isArray(res.data)) {
          setAttendanceRecords(res.data);
          if (res.data.length === 0) {
            setSuccess('No attendance records found for the selected date');
          }
        } 
        // If it's a single object, wrap in array
        else if (res.data.ls_AttendDt || res.data.ls_EmpCode) {
          setAttendanceRecords([res.data]);
        }
        // Check for error status in response
        else if (res.data.l_ClsErrorStatus?.ls_Status === 'F') {
          setError(res.data.l_ClsErrorStatus.ls_Message || 'Failed to fetch records');
          setAttendanceRecords([]);
        } else {
          setAttendanceRecords([]);
          setSuccess('No records found');
        }
      } else {
        setAttendanceRecords([]);
        setSuccess('No records found');
      }
    } catch (err) {
      console.error('Search Error:', err);
      if (err.response?.data?.l_ClsErrorStatus) {
        setError(err.response.data.l_ClsErrorStatus.ls_Message || 'Failed to fetch attendance');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch attendance records');
      }
      setAttendanceRecords([]);
    } finally {
      setIsSearching(false);
    }
  };

  /* ======================= HANDLE FORM CHANGES ======================= */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    // Auto-calculate total time if both In and Out times are present
    if (name === 'ls_InTime' || name === 'ls_OutTime') {
      if (updated.ls_InTime && updated.ls_OutTime) {
        const [inHour, inMin] = updated.ls_InTime.split(':').map(Number);
        const [outHour, outMin] = updated.ls_OutTime.split(':').map(Number);
        
        const inMinutes = inHour * 60 + inMin;
        const outMinutes = outHour * 60 + outMin;
        
        if (outMinutes > inMinutes) {
          const totalMinutes = outMinutes - inMinutes;
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          updated.ls_TotalTime = parseFloat((hours + minutes / 60).toFixed(2));
        } else {
          setError('Out time must be after In time');
          updated.ls_TotalTime = 0;
        }
      }
    }

    setError('');
    setSuccess('');
    setForm(updated);
  };

  /* ======================= HANDLE SEARCH PARAM CHANGES ======================= */
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  /* ======================= EDIT RECORD ======================= */
  const handleEdit = (record) => {
    setForm({
      ls_Code: record.ls_Code || '',
      ls_EmpCode: record.ls_EmpCode,
      ls_AttendDt: record.ls_AttendDt ? dayjs(record.ls_AttendDt, 'YYYYMMDD').format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      ls_InTime: record.ls_InTime ? formatTimeForInput(record.ls_InTime) : '',
      ls_OutTime: record.ls_OutTime ? formatTimeForInput(record.ls_OutTime) : '',
      ls_TotalTime: record.ls_TotalTime ? parseFloat(record.ls_TotalTime) : 0,
      ls_Remark: record.ls_Remark || '',
      ls_Status: record.ls_Status || 'P'
    });
    setEditingId(record.ls_Code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ======================= FORMAT TIME FOR INPUT ======================= */
  const formatTimeForInput = (time) => {
    if (!time) return '';
    // Convert 930 to 09:30
    const timeStr = time.toString().padStart(4, '0');
    return `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
  };

  /* ======================= FORMAT TIME FOR DISPLAY ======================= */
  const formatTimeForDisplay = (time) => {
    if (!time) return '--:--';
    const timeStr = time.toString().padStart(4, '0');
    return `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
  };

  /* ======================= FORMAT DATE FOR DISPLAY ======================= */
  const formatDateForDisplay = (date) => {
    if (!date) return '--';
    return dayjs(date, 'YYYYMMDD').format('DD MMM YYYY');
  };

  /* ======================= RESET FORM ======================= */
  const resetForm = () => {
    setForm({
      ls_Code: '',
      ls_EmpCode: userData?.ls_EMPCODE || '',
      ls_AttendDt: dayjs().format('YYYY-MM-DD'),
      ls_InTime: '',
      ls_OutTime: '',
      ls_TotalTime: 0,
      ls_Remark: '',
      ls_Status: 'P'
    });
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  /* ======================= VALIDATE FORM ======================= */
  const validateForm = () => {
    if (!form.ls_EmpCode) {
      setError('Employee Code is required');
      return false;
    }

    if (!form.ls_AttendDt) {
      setError('Attendance Date is required');
      return false;
    }

    if (form.ls_InTime && form.ls_OutTime) {
      const [inHour, inMin] = form.ls_InTime.split(':').map(Number);
      const [outHour, outMin] = form.ls_OutTime.split(':').map(Number);
      
      const inMinutes = inHour * 60 + inMin;
      const outMinutes = outHour * 60 + outMin;
      
      if (outMinutes <= inMinutes) {
        setError('Out time must be after In time');
        return false;
      }
    }

    return true;
  };

  /* ======================= SUBMIT ATTENDANCE ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting attendance:', form);

      const res = await api.post('/manual-attendance', {
        ls_Code: editingId || '',
        ls_EmpCode: form.ls_EmpCode,
        ls_AttendDt: form.ls_AttendDt,
        ls_InTime: form.ls_InTime,
        ls_OutTime: form.ls_OutTime,
        ls_TotalTime: form.ls_TotalTime.toString(),
        ls_Remark: form.ls_Remark,
        ls_Status: form.ls_Status
      });

      console.log('Submit Response:', res.data);

      // Check for success in response
      if (res.data?.l_ClsErrorStatus?.ls_Status === 'S') {
        setSuccess(res.data.l_ClsErrorStatus.ls_Message || `Attendance ${editingId ? 'updated' : 'submitted'} successfully`);
        resetForm();
        // Refresh the search results
        await handleSearch();
      } else if (res.data?.l_ClsErrorStatus?.ls_Status === 'F') {
        setError(res.data.l_ClsErrorStatus.ls_Message || 'Submission failed');
      } else {
        // Assume success if we got here without error
        setSuccess(`Attendance ${editingId ? 'updated' : 'submitted'} successfully`);
        resetForm();
        await handleSearch();
      }
    } catch (err) {
      console.error('Submit Error:', err);
      if (err.response?.data?.l_ClsErrorStatus) {
        setError(err.response.data.l_ClsErrorStatus.ls_Message || 'Submission failed');
      } else {
        setError(err.response?.data?.message || 'Failed to submit attendance');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ======================= CANCEL EDIT ======================= */
  const handleCancelEdit = () => {
    resetForm();
  };

  /* ======================= GET STATUS COLOR ======================= */
  const getStatusColor = (status) => {
    switch (status) {
      case 'P': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-red-100 text-red-800';
      case 'L': return 'bg-yellow-100 text-yellow-800';
      case 'HD': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /* ======================= GET STATUS LABEL ======================= */
  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Manual Attendance
              </h1>
              <p className="text-gray-600 mt-1">Record and manage employee attendance</p>
              {userData?.ls_BPLID && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  <Info className="w-3 h-3" />
                  {userData?.ls_BPLNAME || `Branch ${userData.ls_BPLID}`}
                </div>
              )}
            </div>
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

        {/* Employee Info Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-800">{userData?.ls_EMPNAME || 'Employee'}</h4>
                <p className="text-sm text-gray-600">Code: {userData?.ls_EMPCODE || 'N/A'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium text-gray-800">{userData?.ls_Department || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Search Attendance</h3>
                <p className="text-gray-500 text-sm">Find attendance records by employee and date</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Code
                </label>
                <input
                  type="text"
                  name="ls_EmpCode"
                  value={searchParams.ls_EmpCode}
                  onChange={handleSearchChange}
                  placeholder="Enter employee code"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  required
                  disabled={isSearching}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="ls_Date"
                  value={searchParams.ls_Date}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  required
                  disabled={isSearching}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Records
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  {editingId ? <Edit3 className="w-5 h-5 text-purple-600" /> : <FileText className="w-5 h-5 text-purple-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingId ? 'Edit Attendance' : 'Record Attendance'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {editingId ? 'Update existing attendance record' : 'Enter new attendance details'}
                  </p>
                </div>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ls_EmpCode"
                  value={form.ls_EmpCode}
                  onChange={handleFormChange}
                  placeholder="Enter employee code"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Attendance Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attendance Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="ls_AttendDt"
                  value={form.ls_AttendDt}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* In Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  In Time
                </label>
                <input
                  type="time"
                  name="ls_InTime"
                  value={form.ls_InTime}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                  disabled={isSubmitting}
                />
              </div>

              {/* Out Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Out Time
                </label>
                <input
                  type="time"
                  name="ls_OutTime"
                  value={form.ls_OutTime}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                  disabled={isSubmitting}
                />
              </div>

              {/* Total Time (Auto-calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Time (Hours)
                </label>
                <input
                  type="number"
                  name="ls_TotalTime"
                  value={form.ls_TotalTime}
                  readOnly
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="ls_Status"
                  value={form.ls_Status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                  required
                  disabled={isSubmitting}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remark */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remark
              </label>
              <textarea
                name="ls_Remark"
                placeholder="Enter any remarks or notes"
                value={form.ls_Remark}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editingId ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {editingId ? 'Update Attendance' : 'Save Attendance'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Records Display */}
        {attendanceRecords.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Attendance Records</h3>
                  <p className="text-gray-500 text-sm">
                    Found {attendanceRecords.length} record{attendanceRecords.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">In Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Out Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Hrs</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceRecords.map((record, index) => (
                    <motion.tr
                      key={record.ls_Code || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDateForDisplay(record.ls_AttendDt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTimeForDisplay(record.ls_InTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTimeForDisplay(record.ls_OutTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.ls_TotalTime || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.ls_Status)}`}>
                          {getStatusLabel(record.ls_Status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {record.ls_Remark || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualAttendance;