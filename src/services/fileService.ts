import axiosInstance from '../api/axios';

const fileService = {
  upload: async (files: File | File[], refId?: string | number) => {
    const formData = new FormData();
    
    // Ensure files is an array for consistent handling
    const fileList = Array.isArray(files) ? files : [files];
    fileList.forEach(file => {
      formData.append('file', file);
    });

    // Add refId as form field if provided
    if (refId) {
      formData.append('refId', String(refId));
    }
    
    const response = await axiosInstance.post('/api/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default fileService;
