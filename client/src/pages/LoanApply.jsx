import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
    Loader2,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Calendar,
    DollarSign,
    FileText,
    Clock,
    Target,
    X,
    Shield,
    Users,
    Award,
    Percent,
    BadgeInfo,
    AlertCircle,
} from 'lucide-react';
import InputField from '../components/InputField';
import CalculationCard from '../components/CalculationCard';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { validateField, calculateEMI } from '../utils/loanHelpers';

// Main Loan Application Component
const LoanApply = ({ userData, setUserData }) => {
    // State Management
    const [loanTypes, setLoanTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [activeStep, setActiveStep] = useState(1);

    // Form Data State
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

    // --- DATA FETCHING ---
    const fetchLoanTypes = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Replace with your actual API endpoint
            const res = await axios.get('http://localhost:5000/api/loan-types');
            if (res.data?.success && Array.isArray(res.data.loanTypes)) {
                setLoanTypes(res.data.loanTypes);
            } else {
                setError(res.data?.message || 'No loan types could be found.');
            }
        } catch (err) {
            console.error('API Error:', err);
            setError('Failed to load loan types. Please check the network connection and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoanTypes();
    }, [fetchLoanTypes]);


    // --- FORM HANDLING ---
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        // Clear previous error for the field
        setFormErrors(prev => ({ ...prev, [name]: undefined }));

        setFormData(prev => {
            let updated = { ...prev, [name]: value };

            // Auto-fill interest rate when loan type changes
            if (name === 'ls_LoanTyp') {
                const selectedLoan = loanTypes.find(lt => lt.ls_CODE === value);
                if (selectedLoan) {
                    updated.ls_Intrst = selectedLoan.ls_Intrst || selectedLoan.ls_INTRST || '0';
                }
            }

            // Real-time EMI Calculation
            if (['ls_ReqAmnt', 'ls_NoOfEmi', 'ls_LoanTyp'].includes(name) || (name === 'ls_Intrst' && prev.ls_Intrst !== updated.ls_Intrst)) {
                const amount = parseFloat(updated.ls_ReqAmnt) || 0;
                const tenure = parseInt(updated.ls_NoOfEmi) || 0;
                const interest = parseFloat(updated.ls_Intrst) || 0;

                if (amount > 0 && tenure > 0 && interest >= 0) { // Corrected condition here
                    const { emi, finalAmount } = calculateEMI(amount, interest, tenure);
                    updated.ls_EmiAmnt = emi;
                    updated.ls_FinlAmnt = finalAmount;
                } else {
                    updated.ls_EmiAmnt = '0.00';
                    updated.ls_FinlAmnt = '0.00';
                }
            }

            return updated;
        });
    }, [loanTypes]);

    const validateForm = useCallback(() => {
        let errors = {};
        const { ls_LoanTyp, ls_ReqAmnt, ls_NoOfEmi, ls_Reason } = formData;

        if (!ls_LoanTyp) errors.ls_LoanTyp = 'Please select a loan type.';
        if (!ls_ReqAmnt || parseFloat(ls_ReqAmnt) <= 0) errors.ls_ReqAmnt = 'Please enter a valid loan amount.';
        if (!ls_NoOfEmi || parseInt(ls_NoOfEmi) <= 0) errors.ls_NoOfEmi = 'Please enter a valid tenure.';
        
        // Updated validation: Mandatory, but no minimum length.
        if (!ls_Reason || ls_Reason.trim() === '') {
            errors.ls_Reason = 'Purpose of loan is required.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSuccessMessage('');
        setError('');

        if (!userData?.ls_EMPCODE) {
            setError('Employee data is missing. Please log in again.');
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                ls_EmpCode: userData.ls_EMPCODE,
                ls_ReqDate: formData.ls_ReqDate.replace(/-/g, ''), // Format date for API
            };

            const res = await axios.post('http://localhost:5000/api/apply-loan', payload);

            if (res.data?.success) {
                setSuccessMessage(res.data.message || 'Loan application submitted successfully!');
                // Reset form state
                setFormData({
                    ls_LoanTyp: '', ls_ReqDate: new Date().toISOString().split('T')[0],
                    ls_ReqAmnt: '', ls_Intrst: '', ls_FinlAmnt: '0.00', ls_NoOfEmi: '',
                    ls_EmiAmnt: '0.00', ls_Reason: '',
                });
                setFormErrors({});
                setActiveStep(1);
                 // Hide success message after 5 seconds
                 setTimeout(() => setSuccessMessage(''), 5000);
            } else {
                setError(res.data?.message || 'An unknown error occurred during submission.');
            }
        } catch (err) {
            console.error('Loan submission error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER LOGIC ---

    const renderStepContent = () => {
        switch (activeStep) {
            case 1:
                return <Step1 formData={formData} formErrors={formErrors} loanTypes={loanTypes} handleChange={handleChange} />;
            case 2:
                return <Step2 formData={formData} formErrors={formErrors} handleChange={handleChange} />;
            case 3:
                return <Step3 formData={formData} formErrors={formErrors} handleChange={handleChange} />;
            default:
                return null;
        }
    };
    
    // Main component render
    if (loading) return <LoadingState message="Loading loan application..." />;

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar setUserData={setUserData} userData={userData} />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">New Loan Application</h1>
                            <p className="text-gray-500 mt-1">Complete your application in 3 simple steps.</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm inline-flex items-center gap-2 self-start">
                             <BadgeInfo className="w-5 h-5 text-gray-400" />
                             <span className="text-sm text-gray-600">Employee ID:</span>
                             <span className="font-semibold text-gray-800 tracking-wider">{userData?.ls_EMPCODE || 'N/A'}</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Form Section */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200/80">
                         {/* Progress Stepper */}
                         <ProgressStepper activeStep={activeStep} />

                        <form onSubmit={handleSubmit} className="p-6 md:p-8">
                            {error && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5" />
                                    <div>
                                     <p className="font-semibold">Error</p>
                                     <p className="text-sm">{error}</p>
                                    </div>
                                    <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4"/></button>
                                </div>
                            )}

                            <div className="transition-all duration-300">
                               {renderStepContent()}
                            </div>
                            
                            {/* Navigation Buttons */}
                            <FormNavigation 
                                activeStep={activeStep} 
                                setActiveStep={setActiveStep}
                                isSubmitting={isSubmitting}
                                formData={formData}
                            />
                        </form>
                    </div>

                    {/* Sidebar Section */}
                    <aside className="lg:col-span-1 space-y-6 sticky top-8">
                        {parseFloat(formData.ls_ReqAmnt) > 0 && <CalculationCard formData={formData} />}
                        <InfoCard />
                        <SupportCard />
                    </aside>
                </div>
            </main>

            {/* Success Toast Notification */}
            {successMessage && <SuccessToast message={successMessage} onClose={() => setSuccessMessage('')} />}
        </div>
    );
};

// --- SUB-COMPONENTS ---

const ProgressStepper = ({ activeStep }) => {
    const steps = ['Loan Type', 'Amount & Tenure', 'Review & Submit'];
    return (
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
                {steps.map((label, index) => {
                    const step = index + 1;
                    const isCompleted = activeStep > step;
                    const isActive = activeStep === step;
                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${isCompleted ? 'bg-green-600 border-green-600 text-white' : ''}
                                    ${isActive ? 'bg-white border-blue-600 text-blue-600' : ''}
                                    ${!isCompleted && !isActive ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                                `}>
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <span className="font-bold text-lg">{step}</span>}
                                </div>
                                <p className={`mt-2 text-xs font-semibold transition-colors duration-300 ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {label}
                                </p>
                            </div>
                            {step < steps.length && <div className={`flex-1 h-1 mx-4 transition-colors duration-300 ${activeStep > step ? 'bg-green-600' : 'bg-gray-200'}`} />}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const Step1 = ({ formData, formErrors, loanTypes, handleChange }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-700">Select Your Loan</h2>
        <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Loan Type" required error={formErrors.ls_LoanTyp}>
                <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select name="ls_LoanTyp" value={formData.ls_LoanTyp} onChange={handleChange} required
                        className={`w-full pl-10 pr-10 py-3 border rounded-lg bg-white appearance-none transition-all ${formErrors.ls_LoanTyp ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} focus:border-blue-500 focus:ring-2 focus:outline-none`}>
                        <option value="" disabled>Choose a loan...</option>
                        {loanTypes.map(type => (
                            <option key={type.ls_CODE} value={type.ls_CODE}>{type.ls_NAME}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </InputField>
            <InputField label="Request Date" required>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="date" name="ls_ReqDate" value={formData.ls_ReqDate} onChange={handleChange} required
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white transition-all border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"/>
                 </div>
            </InputField>
        </div>
    </div>
);

const Step2 = ({ formData, formErrors, handleChange }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-700">Enter Loan Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Loan Amount (₹)" required error={formErrors.ls_ReqAmnt}>
                <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input type="number" name="ls_ReqAmnt" value={formData.ls_ReqAmnt} onChange={handleChange} required min="1" placeholder="e.g., 500000"
                     className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white transition-all ${formErrors.ls_ReqAmnt ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} focus:border-blue-500 focus:ring-2 focus:outline-none`} />
                </div>
            </InputField>
            <InputField label="Tenure (in months)" required error={formErrors.ls_NoOfEmi}>
                 <div className="relative">
                     <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input type="number" name="ls_NoOfEmi" value={formData.ls_NoOfEmi} onChange={handleChange} required min="1" max="360" placeholder="e.g., 36"
                     className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white transition-all ${formErrors.ls_NoOfEmi ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} focus:border-blue-500 focus:ring-2 focus:outline-none`} />
                </div>
            </InputField>
        </div>
        <InputField label="Interest Rate (%)" info="Auto-filled based on loan type">
             <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" name="ls_Intrst" value={formData.ls_Intrst} readOnly
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300 focus:outline-none" />
             </div>
        </InputField>
    </div>
);

const Step3 = ({ formData, formErrors, handleChange }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-700">State Your Purpose</h2>
        <InputField label="Purpose of Loan" required error={formErrors.ls_Reason}>
            <textarea name="ls_Reason" value={formData.ls_Reason} onChange={handleChange} rows="4" required maxLength={500}
                placeholder="Briefly describe why you need this loan (e.g., for a wedding, home renovation, medical emergency, etc.)"
                className={`w-full border rounded-lg px-4 py-3 resize-none transition-all ${formErrors.ls_Reason ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} focus:border-blue-500 focus:ring-2 focus:outline-none`} />
            <div className="text-right text-xs text-gray-400 mt-1">
                {formData.ls_Reason?.length || 0}/500
            </div>
        </InputField>
    </div>
);

const FormNavigation = ({ activeStep, setActiveStep, isSubmitting, formData }) => {
    const nextDisabled = 
        (activeStep === 1 && !formData.ls_LoanTyp) ||
        (activeStep === 2 && (!formData.ls_ReqAmnt || !formData.ls_NoOfEmi));
        
    return (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            {activeStep > 1 ? (
                <button type="button" onClick={() => setActiveStep(p => p - 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
            ) : <div />}

            {activeStep < 3 ? (
                <button type="button" onClick={() => setActiveStep(p => p + 1)} disabled={nextDisabled}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-sm">
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            ) : (
                <button type="submit" disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-wait transition-colors shadow-sm">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" /> Submit Application
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

const InfoCard = () => (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-full"><Shield className="w-5 h-5 text-green-600" /></div>
            <h3 className="text-lg font-semibold text-gray-800">Loan Benefits</h3>
        </div>
        <ul className="space-y-3 text-sm text-gray-600">
            {["Competitive interest rates", "Flexible tenure options", "Quick & transparent process", "No hidden charges"].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{text}</span>
                </li>
            ))}
        </ul>
    </div>
);

const SupportCard = () => (
    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100/80">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full"><Users className="w-5 h-5 text-blue-600" /></div>
            <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">Our loan specialists are here to assist you with any questions during the application process.</p>
        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700"><Award className="w-4 h-4 text-blue-500" /><span>Expert Guidance Available</span></div>
            <div className="flex items-center gap-2 text-gray-700"><Clock className="w-4 h-4 text-blue-500" /><span>Mon-Fri: 9 AM - 6 PM</span></div>
        </div>
    </div>
);

const SuccessToast = ({ message, onClose }) => (
    <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-lg shadow-2xl max-w-sm z-50 animate-fade-in-up">
        <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-bold">Success!</p>
                <p className="text-sm opacity-90">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-auto -mr-2 -mt-1 p-1 rounded-full">
                <X className="w-5 h-5" />
            </button>
        </div>
    </div>
);

export default LoanApply;
