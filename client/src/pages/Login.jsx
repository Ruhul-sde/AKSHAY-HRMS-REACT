import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

function Login({ setUserData }) {
  const [empCode, setEmpCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/login', {
        ls_EmpCode: empCode,
        ls_Password: password,
      });

      if (res.data.success) {
        setUserData(res.data.data);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 to-blue-400 px-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md perspective"
        whileHover={{ rotateY: 3, rotateX: 3, transition: { duration: 0.3 } }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Employee Code
            </label>
            <input
              type="text"
              value={empCode}
              onChange={(e) => setEmpCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter your employee code"
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter your password"
              required
            />
          </motion.div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex justify-center items-center gap-2"
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Logging In...
              </>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          © 2025 KKD HRMS. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
