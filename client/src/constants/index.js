/**
 * Application constants
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ALLOWANCE: '/allowance',
  ATTENDANCE: '/attendance',
  LEAVE_APPLY: '/leave-apply',
  LEAVE_HISTORY: '/leave-history',
  LOAN_APPLY: '/loan-apply',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  ALLOWANCE: {
    TYPES: '/allowance/allowance-types',
    APPLY: '/allowance/allowance-apply',
    DELETE: '/allowance/allowance-delete'
  },
  EMPLOYEE: {
    PROFILE: '/employee/profile',
    UPDATE: '/employee/update'
  },
  HEALTH: {
    CHECK: '/health',
    READY: '/ready'
  }
};

export const ALLOWANCE_TYPES = {
  MA: 'Meal Allowance',
  TA: 'Travel Allowance',
  DA: 'Daily Allowance',
  OT: 'Overtime Allowance'
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ['.pdf', '.jpg', '.jpeg', '.png'],
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
};

export const VALIDATION = {
  ALLOWANCE: {
    MAX_ENTRIES: 50,
    MAX_AMOUNT: 100000,
    MAX_REMARKS_LENGTH: 500
  }
};

export const UI_MESSAGES = {
  SUCCESS: {
    ALLOWANCE_APPLIED: 'Allowance applied successfully!',
    FILE_UPLOADED: 'File uploaded successfully',
    PROFILE_UPDATED: 'Profile updated successfully'
  },
  ERROR: {
    GENERIC: 'An unexpected error occurred',
    NETWORK: 'Network error. Please check your connection.',
    VALIDATION: 'Please check all required fields',
    FILE_TOO_LARGE: 'File size exceeds 5MB limit',
    INVALID_FILE_TYPE: 'Only JPEG, PNG, and PDF files are allowed'
  },
  LOADING: {
    SUBMITTING: 'Submitting...',
    UPLOADING: 'Uploading...',
    LOADING: 'Loading...'
  }
};

export default {
  ROUTES,
  API_ENDPOINTS,
  ALLOWANCE_TYPES,
  FILE_UPLOAD,
  VALIDATION,
  UI_MESSAGES
};