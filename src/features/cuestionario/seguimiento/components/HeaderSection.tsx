import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Seguimiento.module.css';

/**
 * HeaderSection muestra el título de la vista de seguimiento y un botón para volver al dashboard.
 */
const HeaderSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.headerSection}>
      <h2>Seguimiento de Cuestionarios</h2>
      <button className={styles.btnVolver} onClick={() => navigate('/dashboard')}>
        Volver
      </button>
    </div>
  );
};

export default HeaderSection; 