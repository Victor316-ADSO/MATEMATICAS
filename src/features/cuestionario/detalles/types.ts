/**
 * types.ts - Tipos y interfaces centralizadas para SeguimientoDetalle
 * 
 * Propósito:
 * - Centraliza todas las definiciones de tipos del módulo de detalles
 * - Evita duplicación de interfaces entre componentes y hooks
 * - Facilita mantenimiento y consistencia de tipos
 * - Importación simple desde cualquier archivo del módulo
 * 
 * Beneficios:
 * - Single source of truth para tipos de seguimiento
 * - TypeScript intellisense mejorado
 * - Fácil refactoring de estructuras de datos
 * - Mejor organización del código
 */

export interface Estudiante {
  id: number;
  nombre: string;
  identificacion: string;
  email: string;
  completado: boolean;
  fecha_respuesta: string | null;
  puntaje_obtenido: number;
  puntaje_total: number;
  porcentaje: number;
  total_preguntas: number;
  respuestas_correctas: number;
}

export interface Cuestionario {
  apertura_id: number;
  id: number;
  titulo: string;
  descripcion: string;
  periodo_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  programa_nombre: string;
}

export interface Estadisticas {
  porcentajeCompletado: number;
  estudiantesCompletados: number;
  estudiantesPendientes: number;
  totalEstudiantes: number;
}

export interface DetalleData {
  cuestionario: Cuestionario | null;
  estudiantes: Estudiante[];
  loading: boolean;
  error: string | null;
}

export interface ProgressInfo {
  porcentaje: number;
  completados: number;
  pendientes: number;
  total: number;
} 