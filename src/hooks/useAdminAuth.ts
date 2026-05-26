import { useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';

const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider');
  }
  return ctx;
};

export default useAdminAuth;
