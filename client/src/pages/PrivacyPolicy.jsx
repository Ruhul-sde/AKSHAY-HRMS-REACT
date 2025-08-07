
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, FileText, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = ({ userData, setUserData }) => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal identification information (Name, Employee ID, Email, Phone)",
        "Employment details (Department, Designation, Salary information)",
        "Attendance and leave records",
        "Performance and appraisal data",
        "Location data for attendance tracking (when applicable)"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Managing employee records and HR processes",
        "Processing payroll and benefits",
        "Tracking attendance and leave management",
        "Performance evaluation and career development",
        "Compliance with legal and regulatory requirements"
      ]
    },
    {
      icon: Lock,
      title: "Data Protection & Security",
      content: [
        "End-to-end encryption for sensitive data transmission",
        "Role-based access control with multi-factor authentication",
        "Regular security audits and vulnerability assessments",
        "Secure cloud storage with automated backups",
        "Employee data access logging and monitoring"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access your personal data and request corrections",
        "Request deletion of personal data (subject to legal requirements)",
        "Opt-out of non-essential data processing",
        "Receive data in a portable format",
        "Lodge complaints with data protection authorities"
      ]
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Privacy Policy</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Your Privacy Matters
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are committed to protecting your personal information and ensuring transparency 
            in how we collect, use, and safeguard your data within our HRMS platform.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Policy Sections */}
          <div className="lg:col-span-2 space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h3>
                      <ul className="space-y-3">
                        {section.content.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Additional Policies */}
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Data Retention & Deletion</h3>
                  <div className="text-gray-600 space-y-4">
                    <p>We retain employee data only for as long as necessary to fulfill business and legal requirements:</p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-blue-50/80 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Active Employees</h4>
                        <p className="text-sm text-blue-700">Data retained for duration of employment plus 7 years</p>
                      </div>
                      <div className="bg-green-50/80 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Former Employees</h4>
                        <p className="text-sm text-green-700">Financial records retained for 7 years, other data for 3 years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6"
            >
              <h4 className="text-xl font-bold text-gray-800 mb-4">Privacy Officer Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">privacy@company.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">Legal Department, Floor 3</span>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5" />
                <h4 className="font-semibold">Last Updated</h4>
              </div>
              <p className="text-blue-100 text-sm">January 15, 2025</p>
              <p className="text-blue-100 text-xs mt-2">
                This policy is reviewed quarterly and updated as needed to reflect changes in our practices or applicable laws.
              </p>
            </motion.div>

            {/* GDPR Compliance Badge */}
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">GDPR Compliant</h4>
              <p className="text-sm text-gray-600">
                Our practices align with international data protection standards
              </p>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.5 }}
          className="mt-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            If you have any questions about how we handle your personal information or want to exercise your privacy rights, 
            our team is here to help.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg">
            Contact Privacy Team
          </button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
