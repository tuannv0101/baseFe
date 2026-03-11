import axiosInstance from '../../api/axios';

const tenantService = {
  getInvoices: async () => {
    const response = await axiosInstance.get('/api/v1/tenant/invoices');
    return response.data;
  },

  createMaintenanceRequest: async (data: unknown) => {
    const response = await axiosInstance.post('/api/v1/tenant/maintenance', data);
    return response.data;
  },
};

export default tenantService;

