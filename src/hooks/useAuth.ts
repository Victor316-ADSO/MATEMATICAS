// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext, type AuthState } from '../context/AuthContext';

const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default useAuth;
