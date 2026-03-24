import axiosInstance from '../../../api/axios';
import type { RoomManagerCreateReqDTO } from './type';

const roomManagementService = {
  // GET /api/v1/host/property-management/rooms/{roomId}/detail
  getRoomDetail: async (roomId: string | number) => {
    const response = await axiosInstance.get(`/api/v1/host/property-management/rooms/${roomId}/detail`);
    return response.data;
  },

  // GET /api/v1/host/room-management/rooms/{roomId}
  getRoomById: async (roomId: string | number) => {
    const response = await axiosInstance.get(`/api/v1/host/room-management/rooms/${roomId}`);
    return response.data;
  },

  // POST /api/v1/host/room-management/rooms
  createRoom: async (data: RoomManagerCreateReqDTO) => {
    const response = await axiosInstance.post('/api/v1/host/room-management/rooms', data);
    return response.data;
  },

  // PUT /api/v1/host/room-management/rooms/{roomId}
  updateRoom: async (roomId: string | number, data: Partial<RoomManagerCreateReqDTO>) => {
    const response = await axiosInstance.put(`/api/v1/host/room-management/rooms/${roomId}`, data);
    return response.data;
  },

  // DELETE /api/v1/host/room-management/rooms/{roomId}
  deleteRoom: async (roomId: string | number) => {
    const response = await axiosInstance.delete(`/api/v1/host/room-management/rooms/${roomId}`);
    return response.data;
  },
};

export default roomManagementService;
