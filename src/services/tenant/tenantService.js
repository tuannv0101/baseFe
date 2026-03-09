import axiosInstance from '../../api/axios';

const tenantService = {
  // Ví dụ: Xem hóa đơn
  getInvoices: async () => {
    const response = await axiosInstance.get('/api/v1/tenant/invoices');
    return response.data;
  },
  
  // Ví dụ: Gửi yêu cầu bảo trì
  createMaintenanceRequest: async (data) => {
    const response = await axiosInstance.post('/api/v1/tenant/maintenance', data);
    return response.data;
  }
};

export default tenantService;
