import React from 'react';
import styles from '../Seguimiento.module.css';
import { FaChartBar } from 'react-icons/fa';
import type { CuestionarioSeguimiento } from '../types';

/**
 * SeguimientoTable muestra la lista de cuestionarios con su progreso y botón de detalles.
 */
interface Props {
  cuestionarios: CuestionarioSeguimiento[];
  onDetalle: (aperturaId: number) => void;
}
const SeguimientoTable: React.FC<Props> = ({ cuestionarios, onDetalle }) => (
  <div className={styles.tableContainer}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Título</th>
          <th>Programa</th>
          <th>Periodo</th>
          <th>Fechas</th>
          <th>Progreso</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cuestionarios.map((cuestionario) => {
          const porcentaje = cuestionario.total_estudiantes_asignados > 0
            ? Math.round((cuestionario.total_estudiantes_completados / cuestionario.total_estudiantes_asignados) * 100)
            : 0;
          return (
            <tr key={cuestionario.apertura_id}>
              <td>
                <strong>{cuestionario.titulo}</strong>
                {cuestionario.descripcion && (
                  <div className={styles.description}>
                    {cuestionario.descripcion.length > 30
                      ? `${cuestionario.descripcion.substring(0, 30)}...`
                      : cuestionario.descripcion}
                  </div>
                )}
              </td>
              <td>{cuestionario.programa_nombre}</td>
              <td>{cuestionario.periodo_nombre}</td>
              <td>
                <div className={styles.dates}>
                  <div>{new Date(cuestionario.fecha_inicio).toLocaleDateString()}</div>
                  <div>{new Date(cuestionario.fecha_fin).toLocaleDateString()}</div>
                </div>
              </td>
              <td>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${porcentaje}%` }}
                      role="progressbar"
                      aria-valuenow={porcentaje}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {porcentaje}%
                    </div>
                  </div>
                  <div className={styles.progressStats}>
                    <span className={styles.completed}>{cuestionario.total_estudiantes_completados}</span> /{' '}
                    {cuestionario.total_estudiantes_asignados}
                  </div>
                </div>
              </td>
              <td>
                <button
                  className={styles.actionButton}
                  onClick={() => onDetalle(cuestionario.apertura_id)}
                  title="Ver detalles"
                >
                  <FaChartBar size={12} /> Detalles
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default SeguimientoTable; 