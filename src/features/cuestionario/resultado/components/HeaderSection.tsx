/**
 * HeaderSection - Componente para el header de la vista de resultados
 *
 * Propósito:
 * - Muestra el título, metadatos y botón de salir/volver
 * - Mantiene consistencia visual con otros headers
 *
 * Beneficios:
 * - Reutilizable en otras páginas
 * - Navegación centralizada y consistente
 * - Fácil personalización de título y destino
 */

import React from 'react';
import styles from '../Resultado.module.css';

interface HeaderSectionProps {
  titulo: string;
  onSalir: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ titulo, onSalir }) => (
  <nav className={styles.navbar}>
    <div className={styles.navbarContent}>
      <h1 className={styles.navbarTitle}>{titulo}</h1>
      <button onClick={onSalir} className={styles.btnSalir} type="button">
        ← Salir
      </button>
    </div>
  </nav>
);

export default HeaderSection; 