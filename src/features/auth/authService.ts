// src/features/auth/authService.ts

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
  confirmar_password: string;
}

export interface RegistroRespuesta {
  status: string;
  mensaje?: string;
}

export interface LoginRespuesta {
  success: boolean;
  message?: string;
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
}

export const registrarUsuario = async (datos: DatosRegistro): Promise<RegistroRespuesta> => {
  try {
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/registro.php`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(datos),
    });

    const resultado = await respuesta.json();
    return resultado;
  } catch (error) {
    return { status: 'error', mensaje: 'Error de red o del servidor' };
  }
};

export const login = async (email: string, password: string): Promise<LoginRespuesta> => {
  try {
    const respuesta = await fetch('http://localhost/cuestionario-api/login_controller.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const resultado = await respuesta.json();
    
    if (resultado.status === 'ok') {
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
      return {
        success: true,
        usuario: resultado.usuario
      };
    } else {
      return {
        success: false,
        message: resultado.mensaje || 'Credenciales incorrectas'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
};

const authService = {
  registrarUsuario,
  login
};

export default authService;
