import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const ChangePassword = ({ userData, setUserData }) => {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return setError('All fields are required.');
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError('New passwords do not match.');
    }
    if (form.newPassword.length < 8) {
      return setError('Password must be at least 8 characters long.');
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
        setError('');
      } else {
        setError(res.data.message || 'Failed to change password.');
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error while changing password.');
      setSuccess('');
    }
  };

  return (
    <>
      <Navbar setUserData={setUserData} userData={userData} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center px-4 py-12">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <FiLock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h2>
            <p className="text-gray-500">Secure your account with a new password</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.old ? "text" : "password"}
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600"
                  >
                    {showPassword.old ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600"
                  >
                    {showPassword.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600"
                  >
                    {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg p-4 ${error ? 'bg-red-50' : 'bg-green-50'}`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${error ? 'text-red-400' : 'text-green-400'}`}>
                    {error ? <FiAlertCircle className="h-5 w-5" /> : <FiCheckCircle className="h-5 w-5" />}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${error ? 'text-red-800' : 'text-green-800'}`}>
                      {error || success}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Update Password
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ChangePassword;