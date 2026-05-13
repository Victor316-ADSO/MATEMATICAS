import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import Swal from 'sweetalert2';
import { API_ENDPOINTS, fetchApi } from '../config/api';

type User = Record<string, any>;

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (programa: string, identificacion: string, redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { nombre: string; email: string; password: string }) => Promise<void>;
  checkSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const data = await fetchApi(API_ENDPOINTS.verificarSesion);

      const isAuthenticatedResponse = !!(data && data.success && (data.data?.autenticado || data.data?.user || data.data?.usuario));
      const sessionUser = data?.data?.usuario ?? data?.data?.user;

      if (isAuthenticatedResponse && sessionUser) {
        setUser(sessionUser);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkSession();

    const intervalId = setInterval(() => {
      void checkSession();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [checkSession]);

  const login = useCallback(async (programa: string, identificacion: string, redirectUrl?: string) => {
    try {
      const data = await fetchApi(API_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({ programa, identificacion })
      });

      if (data && data.success) {
        const token = data?.data?.token ?? data?.token;
        const loginUser = data?.data?.user ?? data?.data?.usuario ?? data?.usuario;

        if (!token) {
          throw new Error('No se recibió token de autenticación');
        }

        localStorage.setItem('authToken', token);
        setUser(loginUser ?? null);
        setIsAuthenticated(true);

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }

        if (loginUser?.rol === 'estudiante') {
          const urlParams = new URLSearchParams(window.location.search);
          const cuestionarioId = urlParams.get('id');
          
          if (cuestionarioId) {
            window.location.href = `/realizar-cuestionario/${cuestionarioId}`;
          } else {
            window.location.href = '/dashboard';
          }
          return;
        }

        window.location.href = '/principal';
      } else {
        if (data.rawResponse) {
          console.error('El servidor devolvió HTML en lugar de JSON:', data.rawResponse);
          
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            html: `El servidor devolvió un formato inválido:<br><pre style="text-align:left;max-height:300px;overflow:auto">${data.rawResponse.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
            width: '80%'
          });
          
          throw new Error('Error del servidor: formato de respuesta inválido');
        } else {
          const errorMsg = data?.error || data?.message || 'Error en el inicio de sesión';
          console.error('Error de login:', errorMsg);
          
          Swal.fire({
            icon: 'error',
            title: 'Error de inicio de sesión',
            text: errorMsg
          });
          
          throw new Error(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error completo:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Por favor, inténtelo de nuevo más tarde.'
      });
      
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetchApi(API_ENDPOINTS.logout, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  }, []);

  const register = useCallback(async (userData: { nombre: string; email: string; password: string }) => {
    try {
      const data = await fetchApi(API_ENDPOINTS.registro, {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (!data || !data.success) {
        throw new Error(data?.message || 'Error en el registro');
      }

      await login(userData.email, userData.password);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error en el registro'
      });
      throw error;
    }
  }, [login]);

  const value: AuthState = useMemo(
    () => ({
      isAuthenticated,
      user,
      isLoading,
      login,
      logout,
      register,
      checkSession,
    }),
    [isAuthenticated, user, isLoading, login, logout, register, checkSession]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 