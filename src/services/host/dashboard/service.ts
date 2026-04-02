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

const hostDashboardService = {
  getOverview: async (params: Record<string, unknown> = {}) => {
    const response = await axiosInstance.get('/api/v1/host/dashboard/overview', {
      params: cleanParams(params),
    });
    return response.data;
  },

  getNotifications: async (params: Record<string, unknown> = {}) => {
    const response = await axiosInstance.get('/api/v1/host/dashboard/notifications', {
      params: cleanParams(params),
    });
    return response.data;
  },
};

export default hostDashboardService;
