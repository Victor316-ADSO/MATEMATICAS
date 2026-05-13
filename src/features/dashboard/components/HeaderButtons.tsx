/**
 * HeaderButtons - Componente para los botones de acción del header del dashboard
 * 
 * Propósito:
 * - Contiene los botones principales de acción (ej: "Crear Cuestionario")
 * - Proporciona acceso rápido a funcionalidades clave desde el dashboard
 * - Mantiene el header organizado y con un diseño consistente
 * - Facilita la navegación a funciones principales de la aplicación
 * 
 * Beneficios:
 * - Separación clara de la lógica de botones del header
 * - Fácil de extender para agregar más botones de acción
 * - Reutilizable en otros dashboards o secciones que necesiten botones similares
 * - Mantiene consistencia visual en todas las cabeceras de la app
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Principal.module.css';

interface HeaderButtonsProps {
  onCopyGeneralLink: () => void;
}

const HeaderButtons: React.FC<HeaderButtonsProps> = ({ onCopyGeneralLink }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div className={styles.headerButtons}>
        <button 
          onClick={() => navigate('/crear-cuestionario')} 
          className={styles.crearCuestionarioBtn}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Crear Cuestionario
        </button>
        
        <button 
          onClick={onCopyGeneralLink} 
          className={styles.generalLinkBtn}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          Link General
        </button>
        

      </div>
    </div>
  );
};

export default HeaderButtons; 