import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  Loader2,
  AlertTriangle,
  Wallet,
  Info,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';

const LoanApply = ({ userData }) => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    ls_LoanTyp: '',
    ls_ReqDate: new Date().toISOString().split('T')[0],
    ls_ReqAmnt: '',
    ls_Intrst: '',
    ls_FinlAmnt: '',
    ls_NoOfEmi: '',
    ls_EmiAmnt: '',
    ls_Reason: '',
  });

  // Fetch loan types
  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/loan-types');
        console.log('Loan Types Response:', res.data);

        if (res.data?.success && res.data.loanTypes?.length > 0) {
          setLoanTypes(res.data.loanTypes);
        } else {
          setError(res.data?.message || 'No loan types found.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load loan types. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanTypes();
  }, []);

  // Calculate final amount and EMI
  const calculateEMI = (amount, interest, emiCount) => {
    const final = amount + (amount * interest) / 100;
    const emi = emiCount ? (final / emiCount).toFixed(2) : '0.00';
    return { finalAmount: final.toFixed(2), emi };
  };

  // Handle input changes and recalculate values
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === 'ls_LoanTyp') {
      const selected = loanTypes.find((lt) => lt.ls_NAME === value);
      if (selected) {
        updated.ls_Intrst = selected.ls_Intrst || selected.ls_INTRST || '0';
      }
    }

    if (['ls_ReqAmnt', 'ls_NoOfEmi', 'ls_LoanTyp'].includes(name)) {
      const amount = parseFloat(
        name === 'ls_ReqAmnt' ? value : formData.ls_ReqAmnt || 0
      );
      const emiCount = parseInt(
        name === 'ls_NoOfEmi' ? value : formData.ls_NoOfEmi || 0
      );

      let interest = 0;
      if (name === 'ls_LoanTyp') {
        const selected = loanTypes.find((lt) => lt.ls_NAME === value);
        interest = parseFloat(selected?.ls_Intrst || selected?.ls_INTRST || 0);
      } else {
        interest = parseFloat(formData.ls_Intrst || 0);
      }

      if (amount > 0 && emiCount > 0) {
        const { finalAmount, emi } = calculateEMI(amount, interest, emiCount);
        updated.ls_FinlAmnt = finalAmount;
        updated.ls_EmiAmnt = emi;
      }
    }

    setFormData(updated);
  };

  // Handle loan submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    if (!userData?.ls_EMPCODE) {
      setError('Employee data not available. Please log in again.');
      return;
    }

    try {
      // Format date to YYYYMMDD format
      const formatDateForAPI = (dateString) => {
        return dateString.replace(/-/g, '');
      };

      const payload = {
        ls_EmpCode: userData.ls_EMPCODE,
        ls_LoanTyp: formData.ls_LoanTyp,
        ls_ReqDate: formatDateForAPI(formData.ls_ReqDate),
        ls_ReqAmnt: formData.ls_ReqAmnt,
        ls_Intrst: formData.ls_Intrst,
        ls_FinlAmnt: formData.ls_FinlAmnt,
        ls_NoOfEmi: formData.ls_NoOfEmi,
        ls_EmiAmnt: formData.ls_EmiAmnt,
        ls_Reason: formData.ls_Reason,
      };

      console.log('Frontend Loan Application Payload:', payload);
      const res = await axios.post('http://localhost:5000/api/apply-loan', payload);

      console.log('Frontend Response:', res.data);

      if (res.data?.success) {
        setSuccessMessage(res.data.message || 'Loan application submitted successfully!');
        setFormData({
          ls_LoanTyp: '',
          ls_ReqDate: new Date().toISOString().split('T')[0],
          ls_ReqAmnt: '',
          ls_Intrst: '',
          ls_FinlAmnt: '',
          ls_NoOfEmi: '',
          ls_EmiAmnt: '',
          ls_Reason: '',
        });
      } else {
        console.error('Loan application failed:', res.data);
        setError(res.data?.message || 'Failed to submit loan application. Please try again.');
      }
    } catch (err) {
      console.error('Loan submission error:', err);
      console.error('Error response:', err.response?.data);

      if (err.response?.data) {
        setError(err.response.data.message || err.response.data.error || 'Failed to submit loan application. Please try again.');
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar userData={userData} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Loan Application</h1>
              <p className="text-sm text-gray-500">
                Fill out the form to apply for a loan
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Employee ID: <span className="font-medium">{userData?.ls_EMPCODE}</span>
          </div>
        </div>

        {/* Loading, Error, or Form */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-gray-600">Loading loan information...</span>
          </div>
        ) : error ? (
          <div className="flex items-start p-4 mb-6 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <p className="text-red-600 font-medium">{error}</p>
              {error.includes('log in') && (
                <p className="text-red-500 text-sm mt-1">
                  Please refresh the page after logging in.
                </p>
              )}
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
          >
            {/* Loan Type and Request Date */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="ls_LoanTyp"
                    value={formData.ls_LoanTyp}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Loan Type</option>
                    {loanTypes.length > 0 ? (
                      loanTypes.map((type, idx) => (
                        <option key={idx} value={type.ls_NAME || type.ls_Code || type.name}>
                          {type.ls_NAME || type.ls_Code || type.name || `Loan Type ${idx + 1}`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No loan types available</option>
                    )}
                  </select>
                  <ChevronDown className="absolute top-3.5 right-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Request Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="ls_ReqDate"
                  value={formData.ls_ReqDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Request Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="ls_ReqAmnt"
                  value={formData.ls_ReqAmnt}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="0.00"
                />
              </div>

              {/* Number of EMIs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of EMIs <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="ls_NoOfEmi"
                  value={formData.ls_NoOfEmi}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Interest */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="text"
                  name="ls_Intrst"
                  value={formData.ls_Intrst}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700"
                />
              </div>

              {/* Final Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Amount
                </label>
                <input
                  type="text"
                  name="ls_FinlAmnt"
                  value={formData.ls_FinlAmnt ? `₹${formData.ls_FinlAmnt}` : ''}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
              </div>

              {/* EMI Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EMI Amount
                </label>
                <input
                  type="text"
                  name="ls_EmiAmnt"
                  value={formData.ls_EmiAmnt ? `₹${formData.ls_EmiAmnt}/month` : ''}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Loan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="ls_Reason"
                value={formData.ls_Reason}
                onChange={handleChange}
                rows={4}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Please describe the purpose of this loan..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
              >
                Submit Application
              </button>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                {successMessage}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoanApply;