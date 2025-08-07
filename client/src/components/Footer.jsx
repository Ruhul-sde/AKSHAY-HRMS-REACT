
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Heart,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-auto"
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AKSHAY HRMS
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Streamlining human resource management with innovative technology solutions. 
              Empowering organizations to manage their workforce efficiently.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600/20 transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Apply Leave', href: '/apply-leave' },
                { label: 'Attendance', href: '/attendance' },
                { label: 'Profile', href: '/profile' },
                { label: 'Settings', href: '/settings' }
              ].map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <ul className="space-y-2">
              {[
                'Leave Management',
                'Attendance Tracking',
                'Payroll Processing',
                'Employee Reports',
                'Loan Management'
              ].map((service, index) => (
                <li key={index}>
                  <motion.span
                    whileHover={{ x: 4 }}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group cursor-pointer"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {service}
                  </motion.span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3">
              <motion.div 
                whileHover={{ x: 4 }}
                className="flex items-start space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  123 Business Park, Tech City,<br />
                  Innovation District, 12345
                </span>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">support@akshayhrms.com</span>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <div className="flex items-center space-x-1">
                  <span className="text-sm">www.akshayhrms.com</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Bottom Footer */}
      <motion.div
        variants={itemVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} Akshay Software Technologies Private Limited. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <motion.a
              href="/privacy-policy"
              whileHover={{ y: -1 }}
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -1 }}
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -1 }}
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Support
            </motion.a>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.div>
            <span>by Akshay Team</span>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
