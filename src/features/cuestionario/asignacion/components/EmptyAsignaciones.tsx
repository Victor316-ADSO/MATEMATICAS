/**
 * EmptyAsignaciones - Componente para mostrar estado vacío cuando no hay asignaciones
 * 
 * Propósito:
 * - Muestra mensaje informativo cuando no existen asignaciones creadas
 * - Proporciona feedback visual claro sobre el estado vacío
 * - Mantiene consistencia con el diseño general de estados vacíos
 * - Evita que el usuario se confunda al ver una tabla vacía
 * 
 * Beneficios:
 * - Mejora la experiencia del usuario con feedback claro
 * - Componente específico para el contexto de asignaciones
 * - Reutilizable en otras partes que listen asignaciones
 * - Fácil de personalizar el mensaje y diseño
 */

import React from 'react';
import styles from '../Asignacion.module.css';

const EmptyAsignaciones: React.FC = () => {
  return (
    <p className={styles.emptyMessage}>Sin asignaciones.</p>
  );
};

export default EmptyAsignaciones; 