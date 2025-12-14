import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';
// Removed the broken import line completely to fix the crash

// --- DEFINED LOCALLY TO FIX IMPORT ERROR ---
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}
// -------------------------------------------

interface AuthContextType {
  user: User | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  googleSignIn: (response: any) => Promise<void>; // Changed to 'any' to fix crash
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.id, role: decoded.role, email: '' }); 
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (credentials: any) => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (credentials: any) => {
    const res = await api.post('/auth/register', credentials);
    if (res.status === 201 && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    }
    return res; 
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await api.post<AuthResponse>('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const googleSignIn = async (response: any) => {
    // We only need the credential string from the response
    const res = await api.post<AuthResponse>('/auth/google', { credential: response.credential });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
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