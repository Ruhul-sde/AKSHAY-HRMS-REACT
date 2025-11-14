import api from './api';

export const allowanceService = {
  /**
   * Get allowance types
   */
  getAllowanceTypes: async () => {
    try {
      const response = await api.get('/allowance/allowance-types');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch allowance types');
    }
  },

  /**
   * Apply for allowance
   */
  applyAllowance: async (formData) => {
    try {
      const response = await api.post('/allowance/allowance-apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to apply for allowance');
    }
  },

  /**
   * Delete allowance
   */
  deleteAllowance: async (docEntry) => {
    try {
      const response = await api.post('/allowance/allowance-delete', { ls_DocEntry: docEntry });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete allowance');
    }
  }
};

export default allowanceService;