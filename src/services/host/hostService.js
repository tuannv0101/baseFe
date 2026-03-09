import axiosInstance from '../../api/axios';

const hostService = {
  // Ví dụ: Lấy danh sách tòa nhà/phòng
  getRooms: async () => {
    const response = await axiosInstance.get('/api/v1/host/rooms');
    return response.data;
  },
  
  // Ví dụ: Quản lý khách thuê
  getTenants: async () => {
    const response = await axiosInstance.get('/api/v1/host/tenants');
    return response.data;
  }
};

export default hostService;
