// Configuración de la API
export const API_BASE_URL = 'http://localhost/cuestionario-api';

const buildApiUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const AUTH_TOKEN_KEY = 'authToken';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const defaultFetchOptions = (): RequestInit => ({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include',
  mode: 'cors',
});

export const fetchApi = async (url: string, options: RequestInit = {}) => {
  try {
    const finalUrl = buildApiUrl(url);
    const fetchOptions: RequestInit = {
      ...defaultFetchOptions(),
      ...options,
      headers: {
        ...defaultFetchOptions().headers,
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    };

    const response = await fetch(finalUrl, fetchOptions);

    const responseText = await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        try {
          const parsed = JSON.parse(responseText);
          return {
            success: false,
            error: parsed.message || parsed.error || 'Sesión no iniciada o expirada',
            message: parsed.message,
            status: response.status,
          };
        } catch {
          return { success: false, error: 'Sesión no iniciada o expirada', status: response.status };
        }
      }
      try {
        const parsed = JSON.parse(responseText);
        return {
          success: false,
          error: parsed.message || parsed.error || response.statusText,
          message: parsed.message,
          status: response.status,
          ...parsed,
        };
      } catch {
        return {
          success: false,
          status: response.status,
          error: response.statusText,
          rawResponse: responseText,
        };
      }
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear respuesta como JSON:', parseError);
      console.error('Contenido de la respuesta:', responseText);
      return {
        success: false,
        error: 'Error al parsear respuesta del servidor',
        rawResponse: responseText,
      };
    }
  } catch (error) {
    console.error('Error en fetchApi:', error);
    throw error;
  }
};

export const API_ENDPOINTS = {
  // Rutas legacy existentes para compatibilidad con el frontend actual
  login: `${API_BASE_URL}/api/auth/login`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  registro: `${API_BASE_URL}/api/auth/registro`,
  principal: `${API_BASE_URL}/principal_controller.php`,
  verCuestionario: (id: string | number) => `${API_BASE_URL}/ver_controller.php?id=${id}`,
  crearCuestionario: `${API_BASE_URL}/crearCuestionario_controller.php`,
  crearCuestionarioApi: `${API_BASE_URL}/api/crearCuestionario_api.php`,
  realizarCuestionario: (id: string | number) => `${API_BASE_URL}/api/resolver_api.php?id=${id}`,
  cuestionariosDisponibles: `${API_BASE_URL}/api/resolver_api.php`,
  resultadoCuestionario: (id: string | number) => `${API_BASE_URL}/resultado_controller.php?id=${id}`,
  resultado: (id: string | number) => `${API_BASE_URL}/api/resultado_api.php?id=${id}`,
  periodos: `${API_BASE_URL}/periodoManage_controller.php`,
  verificarSesion: `${API_BASE_URL}/api/auth/verify`,
  estudiantes: `${API_BASE_URL}/estudiante_controller.php`,
  seguimiento: {
    lista: `${API_BASE_URL}/api/seguimiento_lista_api.php`,
    detalle: (id: string | number) => `${API_BASE_URL}/api/seguimiento_detalle_api.php?id=${id}`,
  },

  // Rutas directas del backend Slim
  direct: {
    auth: {
      login: `${API_BASE_URL}/api/auth/login`,
      verify: `${API_BASE_URL}/api/auth/verify`,
      refresh: `${API_BASE_URL}/api/auth/refresh`,
      logout: `${API_BASE_URL}/api/auth/logout`,
      autorizacionGet: `${API_BASE_URL}/api/auth/autorizacion/get`,
      autorizacionSet: `${API_BASE_URL}/api/auth/autorizacion/set`,
      registro: `${API_BASE_URL}/api/auth/registro`,
    },
    programas: {
      list: `${API_BASE_URL}/api/programas`,
      detail: (id: string | number) => `${API_BASE_URL}/api/programas/${id}`,
    },
    preguntas: `${API_BASE_URL}/api/preguntas`,
    cuestionario: {
      responder: `${API_BASE_URL}/api/cuestionario/responder`,
      misRespuestas: `${API_BASE_URL}/api/mis-respuestas`,
    },
    usuario: {
      perfil: `${API_BASE_URL}/api/usuario/perfil`,
      contacto: `${API_BASE_URL}/api/usuario/contacto`,
    },
  },
};

export const buildImageUrl = (tipo: 'pregunta' | 'opcion', id: number | string) =>
  buildApiUrl(`${API_BASE_URL}/api/obtenerImagen_api.php?tipo=${tipo}&id=${id}`);
 