/**
 * types.ts - Tipos e interfaces centralizadas para RealizarCuestionario
 *
 * Propósito:
 * - Centraliza todas las definiciones de tipos del módulo de realizar
 * - Evita duplicación de interfaces entre componentes y hooks
 * - Facilita mantenimiento y consistencia de tipos
 * - Importación simple desde cualquier archivo del módulo
 *
 * Beneficios:
 * - Single source of truth para tipos de realizar
 * - TypeScript intellisense mejorado
 * - Fácil refactoring de estructuras de datos
 * - Mejor organización del código
 */

export interface Opcion {
  id: number;
  texto_opcion: string;
  imagen_opcion?: string;
  orden: number;
}

export interface Pregunta {
  id: number;
  texto_pregunta: string;
  orden_pregunta: number;
  peso_pregunta: number;
  imagen_pregunta?: string;
  opciones: Opcion[];
}

export interface CuestionarioRealizar {
  id: number;
  titulo: string;
  descripcion: string;
  creador_nombre: string;
  programa_nombre: string;
  nivel_nombre: string;
  campus_nombre: string;
}

export interface RespuestasUsuario {
  [preguntaId: number]: number; // preguntaId -> opcionId
}

export interface EstadoRealizar {
  isLoading: boolean;
  error: string | null;
  tiempoRestante: number;
  currentPreguntaIndex: number;
  hasRedirected: boolean;
} 