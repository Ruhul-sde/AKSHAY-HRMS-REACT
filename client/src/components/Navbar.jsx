import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, User, Settings, LogOut, Bell, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const dropdownItems = {
  leave: [
    { label: 'Apply for Leave', to: '/apply-leave', icon: '📝' },
    { label: 'Leave History', to: '/leave-history', icon: '🕒' },
    // { label: 'Pending Leaves', to: '/pending-leaves', icon: '⏳' },
  ],
  loan: [
    { label: 'Apply for Loan', to: '/apply-loan', icon: '💰' },
    { label: 'Loan Status', to: '/loan-status', icon: '📊' },
  ],
  reports: [
    { label: 'Leave Report', to: '/leave-report', icon: '📑' },
    { label: 'Pay Structure Report', to: '/pay-structure-report', icon: '💵' },
    { label: 'Annual Summary Report', to: '/annual-summary-report', icon: '📈' },
    { label: 'Monthly Attendance Report', to: '/monthly-attendance-report', icon: '🗓️' },
    { label: 'Loan Report', to: '/loan-report', icon: '📋' },
    { label: 'FulNFinal Report', to: '/fulnfinal-report', icon: '🏁' },
    { label: 'Employee Details Report', to: '/employee-details-report', icon: '👥' },
  ]
};

// Animation variants (moved outside component to be accessible by child components)
const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

const mobileMenuVariants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.2, ease: "easeIn" }
  },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.25, ease: "easeOut" }
  }
};

const Navbar = ({ setUserData, userData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserData(null);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-md shadow-lg px-4 sm:px-6 py-3 font-sans sticky top-0 z-50 border-b border-gray-100/50"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo Section */}
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <NavLink to="/dashboard" className="flex items-center group">
            <motion.img 
              src={logo} 
              alt="Company Logo" 
              className="h-9 w-auto mr-3 transition-transform group-hover:scale-105"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              AKSHAY HRMS
            </span>
          </NavLink>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100/80 transition-all duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-2 text-gray-700 font-medium">
          <NavItem to="/dashboard">Dashboard</NavItem>

          <Dropdown
            label="Leave"
            open={leaveOpen}
            setOpen={setLeaveOpen}
            items={dropdownItems.leave}
          />

          <Dropdown
            label="Loan"
            open={loanOpen}
            setOpen={setLoanOpen}
            items={dropdownItems.loan}
          />

          <Dropdown
            label="Reports"
            open={reportOpen}
            setOpen={setReportOpen}
            items={dropdownItems.reports}
          />

          {/* Notifications Icon */}
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className="relative p-2.5 rounded-xl text-gray-600 hover:bg-gray-100/80 transition-all duration-200">
              <Bell size={20} />
              <motion.span 
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </button>
          </motion.li>

          {/* Profile Section */}
          <li className="relative" ref={profileRef}>
            <motion.button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Profile menu"
            >
              <div className="relative">
                <motion.div 
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden border-2 border-white shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {userData?.ls_EMPCODE ? (
                    <img 
                      src={`http://localhost:5000/api/employee-image/${userData.ls_EMPCODE}`}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                  )}
                </motion.div>
                <motion.div 
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {userData?.ls_EMPNAME?.split(' ')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {userData?.ls_Department || 'Department'}
                </p>
              </div>
              <motion.div
                animate={{ rotate: profileOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="hidden md:block"
              >
                <ChevronDown size={16} className="text-gray-400" />
              </motion.div>
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-0 top-full bg-white shadow-xl rounded-2xl mt-2 p-2 z-50 w-64 border border-gray-100/50 backdrop-blur-sm"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">{userData?.ls_EMPNAME || 'Loading...'}</p>
                    <p className="text-sm text-gray-500">{userData?.ls_Email || 'Loading...'}</p>
                    <p className="text-xs text-gray-400 mt-1">ID: {userData?.ls_EMPCODE}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <ProfileMenuItem
                      to="/help"
                      icon={<Info size={16} />}
                      label="Help"
                    />
                    <ProfileMenuItem
                      to="/profile"
                      icon={<User size={16} />}
                      label="My Profile"
                    />
                    <ProfileMenuItem
                      to="/settings"
                      icon={<Settings size={16} />}
                      label="Settings"
                    />
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm rounded-xl text-red-600 hover:bg-red-50/80 transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="lg:hidden overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-100">
              <ul className="space-y-1 text-gray-700 font-medium">
                <MobileNavItem to="/dashboard" setMenuOpen={setMenuOpen}>Dashboard</MobileNavItem>

                <MobileDropdown
                  label="Leave"
                  items={dropdownItems.leave}
                  setMenuOpen={setMenuOpen}
                />

                <MobileDropdown
                  label="Loan"
                  items={dropdownItems.loan}
                  setMenuOpen={setMenuOpen}
                />

                <MobileDropdown
                  label="Reports"
                  items={dropdownItems.reports}
                  setMenuOpen={setMenuOpen}
                />

                {/* Mobile Profile Section */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <MobileNavItem to="/help" setMenuOpen={setMenuOpen}>
                    <Info size={18} className="mr-3" />
                    Help
                  </MobileNavItem>
                  <MobileNavItem to="/profile" setMenuOpen={setMenuOpen}>
                    <User size={18} className="mr-3" />
                    Profile
                  </MobileNavItem>
                  <MobileNavItem to="/settings" setMenuOpen={setMenuOpen}>
                    <Settings size={18} className="mr-3" />
                    Settings
                  </MobileNavItem>
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50/80 transition-all duration-200"
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </motion.button>
                </div>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Enhanced Navigation Item
const NavItem = ({ to, children }) => (
  <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : 'hover:bg-gray-100/80 hover:text-blue-600'
        }`
      }
    >
      {children}
    </NavLink>
  </motion.li>
);

// Enhanced Profile Menu Item
const ProfileMenuItem = ({ to, icon, label }) => (
  <motion.div whileHover={{ x: 4 }}>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-blue-50/80 text-blue-600'
            : 'hover:bg-gray-50/80 hover:text-blue-500'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  </motion.div>
);

// Enhanced Dropdown for desktop
const Dropdown = ({ label, items, open, setOpen }) => (
  <motion.li
    className="relative"
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
    whileHover={{ scale: 1.02 }}
  >
    <motion.button
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
        open ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'hover:bg-gray-100/80 hover:text-blue-600'
      }`}
      onClick={() => setOpen(!open)}
      whileTap={{ scale: 0.98 }}
    >
      {label}
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown size={16} className="mt-0.5" />
      </motion.span>
    </motion.button>

    <AnimatePresence>
      {open && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute left-0 top-full bg-white shadow-xl rounded-2xl mt-2 p-2 z-50 min-w-[200px] border border-gray-100/50 backdrop-blur-sm"
        >
          {items.map((item, i) => (
            <motion.div key={i} whileHover={{ x: 4 }}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600'
                      : 'hover:bg-gray-50/80 hover:text-blue-500'
                  }`
                }
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.li>
);

// Enhanced Mobile Navigation Item
const MobileNavItem = ({ to, children, setMenuOpen }) => (
  <motion.li whileTap={{ scale: 0.98 }}>
    <NavLink
      to={to}
      onClick={() => setMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : 'hover:bg-gray-100/80 hover:text-blue-600'
        }`
      }
    >
      {children}
    </NavLink>
  </motion.li>
);

// Enhanced Mobile Dropdown
const MobileDropdown = ({ label, items, setMenuOpen }) => {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
        whileTap={{ scale: 0.98 }}
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="pl-6 space-y-1 overflow-hidden"
          >
            {items.map((item, i) => (
              <motion.div key={i} whileTap={{ scale: 0.98 }}>
                <NavLink
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50/80 text-blue-600'
                        : 'hover:bg-gray-50/80 hover:text-blue-500'
                    }`
                  }
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default Navbar;