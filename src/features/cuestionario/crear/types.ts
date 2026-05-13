/**
 * types.ts - Tipos y interfaces centralizadas para crear cuestionario
 * 
 * Propósito:
 * - Centraliza todas las definiciones de tipos
 * - Evita duplicación de interfaces entre archivos
 * - Facilita mantenimiento y consistencia
 * - Importación simple desde cualquier módulo
 * 
 * Beneficios:
 * - Single source of truth para tipos
 * - TypeScript intellisense mejorado
 * - Fácil refactoring de tipos
 * - Mejor organización del código
 */

export interface Programa {
  id: number;
  nombre: string;
  nivel_nombre: string;
  campus_nombre: string;
  nivel_puntaje_maximo?: number;
}

export interface Opcion {
  texto: string;
  imagen: File | null;
}

export interface Pregunta {
  texto: string;
  opciones: Opcion[];
  correcta: number | null;
  peso: number;
  imagen: File | null;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  rol?: string;
}

export interface CrearCuestionarioFormData {
  titulo: string;
  descripcion: string;
  programaId: string;
  preguntas: Pregunta[];
}

export interface PuntajeCalculation {
  total: number;
  maximo: number;
  porcentaje: number;
  estado: 'perfecto' | 'excedido' | 'medio' | 'bajo';
} 