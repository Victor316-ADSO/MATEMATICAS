import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import Swal from 'sweetalert2';
import { API_ENDPOINTS, fetchAdminApi, setAdminAuthToken } from '../config/api';

export interface AdminUser {
  id: number;
  email: string;
  nombre: string;
  tipo: 'admin';
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const AdminAuthContext = createContext<AdminAuthState | null>(null);

interface Props {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: Props) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      if (!token) {
        setAdmin(null);
        setIsAuthenticated(false);
        return;
      }

      const data = await fetchAdminApi(API_ENDPOINTS.direct.admin.verify);

      if (data?.success && data?.data?.autenticado && data?.data?.admin) {
        setAdmin(data.data.admin as AdminUser);
        setIsAuthenticated(true);
      } else {
        setAdminAuthToken(null);
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } catch {
      setAdminAuthToken(null);
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await fetchAdminApi(API_ENDPOINTS.direct.admin.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!data?.success) {
      const msg = data?.message || data?.error || 'Credenciales incorrectas';
      await Swal.fire({ icon: 'error', title: 'Acceso denegado', text: msg });
      throw new Error(msg);
    }

    const token = data?.data?.token;
    const adminData = data?.data?.admin as AdminUser | undefined;

    if (!token) {
      throw new Error('No se recibió token de administrador');
    }

    setAdminAuthToken(token);
    setAdmin(adminData ?? null);
    setIsAuthenticated(true);
    window.location.href = '/admin/analytics';
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetchAdminApi(API_ENDPOINTS.direct.admin.logout, { method: 'POST' });
    } catch {
      /* ignore */
    } finally {
      setAdminAuthToken(null);
      setAdmin(null);
      setIsAuthenticated(false);
      window.location.href = '/admin/login';
    }
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, admin, isLoading, login, logout, checkSession }),
    [isAuthenticated, admin, isLoading, login, logout, checkSession]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
