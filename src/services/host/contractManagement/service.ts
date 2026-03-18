import axiosInstance from '../../../api/axios';

const contractManagementService = {
  // GET /api/v1/host/tenancy/contracts
  getContracts: async (params: Record<string, unknown> = {}) => {
    const response = await axiosInstance.get('/api/v1/host/tenancy/contracts', { params });
    return response.data;
  },

  // POST /api/v1/host/tenancy/contracts
  createContract: async (data: Record<string, unknown>) => {
    // Axios will automatically set 'Content-Type': 'application/json' for plain objects.
    const response = await axiosInstance.post('/api/v1/host/tenancy/contracts', data);
    return response.data;
  },

  // GET /api/v1/host/tenancy/contracts/{contractId}
  getContractById: async (contractId: string | number) => {
    const response = await axiosInstance.get(`/api/v1/host/tenancy/contracts/${contractId}`);
    return response.data;
  },
};

export default contractManagementService;
