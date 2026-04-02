import axiosInstance from '../../../api/axios';

const cleanParams = (params: Record<string, unknown>) => {
  const cleaned: Record<string, unknown> = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'string' && value.trim() === '') return;
    cleaned[key] = value;
  });

  return cleaned;
};

const billingService = {
  getCurrentMonthInvoices: async (params: Record<string, unknown> = {}) => {
    const response = await axiosInstance.get('/api/v1/host/billing/invoices/current-month', {
      params: cleanParams(params),
    });
    return response.data;
  },

  getOverdueInvoices: async () => {
    const response = await axiosInstance.get('/api/v1/host/billing/invoices/overdue');
    return response.data;
  },

  createInvoice: async (data: Record<string, unknown>) => {
    const response = await axiosInstance.post('/api/v1/host/billing/invoices', data);
    return response.data;
  },
};

export default billingService;
