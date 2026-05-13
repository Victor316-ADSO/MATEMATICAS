/**
 * useEstadisticas - Custom hook para cálculos estadísticos de seguimiento
 * 
 * Propósito:
 * - Calcula automáticamente porcentajes de completado
 * - Genera estadísticas en tiempo real basadas en los estudiantes
 * - Proporciona métricas útiles para visualización
 * - Encapsula toda la lógica de cálculos matemáticos
 * 
 * Beneficios:
 * - Separación clara de la lógica de cálculos
 * - Hook reutilizable para otros componentes de seguimiento
 * - Cálculos optimizados y memoizados
 * - Métricas consistentes en toda la aplicación
 */

import { useMemo } from 'react';
import type { Estudiante, Estadisticas, ProgressInfo } from '../types';

export const useEstadisticas = (estudiantes: Estudiante[]) => {
  
  // Cálculos principales memoizados para performance
  const estadisticas = useMemo((): Estadisticas => {
    const totalEstudiantes = estudiantes.length;
    const estudiantesCompletados = estudiantes.filter(e => e.completado).length;
    const estudiantesPendientes = totalEstudiantes - estudiantesCompletados;
    const porcentajeCompletado = totalEstudiantes > 0 
      ? Math.round((estudiantesCompletados / totalEstudiantes) * 100) 
      : 0;

    return {
      porcentajeCompletado,
      estudiantesCompletados,
      estudiantesPendientes,
      totalEstudiantes
    };
  }, [estudiantes]);

  // Información específica para la barra de progreso
  const progressInfo = useMemo((): ProgressInfo => ({
    porcentaje: estadisticas.porcentajeCompletado,
    completados: estadisticas.estudiantesCompletados,
    pendientes: estadisticas.estudiantesPendientes,
    total: estadisticas.totalEstudiantes
  }), [estadisticas]);

  // Métricas adicionales útiles
  const metricas = useMemo(() => {
    const completados = estudiantes.filter(e => e.completado);
    
    // Promedio de puntajes (solo estudiantes completados)
    const promedioPuntaje = completados.length > 0
      ? Math.round(completados.reduce((sum, e) => sum + e.porcentaje, 0) / completados.length)
      : 0;

    // Mejor y peor puntaje
    const puntajes = completados.map(e => e.porcentaje);
    const mejorPuntaje = puntajes.length > 0 ? Math.max(...puntajes) : 0;
    const peorPuntaje = puntajes.length > 0 ? Math.min(...puntajes) : 0;

    // Estudiantes con puntaje perfecto (100%)
    const puntajePerfecto = completados.filter(e => e.porcentaje === 100).length;

    // Estudiantes por rango de puntaje
    const excelente = completados.filter(e => e.porcentaje >= 90).length; // 90-100%
    const bueno = completados.filter(e => e.porcentaje >= 70 && e.porcentaje < 90).length; // 70-89%
    const regular = completados.filter(e => e.porcentaje >= 50 && e.porcentaje < 70).length; // 50-69%
    const deficiente = completados.filter(e => e.porcentaje < 50).length; // <50%

    return {
      promedioPuntaje,
      mejorPuntaje,
      peorPuntaje,
      puntajePerfecto,
      distribucion: {
        excelente,
        bueno,
        regular,
        deficiente
      }
    };
  }, [estudiantes]);

  // Utilidades para UI
  const getEstadoColor = (porcentaje: number): 'success' | 'warning' | 'danger' => {
    if (porcentaje >= 80) return 'success';
    if (porcentaje >= 50) return 'warning';
    return 'danger';
  };

  const getDescripcionEstado = (porcentaje: number): string => {
    if (porcentaje === 100) return 'Completado perfectamente';
    if (porcentaje >= 80) return 'Excelente progreso';
    if (porcentaje >= 50) return 'Progreso moderado';
    if (porcentaje > 0) return 'Progreso lento';
    return 'Sin progreso';
  };

  const formatearPorcentaje = (valor: number): string => `${valor}%`;

  const formatearFecha = (fecha: string | null): string => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return {
    // Estadísticas principales
    ...estadisticas,
    progressInfo,
    metricas,
    
    // Utilidades
    getEstadoColor,
    getDescripcionEstado,
    formatearPorcentaje,
    formatearFecha,
    
    // Propiedades derivadas útiles
    hayCompletados: estadisticas.estudiantesCompletados > 0,
    hayPendientes: estadisticas.estudiantesPendientes > 0,
    estaCompleto: estadisticas.porcentajeCompletado === 100,
    necesitaAtencion: estadisticas.porcentajeCompletado < 50
  };
}; 