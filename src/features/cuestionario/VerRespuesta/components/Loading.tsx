import React from 'react';
import styles from '../VerRespuesta.module.css';
import { FaSpinner } from 'react-icons/fa';

/**
 * Loading muestra un spinner y mensaje de carga.
 */
const Loading: React.FC = () => (
  <div className={styles.loading}>
    <div className={styles.loadingContent}>
      <div className={styles.spinner}><FaSpinner className={styles.spinnerIcon} /></div>
      <h2>Cargando...</h2>
    </div>
  </div>
);

export default Loading; 