/**
 * HeaderSection - Componente para el header principal de crear cuestionario
 * 
 * Propósito:
 * - Muestra el título principal de la página "Crear Cuestionario"
 * - Mantiene consistencia visual con otros headers de la aplicación
 * - Proporciona un punto central para modificar el título si es necesario
 * - Separación clara del contenido principal
 * 
 * Beneficios:
 * - Reutilizable en otras páginas que necesiten header similar
 * - Centraliza el diseño del header principal
 * - Fácil personalización del título e iconos
 * - Consistencia visual en toda la aplicación
 */

import React from 'react';
import styles from '../CrearCuestionario.module.css';

const HeaderSection: React.FC = () => {
  return (
    <div className={styles.principalHeader}>
      <h1>Crear Cuestionario</h1>
    </div>
  );
};

export default HeaderSection; 