/**
 * ResumenGeneral - Componente para mostrar el resumen general del resultado
 *
 * Propósito:
 * - Muestra puntaje, porcentaje, badges y mensaje de estado
 * - Visualiza el estado general del cuestionario
 *
 * Beneficios:
 * - Reutilizable en cualquier vista de resultados
 * - Visualización clara y atractiva
 */

import React from 'react';
import styles from '../Resultado.module.css';

interface ResumenGeneralProps {
  puntajeObtenido: number;
  puntajeTotal: number;
  porcentaje: number;
  correctas: number;
  incorrectas: number;
  color: 'success' | 'warning' | 'danger';
  icono: string;
  mensaje: string;
}

const ResumenGeneral: React.FC<ResumenGeneralProps> = ({
  puntajeObtenido,
  puntajeTotal,
  porcentaje,
  correctas,
  incorrectas,
  color,
  icono,
  mensaje
}) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <h2 className={styles.headerTitle}>🏆 Resultado del Cuestionario</h2>
    </div>
    <div className={styles.cardBody}>
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardPrimary}`}>
          <h4 className={styles.statTitle}>Puntaje</h4>
          <p className={styles.statValue}>{puntajeObtenido.toFixed(2)}/{puntajeTotal.toFixed(2)}</p>
        </div>
        <div className={`${styles.statCard} ${styles[`statCard${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
          <h4 className={styles.statTitle}>Porcentaje</h4>
          <p className={styles.statValue}>{porcentaje}%</p>
        </div>
        <div className={`${styles.statCard} ${styles.statCardInfo}`}>
          <h4 className={styles.statTitle}>Correctas</h4>
          <p className={styles.statValue}>{correctas}</p>
        </div>
        <div className={`${styles.statCard} ${styles.statCardDanger}`}>
          <h4 className={styles.statTitle}>Incorrectas</h4>
          <p className={styles.statValue}>{incorrectas}</p>
        </div>
      </div>
      <div className={styles[`alert${color.charAt(0).toUpperCase() + color.slice(1)}`]}>
        <span className={styles.alertIcon}>{icono}</span>
        {mensaje}
      </div>
    </div>
  </div>
);

export default ResumenGeneral; 