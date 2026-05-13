/**
 * useDetalleData - Custom hook para gestión de datos de seguimiento detallado
 * 
 * Propósito:
 * - Maneja la carga de datos del cuestionario y estudiantes desde la API
 * - Gestiona estados de loading, error y datos
 * - Proporciona recarga de datos cuando sea necesario
 * - Encapsula toda la lógica de comunicación con el backend
 * 
 * Beneficios:
 * - Lógica de datos completamente separada y reutilizable
 * - Hook testeable independientemente
 * - Manejo centralizado de errores de API
 * - Estados optimizados para UI responsiva
 */

import { useState, useEffect } from 'react';
import { API_ENDPOINTS, fetchApi } from '../../../../config/api';
import type { Cuestionario, Estudiante, DetalleData } from '../types';

export const useDetalleData = (id: string | undefined) => {
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDetalles = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const usuarioJSON = localStorage.getItem('usuario');
      const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
      const usuarioId = usuario?.id || '';
      
      if (!usuarioId) {
        throw new Error('No se encontró información del usuario');
      }
      
      const url = `${API_ENDPOINTS.seguimiento.detalle(id)}&usuario_id=${usuarioId}`;
      const data = await fetchApi(url);
      
      if (data.success) {
        setCuestionario(data.cuestionario);
        setEstudiantes(data.estudiantes);
      } else {
        throw new Error(data.error || 'Error al cargar los detalles');
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const recargarDetalles = () => {
    cargarDetalles();
  };

  const actualizarEstudianteLocal = (estudianteId: number, cambios: Partial<Estudiante>) => {
    setEstudiantes(prev => 
      prev.map(estudiante => 
        estudiante.id === estudianteId 
          ? { ...estudiante, ...cambios }
          : estudiante
      )
    );
  };

  useEffect(() => {
    cargarDetalles();
  }, [id]);

  return {
    cuestionario,
    estudiantes,
    loading,
    error,
    recargarDetalles,
    actualizarEstudianteLocal,
    // Propiedades derivadas útiles
    totalEstudiantes: estudiantes.length,
    hayDatos: cuestionario !== null,
    hayEstudiantes: estudiantes.length > 0
  };
}; 