import React from 'react';
import styles from '../Seguimiento.module.css';
import { FaClipboardList, FaUsers, FaCheckCircle } from 'react-icons/fa';
import type { EstadisticasGlobales } from '../types';

/**
 * ResumenGeneral muestra las estadísticas globales de cuestionarios, asignados y completados.
 */
interface Props {
  estadisticas: EstadisticasGlobales;
}
const ResumenGeneral: React.FC<Props> = ({ estadisticas }) => (
  <div className={styles.statsGrid}>
    <div className={`${styles.statCard} ${styles.primary}`}>
      <div className={styles.statContent}>
        <div className={styles.statInfo}>
          <h6>Cuestionarios</h6>
          <h2>{estadisticas.total_cuestionarios}</h2>
        </div>
        <FaClipboardList size={18} />
      </div>
    </div>
    <div className={`${styles.statCard} ${styles.info}`}>
      <div className={styles.statContent}>
        <div className={styles.statInfo}>
          <h6>Asignados</h6>
          <h2>{estadisticas.total_estudiantes_asignados}</h2>
        </div>
        <FaUsers size={18} />
      </div>
    </div>
    <div className={`${styles.statCard} ${styles.success}`}>
      <div className={styles.statContent}>
        <div className={styles.statInfo}>
          <h6>Completados</h6>
          <h2>
            {estadisticas.total_estudiantes_completados} ({estadisticas.porcentaje_global}%)
          </h2>
        </div>
        <FaCheckCircle size={18} />
      </div>
    </div>
  </div>
);

export default ResumenGeneral; 