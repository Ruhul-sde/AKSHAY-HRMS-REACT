import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = ({ setUserData, userData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserData(null);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm px-4 sm:px-6 py-3 font-sans sticky top-0 z-50 border-b border-gray-100"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <NavLink
            to="/dashboard"
            className="flex items-center"
          >
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-8 w-auto mr-2"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              HRMS
            </span>
          </NavLink>
        </div>

        <button
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={24} className="text-gray-700" />
          ) : (
            <Menu size={24} className="text-gray-700" />
          )}
        </button>

        <ul className="hidden lg:flex items-center gap-1 text-gray-700 font-medium">
          <NavItem to="/dashboard">Dashboard</NavItem>

          <Dropdown
            label="Leave"
            open={leaveOpen}
            setOpen={setLeaveOpen}
            items={[
              { label: 'Apply for Leave', to: '/apply-leave' },
              { label: 'Leave History', to: '/leave-history' },
              { label: 'Pending Leaves', to: '/pending-leaves' },
            ]}
          />

          <Dropdown
            label="Loan"
            open={loanOpen}
            setOpen={setLoanOpen}
            items={[
              { label: 'Apply for Loan', to: '/apply-loan' },
              { label: 'Loan Status', to: '/loan-status' },
            ]}
          />

          <Dropdown
            label="Reports"
            open={reportOpen}
            setOpen={setReportOpen}
            items={[
              { label: 'Attendance Report', to: '/attendance-report' },
            ]}
          />

          <li className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors overflow-hidden border border-gray-200"
              aria-label="Profile menu"
            >
              {userData?.profilePicture ? (
                <img 
                  src={userData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-gray-600" />
              )}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full bg-white shadow-lg rounded-lg mt-1 p-1.5 z-50 w-48 border border-gray-100"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 hover:text-blue-500'
                      }`
                    }
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 hover:text-blue-500'
                      }`
                    }
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden mt-4 space-y-1 text-gray-700 font-medium overflow-hidden"
          >
            <NavItem to="/dashboard" mobile>Dashboard</NavItem>

            <MobileDropdown
              label="Leave"
              items={[
                { label: 'Apply for Leave', to: '/apply-leave' },
                { label: 'Leave History', to: '/leave-history' },
                { label: 'Pending Leaves', to: '/pending-leaves' },
              ]}
            />

            <MobileDropdown
              label="Loan"
              items={[
                { label: 'Apply for Loan', to: '/apply-loan' },
                { label: 'Loan Status', to: '/loan-status' },
              ]}
            />

            <MobileDropdown
              label="Reports"
              items={[
                { label: 'Attendance Report', to: '/attendance-report' },
              ]}
            />

            <li className="px-1">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50 hover:text-blue-500'
                  }`
                }
              >
                <User size={18} className="mr-2" />
                Profile
              </NavLink>
            </li>
            <li className="px-1">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50 hover:text-blue-500'
                  }`
                }
              >
                <Settings size={18} className="mr-2" />
                Settings
              </NavLink>
            </li>
            <li className="px-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Reusable navigation item
const NavItem = ({ to, children, mobile = false }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${mobile ? 'block px-4 py-2.5 rounded-lg' : 'px-3 py-2 rounded-lg'} ${
          isActive
            ? 'bg-blue-50 text-blue-600 font-semibold'
            : 'hover:bg-gray-50 hover:text-blue-500'
        } transition-colors duration-200`
      }
    >
      {children}
    </NavLink>
  </li>
);

// Dropdown for desktop
const Dropdown = ({ label, items, open, setOpen }) => (
  <li
    className="relative"
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
  >
    <button
      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
        open ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 hover:text-blue-500'
      }`}
      onClick={() => setOpen(!open)}
    >
      {label}
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown size={16} className="mt-0.5" />
      </motion.span>
    </button>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute left-0 top-full bg-white shadow-lg rounded-lg mt-1 p-1.5 z-50 min-w-[180px] border border-gray-100"
        >
          {items.map((item, i) =>
            item.to ? (
              <NavLink
                key={i}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50 hover:text-blue-500'
                  } ${item.className || ''}`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                  item.className || 'hover:bg-gray-50 hover:text-blue-500'
                }`}
              >
                {item.label}
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </li>
);

// Dropdown for mobile
const MobileDropdown = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <li className="px-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="pl-4 space-y-1 overflow-hidden"
          >
            {items.map((item, i) =>
              item.to ? (
                <NavLink
                  key={i}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm rounded-lg transition-colors duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 hover:text-blue-500'
                    } ${item.className || ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <button
                  key={i}
                  onClick={item.onClick}
                  className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors duration-150 ${
                    item.className || 'hover:bg-gray-50 hover:text-blue-500'
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default Navbar;