import axiosInstance from '../../api/axios';
import type { LoginCredentials, LoginResponse } from './type';

const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    // Server-side logout if needed
  },
};

export default authService;

