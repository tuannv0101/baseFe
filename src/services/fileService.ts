import axiosInstance from '../api/axios';

const fileService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    
    const response = await axiosInstance.post('/api/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default fileService;
