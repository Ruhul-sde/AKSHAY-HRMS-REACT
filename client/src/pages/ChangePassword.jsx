import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar'; // Assuming this is your Navbar path

const ChangePassword = ({ userData }) => {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return setError('All fields are required.');
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError('New passwords do not match.');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/change-password', {
        ls_EmpCode: userData.ls_EMPCODE,
        ls_OldPassword: form.oldPassword,
        ls_NewPassword: form.newPassword,
      });

      if (res.data.success) {
        setSuccess('Password changed successfully!');
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(res.data.message || 'Failed to change password.');
      }
    } catch (err) {
      setError('Server error while changing password.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-12">
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Change Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
            {success && <p className="text-green-600 text-sm font-semibold">{success}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ChangePassword;
