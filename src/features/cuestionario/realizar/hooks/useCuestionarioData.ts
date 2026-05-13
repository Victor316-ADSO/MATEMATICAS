import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_ENDPOINTS, fetchApi } from '../../../../config/api';
import useAuth from '../../../../hooks/useAuth';
import type { Pregunta, Cuestionario, RespuestaUsuario } from '../../../../types/cuestionario.types';

interface UseCuestionarioDataProps {
  cuestionarioId: string | undefined;
}

interface UseCuestionarioDataReturn {
  // Estados de datos
  cuestionario: Cuestionario | null;
  preguntas: Pregunta[];
  respuestas: RespuestaUsuario;
  
  // Estados de carga y errores
  isLoading: boolean;
  error: string | null;
  
  // Funciones de manejo de datos
  handleChange: (preguntaId: number, opcionId: number) => void;
  handleSubmit: () => Promise<void>;
  
  // Utilidades
  getImageUrl: (tipo: 'pregunta' | 'opcion', id: number) => string;
  
  // Estado de envío
  isSubmitting: boolean;
}

export const useCuestionarioData = ({ 
  cuestionarioId 
}: UseCuestionarioDataProps): UseCuestionarioDataReturn => {
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Estados principales
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestaUsuario>({});
  
  // Estados de carga y errores
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados de control interno
  const [isMounted, setIsMounted] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Función para obtener URLs de imágenes
  const getImageUrl = useCallback((tipo: 'pregunta' | 'opcion', id: number): string => {
    return `http://localhost/cuestionario-api/api/obtenerImagen_api.php?tipo=${tipo}&id=${id}`;
  }, []);

  // Función para manejar cambios en las respuestas
  const handleChange = useCallback((preguntaId: number, opcionId: number) => {
    setRespuestas(prev => ({ ...prev, [preguntaId]: opcionId }));
  }, []);

  // Función para enviar el cuestionario
  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !cuestionario || !cuestionarioId) return;

    const total = preguntas.length;
    const respondidas = Object.keys(respuestas).length;

    // Validar que todas las preguntas estén respondidas
    if (respondidas < total) {
      await Swal.fire({
        icon: 'warning',
        title: 'Faltan respuestas',
        text: 'Por favor responde todas las preguntas antes de enviar.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Confirmar el envío
    const result = await Swal.fire({
      title: '¿Enviar respuestas?',
      text: 'Una vez enviadas, no podrás modificar tus respuestas.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      setIsSubmitting(true);
      
      const data = await fetchApi(`${API_ENDPOINTS.realizarCuestionario(cuestionarioId)}`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          cuestionario_id: cuestionarioId,
          respuestas
        })
      });

      if (!data || data.error) {
        // Manejar errores de sesión
        if (data?.error?.includes('sesión') || data?.error?.includes('acceso')) {
          window.location.href = `/linksystem?id=${cuestionarioId}`;
          return;
        }
        throw new Error(data?.error || 'Error al enviar respuestas');
      }

      // Mostrar éxito y navegar
      await Swal.fire({
        icon: 'success',
        title: '¡Listo!',
        text: 'Tus respuestas fueron enviadas correctamente.',
        confirmButtonText: 'Ver resultados'
      });

      navigate(`/resultado/${cuestionarioId}`);
      
    } catch (err) {
      console.error('Error al enviar cuestionario:', err);
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el cuestionario.',
        confirmButtonText: 'Volver a intentar'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, cuestionario, cuestionarioId, preguntas.length, respuestas, navigate]);

  // Cargar el cuestionario al montar el componente
  useEffect(() => {
    if (!isMounted || hasRedirected) return;
    
    const cargarCuestionario = async () => {
      // Validar ID del cuestionario
      if (!cuestionarioId || isNaN(Number(cuestionarioId))) {
        setError('ID de cuestionario no válido');
        setIsLoading(false);
        return;
      }

      // Verificar autenticación
      if (!isAuthenticated || user?.rol !== 'estudiante') {
        setHasRedirected(true);
        window.location.href = `/linksystem?id=${cuestionarioId}`;
        return;
      }

      try {
        const data = await fetchApi(`${API_ENDPOINTS.realizarCuestionario(cuestionarioId)}`, {
          credentials: 'include'
        });

        // Verificar si el componente sigue montado
        if (!isMounted) return;

        // Manejar errores de la API
        if (!data || data.error) {
          if (data?.error?.includes('sesión') || data?.error?.includes('acceso')) {
            window.location.href = `/linksystem?id=${cuestionarioId}`;
            return;
          }
          throw new Error(data?.error || 'Error al cargar el cuestionario');
        }

        // Verificar si ya se realizó el cuestionario
        if (data.yaResuelto) {
          await Swal.fire({
            icon: 'warning',
            title: 'Cuestionario ya realizado',
            text: 'Ya has completado este cuestionario anteriormente.',
            confirmButtonText: 'Entendido'
          });
          navigate('/dashboard');
          return;
        }

        // Establecer los datos cargados
        setCuestionario(data.cuestionario);
        setPreguntas(data.preguntas);
        
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el cuestionario';
        setError(errorMessage);
        console.error('Error al cargar cuestionario:', err);
        
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    cargarCuestionario();

    // Cleanup
    return () => {
      setIsMounted(false);
    };
  }, [cuestionarioId, isAuthenticated, user?.rol, hasRedirected, isMounted, navigate]);

  return {
    // Estados de datos
    cuestionario,
    preguntas,
    respuestas,
    
    // Estados de carga y errores
    isLoading,
    error,
    
    // Funciones de manejo de datos
    handleChange,
    handleSubmit,
    
    // Utilidades
    getImageUrl,
    
    // Estado de envío
    isSubmitting
  };
}; 