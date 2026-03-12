import axiosInstance from '../../api/axios';
import { propertyManagementService } from './propertyManagement';

const hostService = {
  getRooms: async () => {
    const response = await axiosInstance.get('/api/v1/host/rooms');
    return response.data;
  },

  getTenants: async () => {
    const response = await axiosInstance.get('/api/v1/host/tenants');
    return response.data;
  },


  getTenantByIdCardNumber: async (idCardNumber: string) => {
    const response = await axiosInstance.get('/api/v1/host/tenancy/tenants/by-id-card-number', {
      params: { idCardNumber },
    });
    return response.data;
  },
  // Wrapper để giữ tương thích; nên dùng propertyManagementService trực tiếp.
  getProperties: propertyManagementService.getProperties,
};

export default hostService;

