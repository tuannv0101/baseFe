import axiosInstance from '../api/axios';

const authService = {
  /**
   * Đăng nhập hệ thống
   * @param {Object} credentials { username, password, role }
   */
  login: async (credentials) => {
    console.log(credentials);
    
    const response = await axiosInstance.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    // Xử lý các logic logout phía server nếu cần (ví dụ: thu hồi token)
  }
};

export default authService;
