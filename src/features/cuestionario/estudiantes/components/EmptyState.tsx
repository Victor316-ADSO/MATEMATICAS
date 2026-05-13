/**
 * EmptyState - Componente para mostrar mensaje vacío
 *
 * Propósito:
 * - Muestra un mensaje amigable cuando no hay estudiantes
 *
 * Beneficios:
 * - Reutilizable en cualquier lista vacía
 * - Mejora la experiencia de usuario
 */

import React from 'react';
import styles from '../estudiante.module.css';

interface EmptyStateProps {
  mensaje?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ mensaje = 'Sin estudiantes registrados.' }) => (
  <div className={styles.alertWarning}>
    <p>{mensaje}</p>
  </div>
);

export default EmptyState; 