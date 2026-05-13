/**
 * HeaderSection - Componente para header con navegación en SeguimientoDetalle
 * 
 * Propósito:
 * - Proporciona navegación de regreso consistente
 * - Muestra título claro de la sección actual
 * - Mantiene diseño uniforme con otros headers
 * - Encapsula lógica de navegación
 * 
 * Beneficios:
 * - Reutilizable en otras páginas de detalle
 * - Navegación centralizada y consistente
 * - Fácil personalización de título y destino
 * - Componente limpio y enfocado
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from '../Detalles.module.css';

interface HeaderSectionProps {
  titulo?: string;
  backUrl?: string;
  onBack?: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  titulo = "Detalles",
  backUrl = "/seguimiento",
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
    <div className={styles.headerNav}>
      <button 
        className={styles.backButton}
        onClick={handleBack}
        type="button"
        aria-label="Volver atrás"
      >
        <FaArrowLeft size={12} /> Atrás
      </button>
      <h1 className={styles.headerTitle}>
        {titulo}
      </h1>
    </div>
  );
};

export default HeaderSection; 