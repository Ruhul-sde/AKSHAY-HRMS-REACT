import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Building2, 
  CreditCard,
  Shield,
  Edit3,
  Camera,
  Star,
  Award,
  Clock,
  Activity,
  Heart,
  Sparkles,
  ChevronRight,
  Download,
  Share2,
  Settings
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = ({ userData, setUserData }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileStats, setProfileStats] = useState({
    completionPercentage: 85,
    yearsOfService: 3.5,
    totalProjects: 24,
    rating: 4.8
  });

  // Calculate profile completion
  useEffect(() => {
    const fields = [
      userData?.ls_EMPNAME,
      userData?.ls_Email,
      userData?.ls_Mobile,
      userData?.ls_BirthDate,
      userData?.ls_Gender,
      userData?.ls_EMPTYPE,
      userData?.ls_Department
    ];
    const filledFields = fields.filter(field => field && field !== 'N/A').length;
    const completion = Math.round((filledFields / fields.length) * 100);
    setProfileStats(prev => ({ ...prev, completionPercentage: completion }));
  }, [userData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr.split(' ')[0]);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getProfilePicture = () => {
    if (userData?.ls_EMPCODE) {
      return `http://localhost:5000/api/employee-image?imagePath=/path/to/images/${userData.ls_EMPCODE}.jpg`;
    }
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'documents', label: 'Documents', icon: CreditCard }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 40px rgba(59, 130, 246, 0.6)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div 
          variants={cardVariants}
          className="relative mb-8"
        >
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Picture */}
              <div className="relative">
                <motion.div 
                  className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img 
                    src={getProfilePicture()}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
                    }}
                  />
                </motion.div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <motion.h1 
                  className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {userData?.ls_EMPNAME || 'Employee Name'}
                </motion.h1>
                <motion.p 
                  className="text-lg text-gray-600 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {userData?.ls_Department || 'Department'} • {userData?.ls_EMPTYPE || 'Employee Type'}
                </motion.p>

                {/* Employee ID Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <CreditCard className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-blue-300 text-sm">ID: {userData?.ls_EMPCODE || 'N/A'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          variants={cardVariants}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'personal' && <PersonalInfo userData={userData} formatDate={formatDate} />}
            {activeTab === 'professional' && <ProfessionalInfo userData={userData} />}
            {activeTab === 'contact' && <ContactInfo userData={userData} />}
            {activeTab === 'documents' && <DocumentsInfo userData={userData} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <Footer />
    </div>
  );
};

// Personal Info Tab
const PersonalInfo = ({ userData, formatDate }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoCard title="Basic Information" icon={User}>
      <InfoItem icon={User} label="Full Name" value={userData?.ls_EMPNAME} />
      <InfoItem icon={Calendar} label="Date of Birth" value={formatDate(userData?.ls_BirthDate)} />
      <InfoItem icon={Activity} label="Gender" value={userData?.ls_Gender} />
      <InfoItem icon={CreditCard} label="Employee Code" value={userData?.ls_EMPCODE} />
    </InfoCard>

    <InfoCard title="Additional Details" icon={Heart}>
      <InfoItem icon={MapPin} label="Address" value="123 Main Street, City" />
      <InfoItem icon={Shield} label="Blood Group" value="O+" />
      <InfoItem icon={Phone} label="Emergency Contact" value="+1 (555) 123-4567" />
      <InfoItem icon={Calendar} label="Joining Date" value="January 15, 2021" />
    </InfoCard>
  </div>
);

// Professional Info Tab
const ProfessionalInfo = ({ userData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoCard title="Employment Details" icon={Briefcase}>
      <InfoItem icon={Building2} label="Department" value={userData?.ls_Department} />
      <InfoItem icon={Briefcase} label="Employee Type" value={userData?.ls_EMPTYPE} />
      <InfoItem icon={Award} label="Designation" value="Senior Developer" />
      <InfoItem icon={User} label="Reporting Manager" value="John Smith" />
    </InfoCard>

    <InfoCard title="Skills & Certifications" icon={Award}>
      <div className="space-y-3">
        <SkillBar skill="React Development" percentage={90} />
        <SkillBar skill="Node.js" percentage={85} />
        <SkillBar skill="Database Design" percentage={80} />
        <SkillBar skill="Project Management" percentage={75} />
      </div>
    </InfoCard>
  </div>
);

// Contact Info Tab
const ContactInfo = ({ userData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoCard title="Contact Information" icon={Mail}>
      <InfoItem icon={Mail} label="Email" value={userData?.ls_Email} />
      <InfoItem icon={Phone} label="Mobile" value={userData?.ls_Mobile} />
      <InfoItem icon={Phone} label="Office Phone" value="+1 (555) 987-6543" />
      <InfoItem icon={MapPin} label="Office Location" value="Building A, Floor 5" />
    </InfoCard>

    <InfoCard title="Social Links" icon={Share2}>
      <InfoItem icon={Share2} label="LinkedIn" value="linkedin.com/in/employee" />
      <InfoItem icon={Share2} label="GitHub" value="github.com/employee" />
      <InfoItem icon={Share2} label="Portfolio" value="employee-portfolio.com" />
      <InfoItem icon={Mail} label="Teams" value="employee@company.teams" />
    </InfoCard>
  </div>
);

// Documents Info Tab
const DocumentsInfo = ({ userData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoCard title="Identity Documents" icon={CreditCard}>
      <DocumentItem name="Passport" status="Verified" date="Valid until 2030" />
      <DocumentItem name="Driver's License" status="Verified" date="Valid until 2027" />
      <DocumentItem name="National ID" status="Verified" date="Valid until 2029" />
    </InfoCard>

    <InfoCard title="Employment Documents" icon={Briefcase}>
      <DocumentItem name="Employment Contract" status="Active" date="Signed Jan 2021" />
      <DocumentItem name="Tax Forms" status="Updated" date="Filed 2024" />
      <DocumentItem name="Insurance Papers" status="Active" date="Valid 2024" />
    </InfoCard>
  </div>
);

// Reusable Components
const InfoCard = ({ title, icon: Icon, children }) => (
  <motion.div 
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    whileHover={{ y: -2, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-blue-100 rounded-xl">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <div className="p-2 bg-blue-100 rounded-lg">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1">
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-gray-800 font-semibold">{value || 'N/A'}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </div>
);

const SkillBar = ({ skill, percentage }) => (
  <div className="space-y-2">
    <div className="flex justify-between">
      <span className="text-gray-800 font-medium">{skill}</span>
      <span className="text-blue-600 font-semibold">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  </div>
);

const DocumentItem = ({ name, status, date }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <div>
      <p className="text-gray-800 font-semibold">{name}</p>
      <p className="text-gray-500 text-sm">{date}</p>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      status === 'Verified' || status === 'Active' 
        ? 'bg-green-100 text-green-700' 
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {status}
    </span>
  </div>
);

export default Profile;