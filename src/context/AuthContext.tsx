import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

// --- Interfaces ---
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  // Add name if your backend sends it
  name?: string; 
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  googleSignIn: (response: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Persistent Login Logic
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user'); // <--- NEW: Get stored user data

      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            console.log('Token expired');
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // <--- Clear user too
            setUser(null);
          } else {
            // OPTION A: Prefer data from localStorage (contains email/name)
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } 
            // OPTION B: Fallback to decoding token if localStorage is empty
            else {
              setUser({ 
                id: decoded.id, 
                role: decoded.role, 
                email: decoded.email || decoded.sub || '' // Try 'sub' as fallback for email
              }); 
            }
          }
        } catch (e) {
          console.error('Invalid token found', e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user)); // <--- NEW: Save User
    setUser(res.data.user);
  };

  const register = async (credentials: any) => {
    const res = await api.post('/auth/register', credentials);
    if (res.status === 201 && res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // <--- NEW: Save User
      setUser(res.data.user);
    }
    return res; 
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await api.post<AuthResponse>('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user)); // <--- NEW: Save User
    setUser(res.data.user);
  };

  const googleSignIn = async (response: any) => {
    const res = await api.post<AuthResponse>('/auth/google', { credential: response.credential });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user)); // <--- NEW: Save User
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // <--- NEW: Remove User
    localStorage.removeItem('cart');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      register,
      verifyOtp,
      googleSignIn,
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};