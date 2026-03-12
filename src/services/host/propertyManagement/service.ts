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

  getAllProperties: async (): Promise<GetPropertiesResponse> => {
    const response = await axiosInstance.get('/api/v1/host/property-management/properties/all');
    return response.data;
  },

  // GET /api/v1/host/property-management/properties/{propertyId}
  getPropertyById: async (propertyId: string) => {
    const response = await axiosInstance.get(`/api/v1/host/property-management/properties/${propertyId}`);
    return response.data;
  },
  
  // POST /api/v1/host/property-management/properties
  createProperty: async (data: Record<string, unknown>) => {
    const response = await axiosInstance.post('/api/v1/host/property-management/properties', data);
    return response.data;
  },

  // PUT /api/v1/host/property-management/properties/{propertyId}
  updateProperty: async (propertyId: string, data: Record<string, unknown>) => {
    const response = await axiosInstance.put(`/api/v1/host/property-management/properties/${propertyId}`, data);
    return response.data;
  },
  
  // DELETE /api/v1/host/property-management/properties/{propertyId}
  deleteProperty: async (propertyId: string) => {
    const response = await axiosInstance.delete(`/api/v1/host/property-management/properties/${propertyId}`);
    return response.data;
  },

  // GET /api/v1/host/property-management/room-matrix?propertyId=
  getRoomMatrix: async (propertyId: string) => {
    const response = await axiosInstance.get('/api/v1/host/property-management/room-matrix', {
      params: { propertyId },
    });
    return response.data;
  },
};

export default propertyManagementService;
