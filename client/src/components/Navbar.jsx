import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ setUserData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);
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
      className="bg-white shadow-sm px-6 py-3 font-sans sticky top-0 z-50 border-b border-gray-100"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <NavLink
          to="/dashboard"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:opacity-90 transition"
        >
          HRMS
        </NavLink>

        <button
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
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

          <Dropdown
            label="Account"
            open={systemOpen}
            setOpen={setSystemOpen}
            items={[
              { label: 'Profile', to: '/profile' },
              {
                label: 'Logout',
                onClick: handleLogout,
                className: 'text-red-600 hover:bg-red-50',
              },
            ]}
          />
        </ul>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
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

            <MobileDropdown
              label="Account"
              items={[
                { label: 'Profile', to: '/profile' },
                {
                  label: 'Logout',
                  onClick: handleLogout,
                  className: 'text-red-600',
                },
              ]}
            />
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
        } transition-colors`
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
      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
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
          transition={{ duration: 0.15 }}
          className="absolute left-0 top-full bg-white shadow-lg rounded-lg mt-1 p-1.5 z-50 min-w-[180px] border border-gray-100"
        >
          {items.map((item, i) =>
            item.to ? (
              <NavLink
                key={i}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm rounded-md transition-colors ${
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
                className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
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
        className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
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
            transition={{ duration: 0.2 }}
            className="pl-4 space-y-1 overflow-hidden"
          >
            {items.map((item, i) =>
              item.to ? (
                <NavLink
                  key={i}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm rounded-lg transition-colors ${
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
                  className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
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
