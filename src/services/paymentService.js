import apiClient from './apiClient';

/**
 * Service for handling payment-related API calls
 */
const paymentService = {
  /**
   * Create a payment intent on the backend
   * @param {Object} paymentData - Payment details (amount, currency, projectId)
   * @returns {Promise<Object>} - Client secret for Stripe Elements
   */
  createPaymentIntent: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/create-intent', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Confirm payment status and record transaction
   * @param {Object} confirmationData - Transaction details
   * @returns {Promise<Object>} - Success response
   */
  confirmPayment: async (confirmationData) => {
    try {
      const response = await apiClient.post('/payments/confirm', confirmationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get user's transaction history
   * @returns {Promise<Array>} - List of transactions
   */
  getTransactionHistory: async () => {
    try {
      const response = await apiClient.get('/payments/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Generate invoice for a transaction
   * @param {string} transactionId 
   * @returns {Promise<Blob>} - PDF Invoice blob
   */
  getInvoice: async (transactionId) => {
    try {
      const response = await apiClient.get(`/payments/invoice/${transactionId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;
