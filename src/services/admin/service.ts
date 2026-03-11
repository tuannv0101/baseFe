import axiosInstance from '../../api/axios';

const adminService = {
  getHosts: async () => {
    const response = await axiosInstance.get('/api/v1/admin/hosts');
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await axiosInstance.get('/api/v1/admin/subscriptions');
    return response.data;
  },
};

export default adminService;

