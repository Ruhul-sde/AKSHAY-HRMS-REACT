
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  User,
  Building2,
  MessageSquare,
  FileText,
  Navigation,
  CheckCircle,
  X,
  Loader,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api';

const OutDuty = ({ userData, setUserData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeType, setActiveType] = useState(null); // 'I' for In, 'O' for Out
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formData, setFormData] = useState({
    ls_Location: '',
    ls_LocManual: '',
    ls_ClientNm: '',
    ls_ReasonVisit: '',
    ls_Remark: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get current location
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Get address from coordinates
      try {
        const response = await api.post('/reverse-geocode', {
          latitude,
          longitude
        });
        
        if (response.data.success) {
          setCurrentLocation({
            latitude,
            longitude,
            address: response.data.address
          });
          setFormData(prev => ({
            ...prev,
            ls_Location: response.data.address,
            ls_LocManual: response.data.address
          }));
        } else {
          throw new Error('Failed to get address');
        }
      } catch (reverseGeocodeError) {
        // If reverse geocoding fails, still use coordinates
        setCurrentLocation({
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
        setFormData(prev => ({
          ...prev,
          ls_Location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          ls_LocManual: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }));
      }

      setMessage({
        type: 'success',
        text: 'Location fetched successfully'
      });
    } catch (error) {
      console.error('Location error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to get current location. Please enable location services.'
      });
    } finally {
      setLocationLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentLocation) {
      setMessage({
        type: 'error',
        text: 'Please fetch your current location first'
      });
      return;
    }

    if (!formData.ls_ClientNm.trim() || !formData.ls_ReasonVisit.trim()) {
      setMessage({
        type: 'error',
        text: 'Client name and reason for visit are required'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ls_EmpCode: userData.ls_EMPCODE,
        ls_Type: activeType,
        ls_Location: formData.ls_Location,
        ls_LocManual: formData.ls_LocManual,
        ls_Latitude: currentLocation.latitude,
        ls_Longitude: currentLocation.longitude,
        ls_ClientNm: formData.ls_ClientNm,
        ls_ReasonVisit: formData.ls_ReasonVisit,
        ls_Remark: formData.ls_Remark
      };

      const response = await api.post('/out-duty', payload);

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: response.data.message
        });
        
        // Reset form after successful submission
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to record out-duty');
      }
    } catch (error) {
      console.error('Out-duty submission error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Failed to record out-duty'
      });
    } finally {
      setLoading(false);
    }
  };

  // Open modal
  const openModal = (type) => {
    setActiveType(type);
    setIsModalOpen(true);
    setMessage({ type: '', text: '' });
    // Auto-fetch location when modal opens
    getCurrentLocation();
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setActiveType(null);
    setCurrentLocation(null);
    setFormData({
      ls_Location: '',
      ls_LocManual: '',
      ls_ClientNm: '',
      ls_ReasonVisit: '',
      ls_Remark: ''
    });
    setMessage({ type: '', text: '' });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Navigation className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Out-Duty Tracking</h1>
              <p className="text-blue-100">Track your client visits and locations</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
        >
          {/* Check In Button */}
          <motion.button
            onClick={() => openModal('I')}
            className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Check In</h3>
              <p className="text-gray-600">Record your arrival at client location</p>
            </div>
          </motion.button>

          {/* Check Out Button */}
          <motion.button
            onClick={() => openModal('O')}
            className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-orange-100 rounded-full mb-4 group-hover:bg-orange-200 transition-colors">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Check Out</h3>
              <p className="text-gray-600">Record your departure from client location</p>
            </div>
          </motion.button>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={(e) => e.target === e.currentTarget && closeModal()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeType === 'I' ? 'bg-green-100' : 'bg-orange-100'}`}>
                      {activeType === 'I' ? (
                        <CheckCircle className={`w-6 h-6 ${activeType === 'I' ? 'text-green-600' : 'text-orange-600'}`} />
                      ) : (
                        <Clock className={`w-6 h-6 ${activeType === 'I' ? 'text-green-600' : 'text-orange-600'}`} />
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {activeType === 'I' ? 'Check In' : 'Check Out'}
                    </h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Message Display */}
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg mb-4 flex items-center gap-2 ${
                      message.type === 'success' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm">{message.text}</span>
                  </motion.div>
                )}

                {/* Location Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Current Location</label>
                    <button
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                      {locationLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      {locationLoading ? 'Fetching...' : 'Refresh'}
                    </button>
                  </div>
                  
                  {currentLocation ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-green-800">{currentLocation.address}</p>
                          <p className="text-green-600 text-xs">
                            {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Click "Refresh" to fetch your current location</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Manual Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manual Location (Optional)
                    </label>
                    <input
                      type="text"
                      name="ls_LocManual"
                      value={formData.ls_LocManual}
                      onChange={handleInputChange}
                      placeholder="Enter specific location details"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ls_ClientNm"
                      value={formData.ls_ClientNm}
                      onChange={handleInputChange}
                      placeholder="Enter client name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Reason for Visit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ls_ReasonVisit"
                      value={formData.ls_ReasonVisit}
                      onChange={handleInputChange}
                      placeholder="Enter reason for visit"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      name="ls_Remark"
                      value={formData.ls_Remark}
                      onChange={handleInputChange}
                      placeholder="Additional comments (optional)"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !currentLocation}
                      className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        activeType === 'I' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-orange-600 hover:bg-orange-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        activeType === 'I' ? 'Check In' : 'Check Out'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OutDuty;
