import React from 'react';
import styles from '../VerRespuesta.module.css';
import { FaUserGraduate } from 'react-icons/fa';
import type { EstudianteInfo, CuestionarioInfo, EstadisticasRespuesta } from '../types';

/**
 * InfoCard muestra la información del estudiante y del cuestionario.
 */
interface Props {
  estudiante: EstudianteInfo;
  cuestionario: CuestionarioInfo;
  estadisticas: EstadisticasRespuesta;
  children?: React.ReactNode;
}
const InfoCard: React.FC<Props> = ({ estudiante, cuestionario, estadisticas, children }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3><FaUserGraduate size={14} /> Información</h3>
    </div>
    <div className={styles.cardBody}>
      <div className={styles.infoGrid}>
        <div className={styles.estudianteInfo}>
          <h4 className={styles.estudianteNombre}>{estudiante.nombre}</h4>
          <div className={styles.infoItem}><span className={styles.infoLabel}>ID:</span> <span>{estudiante.identificacion}</span></div>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Email:</span> <span>{estudiante.email}</span></div>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Programa:</span> <span>{estudiante.programa_nombre}</span></div>
        </div>
        <div className={styles.cuestionarioInfo}>
          <h5 className={styles.cuestionarioTitulo}>{cuestionario.titulo}</h5>
          <p className={styles.cuestionarioDescripcion}>{cuestionario.descripcion}</p>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Fecha:</span> <span>{new Date(estadisticas.fecha_respuesta).toLocaleDateString()}</span></div>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default InfoCard; 