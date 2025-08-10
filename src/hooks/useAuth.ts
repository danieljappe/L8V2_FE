import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    loading: true,
  });
  const navigate = useNavigate();

  // Check if token is valid (not expired)
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && isTokenValid(token)) {
      setAuthState({
        isAuthenticated: true,
        token,
        loading: false,
      });
    } else {
      // Clear invalid token
      if (token) {
        localStorage.removeItem('token');
      }
      setAuthState({
        isAuthenticated: false,
        token: null,
        loading: false,
      });
    }
  }, [isTokenValid]);

  // Login function
  const login = useCallback((token: string) => {
    localStorage.setItem('token', token);
    setAuthState({
      isAuthenticated: true,
      token,
      loading: false,
    });
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      token: null,
      loading: false,
    });
    navigate('/login');
  }, [navigate]);

  // Check authentication on route changes
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      logout();
      return false;
    }

    if (!isTokenValid(token)) {
      logout();
      return false;
    }

    return true;
  }, [logout, isTokenValid]);

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
} 