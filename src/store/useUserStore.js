import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: localStorage.getItem('role') || null,
  
  login: (username, role) => {
    // Mô phỏng login theo role
    const mockUser = { 
      username, 
      role, 
      email: `${username}@example.com`, 
      id: Date.now(),
      avatar: username.charAt(0).toUpperCase()
    };
    
    localStorage.setItem('token', 'mock-token-' + role);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('role', role);
    
    set({ user: mockUser, isAuthenticated: true, role: role });
    return true;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    set({ user: null, isAuthenticated: false, role: null });
  },
}));

export default useUserStore;
