import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';

const AM_TIME = { from: '09:00', to: '13:00' };
const PM_TIME = { from: '13:00', to: '18:00' };
const FULL_DAY_TIME = { from: '', to: '' };

const LeaveApply = ({ userData }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    leaveType: '',
    dayType: 'fullDay',
    date: '',
    fromDate: '',
    toDate: '',
    halfDayPeriod: 'AM',
    reason: '',
    numDays: 0,
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
      } catch {
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
    let updatedForm = { ...form, [name]: value };
    setError('');
    setSuccess('');

    if (name === 'dayType') {
      updatedForm = {
        ...updatedForm,
        fromDate: '',
        toDate: '',
        date: '',
        numDays: value === 'halfDay' ? 0.5 : value === 'fullDay' ? 1 : 0,
      };
    }

    if (name === 'date' && ['fullDay', 'halfDay'].includes(form.dayType)) {
      updatedForm.fromDate = value;
      updatedForm.toDate = value;
    }

    if ((name === 'fromDate' || name === 'toDate') && form.dayType === 'multiDay') {
      const { fromDate, toDate } = updatedForm;
      if (fromDate && toDate) {
        const start = dayjs(fromDate);
        const end = dayjs(toDate);
        updatedForm.numDays = end.isBefore(start) ? 0 : end.diff(start, 'day') + 1;
        if (end.isBefore(start)) setError('End date must be after start date');
      }
    }

    setForm(updatedForm);
  };

  const validateForm = () => {
    if (!form.leaveType) return setError('Please select a leave type'), false;
    if (['fullDay', 'halfDay'].includes(form.dayType) && !form.date) return setError('Please select a date'), false;
    if (form.dayType === 'multiDay' && (!form.fromDate || !form.toDate)) return setError('Select both start and end dates'), false;
    if (form.numDays <= 0) return setError('Invalid leave duration'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const time =
      form.dayType === 'halfDay'
        ? form.halfDayPeriod === 'AM'
          ? AM_TIME
          : PM_TIME
        : FULL_DAY_TIME;

    try {
      const payload = {
        ls_EmpCode: userData.ls_EMPCODE.toString(),
        ls_FromDate: formatDate(form.dayType === 'multiDay' ? form.fromDate : form.date),
        ls_ToDate: formatDate(form.dayType === 'multiDay' ? form.toDate : form.date),
        ls_DocDate: formatDate(dayjs()),
        ls_NofDays: form.numDays.toString(),
        ls_FromTime: time.from,
        ls_ToTime: time.to,
        ls_LeavTyp: form.leaveType,
        ls_Reason: form.reason,
        ls_Status: 'A',
        ls_GrpNo: '5',
      };

      const res = await axios.post(
        'http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/LeavApply',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (res.data?.li_ErrorCode === 0) {
        setSuccess(res.data.ls_Message || 'Leave applied successfully');
        setForm({
          leaveType: '',
          dayType: form.dayType,
          date: '',
          fromDate: '',
          toDate: '',
          halfDayPeriod: 'AM',
          reason: '',
          numDays: 0,
        });
      } else {
        setError(res.data?.ls_Message || 'Application failed. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Server error occurred');
      } else if (err.request) {
        setError('Network error. Please check your connection and CORS settings.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>}

          {/* You can now plug in your existing Tailwind-styled form fields here... */}

          {/* Leave Type, Day Type, Half-Day Picker, Date Pickers, Reason Textarea, Submit Button */}
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveApply;
