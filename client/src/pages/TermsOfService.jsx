
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  Users, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Gavel, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  Zap,
  Globe,
  UserCheck,
  Settings,
  Ban,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService = ({ userData, setUserData }) => {
  const sections = [
    {
      icon: UserCheck,
      title: "Eligibility Requirements",
      content: [
        "You are an employee, authorized representative, or contractor of a company with a valid agreement",
        "You have been granted an account by your employer or authorized administrator",
        "You are at least 18 years of age or legally permitted to use the system",
        "You agree to comply with all company policies and employment terms"
      ],
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Settings,
      title: "Services Provided",
      content: [
        "Apply for Leave and Leave History tracking",
        "Out-Duty Tracking and management",
        "Apply for Loan with complete history",
        "Change Password & Account Security features",
        "Comprehensive Reports & Analytics",
        "Allowance and Benefits Management system"
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: ShieldCheck,
      title: "User Responsibilities",
      content: [
        "Provide accurate and complete information at all times",
        "Keep your account credentials secure and confidential",
        "Use the HRMS only for lawful and authorized purposes",
        "Comply with company policies, employment terms, and applicable laws",
        "Immediately report any suspected unauthorized account access"
      ],
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: [
        "Attempting to hack, bypass, or interfere with HRMS security features",
        "Uploading or transmitting malicious software or harmful code",
        "Using the HRMS to store or transmit unlawful or discriminatory content",
        "Copying, modifying, distributing, or reverse-engineering any part of the system",
        "Removing or altering copyright, trademark, or proprietary notices"
      ],
      color: "from-red-500 to-rose-600"
    },
    {
      icon: Lock,
      title: "Account Management",
      content: [
        "Each user is responsible for all activities under their account",
        "Accounts are non-transferable and tied to your employment",
        "Your employer may suspend or terminate your account for violations",
        "Account access ceases immediately upon employment termination",
        "Data handling follows our comprehensive Privacy Policy"
      ],
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: Gavel,
      title: "Limitation of Liability",
      content: [
        "We are not liable for indirect, incidental, or consequential damages",
        "Total liability limited to amounts paid for services in prior 12 months",
        "Service availability strived for 24/7 but not guaranteed",
        "Maintenance and upgrades may cause temporary downtime",
        "All disputes subject to exclusive jurisdiction of Indian courts"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
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
            className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-xl mb-8 border border-purple-200/50"
          >
            <div className="relative">
              <Scale className="w-8 h-8 text-purple-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Terms of Service</span>
            <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              Effective: Jan 1, 2025
            </div>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight"
          >
            Terms of
            <br />
            <span className="text-5xl md:text-6xl">Service</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
          >
            Clear guidelines for using our HRMS platform responsibly and securely. 
            By using our services, you agree to these terms and conditions.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {[
              { icon: Scale, label: "Legal Compliance", color: "purple" },
              { icon: ShieldCheck, label: "Secure Platform", color: "green" },
              { icon: CheckCircle, label: "Fair Usage", color: "blue" },
              { icon: Star, label: "Quality Service", color: "yellow" }
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
          {/* Terms Sections */}
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
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-purple-600 transition-colors duration-300">
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
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3 flex-shrink-0 shadow-sm"></div>
                            <span className="leading-relaxed text-sm lg:text-base">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Termination Section */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-6">Termination Policy</h3>
                    <div className="space-y-4 text-white/90">
                      <p className="leading-relaxed">
                        We may suspend or terminate access to the HRMS under the following circumstances:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                          <h4 className="font-semibold mb-2">Policy Violations</h4>
                          <p className="text-sm text-white/80">Violation of terms or applicable laws</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                          <h4 className="font-semibold mb-2">Agreement Expiry</h4>
                          <p className="text-sm text-white/80">Employer agreement expires or terminates</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                          <h4 className="font-semibold mb-2">Legal Requirements</h4>
                          <p className="text-sm text-white/80">Required by law or court order</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                          <h4 className="font-semibold mb-2">Data Handling</h4>
                          <p className="text-sm text-white/80">Data handled per Privacy Policy</p>
                        </div>
                      </div>
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
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800">Legal & Compliance</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700 font-medium">legal@akshay.com</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700 font-medium">022 6712 6060</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">
                    Building 2, 214, MBP Rd, Sector I, MIDC Industrial Area, Mahape, Navi Mumbai, Maharashtra 400710
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Governing Law */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Gavel className="w-6 h-6" />
                  <h4 className="font-bold text-lg">Governing Law</h4>
                </div>
                <p className="text-indigo-100 text-lg font-semibold mb-2">Laws of India</p>
                <p className="text-indigo-100 text-xs leading-relaxed">
                  All disputes are subject to the exclusive jurisdiction of Indian courts as per applicable law.
                </p>
              </div>
            </motion.div>

            {/* Updates Notice */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <RefreshCw className="w-10 h-10 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">Terms Updates</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                We may update these terms periodically. Changes will be communicated via the HRMS or your registered email.
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </motion.div>

            {/* Agreement Notice */}
            <motion.div
              variants={fadeInUp}
              className="bg-green-50 border border-green-200 rounded-2xl p-6"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Agreement Required</h4>
                  <p className="text-green-700 text-sm leading-relaxed">
                    By using the HRMS, you acknowledge that you have read, understood, 
                    and agreed to be bound by these Terms of Service.
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
          className="text-center bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Questions About Our Terms?</h3>
            <p className="text-purple-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              If you have any questions about these Terms of Service or need clarification on any provisions, 
              our legal and compliance team is here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Contact Legal Team
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                Download Terms PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;