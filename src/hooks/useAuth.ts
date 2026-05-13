// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (programa: string, identificacion: string, redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { nombre: string; email: string; password: string }) => Promise<void>;
  checkSession: () => Promise<void>;
}

const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default useAuth;
