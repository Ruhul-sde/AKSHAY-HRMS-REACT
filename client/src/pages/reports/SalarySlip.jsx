import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  RefreshCw,
  Download,
  Calendar,
  Search,
  AlertCircle,
  CheckCircle,
  DollarSign,
  CreditCard,
  Building2,
  ChevronRight
} from 'lucide-react';
import api from '../../api';
import dayjs from 'dayjs';
import Navbar from '../../components/Navbar';

const SalarySlip = ({ userData, setUserData }) => {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const generateSalarySlip = async () => {
    if (!userData?.ls_EMPCODE) {
      setError('Employee Code missing.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/salary-slip/generate', {
        ls_Month: month,
        ls_EmpCode: userData.ls_EMPCODE,
      });

      if (res.data?.success) {
        setResult(res.data);
      } else {
        setError(res.data?.message || 'Salary slip generation failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Salary slip generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.ls_Path) return;

    try {
      setDownloading(true);

      const response = await api.get('/salary-slip/download', {
        params: { filePath: result.ls_Path },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `Salary_Slip_${month}_${userData.ls_EMPCODE}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      setResult(null);
    } catch (err) {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <DollarSign className="w-7 h-7" />
            <h1 className="text-3xl font-bold">Salary Slip</h1>
          </div>
          <p className="text-blue-100 mt-1">
            Generate and download your monthly salary slip
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Month & Year
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Employee Code
              </label>
              <input
                type="text"
                value={userData?.ls_EMPCODE || ''}
                disabled
                className="w-full px-3 py-2 border rounded-xl bg-gray-100"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={generateSalarySlip}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards (NO Employee Name) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Employee Code</p>
              <p className="text-lg font-semibold">{userData?.ls_EMPCODE}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Selected Month</p>
              <p className="text-lg font-semibold">
                {dayjs(month).format('MMMM YYYY')}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Generating salary slip...</p>
            </div>
          ) : result ? (
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600 w-6 h-6" />
                <div>
                  <h3 className="text-lg font-semibold">
                    Salary Slip Ready
                  </h3>
                  <p className="text-gray-600">
                    {dayjs(month).format('MMMM YYYY')}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl disabled:opacity-50"
              >
                <Download className={downloading ? 'animate-spin' : ''} />
                {downloading ? 'Downloading...' : 'Download PDF'}
                <ChevronRight />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-2xl p-12 text-center text-gray-500">
              <FileText className="w-14 h-14 mx-auto mb-4" />
              Generate your salary slip to get started
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SalarySlip;
