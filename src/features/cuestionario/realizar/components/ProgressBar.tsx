/**
 * ProgressBar - Componente para barra de progreso de preguntas respondidas
 *
 * Propósito:
 * - Muestra visualmente el porcentaje de preguntas respondidas
 * - Proporciona feedback inmediato al usuario
 *
 * Beneficios:
 * - Reutilizable en cualquier formulario con progreso
 * - Visualización clara y atractiva
 */

import React from 'react';
import styles from '../RealizarCuestionario.module.css';

interface ProgressBarProps {
  respondidas: number;
  total: number;
  porcentaje: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ respondidas, total, porcentaje }) => (
  <div className={styles.progressContainer}>
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{ width: `${porcentaje}%` }}
      ></div>
    </div>
    <span className={styles.progressText}>
      {respondidas} de {total} preguntas respondidas ({porcentaje}%)
    </span>
  </div>
);

export default ProgressBar; 