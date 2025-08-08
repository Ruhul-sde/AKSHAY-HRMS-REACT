
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  UserCheck, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Globe,
  Users,
  Building,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Star
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = ({ userData, setUserData }) => {
  const sections = [
    {
      icon: Building,
      title: "HRMS Scope & Features",
      content: [
        "Apply for Leave and Leave History Tracking",
        "Out-Duty Tracking",
        "Apply for Loan and Loan History",
        "Change Password and Account Management",
        "Reports and Analytics",
        "Allowance & Benefits Management"
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Identification Data: Employee code, name, gender, date of birth, designation, department",
        "Contact Information: Mobile number, email address, physical address",
        "Employment Information: Joining date, employment type, department details",
        "Leave & Attendance Data: Leave applications, balances, attendance logs, out-duty details",
        "Loan Information: Loan type, requested amount, interest rates, repayment schedule",
        "Financial Data: Allowances, deductions, benefits",
        "Authentication Data: Login credentials (encrypted), password change history"
      ],
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Provide HRMS Services – Enable leave applications, loan requests, out-duty tracking",
        "Maintain Security – Authenticate users, detect unauthorized access, safeguard accounts",
        "Generate Reports – Prepare HR reports, compliance data, and analytics for authorized users",
        "Process Financial Requests – Manage salary allowances, benefits, and loan disbursements",
        "Comply with Legal Requirements – Respond to lawful requests from authorities"
      ],
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Lock,
      title: "Data Security Measures",
      content: [
        "Encryption of data in transit and at rest",
        "Access Controls to restrict data to authorized users only",
        "Regular Security Audits and vulnerability assessments",
        "Two-Factor Authentication (2FA) for sensitive actions",
        "Industry-standard security protocols and monitoring"
      ],
      color: "from-red-500 to-rose-600"
    },
    {
      icon: Users,
      title: "Data Sharing & Disclosure",
      content: [
        "With Your Employer (Client Organization) – For HR and payroll management",
        "With Authorized Personnel – HR managers, payroll staff, and administrators",
        "With Service Providers – Vendors who maintain or host the HRMS (confidential)",
        "For Legal Compliance – When required by law, regulation, or court order",
        "We do NOT sell, rent, or trade your personal data"
      ],
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access and review your personal information",
        "Request corrections or updates to your information",
        "Request deletion of your account (through HR department)",
        "Withdraw consent for certain types of processing",
        "Data portability and transparency rights"
      ],
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-xl mb-8 border border-blue-200/50"
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Privacy Policy</span>
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              Effective: Aug 8, 2025
            </div>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight"
          >
            Your Privacy,
            <br />
            <span className="text-5xl md:text-6xl">Our Priority</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
          >
            Akshay Software Technologies is committed to protecting your personal and organizational 
            information with industry-leading security measures and transparent practices.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {[
              { icon: Shield, label: "256-bit Encryption", color: "blue" },
              { icon: CheckCircle, label: "GDPR Compliant", color: "green" },
              { icon: Zap, label: "Real-time Security", color: "yellow" },
              { icon: Star, label: "ISO Certified", color: "purple" }
            ].map((item, index) => (
              <div key={index} className={`flex items-center gap-2 px-4 py-2 bg-${item.color}-50 border border-${item.color}-200 rounded-full`}>
                <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                <span className={`text-sm font-medium text-${item.color}-700`}>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Policy Sections */}
          <div className="lg:col-span-2 space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
                >
                  <div className="flex items-start gap-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-4 bg-gradient-to-br ${section.color} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-blue-600 transition-colors duration-300">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.content.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                            className="flex items-start gap-4 text-gray-700 group-hover:text-gray-800 transition-colors duration-300"
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3 flex-shrink-0 shadow-sm"></div>
                            <span className="leading-relaxed text-sm lg:text-base">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Data Retention Section */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-6">Data Retention Policy</h3>
                    <div className="space-y-4 text-white/90">
                      <p className="leading-relaxed">
                        We retain your personal and employment-related data only for as long as necessary to:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                          <h4 className="font-semibold mb-2">Business Purposes</h4>
                          <p className="text-sm text-white/80">Fulfill services outlined in this policy</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                          <h4 className="font-semibold mb-2">Legal Compliance</h4>
                          <p className="text-sm text-white/80">Meet contractual and regulatory obligations</p>
                        </div>
                      </div>
                      <p className="text-sm text-white/80 mt-4">
                        When data is no longer required, it is securely deleted or anonymized using industry-standard methods.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800">Data Protection Officer</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700 font-medium">ruhul@akshay.com</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700 font-medium">022 6712 6060</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">
                    Building 2, 214, MBP Rd, Sector I, MIDC Industrial Area, Mahape, Navi Mumbai, Maharashtra 400710
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6" />
                  <h4 className="font-bold text-lg">Effective Date</h4>
                </div>
                <p className="text-green-100 text-lg font-semibold mb-2">August 8, 2025</p>
                <p className="text-green-100 text-xs leading-relaxed">
                  This policy is reviewed quarterly and updated as needed to reflect changes in our practices or applicable laws.
                </p>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">Enterprise Security</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Our practices align with international data protection standards including GDPR, SOC 2, and ISO 27001.
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              variants={fadeInUp}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    By using the HRMS, you agree to the terms of this Privacy Policy. 
                    If you do not agree, please discontinue using the system.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Questions About Our Privacy Policy?</h3>
            <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              If you have any questions about how we handle your personal information or want to exercise your privacy rights, 
              our dedicated team is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Contact Privacy Team
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                Download Policy PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
