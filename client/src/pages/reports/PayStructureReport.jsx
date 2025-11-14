
import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, Clock, Sparkles } from 'lucide-react';
import Navbar from '../../components/Navbar';

const PayStructureReport = ({ userData, setUserData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Banknote className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-gray-800 mb-4"
            >
              Pay Structure Report
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 text-2xl font-semibold text-purple-600 mb-6"
            >
              <Sparkles className="w-8 h-8" />
              Coming Soon
              <Sparkles className="w-8 h-8" />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto"
            >
              Get ready for detailed insights into your compensation structure, 
              including salary breakdowns, allowances, deductions, and tax calculations.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-2 text-gray-500"
            >
              <Clock className="w-5 h-5" />
              <span>Expected launch: Q2 2025</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PayStructureReport;
