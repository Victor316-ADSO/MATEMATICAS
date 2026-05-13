/**
 * types.ts - Tipos e interfaces centralizadas para Estudiantes
 *
 * Propósito:
 * - Centraliza todas las definiciones de tipos del módulo de estudiantes
 * - Evita duplicación de interfaces entre componentes y hooks
 * - Facilita mantenimiento y consistencia de tipos
 * - Importación simple desde cualquier archivo del módulo
 *
 * Beneficios:
 * - Single source of truth para tipos de estudiantes
 * - TypeScript intellisense mejorado
 * - Fácil refactoring de estructuras de datos
 * - Mejor organización del código
 */

export interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  identificacion: string;
  programa_nombre: string;
}

export interface Programa {
  id: number;
  nombre: string;
}

export interface EstudianteForm {
  nombre: string;
  email: string;
  identificacion: string;
  programaId: string;
}

export interface ImportarEstudiantesState {
  selectedFileName: string;
}

export interface EstudiantesError {
  message: string;
  code?: string | number;
} 