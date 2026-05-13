/**
 * ProgressSection - Componente para barra de progreso y estadísticas
 * 
 * Propósito:
 * - Muestra barra de progreso visual con porcentaje
 * - Incluye badges informativos con estadísticas clave
 * - Proporciona feedback visual inmediato del estado
 * - Separación clara de la visualización de progreso
 * 
 * Beneficios:
 * - Componente reutilizable para cualquier progreso
 * - Visualización clara y atractiva de estadísticas
 * - Fácil de personalizar y extender
 * - Accesibilidad integrada con aria-labels
 */

import React from 'react';
import { FaUsers, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import type { ProgressInfo } from '../types';
import styles from '../Detalles.module.css';

interface ProgressSectionProps {
  progressInfo: ProgressInfo;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ progressInfo }) => {
  const { porcentaje, completados, pendientes, total } = progressInfo;

  return (
    <div className={styles.progressSection}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${porcentaje}%` }}
          role="progressbar"
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso: ${porcentaje}% completado`}
        >
          {porcentaje}%
        </div>
      </div>
      <div className={styles.statsGrid}>
        <div className={`${styles.statBadge} ${styles.info}`}>
          <FaUsers size={12} />
          Asignados: {total}
        </div>
        <div className={`${styles.statBadge} ${styles.success}`}>
          <FaCheckCircle size={12} />
          Completados: {completados}
        </div>
        <div className={`${styles.statBadge} ${styles.warning}`}>
          <FaHourglassHalf size={12} />
          Pendientes: {pendientes}
        </div>
      </div>
    </div>
  );
};

export default ProgressSection; 