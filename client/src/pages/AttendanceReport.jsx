import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Download, 
  RefreshCw, 
  Filter,
  Search,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  Zap,
  Eye,
  Calendar as CalendarIcon,
  Users,
  Activity,
  FileText,
  DollarSign,
  CreditCard,
  UserCheck,
  Building,
  PieChart,
  LineChart,
  ArrowRight,
  ChevronRight,
  Shield,
  Award,
  Briefcase
} from 'lucide-react';

const ReportsPage = ({ userData, setUserData }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const reports = [
    {
      id: 'leave',
      title: 'Leave Report',
      description: 'View comprehensive leave records, balances, and history',
      icon: User,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      stats: { total: '24', pending: '3', approved: '18', rejected: '3' }
    },
    {
      id: 'paystructure',
      title: 'Pay Structure Report',
      description: 'Detailed salary breakdown and compensation structure',
      icon: DollarSign,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      stats: { basic: '₹45,000', allowances: '₹15,000', deductions: '₹8,000', net: '₹52,000' }
    },
    {
      id: 'annual',
      title: 'Annual Summary Report',
      description: 'Complete yearly performance and attendance summary',
      icon: PieChart,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      stats: { attendance: '96%', leaves: '12 days', rating: '4.2/5', bonus: '₹25,000' }
    },
    {
      id: 'attendance',
      title: 'Monthly Attendance Report',
      description: 'Detailed monthly attendance with time tracking',
      icon: Calendar,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      stats: { present: '22', absent: '1', late: '2', hours: '176' }
    },
    {
      id: 'loan',
      title: 'Loan Report',
      description: 'Active loans, EMI schedules, and payment history',
      icon: CreditCard,
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      stats: { active: '2', total: '₹5,00,000', pending: '₹3,50,000', emi: '₹25,000' }
    },
    {
      id: 'fnf',
      title: 'Full & Final Report',
      description: 'Settlement calculations and final clearance details',
      icon: Shield,
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600',
      stats: { gratuity: '₹1,20,000', pf: '₹85,000', notice: '30 days', status: 'Pending' }
    },
    {
      id: 'employee',
      title: 'Employee Details Report',
      description: 'Complete employee profile and organizational information',
      icon: UserCheck,
      color: 'bg-teal-500',
      gradient: 'from-teal-500 to-teal-600',
      stats: { department: 'IT', designation: 'Senior Developer', experience: '5 years', grade: 'L2' }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const fetchReportData = async (reportType) => {
    setLoading(true);
    setError('');

    try {
      // Mock data for now - will be replaced with actual API calls
      const mockData = generateMockData(reportType);
      setReportData(mockData);
    } catch (err) {
      setError('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (reportType) => {
    switch (reportType) {
      case 'leave':
        return [
          { type: 'Annual Leave', available: 24, used: 18, balance: 6, lastUsed: '2024-12-15' },
          { type: 'Sick Leave', available: 12, used: 3, balance: 9, lastUsed: '2024-11-20' },
          { type: 'Casual Leave', available: 6, used: 3, balance: 3, lastUsed: '2024-10-10' }
        ];
      case 'paystructure':
        return [
          { component: 'Basic Salary', amount: 45000, percentage: 60 },
          { component: 'HRA', amount: 9000, percentage: 12 },
          { component: 'Special Allowance', amount: 6000, percentage: 8 },
          { component: 'PF Deduction', amount: -5400, percentage: -7.2 },
          { component: 'Tax Deduction', amount: -2600, percentage: -3.5 }
        ];
      case 'attendance':
        return Array.from({ length: 30 }, (_, i) => ({
          date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
          dayType: i % 7 === 0 ? 'WO' : 'WD',
          inTime: '09:00',
          outTime: '18:00',
          hours: '9:00',
          status: Math.random() > 0.1 ? 'Present' : 'Absent'
        }));
      default:
        return [];
    }
  };

  const ReportCard = ({ report }) => (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group"
      onClick={() => {
        setSelectedReport(report);
        fetchReportData(report.id);
      }}
    >
      <div className={`h-2 bg-gradient-to-r ${report.gradient}`}></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-gradient-to-r ${report.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
            <report.icon className="w-6 h-6 text-white" />
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {report.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {report.description}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(report.stats).slice(0, 4).map(([key, value], idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 capitalize font-medium">{key}</p>
              <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const ReportViewer = ({ report }) => {
    if (loading) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 space-y-4"
        >
          <div className="relative">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg">Loading {report.title}...</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className={`bg-gradient-to-r ${report.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <report.icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{report.title}</h2>
                <p className="text-white text-opacity-90">{report.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {report.id === 'leave' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance Summary</h3>
              {reportData.map((leave, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{leave.type}</h4>
                    <p className="text-sm text-gray-600">Last used: {leave.lastUsed}</p>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="font-bold text-blue-600">{leave.available}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Used</p>
                      <p className="font-bold text-red-600">{leave.used}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="font-bold text-green-600">{leave.balance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {report.id === 'paystructure' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Components</h3>
              {reportData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium text-gray-900">{item.component}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{Math.abs(item.amount).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-500">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {report.id === 'attendance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance</h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {reportData.slice(0, 35).map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg text-center text-sm ${
                      day.dayType === 'WO' ? 'bg-purple-100 text-purple-800' :
                      day.status === 'Present' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="font-medium">{dayjs(day.date).format('DD')}</div>
                    <div className="text-xs">{day.dayType === 'WO' ? 'OFF' : day.status === 'Present' ? '✓' : '✗'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {['annual', 'loan', 'fnf', 'employee'].includes(report.id) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <report.icon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-500">{report.title} will be available soon with API integration.</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar setUserData={setUserData} userData={userData} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {!selectedReport ? (
          <>
            {/* Header */}
            <motion.div variants={cardVariants} className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Reports Center
                  </h1>
                  <p className="text-gray-600">Access comprehensive employee reports and analytics</p>
                </div>
              </div>

              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border border-gray-100"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Employee ID:</span>
                <span className="font-semibold text-gray-800">{userData?.ls_EMPCODE}</span>
              </motion.div>
            </motion.div>

            {/* Reports Grid */}
            <motion.div 
              variants={cardVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={cardVariants} className="mt-12">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Quick Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-xl font-bold text-blue-600">96%</p>
                    <p className="text-xs text-gray-500">Attendance</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Leave Balance</p>
                    <p className="text-xl font-bold text-green-600">18</p>
                    <p className="text-xs text-gray-500">Days Remaining</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Net Salary</p>
                    <p className="text-xl font-bold text-purple-600">₹52,000</p>
                    <p className="text-xs text-gray-500">Current Month</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="text-xl font-bold text-orange-600">4.2/5</p>
                    <p className="text-xs text-gray-500">This Year</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <ReportViewer report={selectedReport} />
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReportsPage;