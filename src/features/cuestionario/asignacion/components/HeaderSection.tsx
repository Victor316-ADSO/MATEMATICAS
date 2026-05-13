/**
 * HeaderSection - Componente para el header de la página de asignaciones
 * 
 * Propósito:
 * - Muestra el título de la página con icono
 * - Incluye botones de navegación específicos para asignaciones
 * - Proporciona acceso rápido a Estudiantes y Dashboard
 * - Mantiene consistencia visual con otros headers de la aplicación
 * 
 * Beneficios:
 * - Reutilizable en páginas similares que necesiten navegación multiple
 * - Centraliza la lógica de navegación del header
 * - Fácil de mantener y actualizar botones de navegación
 * - Navegación intuitiva y consistente
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaArrowLeft, FaClipboardList } from 'react-icons/fa';
import styles from '../Asignacion.module.css';

const HeaderSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <h2><FaClipboardList /> Asignaciones</h2>
      <div className={styles.headerButtons}>
        <button 
          className={styles.btnPrimary}
          onClick={() => navigate('/estudiantes')}
        >
          <FaUsers /> Estudiantes
        </button>
        <button 
          className={styles.btnSecondary}
          onClick={() => navigate('/dashboard')}
        >
          <FaArrowLeft /> Volver
        </button>
      </div>
    </div>
  );
};

export default HeaderSection; 