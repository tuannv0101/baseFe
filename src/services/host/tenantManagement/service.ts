import axiosInstance from '../../../api/axios';
import type { TenantResponse, GetTenantsParams } from './type';

const cleanParams = (params: Record<string, unknown>) => {
  const cleaned: Record<string, unknown> = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'string' && value.trim() === '') return;
    cleaned[key] = value;
  });
  return cleaned;
};

const tenantManagementService = {
  // GET /api/v1/host/tenancy/tenants?page=&size=&search=
  getTenants: async (params: GetTenantsParams = {}): Promise<TenantResponse> => {
    const { page = 0, size = 10, textSearch, ...rest } = params;
    const query = cleanParams({ page, size, textSearch: textSearch, ...rest });
    const response = await axiosInstance.get('/api/v1/host/tenancy/tenants', { params: query });
    return response.data;
  },

  getAllTenants: async (): Promise<TenantResponse> => {
    const response = await axiosInstance.get('/api/v1/host/tenancy/tenants');
    return response.data;
  },

  // GET /api/v1/host/tenancy/tenants/{tenantId}
  getTenantById: async (tenantId: string) => {
    const response = await axiosInstance.get(`/api/v1/host/tenancy/tenants/${tenantId}`);
    return response.data;
  },
  
  // POST /api/v1/host/tenancy/tenants
  createTenant: async (data: Record<string, unknown>) => {
    const response = await axiosInstance.post('/api/v1/host/tenancy/tenants', data);
    return response.data;
  },

  // PUT /api/v1/host/tenancy/tenants/{tenantId}
  updateTenant: async (tenantId: string, data: Record<string, unknown>) => {
    const response = await axiosInstance.put(`/api/v1/host/tenancy/tenants/${tenantId}`, data);
    return response.data;
  },
  
  // DELETE /api/v1/host/tenancy/tenants/{tenantId}
  deleteTenant: async (tenantId: string) => {
    const response = await axiosInstance.delete(`/api/v1/host/tenancy/tenants/${tenantId}`);
    return response.data;
  },
};

export default tenantManagementService;
