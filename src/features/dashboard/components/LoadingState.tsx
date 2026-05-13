/**
 * LoadingState - Componente para mostrar indicadores de carga
 * 
 * Propósito:
 * - Muestra un spinner animado mientras se cargan los datos
 * - Proporciona feedback visual inmediato al usuario durante esperas
 * - Mantiene la consistencia de indicadores de carga en toda la aplicación
 * - Mejora la percepción de velocidad y responsividad de la app
 * 
 * Beneficios:
 * - Componente simple y reutilizable para cualquier estado de carga
 * - Evita duplicación de código para indicadores de loading
 * - Fácil de personalizar (tamaño, color, mensaje) según necesidades
 * - Centraliza el diseño de estados de carga para mantener consistencia
 */

import React from 'react';
import styles from '../Principal.module.css';

const LoadingState: React.FC = () => {
  return (
    <div className={styles.emptyMessage}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={styles['animate-spin']}
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
      <p>Cargando...</p>
    </div>
  );
};

export default LoadingState; 