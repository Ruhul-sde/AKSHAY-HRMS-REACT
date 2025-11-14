import { useState, useEffect } from 'react';
import { allowanceService } from '../services/allowanceService';
import { UI_MESSAGES } from '../constants';

export const useAllowance = () => {
  const [allowanceTypes, setAllowanceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch allowance types on mount
  useEffect(() => {
    fetchAllowanceTypes();
  }, []);

  const fetchAllowanceTypes = async () => {
    try {
      setLoadingTypes(true);
      setError('');
      const response = await allowanceService.getAllowanceTypes();
      
      if (response.success) {
        setAllowanceTypes(response.allowanceTypes);
      } else {
        setError(response.message || 'Failed to fetch allowance types');
      }
    } catch (err) {
      setError(err.message || UI_MESSAGES.ERROR.NETWORK);
    } finally {
      setLoadingTypes(false);
    }
  };

  const applyAllowance = async (formData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await allowanceService.applyAllowance(formData);
      
      if (response.success) {
        setSuccess(response.message || UI_MESSAGES.SUCCESS.ALLOWANCE_APPLIED);
        return { success: true, data: response };
      } else {
        setError(response.message || 'Allowance application failed');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || UI_MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteAllowance = async (docEntry) => {
    try {
      setLoading(true);
      setError('');

      const response = await allowanceService.deleteAllowance(docEntry);
      
      if (response.success) {
        setSuccess(response.message || 'Allowance deleted successfully');
        return { success: true };
      } else {
        setError(response.message || 'Failed to delete allowance');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || UI_MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    // State
    allowanceTypes,
    loading,
    loadingTypes,
    error,
    success,
    
    // Actions
    fetchAllowanceTypes,
    applyAllowance,
    deleteAllowance,
    clearMessages
  };
};

export default useAllowance;