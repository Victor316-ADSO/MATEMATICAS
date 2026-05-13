/**
 * HeaderSection - Componente para el header de la vista de estudiantes
 *
 * Propósito:
 * - Muestra el título principal y el botón de volver
 * - Mantiene consistencia visual con otros headers
 * - Encapsula la lógica de navegación
 *
 * Beneficios:
 * - Reutilizable en otras páginas
 * - Navegación centralizada y consistente
 * - Fácil personalización de título y destino
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaArrowLeft } from 'react-icons/fa';
import styles from '../estudiante.module.css';

interface HeaderSectionProps {
  titulo?: string;
  backUrl?: string;
  onBack?: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  titulo = 'Estudiantes',
  backUrl = '/asignar',
  onBack
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backUrl);
    }
  };

  return (
    <div className={styles.header}>
      <h2><FaUsers /> {titulo}</h2>
      <div className={styles.headerButtons}>
        <button
          className={styles.btnSecondary}
          onClick={handleBack}
          type="button"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>
    </div>
  );
};

export default HeaderSection; 