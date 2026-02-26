import { useState, useEffect } from 'react';
import useUserStore from '../store/useUserStore';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user info with token
      // For now, just a placeholder
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setUser]);

  return { user, isAuthenticated, loading, logout };
};
