import React from 'react';
import styles from '../VerRespuesta.module.css';
import type { EstadisticasRespuesta } from '../types';

/**
 * ResumenPuntaje muestra el puntaje, porcentaje y barra de progreso del cuestionario.
 */
interface Props {
  estadisticas: EstadisticasRespuesta;
  getPorcentajeColor: (porcentaje: number) => string;
}
const ResumenPuntaje: React.FC<Props> = ({ estadisticas, getPorcentajeColor }) => {
  const color = getPorcentajeColor(estadisticas.porcentaje);
  return (
    <div className={styles.puntajeContainer}>
      <div className={styles.puntajeTexto}>
        <strong>Puntaje:</strong> {estadisticas.puntaje_obtenido}/{estadisticas.puntaje_total} ({estadisticas.porcentaje}%)
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={
              styles.progressFill + ' ' +
              styles['progress' + color.charAt(0).toUpperCase() + color.slice(1)]
            }
            style={{ width: `${estadisticas.porcentaje}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ResumenPuntaje; 