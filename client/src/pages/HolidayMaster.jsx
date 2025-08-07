
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Clock, Gift } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HolidayMaster = ({ userData, setUserData }) => {
  const upcomingFeatures = [
    {
      icon: Calendar,
      title: "Holiday Calendar",
      description: "View all company holidays in a beautiful calendar format"
    },
    {
      icon: Gift,
      title: "Festival Management",
      description: "Manage regional and cultural festivals with custom settings"
    },
    {
      icon: Clock,
      title: "Holiday Scheduling",
      description: "Plan and schedule holidays for the entire year in advance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Main Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-gray-100/50">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.3, 
                type: "spring", 
                stiffness: 200,
                duration: 0.8 
              }}
              className="relative mx-auto mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl">
                <Calendar className="w-16 h-16 text-white" />
              </div>
              {/* Floating sparkles */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-8 h-8 text-pink-400" />
              </motion.div>
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
                className="absolute -bottom-2 -left-2"
              >
                <Sparkles className="w-6 h-6 text-purple-400" />
              </motion.div>
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-6"
            >
              Holiday Master
            </motion.h1>
            
            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full shadow-lg mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <span className="text-xl font-semibold">Coming Soon</span>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            </motion.div>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Manage company holidays, festivals, and special occasions with our comprehensive 
              holiday management system. Plan ahead and keep your team informed about upcoming celebrations.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="grid md:grid-cols-3 gap-8 mb-12"
            >
              {upcomingFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Launch Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex items-center justify-center gap-3 text-gray-500 bg-gray-50/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-200/50"
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">Expected Launch: Q2 2025</span>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-8 bg-gray-200 h-2 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "35%" }}
                transition={{ delay: 2.2, duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 0.4 }}
              className="text-sm text-gray-500 mt-2"
            >
              Development Progress: 35% Complete
            </motion.p>
          </div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
            <p className="text-purple-100 mb-4">
              Be the first to know when Holiday Master goes live. We'll notify all users via email.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg"
            >
              Get Notified
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default HolidayMaster;
