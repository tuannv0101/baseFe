import axiosInstance from '../../../api/axios';
import type { GetPropertiesParams, GetPropertiesResponse } from './type';

const cleanParams = (params: Record<string, unknown>) => {
  const cleaned: Record<string, unknown> = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'string' && value.trim() === '') return;
    cleaned[key] = value;
  });
  return cleaned;
};

const propertyManagementService = {
  // GET /api/v1/host/property-management/properties?page=&size=&search=
  getProperties: async (params: GetPropertiesParams = {}): Promise<GetPropertiesResponse> => {
    const { page = 0, size = 10, search, ...rest } = params;
    const query = cleanParams({ page, size, search, ...rest });
    const response = await axiosInstance.get('/api/v1/host/property-management/properties', { params: query });
    return response.data;
  },
};

export default propertyManagementService;
