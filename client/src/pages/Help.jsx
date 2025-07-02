import React from 'react';
import Navbar from '../components/Navbar';
import { Info, Users, Mail, Phone } from 'lucide-react';

const Help = ({ userData, setUserData }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <Navbar setUserData={setUserData} userData={userData} />
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Welcome to the HRMS Help Center. Here you can find answers to common questions and contact our support team for further assistance.
        </p>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Frequently Asked Questions</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>How do I apply for leave or loan?</li>
            <li>How can I view my attendance report?</li>
            <li>How do I change my password?</li>
            <li>Who do I contact for payroll or HR queries?</li>
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Contact Support</h2>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700">HR Team</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700">hr-support@example.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700">+91 98765 43210</span>
          </div>
        </div>
        <div className="text-sm text-gray-400">For urgent issues, please contact your HR manager directly.</div>
      </div>
    </div>
  </div>
);

export default Help;