import React from 'react';
import styles from '../RealizarCuestionario.module.css';
import type { Cuestionario } from '../../../../types/cuestionario.types';

interface CuestionarioHeaderProps {
  cuestionario: Cuestionario;
}

const CuestionarioHeader: React.FC<CuestionarioHeaderProps> = ({ cuestionario }) => {
  return (
    <div className={styles.header}>
      <h1>{cuestionario.titulo}</h1>
      <div className={styles.metadata}>
        <div className={styles.metadataItem}>
          <strong>Docente:</strong> {cuestionario.creador_nombre}
        </div>
        <div className={styles.metadataItem}>
          <strong>Programa:</strong> {cuestionario.programa_nombre}
        </div>
        <div className={styles.metadataItem}>
          <strong>Nivel:</strong> {cuestionario.nivel_nombre}
        </div>
      </div>
    </div>
  );
};

export default CuestionarioHeader; 