import axiosInstance from '../../api/axios';

const adminService = {
  // Ví dụ: Lấy danh sách chủ trọ
  getHosts: async () => {
    const response = await axiosInstance.get('/api/v1/admin/hosts');
    return response.data;
  },
  
  // Ví dụ: Quản lý gói dịch vụ
  getSubscriptions: async () => {
    const response = await axiosInstance.get('/api/v1/admin/subscriptions');
    return response.data;
  }
};

export default adminService;
