/**
 * useRealizarCuestionarioData - Custom hook para la lógica principal de RealizarCuestionario
 *
 * Propósito:
 * - Maneja la carga de datos del cuestionario y preguntas
 * - Gestiona el timer, navegación de preguntas y envío de respuestas
 * - Encapsula estados de loading, error, tiempo, pregunta actual, etc.
 *
 * Beneficios:
 * - Lógica desacoplada y reutilizable
 * - Hook testeable independientemente
 * - Facilita la modularización de la UI
 */

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_ENDPOINTS, fetchApi } from '../../../../config/api';
import useAuth from '../../../../hooks/useAuth';
import type { Pregunta, CuestionarioRealizar, RespuestasUsuario, EstadoRealizar } from '../types';

export const useRealizarCuestionarioData = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const cuestionarioId = params.id;

  const [cuestionario, setCuestionario] = useState<CuestionarioRealizar | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestasUsuario>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(10); // 40 minutos en segundos
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar datos del cuestionario
  useEffect(() => {
    let isMounted = true;
    if (hasRedirected) return;
    const cargarCuestionario = async () => {
      if (!cuestionarioId || isNaN(Number(cuestionarioId))) {
        setError('ID de cuestionario no válido');
        setIsLoading(false);
        return;
      }
      if (!isAuthenticated || user?.rol !== 'estudiante') {
        setHasRedirected(true);
        window.location.href = `/linksystem?id=${cuestionarioId}`;
        return;
      }
      try {
        const data = await fetchApi(`${API_ENDPOINTS.realizarCuestionario(cuestionarioId)}`, { credentials: 'include' });
        if (!isMounted) return;
        if (!data || data.error) {
          if (data?.error?.includes('sesión') || data?.error?.includes('acceso')) {
            window.location.href = `/linksystem?id=${cuestionarioId}`;
            return;
          }
          throw new Error(data?.error || 'Error al cargar el cuestionario');
        }
        if (data.yaResuelto) {
          await Swal.fire({ icon: 'warning', title: 'Cuestionario ya realizado', text: 'Ya has completado este cuestionario anteriormente.', confirmButtonText: 'Entendido' });
          navigate('/dashboard');
          return;
        }
        setCuestionario(data.cuestionario);
        setPreguntas(data.preguntas);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Error al cargar el cuestionario');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    cargarCuestionario();
    return () => { isMounted = false; };
  }, [cuestionarioId, isAuthenticated, user?.rol, hasRedirected, navigate]);

  // Timer
  useEffect(() => {
    if (isLoading || !cuestionario) return;
    timerRef.current = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          enviarRespuestasTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isLoading, cuestionario]);

  // Enviar respuestas por timeout
  const enviarRespuestasTimeout = async () => {
    try {
      await Swal.fire({ icon: 'warning', title: 'Tiempo agotado', text: 'El tiempo para responder ha terminado. Se enviarán tus respuestas.', confirmButtonText: 'Ver resultados', allowOutsideClick: false, allowEscapeKey: false });
      const data = await fetchApi(`${API_ENDPOINTS.realizarCuestionario(cuestionarioId || '')}`, {
        method: 'POST', credentials: 'include', body: JSON.stringify({ cuestionario_id: cuestionarioId, respuestas, timeout: true, todas_las_preguntas: preguntas.map(p => p.id) })
      });
      if (!data || data.error) {
        if (data?.error?.includes('sesión') || data?.error?.includes('acceso')) {
          window.location.href = `/linksystem?id=${cuestionarioId}`;
          return;
        }
        throw new Error(data?.error || 'Error al enviar respuestas');
      }
      navigate(`/resultado/${cuestionarioId}`);
    } catch {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar el cuestionario.', confirmButtonText: 'Volver a intentar' });
    }
  };

  // Navegación y helpers
  const handleNextPregunta = () => setCurrentPreguntaIndex(i => Math.min(i + 1, preguntas.length - 1));
  const handlePrevPregunta = () => setCurrentPreguntaIndex(i => Math.max(i - 1, 0));
  const formatTiempo = (segundos: number) => `${Math.floor(segundos / 60)}:${segundos % 60 < 10 ? '0' : ''}${segundos % 60}`;
  const getImageUrl = (tipo: 'pregunta' | 'opcion', id: number) => `http://localhost/cuestionario-api/api/obtenerImagen_api.php?tipo=${tipo}&id=${id}`;

  return {
    cuestionario,
    preguntas,
    respuestas,
    setRespuestas,
    isLoading,
    error,
    tiempoRestante,
    currentPreguntaIndex,
    setCurrentPreguntaIndex,
    hasRedirected,
    handleNextPregunta,
    handlePrevPregunta,
    formatTiempo,
    getImageUrl,
    enviarRespuestasTimeout
  };
}; 