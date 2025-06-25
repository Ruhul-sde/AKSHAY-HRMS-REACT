
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  Loader2,
  AlertTriangle,
  Wallet,
  Info,
  CheckCircle,
  ChevronDown,
  Calculator,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  Clock,
  Target,
  X,
  RefreshCw,
  AlertCircle,
  Shield,
  Users,
  Award
} from 'lucide-react';

const LoanApply = ({ userData }) => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  // Fetch loan types with improved error handling
  const fetchLoanTypes = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get('http://localhost:5000/api/loan-types');
      console.log('Loan Types Response:', res.data);

      if (res.data?.success && res.data.loanTypes?.length > 0) {
        setLoanTypes(res.data.loanTypes);
      } else {
        setError(res.data?.message || 'No loan types available at the moment.');
      }
    } catch (err) {
      console.error('API Error:', err);
      if (err.response?.status === 500) {
        setError('Server error. Please contact IT support.');
      } else if (err.response?.status === 404) {
        setError('Loan service not available. Please try again later.');
      } else {
        setError('Failed to load loan types. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoanTypes();
  }, [fetchLoanTypes]);

  // Calculate final amount and EMI with validation
  const calculateEMI = (amount, interest, emiCount) => {
    const numAmount = parseFloat(amount) || 0;
    const numInterest = parseFloat(interest) || 0;
    const numEmiCount = parseInt(emiCount) || 0;

    if (numAmount <= 0 || numEmiCount <= 0) {
      return { finalAmount: '0.00', emi: '0.00' };
    }

    const final = numAmount + (numAmount * numInterest) / 100;
    const emi = final / numEmiCount;
    
    return { 
      finalAmount: final.toFixed(2), 
      emi: emi.toFixed(2) 
    };
  };

  // Validate form fields
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'ls_ReqAmnt':
        const amount = parseFloat(value);
        if (!value) {
          errors[name] = 'Amount is required';
        } else if (isNaN(amount) || amount <= 0) {
          errors[name] = 'Amount must be a positive number';
        } else if (amount > 10000000) {
          errors[name] = 'Amount cannot exceed ₹1 crore';
        }
        break;
      
      case 'ls_NoOfEmi':
        const emi = parseInt(value);
        if (!value) {
          errors[name] = 'Number of EMIs is required';
        } else if (isNaN(emi) || emi <= 0) {
          errors[name] = 'EMIs must be a positive number';
        } else if (emi > 360) {
          errors[name] = 'EMIs cannot exceed 360 months';
        }
        break;
      
      case 'ls_Reason':
        if (!value || value.trim().length < 10) {
          errors[name] = 'Reason must be at least 10 characters';
        } else if (value.length > 500) {
          errors[name] = 'Reason cannot exceed 500 characters';
        }
        break;
      
      case 'ls_LoanTyp':
        if (!value) {
          errors[name] = 'Please select a loan type';
        }
        break;

      default:
        break;
    }

    return errors;
  };

  // Handle input changes with improved state management
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field-specific errors
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // Create updated form data
    let updated = { ...formData, [name]: value };

    // Auto-fill interest rate when loan type is selected
    if (name === 'ls_LoanTyp') {
      const selected = loanTypes.find((lt) => lt.ls_NAME === value);
      if (selected) {
        updated.ls_Intrst = selected.ls_Intrst || selected.ls_INTRST || '0';
      }
    }

    // Recalculate EMI and final amount when relevant fields change
    if (['ls_ReqAmnt', 'ls_NoOfEmi', 'ls_LoanTyp', 'ls_Intrst'].includes(name)) {
      const amount = parseFloat(updated.ls_ReqAmnt) || 0;
      const emiCount = parseInt(updated.ls_NoOfEmi) || 0;
      const interest = parseFloat(updated.ls_Intrst) || 0;

      if (amount > 0 && emiCount > 0 && interest >= 0) {
        const final = amount + (amount * interest) / 100;
        const emi = final / emiCount;
        updated.ls_FinlAmnt = final.toFixed(2);
        updated.ls_EmiAmnt = emi.toFixed(2);
      } else {
        updated.ls_FinlAmnt = '0.00';
        updated.ls_EmiAmnt = '0.00';
      }
    }

    // Update form data
    setFormData(updated);
  };

  // Validate entire form
  const validateForm = () => {
    const requiredFields = ['ls_LoanTyp', 'ls_ReqAmnt', 'ls_NoOfEmi', 'ls_Reason'];
    let errors = {};

    requiredFields.forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      errors = { ...errors, ...fieldErrors };
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle loan submission with improved error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setError('');

    if (!userData?.ls_EMPCODE) {
      setError('Employee data not available. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    try {
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
        ls_Reason: formData.ls_Reason.trim(),
      };

      console.log('Frontend Loan Application Payload:', payload);
      const res = await axios.post('http://localhost:5000/api/apply-loan', payload);

      console.log('Frontend Response:', res.data);

      if (res.data?.success) {
        setSuccessMessage(res.data.message || 'Loan application submitted successfully!');
        // Reset form
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
        setFormErrors({});
      } else {
        setError(res.data?.message || 'Failed to submit loan application. Please try again.');
      }
    } catch (err) {
      console.error('Loan submission error:', err);
      
      if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Invalid application data. Please check your inputs.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please contact IT support or try again later.');
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced Input Field Component
  const InputField = ({ 
    icon: Icon, 
    label, 
    name, 
    type = 'text', 
    required = false, 
    readOnly = false, 
    children, 
    error,
    ...props 
  }) => (
    <div className="group">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <Icon className="w-4 h-4 text-gray-500" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {children || (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            readOnly={readOnly}
            className={`w-full border rounded-xl px-4 py-3.5 transition-all duration-200 ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : readOnly 
                  ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-100'
            } focus:outline-none focus:ring-4`}
            {...props}
          />
        )}
        {error && (
          <AlertCircle className="absolute right-3 top-4 w-5 h-5 text-red-500" />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );

  // Enhanced Calculation Card
  const CalculationCard = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Calculator className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Loan Calculation</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Final Amount</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">
                {formData.ls_FinlAmnt ? `₹${Number(formData.ls_FinlAmnt).toLocaleString()}` : '₹0'}
              </p>
              {formData.ls_ReqAmnt && formData.ls_FinlAmnt && (
                <p className="text-xs text-gray-500">
                  +₹{(Number(formData.ls_FinlAmnt) - Number(formData.ls_ReqAmnt)).toLocaleString()} interest
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Monthly EMI</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">
                {formData.ls_EmiAmnt ? `₹${Number(formData.ls_EmiAmnt).toLocaleString()}` : '₹0'}
              </p>
              {formData.ls_NoOfEmi && (
                <p className="text-xs text-gray-500">
                  for {formData.ls_NoOfEmi} months
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {formData.ls_Intrst && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              Interest Rate: <strong>{formData.ls_Intrst}% per annum</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6">
      <div className="flex items-start gap-4">
        <div className="bg-red-100 p-3 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Loan Application</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchLoanTypes}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  // Loading State Component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin absolute top-4 left-4" />
      </div>
      <div className="text-center">
        <span className="text-gray-600 font-medium">Loading loan information...</span>
        <p className="text-gray-500 text-sm mt-1">Please wait while we fetch available loan types</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar userData={userData} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Enhanced Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Loan Application</h1>
              <p className="text-gray-600">
                Apply for a loan with competitive interest rates and flexible EMI options
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Employee ID:</span>
                <span className="font-semibold text-gray-800">{userData?.ls_EMPCODE}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Based on State */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Application Details</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Loan Type and Date Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      icon={Target}
                      label="Loan Type"
                      name="ls_LoanTyp"
                      required
                      error={formErrors.ls_LoanTyp}
                    >
                      <div className="relative">
                        <select
                          name="ls_LoanTyp"
                          value={formData.ls_LoanTyp || ''}
                          onChange={handleChange}
                          required
                          className={`w-full border rounded-xl px-4 py-3.5 bg-white appearance-none transition-all duration-200 focus:outline-none focus:ring-4 ${
                            formErrors.ls_LoanTyp
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                        >
                          <option value="">Choose your loan type</option>
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
                        <ChevronDown className="absolute top-4 right-3 w-5 h-5 text-gray-400 pointer-events-none" />
                        {formErrors.ls_LoanTyp && (
                          <AlertCircle className="absolute right-10 top-4 w-5 h-5 text-red-500" />
                        )}
                      </div>
                      {formErrors.ls_LoanTyp && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.ls_LoanTyp}</p>
                      )}
                    </InputField>

                    <InputField
                      icon={Calendar}
                      label="Request Date"
                      name="ls_ReqDate"
                      type="date"
                      required
                    />
                  </div>

                  {/* Amount and EMI Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      icon={DollarSign}
                      label="Request Amount"
                      name="ls_ReqAmnt"
                      type="number"
                      required
                      min="1"
                      max="10000000"
                      placeholder="Enter amount in ₹"
                      error={formErrors.ls_ReqAmnt}
                    />

                    <InputField
                      icon={Clock}
                      label="Number of EMIs"
                      name="ls_NoOfEmi"
                      type="number"
                      required
                      min="1"
                      max="360"
                      placeholder="Enter number of installments"
                      error={formErrors.ls_NoOfEmi}
                    />
                  </div>

                  {/* Interest Rate */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      icon={TrendingUp}
                      label="Interest Rate (%)"
                      name="ls_Intrst"
                      type="number"
                      step="0.01"
                      min="0"
                      readOnly
                      placeholder="Auto-filled based on loan type"
                    />
                  </div>

                  {/* Reason */}
                  <InputField
                    icon={FileText}
                    label="Reason for Loan"
                    name="ls_Reason"
                    required
                    error={formErrors.ls_Reason}
                  >
                    <textarea
                      name="ls_Reason"
                      value={formData.ls_Reason || ''}
                      onChange={handleChange}
                      rows={4}
                      required
                      maxLength={500}
                      className={`w-full border rounded-xl px-4 py-3.5 transition-all duration-200 resize-none focus:outline-none focus:ring-4 ${
                        formErrors.ls_Reason
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                      placeholder="Please describe the purpose and necessity of this loan application (minimum 10 characters)..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {formErrors.ls_Reason ? (
                        <p className="text-sm text-red-600">{formErrors.ls_Reason}</p>
                      ) : (
                        <span></span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formData.ls_Reason?.length || 0}/500
                      </span>
                    </div>
                  </InputField>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform ${
                        isSubmitting 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing Application...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Submit Loan Application
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Calculation and Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <CalculationCard />
              
              {/* Enhanced Info Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Loan Benefits</h3>
                </div>
                
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Competitive interest rates starting from 8.5%</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Flexible EMI tenure up to 30 years</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Quick approval within 24-48 hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Automatic salary deduction facility</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>No prepayment charges for early settlement</span>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Our loan specialists are here to assist you with your application.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Support Hours: 9 AM - 6 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Expert Guidance Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg border border-green-600 max-w-md z-50 transform transition-all duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Application Submitted!</p>
                <p className="text-sm opacity-90">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApply;
