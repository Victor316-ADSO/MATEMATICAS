/**
 * HeaderSection - Componente para el header de páginas con título y navegación
 * 
 * Propósito:
 * - Muestra el título principal de la página con icono
 * - Incluye botón de navegación "Volver" para retroceder
 * - Mantiene consistencia visual en headers de toda la aplicación
 * - Proporciona navegación intuitiva para el usuario
 * 
 * Beneficios:
 * - Reutilizable en múltiples páginas que necesiten header similar
 * - Centraliza el diseño y comportamiento de headers
 * - Fácil personalización de títulos e iconos
 * - Navegación consistente en toda la aplicación
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Apertura.module.css';

interface HeaderSectionProps {
  title: string;
  backUrl?: string;
  icon?: React.ReactNode;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  title, 
  backUrl = '/dashboard',
  icon
}) => {
  const navigate = useNavigate();

  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  return (
    <div className={styles.header}>
      <h2>
        {icon || defaultIcon}
        {title}
      </h2>
      <button 
        className={styles.backButton}
        onClick={() => navigate(backUrl)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver
      </button>
    </div>
  );
};

export default HeaderSection; 