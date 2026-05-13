import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import { fetchApi } from '../../../../config/api';
import type { VerRespuestaData } from '../types';

interface UseVerRespuestaData {
  data: VerRespuestaData | null;
  isLoading: boolean;
  error: string | null;
  expandedAccordion: number;
  handleVolver: () => void;
  toggleAccordion: (index: number) => void;
  getImageUrl: (tipo: 'pregunta' | 'opcion', id: number) => string;
  getPorcentajeColor: (porcentaje: number) => 'success' | 'warning' | 'danger';
}

export function useVerRespuestaData(): UseVerRespuestaData {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const estudianteId = params.estudianteId;
  const cuestionarioId = params.cuestionarioId;

  const [data, setData] = useState<VerRespuestaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<number>(0);

  useEffect(() => {
    const cargarRespuestas = async () => {
      if (!estudianteId || !cuestionarioId || isNaN(Number(estudianteId)) || isNaN(Number(cuestionarioId))) {
        setError('Parámetros no válidos');
        setIsLoading(false);
        return;
      }
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      if (user?.rol !== 'docente') {
        navigate('/login');
        return;
      }
      try {
        const response = await fetchApi(`http://localhost/cuestionario-api/api/ver_respuestas_api.php?estudiante_id=${estudianteId}&cuestionario_id=${cuestionarioId}`, {
          credentials: 'include'
        });
        if (!response || response.error) {
          throw new Error(response?.error || 'Error al cargar las respuestas');
        }
        setData(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar las respuestas';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    cargarRespuestas();
  }, [estudianteId, cuestionarioId, isAuthenticated, user?.rol, navigate]);

  const handleVolver = () => {
    navigate(-1);
  };

  const toggleAccordion = (index: number) => {
    setExpandedAccordion(expandedAccordion === index ? -1 : index);
  };

  const getImageUrl = (tipo: 'pregunta' | 'opcion', id: number) => {
    return `http://localhost/cuestionario-api/api/obtenerImagen_api.php?tipo=${tipo}&id=${id}`;
  };

  const getPorcentajeColor = (porcentaje: number): 'success' | 'warning' | 'danger' => {
    if (porcentaje >= 70) return 'success';
    if (porcentaje >= 40) return 'warning';
    return 'danger';
  };

  return {
    data,
    isLoading,
    error,
    expandedAccordion,
    handleVolver,
    toggleAccordion,
    getImageUrl,
    getPorcentajeColor
  };
} 