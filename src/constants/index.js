export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ROOM_DETAIL: '/room/:id',
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'user_info',
};
