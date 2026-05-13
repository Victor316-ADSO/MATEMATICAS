/**
 * useResultadoData - Custom hook para la lógica principal de Resultado
 *
 * Propósito:
 * - Maneja la carga de datos del resultado del cuestionario
 * - Proporciona helpers de formateo, navegación y estado
 *
 * Beneficios:
 * - Lógica desacoplada y reutilizable
 * - Hook testeable independientemente
 * - Facilita la modularización de la UI
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_ENDPOINTS, fetchApi } from '../../../../config/api';
import useAuth from '../../../../hooks/useAuth';
import type { ResultadoData } from '../types';

export const useResultadoData = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const cuestionarioId = params.id;

  const [resultado, setResultado] = useState<ResultadoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarResultado = async () => {
      if (!cuestionarioId || isNaN(Number(cuestionarioId))) {
        setError('ID de cuestionario no válido');
        setIsLoading(false);
        return;
      }
      if (!isAuthenticated || user?.rol !== 'estudiante') {
        navigate('/login');
        return;
      }
      try {
        const data = await fetchApi(`${API_ENDPOINTS.resultado(cuestionarioId)}`, { credentials: 'include' });
        if (!data || data.error) {
          throw new Error(data?.error || 'Error al cargar los resultados');
        }
        setResultado(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los resultados');
      } finally {
        setIsLoading(false);
      }
    };
    cargarResultado();
  }, [cuestionarioId, isAuthenticated, user?.rol, navigate]);

  const getImageUrl = (tipo: 'pregunta' | 'opcion', id: number) => `http://localhost/cuestionario-api/api/obtenerImagen_api.php?tipo=${tipo}&id=${id}`;

  const getPorcentajeColor = (porcentaje: number): 'success' | 'warning' | 'danger' => {
    if (porcentaje >= 70) return 'success';
    if (porcentaje >= 50) return 'warning';
    return 'danger';
  };

  const getPorcentajeTexto = (porcentaje: number): string => {
    if (porcentaje >= 70) return '¡Excelente trabajo! Has aprobado el cuestionario.';
    if (porcentaje >= 50) return 'Buen intento. Puedes mejorar revisando las respuestas incorrectas.';
    return 'Necesitas estudiar más el tema. Revisa las respuestas correctas.';
  };

  const getPorcentajeIcono = (porcentaje: number): string => {
    if (porcentaje >= 70) return '✅';
    if (porcentaje >= 50) return '⚠️';
    return '❌';
  };

  const handleImprimir = () => window.print();

  const handleCerrar = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión de estudiante',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await fetchApi('/cuestionario-api/api/logoutEstudiantes_api.php', { method: 'POST', credentials: 'include' });
        navigate('/');
      } catch {
        navigate('/');
      }
    }
  };

  return {
    resultado,
    isLoading,
    error,
    user,
    getImageUrl,
    getPorcentajeColor,
    getPorcentajeTexto,
    getPorcentajeIcono,
    handleImprimir,
    handleCerrar
  };
}; 