/**
 * Client configuration
 */

const config = {
  // API Configuration
  api: {
    baseURL: '/api',
    timeout: 30000
  },

  // Application Settings
  app: {
    name: 'HRMS Application',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development'
  },

  // Feature Flags
  features: {
    enableNotifications: true,
    enableFileUpload: true,
    enableReports: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFileCount: 10
  },

  // UI Settings
  ui: {
    theme: 'light',
    primaryColor: '#10b981', // emerald-500
    itemsPerPage: 10,
    animationDuration: 300
  }
};

export default config;