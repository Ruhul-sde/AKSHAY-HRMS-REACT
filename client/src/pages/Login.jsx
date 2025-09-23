import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { FaSpinner, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Particles from 'react-tsparticles';
import logo from '../assets/logo.png';
import { loadFull } from 'tsparticles';

function Login({ setUserData }) {
  const [empCode, setEmpCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [particlesInitialized, setParticlesInitialized] = useState(false);
  const navigate = useNavigate();

  const particlesInit = async (engine) => {
    await loadFull(engine);
    setParticlesInitialized(true);
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 px-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      {particlesInitialized && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      )}

      {/* Floating Blobs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 right-0 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/4 right-1/4 w-56 h-56 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10 border border-white/20"
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        whileHover={{ 
          rotateY: 3, 
          rotateX: 3, 
          transition: { duration: 0.3 },
          boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.15)'
        }}
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="p-4 rounded-full shadow-lg"
          >
            <img 
              src={logo} 
              alt="Company Logo" 
              className="w-16 h-16 object-contain"
            />
          </motion.div>
        </div>

        <h2 className="text-4xl font-bold text-center text-white mb-2">
          AKSHAY HRMS
        </h2>
        <p className="text-center text-white/80 mb-8">Secure Employee Portal</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              value={empCode}
              onChange={(e) => setEmpCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition backdrop-blur-sm"
              placeholder="Employee Code"
              required
            />
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition backdrop-blur-sm"
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400 hover:text-white transition" />
              ) : (
                <FaEye className="text-gray-400 hover:text-white transition" />
              )}
            </button>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-red-500/20 text-red-200 rounded-lg text-sm text-center border border-red-500/30"
            >
              {error}
            </motion.div>
          )}

<motion.button
  type="submit"
  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex justify-center items-center gap-2 shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group"
  whileTap={{ scale: 0.98 }}
  disabled={loading}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
>
  {loading ? (
    <div className="flex items-center gap-2">
      <span>Logging In...</span>
      <FaSpinner className="animate-spin" />
    </div>
  ) : (
    'Login'
  )}
  <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition duration-300 transform -translate-x-full group-hover:translate-x-0"></span>
</motion.button>
        </form>

        <motion.div 
          className="mt-6 text-center text-white/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* <a href="#" className="hover:text-white transition underline">Forgot password?</a> */}
        </motion.div>

        <motion.p 
          className="text-xs text-white/50 text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          © 2025 Akshay Software Technologies Private Limited. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Login;