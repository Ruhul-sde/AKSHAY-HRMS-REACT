import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import dayjs from 'dayjs';
import {
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Paperclip,
  X,
  Calendar,
  DollarSign,
  FileText,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AllowanceApply({ userData, setUserData }) {
  const navigate = useNavigate();

  const [allowanceTypes, setAllowanceTypes] = useState([]);
  const [entries, setEntries] = useState([]);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [loading, setLoading] = useState({
    types: true,
    submit: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(null);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!userData?.ls_EMPCODE) {
      navigate('/login');
    }
  }, [userData, navigate]);

  /* ================= FETCH ALLOWANCE TYPES ================= */
  useEffect(() => {
    fetchAllowanceTypes();
  }, []);

  const fetchAllowanceTypes = async () => {
    setLoading(prev => ({ ...prev, types: true }));
    try {
      const res = await api.get('/allowance-types');
      if (res.data.success) {
        setAllowanceTypes(res.data.allowanceTypes || []);
      } else {
        setError(res.data.message || 'Failed to load allowance types');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load allowance types');
    } finally {
      setLoading(prev => ({ ...prev, types: false }));
    }
  };

  /* ================= ENTRY MANAGEMENT ================= */
  const addEntry = () => {
    const newEntry = {
      li_LineId: entries.length + 1,
      ls_EXTYPE: '',
      ls_APLYDATE: dayjs().format('YYYYMMDD'),
      ld_AMT: '',
      ls_REMARKS: '',
      files: []
    };
    
    setEntries(prev => [...prev, newEntry]);
    setSelectedEntryIndex(entries.length);
  };

  const removeEntry = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated.map((e, i) => ({ ...e, li_LineId: i + 1 })));
    setSelectedEntryIndex(null);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  /* ================= FILE HANDLING ================= */
  const handleFileChange = (entryIndex, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const updated = [...entries];
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    files.forEach(file => {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds 10MB limit`);
        return;
      }

      updated[entryIndex].files.push({
        file,
        fileName: file.name,
        size: file.size,
        type: file.type,
        uploadTime: Date.now()
      });
    });

    setEntries(updated);
    e.target.value = '';
  };

  const removeFile = (entryIndex, fileIndex) => {
    const updated = [...entries];
    updated[entryIndex].files.splice(fileIndex, 1);
    setEntries(updated);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!entries.length) {
      setError('Please add at least one allowance entry');
      return false;
    }

    if (!month) {
      setError('Please select a month');
      return false;
    }

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      
      if (!e.ls_EXTYPE) {
        setError(`Select allowance type for entry ${i + 1}`);
        setSelectedEntryIndex(i);
        return false;
      }
      
      if (!e.ld_AMT || Number(e.ld_AMT) <= 0) {
        setError(`Enter valid amount for entry ${i + 1}`);
        setSelectedEntryIndex(i);
        return false;
      }
      
      if (!e.ls_APLYDATE) {
        setError(`Select date for entry ${i + 1}`);
        setSelectedEntryIndex(i);
        return false;
      }
      
      const selectedDate = dayjs(e.ls_APLYDATE);
      const today = dayjs();
      if (selectedDate.isAfter(today)) {
        setError(`Date cannot be in the future for entry ${i + 1}`);
        setSelectedEntryIndex(i);
        return false;
      }
    }
    
    return true;
  };

  /* ================= SUBMIT ALLOWANCE (EXACTLY LIKE LOGIN) ================= */
  const handleSubmit = async () => {
    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate
    if (!validate()) return;

    setLoading(prev => ({ ...prev, submit: true }));

    try {
      const formData = new FormData();

      // Add month (format: YYYYMM)
      const formattedMonth = month.replace('-', '');
      formData.append('ls_MONTH', formattedMonth);
      
      // Prepare entries - MATCH BACKEND EXPECTATIONS
      const allowanceDetails = entries.map((e, entryIndex) => {
        const baseEntry = {
          li_LineId: e.li_LineId,
          ls_EmpCode: userData.ls_EMPCODE, // IMPORTANT: Match backend field name
          ls_EXTYPE: e.ls_EXTYPE,
          ls_APLYDATE: e.ls_APLYDATE,
          ld_AMT: Number(e.ld_AMT),
          ls_REMARKS: e.ls_REMARKS || ''
        };

        // If there are files, create file details
        if (e.files && e.files.length > 0) {
          const fileDetails = e.files.map((fileObj, fileIndex) => {
            const fileKey = `file-${e.li_LineId}-${fileIndex}-${fileObj.uploadTime}`;
            formData.append(fileKey, fileObj.file);
            
            return {
              ls_FILEPATH: fileKey,
              ls_REMARKS: 'Attachment'
            };
          });
          
          return {
            ...baseEntry,
            lst_ClsAllowenceFileDtl: fileDetails
          };
        } else {
          return {
            ...baseEntry,
            lst_ClsAllowenceFileDtl: null
          };
        }
      });

      // Append as JSON string
      formData.append('lst_ClsAllowenceApplyDtl', JSON.stringify(allowanceDetails));

      // API CALL - EXACTLY LIKE LOGIN
      const res = await api.post('/allowance-apply', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      // RESPONSE HANDLING - EXACTLY LIKE LOGIN
      if (res.data.success) {
        setSuccess(res.data.message || 'Allowance applied successfully');
        setEntries([]);
        setSelectedEntryIndex(null);
      } else {
        setError(res.data.message || 'Allowance application failed');
      }
    } catch (err) {
      // ERROR HANDLING - EXACTLY LIKE LOGIN
      setError(err.response?.data?.message || 'Allowance application failed');
    } finally {
      // LOADING HANDLING - EXACTLY LIKE LOGIN
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  /* ================= FORMAT FILE SIZE ================= */
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  /* ================= FORMAT DATE FOR DISPLAY ================= */
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  };

  /* ================= ANIMATION VARIANTS ================= */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar setUserData={setUserData} userData={userData} />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Allowance Application
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Submit your monthly allowance claims with supporting documents
          </p>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-red-700 font-medium">{error}</p>
                  {selectedEntryIndex !== null && (
                    <p className="text-red-600 text-sm mt-1">
                      Please check entry #{selectedEntryIndex + 1}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setError('')}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
                <button 
                  onClick={() => setSuccess('')}
                  className="text-green-500 hover:text-green-700"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
        >
          {/* Month Selection */}
          <motion.div variants={itemVariants} className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                Select Month *
              </div>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <div className="text-sm text-gray-500">
                {dayjs(month).format('MMMM YYYY')}
              </div>
            </div>
          </motion.div>

          {/* Allowance Types Loading */}
          {loading.types && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-500 mr-3" />
              <span className="text-blue-700">Loading allowance types...</span>
            </div>
          )}

          {/* Entries Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Allowance Entries</h2>
                <p className="text-gray-600 text-sm">Add all your allowance claims for the month</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addEntry}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-blue-200 transition-shadow"
              >
                <Plus size={18} />
                Add Entry
              </motion.button>
            </div>

            {entries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl"
              >
                <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">
                  No allowance entries added
                </h3>
                <p className="text-gray-400 mb-4">
                  Click "Add Entry" to start adding your allowance claims
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`border rounded-2xl p-6 transition-all ${
                      selectedEntryIndex === index 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <h3 className="font-semibold text-gray-800">Entry #{index + 1}</h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeEntry(index)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {/* Allowance Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Allowance Type *
                        </label>
                        <select
                          value={entry.ls_EXTYPE}
                          onChange={(e) => updateEntry(index, 'ls_EXTYPE', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          required
                        >
                          <option value="">Select Type</option>
                          {allowanceTypes.map(type => (
                            <option key={type.code} value={type.code}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                          <input
                            type="date"
                            value={formatDateForDisplay(entry.ls_APLYDATE)}
                            onChange={(e) =>
                              updateEntry(index, 'ls_APLYDATE', dayjs(e.target.value).format('YYYYMMDD'))
                            }
                            max={dayjs().format('YYYY-MM-DD')}
                            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                          />
                        </div>
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                          <input
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            value={entry.ld_AMT}
                            onChange={(e) => updateEntry(index, 'ld_AMT', e.target.value)}
                            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                          />
                        </div>
                      </div>

                      {/* Remarks */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remarks
                        </label>
                        <input
                          type="text"
                          placeholder="Optional remarks..."
                          value={entry.ls_REMARKS}
                          onChange={(e) => updateEntry(index, 'ls_REMARKS', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supporting Documents (Optional)
                      </label>
                      <div className="flex items-center gap-4 mb-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(index, e)}
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                          />
                          <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-2">
                            <Paperclip size={16} />
                            <span className="text-sm font-medium">Choose Files</span>
                          </div>
                        </label>
                        <span className="text-xs text-gray-500">
                          Max 10MB per file (JPG, PNG, PDF, DOC, DOCX)
                        </span>
                      </div>

                      {/* File List */}
                      {entry.files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {entry.files.map((file, fileIndex) => (
                            <motion.div
                              key={fileIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
                            >
                              <div className="flex items-center gap-3">
                                <Paperclip size={16} className="text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {file.fileName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)} • {file.type}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(index, fileIndex)}
                                className="p-1 hover:bg-red-100 rounded transition"
                                type="button"
                              >
                                <X size={16} className="text-gray-400 hover:text-red-500" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Submit Button */}
          {entries.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Total Entries: <span className="font-bold">{entries.length}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please review all entries before submitting
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading.submit}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading.submit ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Allowance
                      <ChevronRight size={18} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AllowanceApply;