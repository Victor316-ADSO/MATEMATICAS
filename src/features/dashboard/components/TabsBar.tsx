/**
 * TabsBar - Componente para la barra de pestañas del dashboard
 * 
 * Propósito:
 * - Maneja la navegación entre "Mis Cuestionarios" y "Cuestionarios Abiertos"
 * - Muestra contadores dinámicos de cada categoría
 * - Controla el estado activo de las pestañas
 * 
 * Beneficios:
 * - Separación clara de la lógica de navegación por tabs
 * - Componente reutilizable en otras secciones que necesiten tabs
 * - Fácil de extender para agregar más pestañas en el futuro
 * - Mantiene la consistencia visual de tabs en toda la app
 */

import React from 'react';
import styles from '../Principal.module.css';

interface TabsBarProps {
  activeTab: 'mis' | 'abiertos';
  onTabChange: (tab: 'mis' | 'abiertos') => void;
  misCuestionariosCount: number;
  abiertosCount: number;
}

const TabsBar: React.FC<TabsBarProps> = ({
  activeTab,
  onTabChange,
  misCuestionariosCount,
  abiertosCount
}) => {
  return (
    <div className={styles.tabsBar}>
      <button
        className={`${styles.tabBtn} ${activeTab === 'mis' ? styles.active : ''}`}
        onClick={() => onTabChange('mis')}
      >
        <i className="fas fa-file-alt"></i>
        Mis Cuestionarios ({misCuestionariosCount})
      </button>
      <button
        className={`${styles.tabBtn} ${activeTab === 'abiertos' ? styles.active : ''}`}
        onClick={() => onTabChange('abiertos')}
      >
        <i className="fas fa-calendar-check"></i>
        Cuestionarios Abiertos ({abiertosCount})
      </button>
    </div>
  );
};

export default TabsBar; 