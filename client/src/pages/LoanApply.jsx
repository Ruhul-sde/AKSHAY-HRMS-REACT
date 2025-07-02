import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  Loader2,
  CheckCircle,
  ChevronDown,
  Calculator,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  Target,
  X,
  Shield,
  Users,
  Award,
  Percent,
  Banknote,
  BadgeInfo
} from 'lucide-react';
import InputField from '../components/InputField';
import CalculationCard from '../components/CalculationCard';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { validateField, calculateEMI } from '../utils/loanHelpers';

const LoanApply = ({ userData, setUserData }) => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [activeStep, setActiveStep] = useState(1);

  // Refs
  const formRef = useRef(null);
  const amountInputRef = useRef(null);
  const emiInputRef = useRef(null);
  const reasonInputRef = useRef(null);

  const [formData, setFormData] = useState({
    ls_LoanTyp: '',
    ls_ReqDate: new Date().toISOString().split('T')[0],
    ls_ReqAmnt: '',
    ls_Intrst: '',
    ls_FinlAmnt: '0.00',
    ls_NoOfEmi: '',
    ls_EmiAmnt: '0.00',
    ls_Reason: '',
  });

  // Debug logging
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  // Fetch loan types
  const fetchLoanTypes = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get('http://localhost:5000/api/loan-types');
      console.log('Loan types API response:', res.data);
      
      if (res.data?.success && res.data.loanTypes?.length > 0) {
        setLoanTypes(res.data.loanTypes);
      } else {
        setError(res.data?.message || 'No loan types available.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to load loan types. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoanTypes();
  }, [fetchLoanTypes]);

  // Handle form changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    
    setFormErrors(prev => ({ ...prev, [name]: undefined }));

    setFormData(prev => {
      let updated = { ...prev, [name]: value };

      if (name === 'ls_LoanTyp') {
        const selected = loanTypes.find(lt => lt.ls_NAME === value);
        if (selected) {
          updated.ls_Intrst = selected.ls_Intrst || selected.ls_INTRST || '0';
          console.log('Selected loan type:', selected);
        }
      }

      if (['ls_ReqAmnt', 'ls_NoOfEmi', 'ls_LoanTyp', 'ls_Intrst'].includes(name)) {
        const amount = parseFloat(updated.ls_ReqAmnt) || 0;
        const emiCount = parseInt(updated.ls_NoOfEmi) || 0;
        const interest = parseFloat(updated.ls_Intrst) || 0;
        console.log(`Calculating EMI with amount: ${amount}, months: ${emiCount}, interest: ${interest}`);

        if (amount > 0 && emiCount > 0 && interest >= 0) {
          const result = calculateEMI(amount, interest, emiCount);
          console.log('EMI Calculation Result:', result);
          updated.ls_FinlAmnt = result.finalAmount || '0.00';
          updated.ls_EmiAmnt = result.emi || '0.00';
        } else {
          updated.ls_FinlAmnt = '0.00';
          updated.ls_EmiAmnt = '0.00';
        }
      }

      return updated;
    });

    // Auto-focus
    switch (name) {
      case 'ls_ReqAmnt': amountInputRef.current?.focus(); break;
      case 'ls_NoOfEmi': emiInputRef.current?.focus(); break;
      case 'ls_Reason': reasonInputRef.current?.focus(); break;
      default: break;
    }
  }, [loanTypes]);

  // Form validation
  const validateForm = useCallback(() => {
    const requiredFields = ['ls_LoanTyp', 'ls_ReqAmnt', 'ls_NoOfEmi', 'ls_Reason'];
    let errors = {};

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      console.log(`Validating ${field}:`, error);
      
      // Ensure we only store string errors, not objects
      if (error && typeof error === 'string') {
        errors[field] = error;
      } else if (error && error[field]) {
        errors[field] = error[field];
      }
    });

    console.log('Form validation errors:', errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setError('');

    if (!userData?.ls_EMPCODE) {
      const errorMsg = 'Employee data not available. Please log in again.';
      console.error(errorMsg);
      setError(errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      const formatDateForAPI = (dateString) => dateString.replace(/-/g, '');

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

      console.log('Submitting payload:', payload);
      const res = await axios.post('http://localhost:5000/api/apply-loan', payload);
      console.log('Submission response:', res.data);

      if (res.data?.success) {
        const successMsg = res.data.message || 'Loan application submitted successfully!';
        console.log(successMsg);
        setSuccessMessage(successMsg);
        
        // Reset form
        setFormData({
          ls_LoanTyp: '',
          ls_ReqDate: new Date().toISOString().split('T')[0],
          ls_ReqAmnt: '',
          ls_Intrst: '',
          ls_FinlAmnt: '0.00',
          ls_NoOfEmi: '',
          ls_EmiAmnt: '0.00',
          ls_Reason: '',
        });
        setFormErrors({});
        setActiveStep(1);
      } else {
        const errorMsg = res.data?.message || 'Failed to submit loan application.';
        console.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Loan submission error:', err);
      
      let errorMsg = 'An unexpected error occurred.';
      if (err.response?.status === 400) {
        errorMsg = err.response.data?.message || 'Invalid application data.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      } else if (err.request) {
        errorMsg = 'Network error. Please check your connection.';
      }
      
      console.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = (step) => {
    console.log(`Rendering step ${step}`);
    
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
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
                    value={formData.ls_LoanTyp}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-lg px-4 py-3 bg-white appearance-none ${
                      formErrors.ls_LoanTyp
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    } focus:outline-none`}
                  >
                    <option value="">Select loan type</option>
                    {loanTypes.map((type, idx) => (
                      <option key={idx} value={type.ls_NAME || type.ls_Code || type.name}>
                        {type.ls_NAME || type.ls_Code || type.name || `Loan Type ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </InputField>

              <InputField
                icon={Calendar}
                label="Request Date"
                name="ls_ReqDate"
                type="date"
                value={formData.ls_ReqDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                disabled={!formData.ls_LoanTyp}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next: Loan Details
                <ChevronDown className="w-4 h-4 inline ml-2" />
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={DollarSign}
                label="Loan Amount (₹)"
                name="ls_ReqAmnt"
                type="number"
                value={formData.ls_ReqAmnt}
                onChange={handleChange}
                required
                min="1"
                max="10000000"
                placeholder="e.g. 500000"
                error={formErrors.ls_ReqAmnt}
                ref={amountInputRef}
              />

              <InputField
                icon={Clock}
                label="Tenure (months)"
                name="ls_NoOfEmi"
                type="number"
                value={formData.ls_NoOfEmi}
                onChange={handleChange}
                required
                min="1"
                max="360"
                placeholder="e.g. 36"
                error={formErrors.ls_NoOfEmi}
                ref={emiInputRef}
              />
            </div>

            <InputField
              icon={Percent}
              label="Interest Rate (%)"
              name="ls_Intrst"
              type="number"
              value={formData.ls_Intrst}
              onChange={handleChange}
              step="0.01"
              min="0"
              readOnly
              placeholder="Auto-filled"
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                disabled={!formData.ls_ReqAmnt || !formData.ls_NoOfEmi}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next: Final Details
                <ChevronDown className="w-4 h-4 inline ml-2" />
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <CalculationCard formData={formData} />
            
            <InputField
              icon={FileText}
              label="Purpose of Loan"
              name="ls_Reason"
              required
              error={formErrors.ls_Reason}
            >
              <textarea
                name="ls_Reason"
                value={formData.ls_Reason}
                onChange={handleChange}
                rows={4}
                required
                maxLength={500}
                ref={reasonInputRef}
                className={`w-full border rounded-lg px-4 py-3 transition-all duration-200 resize-none focus:outline-none ${
                  formErrors.ls_Reason
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
                placeholder="Describe why you need this loan..."
              />
              <div className="flex justify-between items-center mt-1">
                {formErrors.ls_Reason ? (
                  <p className="text-sm text-red-600">{formErrors.ls_Reason}</p>
                ) : (
                  <span className="text-xs text-gray-500">
                    Minimum 10 characters
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {formData.ls_Reason?.length || 0}/500
                </span>
              </div>
            </InputField>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setUserData={setUserData} userData={userData} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Loan Application</h1>
              <p className="text-gray-600">Complete your application in simple steps</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm inline-flex items-center gap-2">
              <BadgeInfo className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Employee ID:</span>
              <span className="font-medium text-gray-800">{userData?.ls_EMPCODE || 'N/A'}</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${(activeStep-1)/2*100}%` }}
                ></div>
              </div>
              
              {/* Steps */}
              {[1, 2, 3].map(step => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    activeStep >= step ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-xs font-medium ${
                    activeStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Loan Type' : step === 2 ? 'Amount' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState message="Loading loan information..." />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchLoanTypes} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form 
                ref={formRef} 
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                {renderStep(activeStep)}
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <CalculationCard formData={formData} />
              
              {/* Info Card */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Loan Benefits</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  {[
                    "Competitive interest rates",
                    "Flexible tenure up to 30 years",
                    "Quick approval process",
                    "No prepayment charges",
                    "Salary deduction facility"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Our loan specialists are available to assist you.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Mon-Fri: 9 AM - 6 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>Expert Guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {successMessage && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg max-w-sm z-50 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Application Submitted!</p>
                <p className="text-sm opacity-90">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-white hover:text-gray-200 transition-colors ml-2"
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