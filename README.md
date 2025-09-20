# Overview

This is an HRMS (Human Resource Management System) web application built for employee management and HR operations. The system provides a comprehensive suite of features for employees to manage their attendance, leaves, loans, allowances, and other HR-related activities. It follows a client-server architecture with a React frontend and Express.js backend that interfaces with an external WCF API service.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client is built using React 19.1.0 with modern development tools and libraries:

- **Build System**: Vite with React plugin for fast development and hot module replacement
- **Styling**: TailwindCSS 4.1.8 with custom utility classes for consistent UI components
- **Routing**: React Router DOM 7.6.1 for client-side navigation
- **HTTP Client**: Axios for API communication with the backend
- **UI Components**: Lucide React icons, React Icons, and Framer Motion for animations
- **Date Handling**: Day.js and date-fns for date manipulation and formatting
- **Visual Effects**: TSParticles for background animations and visual enhancements

The frontend serves on port 5000 and uses a proxy configuration to route `/api` requests to the backend server on port 3001.

## Backend Architecture

The server is built with Express.js 5.1.0 using a modular route structure:

- **Route Organization**: Separate modules for different HR functions (auth, leave, loan, attendance, employee, outduty, holiday, allowance, password)
- **Middleware**: CORS for cross-origin requests, body-parser for request parsing, and multer for file uploads
- **File Handling**: Multer storage configuration for document uploads with support for images, PDFs, and documents
- **Error Handling**: Centralized error handling utilities for consistent API responses
- **Environment Configuration**: Dotenv for environment variable management

The backend serves on port 3001 (configurable via environment variables) and acts as a proxy layer between the React frontend and external WCF services.

## API Integration Pattern

The system implements a proxy architecture where the Express backend serves as an intermediary:

- **Client → Backend**: Frontend makes requests to `/api` endpoints
- **Backend → WCF Service**: Backend forwards requests to external WCF API service
- **Response Flow**: Responses are processed and standardized before sending back to client

This pattern allows for data transformation, error handling, and security measures while maintaining a clean separation of concerns.

## Data Management

The application uses a stateless approach with no direct database integration:

- **External API Dependency**: All data operations are handled through WCF service calls
- **File Storage**: Local file system storage for uploaded documents (allowance attachments)
- **Session Management**: Stateless authentication flow through external API validation

## Utility Functions

Custom utility functions handle:
- **EMI Calculations**: Loan EMI calculations with interest and tenure
- **Form Validation**: Field-level validation for loan applications and other forms
- **Date Formatting**: Consistent date handling across different components

# External Dependencies

## Core Services

- **WCF API Service**: Primary data source accessible via BASE_URL environment variable
  - Employee authentication and details
  - Leave management (types, applications, reports)
  - Loan management (types, applications, calculations)
  - Attendance tracking and reporting
  - Holiday calendars and reports
  - Allowance management
  - Out-duty tracking with GPS coordinates
  - Password management

## Development and Build Tools

- **Vite**: Development server and build tool for the React frontend
- **Nodemon**: Development server with auto-restart for the Express backend
- **ESLint**: Code linting with React-specific rules and hooks validation

## Third-Party Libraries

- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Axios**: HTTP client for API communication between frontend and backend
- **Day.js**: Lightweight date manipulation library
- **Framer Motion**: Animation library for smooth UI transitions
- **Multer**: File upload handling middleware for document attachments
- **React Router**: Client-side routing for single-page application navigation

## Environment Configuration

The application requires environment variables for:
- `BASE_URL`: WCF API service endpoint
- `CLIENT_URL`: Frontend application URL for CORS configuration
- `PORT`: Backend server port (defaults to 3001)
- `API_TIMEOUT`: Timeout configuration for external API calls

## File System Dependencies

- **Upload Directory**: Local storage for allowance-related document uploads
- **Static File Serving**: Employee image serving through file system access
- **Supported File Types**: Images (JPEG, JPG, PNG), documents (PDF, DOC, DOCX)