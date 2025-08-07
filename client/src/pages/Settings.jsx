import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Check,
  X,
  Info,
  Palette,
  Lock,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Camera,
  Monitor,
  Volume2,
  VolumeX
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Settings = ({ userData, setUserData }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile Settings
    displayName: userData?.ls_EMPNAME || '',
    email: userData?.ls_Email || '',
    phone: userData?.ls_Mobile || '',

    // Appearance Settings
    theme: localStorage.getItem('theme') || 'light',
    accentColor: localStorage.getItem('accentColor') || 'blue',
    language: localStorage.getItem('language') || 'en',

    // Notification Settings
    emailNotifications: JSON.parse(localStorage.getItem('emailNotifications') || 'true'),
    pushNotifications: JSON.parse(localStorage.getItem('pushNotifications') || 'true'),
    leaveReminders: JSON.parse(localStorage.getItem('leaveReminders') || 'true'),
    soundEnabled: JSON.parse(localStorage.getItem('soundEnabled') || 'true'),

    // Privacy Settings
    profileVisibility: localStorage.getItem('profileVisibility') || 'team',
    showOnlineStatus: JSON.parse(localStorage.getItem('showOnlineStatus') || 'true'),

    // Security Settings
    twoFactorEnabled: false,
    sessionTimeout: localStorage.getItem('sessionTimeout') || '30',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Save settings to localStorage
  const saveSettings = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save to localStorage
    Object.keys(settings).forEach(key => {
      localStorage.setItem(key, JSON.stringify(settings[key]));
    });

    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetSettings = () => {
    setSettings({
      ...settings,
      theme: 'light',
      accentColor: 'blue',
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
      leaveReminders: true,
      soundEnabled: true,
      profileVisibility: 'team',
      showOnlineStatus: true,
      sessionTimeout: '30'
    });
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User, color: 'bg-blue-500' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'bg-purple-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-green-500' },
    { id: 'privacy', label: 'Privacy', icon: Eye, color: 'bg-orange-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'bg-red-500' },
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
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <SettingsIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">Settings</h1>
                <p className="text-blue-100">Customize your experience</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div 
            variants={cardVariants}
            className="lg:w-80"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sticky top-24">
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-medium ${
                        activeSection === section.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-lg ${activeSection === section.id ? 'bg-white/20' : section.color}`}>
                        <Icon className={`w-5 h-5 ${activeSection === section.id ? 'text-white' : 'text-white'}`} />
                      </div>
                      <span>{section.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="space-y-2">
                  <motion.button
                    onClick={saveSettings}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </motion.button>

                  <motion.button
                    onClick={resetSettings}
                    className="w-full flex items-center gap-3 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset to Default
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            variants={cardVariants}
            className="flex-1"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
              >
                {activeSection === 'profile' && (
                  <ProfileSettings settings={settings} setSettings={setSettings} userData={userData} />
                )}
                {activeSection === 'appearance' && (
                  <AppearanceSettings settings={settings} setSettings={setSettings} />
                )}
                {activeSection === 'notifications' && (
                  <NotificationSettings settings={settings} setSettings={setSettings} />
                )}
                {activeSection === 'privacy' && (
                  <PrivacySettings settings={settings} setSettings={setSettings} />
                )}
                {activeSection === 'security' && (
                  <SecuritySettings settings={settings} setSettings={setSettings} setShowPasswordModal={setShowPasswordModal} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
            >
              <Check className="w-5 h-5" />
              Settings saved successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <PasswordChangeModal setShowModal={setShowPasswordModal} />
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ settings, setSettings, userData }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-blue-100 rounded-xl">
        <User className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <p className="text-gray-600">Manage your personal information</p>
      </div>
    </div>

    {/* Profile Picture */}
    <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
      <div className="relative">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-blue-600">
          <img 
            src={userData?.ls_EMPCODE ? `http://localhost:5000/api/employee-image/${userData.ls_EMPCODE}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
            }}
          />
        </div>
        <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">Profile Picture</h3>
        <p className="text-gray-600 text-sm">Update your profile picture</p>
        <div className="flex gap-2 mt-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Upload New
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
            Remove
          </button>
        </div>
      </div>
    </div>

    {/* Form Fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField
        label="Display Name"
        value={settings.displayName}
        onChange={(value) => setSettings(prev => ({ ...prev, displayName: value }))}
        placeholder="Enter your display name"
      />
      <SettingField
        label="Email Address"
        value={settings.email}
        onChange={(value) => setSettings(prev => ({ ...prev, email: value }))}
        placeholder="Enter your email"
        type="email"
      />
      <SettingField
        label="Phone Number"
        value={settings.phone}
        onChange={(value) => setSettings(prev => ({ ...prev, phone: value }))}
        placeholder="Enter your phone number"
        type="tel"
      />
      <div className="p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
        <input
          type="text"
          value={userData?.ls_EMPCODE || ''}
          className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
          disabled
        />
      </div>
    </div>
  </div>
);

// Appearance Settings Component
const AppearanceSettings = ({ settings, setSettings }) => {
  const themes = [
    { id: 'light', name: 'Light', icon: Sun, preview: 'bg-white' },
    { id: 'dark', name: 'Dark', icon: Moon, preview: 'bg-gray-900' },
    { id: 'auto', name: 'Auto', icon: Monitor, preview: 'bg-gradient-to-r from-white to-gray-900' }
  ];

  const colors = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
    { id: 'pink', name: 'Pink', color: 'bg-pink-500' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Palette className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Appearance</h2>
          <p className="text-gray-600">Customize how the app looks</p>
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <motion.button
                key={theme.id}
                onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.theme === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-full h-16 ${theme.preview} rounded-lg mb-3 border`}></div>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{theme.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Accent Color</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {colors.map((color) => (
            <motion.button
              key={color.id}
              onClick={() => setSettings(prev => ({ ...prev, accentColor: color.id }))}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                settings.accentColor === color.id
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-8 h-8 ${color.color} rounded-full`}></div>
              <span className="text-xs font-medium">{color.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Language</h3>
        <select
          value={settings.language}
          onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
          className="w-full md:w-64 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = ({ settings, setSettings }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-green-100 rounded-xl">
        <Bell className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <p className="text-gray-600">Control how you receive notifications</p>
      </div>
    </div>

    <div className="space-y-6">
      <ToggleSetting
        label="Email Notifications"
        description="Receive notifications via email"
        checked={settings.emailNotifications}
        onChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
      />
      <ToggleSetting
        label="Push Notifications"
        description="Receive push notifications in your browser"
        checked={settings.pushNotifications}
        onChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
      />
      <ToggleSetting
        label="Leave Reminders"
        description="Get reminded about upcoming leave deadlines"
        checked={settings.leaveReminders}
        onChange={(checked) => setSettings(prev => ({ ...prev, leaveReminders: checked }))}
      />
      <ToggleSetting
        label="Sound Notifications"
        description="Play sounds for notifications"
        checked={settings.soundEnabled}
        onChange={(checked) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
        icon={settings.soundEnabled ? Volume2 : VolumeX}
      />
    </div>
  </div>
);

// Privacy Settings Component
const PrivacySettings = ({ settings, setSettings }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-orange-100 rounded-xl">
        <Eye className="w-6 h-6 text-orange-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Privacy</h2>
        <p className="text-gray-600">Control your privacy settings</p>
      </div>
    </div>

    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
        <select
          value={settings.profileVisibility}
          onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
          className="w-full md:w-64 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="everyone">Everyone</option>
          <option value="team">Team Members Only</option>
          <option value="managers">Managers Only</option>
          <option value="private">Private</option>
        </select>
      </div>

      <ToggleSetting
        label="Show Online Status"
        description="Let others see when you're online"
        checked={settings.showOnlineStatus}
        onChange={(checked) => setSettings(prev => ({ ...prev, showOnlineStatus: checked }))}
      />

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Data Usage</h4>
            <p className="text-blue-700 text-sm">We collect minimal data to provide our services. View our privacy policy for details.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Security Settings Component
const SecuritySettings = ({ settings, setSettings, setShowPasswordModal }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-red-100 rounded-xl">
        <Shield className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Security</h2>
        <p className="text-gray-600">Protect your account</p>
      </div>
    </div>

    <div className="space-y-6">
      {/* Password */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Password</h3>
            <p className="text-gray-600 text-sm">Last changed 3 months ago</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Session Timeout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
        <select
          value={settings.sessionTimeout}
          onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
          className="w-full md:w-64 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="120">2 hours</option>
        </select>
      </div>

      {/* Two Factor Authentication */}
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800">Two-Factor Authentication</h4>
            <p className="text-yellow-700 text-sm mb-3">Add an extra layer of security to your account</p>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Reusable Components
const SettingField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const ToggleSetting = ({ label, description, checked, onChange, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="p-2 bg-white rounded-lg">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
      )}
      <div>
        <h4 className="font-medium text-gray-800">{label}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
    <motion.button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ x: checked ? 26 : 2 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  </div>
);

// Password Change Modal
const PasswordChangeModal = ({ setShowModal }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {['current', 'new', 'confirm'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field === 'current' ? 'Current Password' : 
                 field === 'new' ? 'New Password' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[field] ? 'text' : 'password'}
                  value={passwords[field]}
                  onChange={(e) => setPasswords(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;