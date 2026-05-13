import React from 'react';
import styles from '../VerRespuesta.module.css';

/**
 * Alert muestra mensajes de error o estados vacíos en la vista VerRespuesta.
 */
interface Props {
  message: string;
  type?: 'error' | 'info';
  onVolver?: () => void;
}
const Alert: React.FC<Props> = ({ message, type = 'info', onVolver }) => (
  <div className={type === 'error' ? styles.error : styles.info}>
    <div className={type === 'error' ? styles.errorContent : styles.infoContent}>
      {type === 'error' && <div className={styles.errorIcon}>⚠️</div>}
      <h2 className={type === 'error' ? styles.errorTitle : styles.infoTitle}>{type === 'error' ? 'Error' : 'Aviso'}</h2>
      <p className={type === 'error' ? styles.errorMessage : styles.infoMessage}>{message}</p>
      {onVolver && (
        <button onClick={onVolver} className={styles.btnPrimary}>
          Volver
        </button>
      )}
    </div>
  </div>
);

export default Alert; 