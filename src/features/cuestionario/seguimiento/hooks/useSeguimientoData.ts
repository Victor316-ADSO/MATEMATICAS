import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, fetchApi } from '../../../../config/api';
import useAuth from '../../../../hooks/useAuth';
import type { CuestionarioSeguimiento, EstadisticasGlobales } from '../types';

interface UseSeguimientoData {
  cuestionarios: CuestionarioSeguimiento[];
  estadisticas: EstadisticasGlobales;
  error: string | null;
  loading: boolean;
  goToDetalle: (aperturaId: number) => void;
}

export function useSeguimientoData(): UseSeguimientoData {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cuestionarios, setCuestionarios] = useState<CuestionarioSeguimiento[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasGlobales>({
    total_cuestionarios: 0,
    total_estudiantes_asignados: 0,
    total_estudiantes_completados: 0,
    porcentaje_global: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSeguimiento = async () => {
      setLoading(true);
      try {
        const usuarioId = user?.id || '';
        const url = `${API_ENDPOINTS.seguimiento.lista}?usuario_id=${usuarioId}`;
        const data = await fetchApi(url);
        if (data.success) {
          setCuestionarios(data.cuestionarios);
          setEstadisticas({
            total_cuestionarios: data.cuestionarios.length,
            total_estudiantes_asignados: data.total_estudiantes_asignados,
            total_estudiantes_completados: data.total_estudiantes_completados,
            porcentaje_global: data.porcentaje_global
          });
          setError(null);
        } else {
          setError(data.error || 'Error al cargar los datos');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    cargarSeguimiento();
  }, [user]);

  const goToDetalle = (aperturaId: number) => {
    navigate(`/seguimiento/detalle/${aperturaId}`);
  };

  return { cuestionarios, estadisticas, error, loading, goToDetalle };
} 