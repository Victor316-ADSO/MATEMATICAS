/**
 * types.ts - Tipos e interfaces centralizadas para Resultado
 *
 * Propósito:
 * - Centraliza todas las definiciones de tipos del módulo de resultado
 * - Evita duplicación de interfaces entre componentes y hooks
 * - Facilita mantenimiento y consistencia de tipos
 * - Importación simple desde cualquier archivo del módulo
 *
 * Beneficios:
 * - Single source of truth para tipos de resultado
 * - TypeScript intellisense mejorado
 * - Fácil refactoring de estructuras de datos
 * - Mejor organización del código
 */

export interface ResultadoDetalle {
  pregunta_id: number;
  texto_pregunta: string;
  orden_pregunta: number;
  peso_pregunta: number;
  imagen_pregunta?: string;
  opcion_seleccionada_id: number;
  respuesta_usuario: string;
  imagen_respuesta_usuario?: string;
  usuario_correcto: boolean;
  respuesta_correcta: string;
  imagen_respuesta_correcta?: string;
}

export interface ResultadoData {
  cuestionario_id: number;
  titulo: string;
  descripcion: string;
  creador_nombre: string;
  programa_nombre: string;
  nivel_nombre: string;
  campus_nombre: string;
  estudiante_id: number;
  total_respondidas: number;
  total_preguntas: number;
  respuestas_correctas: number;
  puntaje_total: number;
  puntaje_obtenido: number;
  porcentaje: number;
  fecha_completado: string;
  detalles: ResultadoDetalle[];
} 