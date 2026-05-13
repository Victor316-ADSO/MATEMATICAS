// Tipos centralizados para el módulo de Seguimiento

export interface CuestionarioSeguimiento {
  apertura_id: number;
  cuestionario_id: number;
  titulo: string;
  descripcion: string;
  periodo_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  programa_nombre: string;
  total_estudiantes_asignados: number;
  total_estudiantes_completados: number;
}

export interface EstadisticasGlobales {
  total_cuestionarios: number;
  total_estudiantes_asignados: number;
  total_estudiantes_completados: number;
  porcentaje_global: number;
} 