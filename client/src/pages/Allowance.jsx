
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Sparkles, Clock, Plus, Trash2, Calendar, DollarSign, FileText, Upload, X, IndianRupee } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import dayjs from 'dayjs';

const Allowance = ({ userData, setUserData }) => {
  const [allowanceTypes, setAllowanceTypes] = useState([]);
  const [allowanceEntries, setAllowanceEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingTypes, setLoadingTypes] = useState(true);

  // Fetch allowance types on component mount
  useEffect(() => {
    fetchAllowanceTypes();
  }, []);

  const fetchAllowanceTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await axios.get('/api/allowance-types');
      if (response.data.success) {
        setAllowanceTypes(response.data.allowanceTypes);
      } else {
        setError(response.data.message || 'Failed to fetch allowance types');
      }
    } catch (err) {
      setError('Failed to load allowance types');
      console.error('Error fetching allowance types:', err);
    } finally {
      setLoadingTypes(false);
    }
  };

  const addNewEntry = () => {
    const newEntry = {
      li_LineId: allowanceEntries.length + 1,
      ls_EMPCODE: userData?.ls_EMPCODE || '',
      ls_EXTYPE: '',
      ls_APLYDATE: dayjs().format('YYYYMMDD'),
      ld_AMT: '',
      ls_REMARKS: '',
      lst_ClsAllowenceFileDtl: []
    };
    setAllowanceEntries([...allowanceEntries, newEntry]);
  };

  const removeEntry = (index) => {
    const updated = allowanceEntries.filter((_, i) => i !== index);
    // Update line IDs
    const reindexed = updated.map((entry, i) => ({
      ...entry,
      li_LineId: i + 1
    }));
    setAllowanceEntries(reindexed);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...allowanceEntries];
    updated[index] = { ...updated[index], [field]: value };
    setAllowanceEntries(updated);
  };

  const addFileToEntry = (entryIndex, file) => {
    const updated = [...allowanceEntries];
    const newFile = {
      file: file, // Store the actual file object
      ls_FILEPATH: file.name, // Just store the filename for display
      ls_REMARKS: updated[entryIndex].ls_REMARKS || 'File attachment'
    };

    if (!updated[entryIndex].lst_ClsAllowenceFileDtl) {
      updated[entryIndex].lst_ClsAllowenceFileDtl = [];
    }

    updated[entryIndex].lst_ClsAllowenceFileDtl.push(newFile);
    setAllowanceEntries(updated);
  };

  const removeFileFromEntry = (entryIndex, fileIndex) => {
    const updated = [...allowanceEntries];
    updated[entryIndex].lst_ClsAllowenceFileDtl.splice(fileIndex, 1);
    setAllowanceEntries(updated);
  };

  const handleSubmit = async () => {
    if (!allowanceEntries.length) {
      setError('Please add at least one allowance entry');
      return;
    }

    // Validate entries
    for (let i = 0; i < allowanceEntries.length; i++) {
      const entry = allowanceEntries[i];
      if (!entry.ls_EXTYPE || !entry.ld_AMT || parseFloat(entry.ld_AMT) <= 0) {
        setError(`Please fill all required fields for entry ${i + 1}`);
        return;
      }
      if (!entry.ls_APLYDATE) {
        setError(`Please select a date for entry ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Create FormData for file uploads
      const formData = new FormData();

      // Convert month format from YYYY-MM to YYYYMM
      const monthFormatted = selectedMonth.replace('-', '');

      // Add basic form data
      formData.append('ls_MONTH', monthFormatted);

      // Process entries and add files
      const processedEntries = allowanceEntries.map((entry, entryIndex) => {
        const processedEntry = {
          li_LineId: entry.li_LineId,
          ls_EMPCODE: entry.ls_EMPCODE || userData?.ls_EMPCODE || '',
          ls_EXTYPE: entry.ls_EXTYPE,
          ls_APLYDATE: entry.ls_APLYDATE,
          ld_AMT: parseFloat(entry.ld_AMT),
          ls_REMARKS: entry.ls_REMARKS,
          lst_ClsAllowenceFileDtl: []
        };

        // Handle files if they exist
        if (entry.lst_ClsAllowenceFileDtl && entry.lst_ClsAllowenceFileDtl.length > 0) {
          entry.lst_ClsAllowenceFileDtl.forEach((fileData, fileIndex) => {
            if (fileData.file) {
              // Add file to FormData
              formData.append(`files_${entryIndex}_${fileIndex}`, fileData.file);
              // Add file reference to entry
              processedEntry.lst_ClsAllowenceFileDtl.push({
                ls_FILEPATH: `files_${entryIndex}_${fileIndex}`, // Reference to FormData key
                ls_REMARKS: fileData.ls_REMARKS || entry.ls_REMARKS || 'File attachment'
              });
            }
          });
        } else {
          // If no files, set to null to match API format
          processedEntry.lst_ClsAllowenceFileDtl = null;
        }

        return processedEntry;
      });

      // Add processed entries to FormData
      formData.append('lst_ClsAllowenceApplyDtl', JSON.stringify(processedEntries));

      console.log('Submitting allowance with files...');

      const response = await axios.post('/api/allowance/allowance-apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'Allowance applied successfully!');
        setAllowanceEntries([]);
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(response.data.message || 'Allowance application failed - please check your details and try again');
      }
    } catch (err) {
      console.error('Allowance submission error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'An unexpected error occurred during allowance submission.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loadingTypes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
        <Navbar setUserData={setUserData} userData={userData} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading allowance types...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <Navbar setUserData={setUserData} userData={userData} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Coins className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">Allowance Management</h1>
            <p className="text-gray-600 text-lg">Apply for meal allowance, travel allowance, and other reimbursements</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {/* Month Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Allowance Entries */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Allowance Entries</h2>
                <button
                  onClick={addNewEntry}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
              </div>

              {allowanceEntries.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Coins className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No allowance entries added yet. Click "Add Entry" to start.</p>
                </div>
              ) : (
                allowanceEntries.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Entry {index + 1}</h3>
                      <button
                        onClick={() => removeEntry(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Allowance Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allowance Type *
                        </label>
                        <select
                          value={entry.ls_EXTYPE}
                          onChange={(e) => updateEntry(index, 'ls_EXTYPE', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        >
                          <option value="">Select Type</option>
                          {allowanceTypes.map(type => (
                            <option key={type.code} value={type.code}>
                              {type.name} ({type.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={dayjs(entry.ls_APLYDATE, 'YYYYMMDD').format('YYYY-MM-DD')}
                          onChange={(e) => updateEntry(index, 'ls_APLYDATE', dayjs(e.target.value).format('YYYYMMDD'))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <IndianRupee className="w-4 h-4 inline mr-1" />
                          Amount *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={entry.ld_AMT}
                          onChange={(e) => updateEntry(index, 'ld_AMT', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter amount"
                          required
                        />
                      </div>

                      {/* Remarks */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FileText className="w-4 h-4 inline mr-1" />
                          Remarks
                        </label>
                        <input
                          type="text"
                          value={entry.ls_REMARKS}
                          onChange={(e) => updateEntry(index, 'ls_REMARKS', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter remarks"
                        />
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Upload className="w-4 h-4 inline mr-1" />
                        Attachments
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          Array.from(e.target.files).forEach(file => {
                            addFileToEntry(index, file);
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>

                    {/* File List */}
                    {entry.lst_ClsAllowenceFileDtl && entry.lst_ClsAllowenceFileDtl.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
                        {entry.lst_ClsAllowenceFileDtl.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                            <span className="text-sm text-gray-600">{file.file ? file.file.name : file.ls_FILEPATH}</span>
                            <button
                              onClick={() => removeFileFromEntry(index, fileIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Submit Button */}
            {allowanceEntries.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Allowance Application'
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Allowance;
