/**
 * EmptyAperturas - Componente para mostrar estado vacío cuando no hay aperturas
 * 
 * Propósito:
 * - Muestra mensaje informativo cuando no existen cuestionarios abiertos
 * - Proporciona feedback visual claro sobre el estado vacío
 * - Mantiene consistencia con el diseño general de estados vacíos
 * - Evita que el usuario se confunda al ver una lista vacía
 * 
 * Beneficios:
 * - Mejora la experiencia del usuario con feedback claro
 * - Componente específico para el contexto de aperturas
 * - Reutilizable en otras partes que listen aperturas
 * - Fácil de personalizar el mensaje y diseño
 */

import React from 'react';
import styles from '../Apertura.module.css';

const EmptyAperturas: React.FC = () => {
  return (
    <div className={styles.emptyState}>
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p className={styles.emptyMessage}>No hay cuestionarios abiertos actualmente.</p>
    </div>
  );
};

export default EmptyAperturas; 