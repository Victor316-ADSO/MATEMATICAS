/**
 * Alert - Componente para mostrar mensajes de error o advertencia en Resultado
 *
 * Propósito:
 * - Muestra un mensaje destacado de error o advertencia
 *
 * Beneficios:
 * - Reutilizable en cualquier vista
 * - Mejora la experiencia de usuario
 */

import React from 'react';
import styles from '../Resultado.module.css';

interface AlertProps {
  tipo?: 'error' | 'warning' | 'info';
  mensaje: string;
}

const Alert: React.FC<AlertProps> = ({ tipo = 'info', mensaje }) => (
  <div className={`${styles.alert} ${styles[tipo]}`}> 
    <p>{mensaje}</p>
  </div>
);

export default Alert; 