import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import { FileText, RefreshCw, Eye, Download } from 'lucide-react';

const SalarySlip = ({ userData, setUserData }) => {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const generateSalarySlip = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('/api/salary-slip/generate', {
        ls_Month: month,
        ls_EmpCode: userData.ls_EMPCODE
      });

      console.log('FRONTEND RECEIVED:', res.data);

      if (res.data?.success && res.data?.ls_Path) {
        setResult(res.data);
      } else {
        setError('Salary slip generated but path not returned');
      }
    } catch (err) {
      setError('Salary slip generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    window.open(
      `/api/salary-slip/view?filePath=${encodeURIComponent(
        result.ls_Path
      )}`,
      '_blank'
    );
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/api/salary-slip/download?filePath=${encodeURIComponent(
      result.ls_Path
    )}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userData={userData} setUserData={setUserData} />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-blue-600 text-white p-6 rounded-xl mb-6 flex items-center gap-2">
          <FileText />
          <h1 className="text-xl font-bold">Salary Slip</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded mr-4"
          />

          <button
            onClick={generateSalarySlip}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded inline-flex items-center gap-2"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} />
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {result && (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-green-600 mb-4">
              Salary slip generated successfully
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleView}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Eye size={18} />
                View PDF
              </button>

              <button
                onClick={handleDownload}
                className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalarySlip;
