import React from 'react';
import styles from '../RealizarCuestionario.module.css';

interface ProgressSectionProps {
  paginaActual: number;
  totalPaginas: number;
  tiempoRestante: number;
  formatearTiempo: (segundos: number) => string;
  getTimerClass: (styles: any) => string;
  getTimerProgressStyle: () => { clipPath: string };
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  paginaActual,
  totalPaginas,
  tiempoRestante,
  formatearTiempo,
  getTimerClass,
  getTimerProgressStyle
}) => {
  const porcentajeProgreso = Math.round((paginaActual / totalPaginas) * 100);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInfo}>
        <div className={styles.paginacionInfo}>
          Pregunta {paginaActual}
        </div>
        <div className={styles.timerContainer}>
          <div className={getTimerClass(styles)}>
            {formatearTiempo(tiempoRestante)}
            <span 
              className={styles.timerProgress} 
              style={getTimerProgressStyle()}
            ></span>
          </div>
        </div>
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${porcentajeProgreso}%` }}
        ></div>
        <div className={styles.progressPercent}>
          {porcentajeProgreso}%
        </div>
      </div>
    </div>
  );
};

export default ProgressSection; 