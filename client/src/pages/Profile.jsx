
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
  Settings,
  FileText,
  Home,
  Building,
  UserCheck,
  Hash,
  Banknote,
  IdCard,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = ({ userData, setUserData }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileStats, setProfileStats] = useState({
    completionPercentage: 0,
    yearsOfService: 0,
    totalProjects: 24
  });

  // Calculate profile completion and years of service
  useEffect(() => {
    if (userData) {
      const fields = [
        userData?.ls_EMPNAME,
        userData?.ls_Email,
        userData?.ls_Mobile,
        userData?.ls_BirthDate,
        userData?.ls_Gender,
        userData?.ls_EMPTYPE,
        userData?.ls_Department,
        userData?.ls_Designation,
        userData?.ls_JoinDate,
        userData?.ls_Adhar,
        userData?.ls_PANNO,
        userData?.ls_PFNO
      ];
      const filledFields = fields.filter(field => field && field !== 'N/A' && field !== '').length;
      const completion = Math.round((filledFields / fields.length) * 100);
      
      // Calculate years of service
      let yearsOfService = 0;
      if (userData?.ls_JoinDate) {
        const joinDate = new Date(userData.ls_JoinDate.split(' ')[0].split('-').reverse().join('-'));
        const currentDate = new Date();
        yearsOfService = ((currentDate - joinDate) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
      }
      
      setProfileStats(prev => ({ 
        ...prev, 
        completionPercentage: completion,
        yearsOfService: parseFloat(yearsOfService)
      }));
    }
  }, [userData]);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '') return 'Not provided';
    try {
      // Handle DD-MM-YYYY format
      const parts = dateStr.split(' ')[0].split('-');
      if (parts.length === 3) {
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      return dateStr;
    }
    return dateStr;
  };

  const getProfilePicture = () => {
    if (userData?.ls_EMPCODE) {
      return `http://localhost:5000/api/employee-image?imagePath=${userData.ls_Picture || `/path/to/images/${userData.ls_EMPCODE}.jpg`}`;
    }
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'documents', label: 'Documents', icon: FileText }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
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
                      e.target.src = "https://images.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
                    }}
                  />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
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
                  {userData?.ls_Designation || 'Designation'} • {userData?.ls_Department || 'Department'}
                </motion.p>

                {/* Employee Details */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                    <CreditCard className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-blue-700 text-sm font-medium">ID: {userData?.ls_EMPCODE || 'N/A'}</span>
                  </div>
                  <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full border border-green-200">
                    <Calendar className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-700 text-sm font-medium">{profileStats.yearsOfService} years</span>
                  </div>
                  <div className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
                    <Users className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-purple-700 text-sm font-medium">{userData?.ls_ManagerName || 'Manager'}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 lg:gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{profileStats.completionPercentage}%</div>
                  <div className="text-sm text-blue-700">Profile Complete</div>
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
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
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
            {activeTab === 'professional' && <ProfessionalInfo userData={userData} formatDate={formatDate} />}
            {activeTab === 'contact' && <ContactInfo userData={userData} />}
            {activeTab === 'address' && <AddressInfo userData={userData} />}
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
      <InfoItem icon={Activity} label="Gender" value={userData?.ls_Gender === 'M' ? 'Male' : userData?.ls_Gender === 'F' ? 'Female' : userData?.ls_Gender} />
      <InfoItem icon={Heart} label="Blood Group" value={userData?.ls_BloodGrp || 'Not provided'} />
    </InfoCard>

    <InfoCard title="Identity Information" icon={IdCard}>
      <InfoItem icon={Hash} label="Aadhaar Number" value={userData?.ls_Adhar || 'Not provided'} />
      <InfoItem icon={Banknote} label="PAN Number" value={userData?.ls_PANNO || 'Not provided'} />
      <InfoItem icon={Shield} label="Employee Code" value={userData?.ls_EMPCODE} />
      <InfoItem icon={Calendar} label="Financial Year" value={userData?.ls_FinYear} />
    </InfoCard>
  </div>
);

// Professional Info Tab
const ProfessionalInfo = ({ userData, formatDate }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoCard title="Employment Details" icon={Briefcase}>
      <InfoItem icon={Building2} label="Department" value={userData?.ls_Department} />
      <InfoItem icon={Briefcase} label="Employee Type" value={userData?.ls_EMPTYPE} />
      <InfoItem icon={Award} label="Designation" value={userData?.ls_Designation || 'Not specified'} />
      <InfoItem icon={Calendar} label="Joining Date" value={formatDate(userData?.ls_JoinDate)} />
    </InfoCard>

    <InfoCard title="Management & Branch" icon={Building}>
      <InfoItem icon={User} label="Manager" value={userData?.ls_ManagerName || 'Not assigned'} />
      <InfoItem icon={Hash} label="Manager ID" value={userData?.ls_Manager || 'Not provided'} />
      <InfoItem icon={Building} label="Branch Name" value={userData?.ls_BrnchName || 'Not specified'} />
      <InfoItem icon={Hash} label="Branch ID" value={userData?.ls_BrnchId || 'Not provided'} />
    </InfoCard>

    <InfoCard title="Government & Financial IDs" icon={FileText}>
      <InfoItem icon={Shield} label="PF Number" value={userData?.ls_PFNO || 'Not provided'} />
      <InfoItem icon={Hash} label="UAN Number" value={userData?.ls_UANNO || 'Not provided'} />
      <InfoItem icon={CreditCard} label="ESIC Number" value={userData?.ls_ESICNO || 'Not provided'} />
      <InfoItem icon={Calendar} label="Confirmation Date" value={formatDate(userData?.ls_CnfmDate) || 'Not confirmed'} />
    </InfoCard>

    <InfoCard title="Company Information" icon={Building2}>
      <InfoItem icon={Building2} label="Company" value={userData?.ls_Company || 'Akshay Software Technologies'} />
      <InfoItem icon={Camera} label="Profile Picture Path" value={userData?.ls_Picture ? 'Available' : 'Not provided'} />
    </InfoCard>
  </div>
);

// Contact Info Tab
const ContactInfo = ({ userData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoCard title="Primary Contact" icon={Mail}>
      <InfoItem icon={Mail} label="Email Address" value={userData?.ls_Email} />
      <InfoItem icon={Phone} label="Mobile Number" value={userData?.ls_Mobile} />
      <InfoItem icon={Phone} label="Emergency Contact" value={userData?.ls_EmrgncyCnt || 'Not provided'} />
    </InfoCard>

    <InfoCard title="Communication Preferences" icon={Settings}>
      <InfoItem icon={Mail} label="Email Notifications" value="Enabled" />
      <InfoItem icon={Phone} label="SMS Alerts" value="Enabled" />
      <InfoItem icon={Activity} label="App Notifications" value="Enabled" />
      <InfoItem icon={Clock} label="Preferred Contact Time" value="9 AM - 6 PM" />
    </InfoCard>
  </div>
);

// Address Info Tab
const AddressInfo = ({ userData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoCard title="Home Address" icon={Home}>
      <InfoItem icon={Building} label="Building/Street" value={userData?.ls_HomeBuild || 'Not provided'} />
      <InfoItem icon={MapPin} label="City" value={userData?.ls_HomeCity || 'Not provided'} />
      <InfoItem icon={MapPin} label="State" value={userData?.ls_HomeState || 'Not provided'} />
      <InfoItem icon={Hash} label="Zip Code" value={userData?.ls_HomeZip || 'Not provided'} />
    </InfoCard>

    <InfoCard title="Work Address" icon={Building2}>
      <InfoItem icon={Building} label="Building/Office" value={userData?.ls_WorkBuild || 'Not provided'} />
      <InfoItem icon={MapPin} label="City" value={userData?.ls_WorkCity || 'Not provided'} />
      <InfoItem icon={MapPin} label="State" value={userData?.ls_WorkState || 'Not provided'} />
      <InfoItem icon={Hash} label="Zip Code" value={userData?.ls_WorkZip || 'Not provided'} />
    </InfoCard>
  </div>
);

// Documents Info Tab
const DocumentsInfo = ({ userData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoCard title="Identity Documents" icon={CreditCard}>
      <DocumentItem 
        name="Aadhaar Card" 
        status={userData?.ls_Adhar ? "Available" : "Not provided"} 
        number={userData?.ls_Adhar ? `****${userData.ls_Adhar.slice(-4)}` : 'N/A'}
      />
      <DocumentItem 
        name="PAN Card" 
        status={userData?.ls_PANNO ? "Available" : "Not provided"} 
        number={userData?.ls_PANNO || 'N/A'}
      />
      <DocumentItem 
        name="Profile Picture" 
        status={userData?.ls_Picture ? "Available" : "Not uploaded"} 
        number={userData?.ls_Picture ? "Uploaded" : 'N/A'}
      />
    </InfoCard>

    <InfoCard title="Employment Documents" icon={Briefcase}>
      <DocumentItem 
        name="PF Account" 
        status={userData?.ls_PFNO ? "Active" : "Not provided"} 
        number={userData?.ls_PFNO || 'N/A'}
      />
      <DocumentItem 
        name="UAN Account" 
        status={userData?.ls_UANNO ? "Active" : "Not provided"} 
        number={userData?.ls_UANNO || 'N/A'}
      />
      <DocumentItem 
        name="ESIC Account" 
        status={userData?.ls_ESICNO ? "Active" : "Not provided"} 
        number={userData?.ls_ESICNO || 'N/A'}
      />
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
      <p className="text-gray-800 font-semibold">{value || 'Not provided'}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </div>
);

const DocumentItem = ({ name, status, number }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <div>
      <p className="text-gray-800 font-semibold">{name}</p>
      <p className="text-gray-500 text-sm">{number}</p>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      status === 'Available' || status === 'Active' || status === 'Uploaded'
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {status}
    </span>
  </div>
);

export default Profile;