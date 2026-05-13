import React from 'react';
import styles from '../Seguimiento.module.css';

/**
 * Alert muestra mensajes de error o estados vacíos en la vista de seguimiento.
 */
interface Props {
  message: string;
  type?: 'error' | 'info';
}
const Alert: React.FC<Props> = ({ message, type = 'info' }) => (
  <div className={type === 'error' ? styles.alertDanger : styles.alertInfo} role="alert">
    {message}
  </div>
);

export default Alert; 