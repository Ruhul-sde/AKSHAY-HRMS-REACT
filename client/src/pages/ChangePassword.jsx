import React, { useState } from 'react';
import api from '../api';
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
  const [loading, setLoading] = useState(false);

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

    // Clear previous messages
    setError('');
    setSuccess('');

    // Validation
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return setError('All fields are required.');
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError('New passwords do not match.');
    }
    if (form.newPassword.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    // Start loading
    setLoading(true);

    try {
      // API CALL - EXACTLY LIKE LOGIN PATTERN
      const res = await api.post('/change-password', {
        ls_EmpCode: userData.ls_EMPCODE,
        ls_OldPassword: form.oldPassword,
        ls_NewPassword: form.newPassword,
      });

      // RESPONSE HANDLING - EXACTLY LIKE LOGIN
      if (res.data.success) {
        setSuccess('Password changed successfully!');
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(res.data.message || 'Failed to change password.');
      }
    } catch (err) {
      // ERROR HANDLING - EXACTLY LIKE LOGIN
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      // LOADING HANDLING - EXACTLY LIKE LOGIN
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(form.newPassword);
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500'
  ];
  const strengthLabels = [
    'Very Weak',
    'Weak',
    'Good',
    'Strong'
  ];

  return (
    <>
      <Navbar setUserData={setUserData} userData={userData} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center px-4 py-12">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-4">
              <FiLock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h2>
            <p className="text-gray-500">Secure your account with a new password</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.old ? "text" : "password"}
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white/50"
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword.old ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white/50"
                    placeholder="At least 8 characters"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {form.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        Strength: <span className={`font-semibold ${
                          passwordStrength === 0 ? 'text-red-500' :
                          passwordStrength === 1 ? 'text-orange-500' :
                          passwordStrength === 2 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {strengthLabels[passwordStrength] || 'Very Weak'}
                        </span>
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength 
                              ? strengthColors[passwordStrength - 1] 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 outline-none transition bg-white/50 ${
                      form.confirmPassword && form.newPassword !== form.confirmPassword
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Re-enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Status Messages */}
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-xl p-4 ${error ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${error ? 'text-red-400' : 'text-green-400'}`}>
                    {error ? <FiAlertCircle className="h-5 w-5" /> : <FiCheckCircle className="h-5 w-5" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${error ? 'text-red-800' : 'text-green-800'}`}>
                      {error || success}
                    </p>
                  </div>
                  <button
                    onClick={() => error ? setError('') : setSuccess('')}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </motion.button>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={`flex items-center ${form.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                  <FiCheckCircle className={`mr-2 h-3 w-3 ${form.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(form.newPassword) ? 'text-green-600' : ''}`}>
                  <FiCheckCircle className={`mr-2 h-3 w-3 ${/[A-Z]/.test(form.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/[0-9]/.test(form.newPassword) ? 'text-green-600' : ''}`}>
                  <FiCheckCircle className={`mr-2 h-3 w-3 ${/[0-9]/.test(form.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                  One number
                </li>
                <li className={`flex items-center ${/[^A-Za-z0-9]/.test(form.newPassword) ? 'text-green-600' : ''}`}>
                  <FiCheckCircle className={`mr-2 h-3 w-3 ${/[^A-Za-z0-9]/.test(form.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                  One special character
                </li>
              </ul>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ChangePassword;