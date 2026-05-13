/**
 * useAuth - Custom hook para autenticación en crear cuestionario
 * 
 * Propósito:
 * - Maneja toda la lógica de verificación de autenticación
 * - Valida si el usuario puede crear cuestionarios
 * - Maneja redirecciones automáticas si no está autenticado
 * - Proporciona información del usuario actual
 * 
 * Beneficios:
 * - Lógica de auth completamente separada y reutilizable
 * - Hook testeable independientemente
 * - Manejo centralizado de errores de autenticación
 * - Fácil de usar en otros componentes
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Usuario {
  id: number;
  nombre: string;
  rol?: string;
}

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const usuarioData = localStorage.getItem('usuario');
        
        if (!usuarioData) {
          throw new Error('No hay datos de usuario');
        }

        const usuarioParsed = JSON.parse(usuarioData);
        
        if (!usuarioParsed.id) {
          throw new Error('Usuario sin ID válido');
        }

        setUsuario(usuarioParsed);
      } catch (error) {
        console.error('Error de autenticación:', error);
        
        await Swal.fire({
          icon: 'error',
          title: 'No autorizado',
          text: 'Debe iniciar sesión para crear un cuestionario',
        });
        
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  return {
    usuario,
    loading,
    isAuthenticated: !!usuario
  };
}; 