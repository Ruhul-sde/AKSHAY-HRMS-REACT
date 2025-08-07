import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Info, Users, Mail, Phone, ChevronDown, ChevronUp, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Help = ({ userData, setUserData }) => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const faqs = [
    {
      question: "How do I apply for leave or loan?",
      answer: "You can apply for leave or loan through the respective modules in the HRMS portal. Navigate to the 'Requests' section and select either 'Leave Application' or 'Loan Application'."
    },
    {
      question: "How can I view my attendance report?",
      answer: "Your attendance records are available in the 'Attendance' section. You can filter by date range and export the report if needed."
    },
    {
      question: "How do I change my password?",
      answer: "Go to your profile settings and select 'Change Password'. You'll need to enter your current password and then your new password twice for confirmation."
    },
    {
      question: "Who do I contact for payroll or HR queries?",
      answer: "For payroll questions, contact payroll@example.com. For general HR queries, email hr-support@example.com or call +91 98765 43210 during business hours."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setMessage('');
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Help & Support</h1>
                <p className="opacity-90">We're here to help you with any questions or issues</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* FAQ Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-sm"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                      >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        {activeFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-blue-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-blue-500" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {activeFAQ === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4 text-gray-600"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                  Contact Support
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      HR Team
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <a href="mailto:hr-support@example.com" className="text-gray-700 hover:text-blue-600 transition">
                          hr-support@example.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <a href="tel:+919876543210" className="text-gray-700 hover:text-blue-600 transition">
                          +91 98765 43210
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                      Send us a message
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[120px]"
                          placeholder="Describe your issue or question..."
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-white font-medium transition ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>

                    <AnimatePresence>
                      {submitSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          <Info className="w-4 h-4" />
                          Your message has been sent successfully! We'll get back to you soon.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center text-sm text-gray-500">
            For urgent issues, please contact your HR manager directly. Response time is typically within 24 hours.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;