/**
 * AsignacionesTable - Componente para mostrar la tabla de asignaciones existentes
 * 
 * Propósito:
 * - Muestra todas las asignaciones existentes en formato tabla
 * - Incluye información detallada: estudiante, email, cuestionario, periodo
 * - Proporciona acción para eliminar asignaciones
 * - Maneja el estado vacío cuando no hay asignaciones
 * 
 * Beneficios:
 * - Separación clara de la lógica de visualización de asignaciones
 * - Reutilizable en otras partes que necesiten mostrar asignaciones
 * - Fácil de mantener y testear independientemente
 * - Acciones centralizadas y consistentes para cada asignación
 */

import React from 'react';
import styles from '../Asignacion.module.css';
import EmptyAsignaciones from './EmptyAsignaciones';

interface Asignacion {
  id: number;
  id_apertura: number;
  id_estudiante: number;
  estudiante_nombre: string;
  email: string;
  cuestionario_titulo: string;
  periodo_nombre: string;
}

interface AsignacionesTableProps {
  asignaciones: Asignacion[];
  onEliminarAsignacion: (id: number) => void;
}

const AsignacionesTable: React.FC<AsignacionesTableProps> = ({
  asignaciones,
  onEliminarAsignacion
}) => {
  return (
    <div className={styles.tableSection}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h5>Asignaciones</h5>
        </div>
        <div className={styles.cardBody}>
          {asignaciones.length === 0 ? (
            <EmptyAsignaciones />
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Estudiante</th>
                    <th>Email</th>
                    <th>Cuestionario</th>
                    <th>Periodo</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {asignaciones.map(asignacion => (
                    <tr key={asignacion.id}>
                      <td>{asignacion.id}</td>
                      <td>{asignacion.estudiante_nombre}</td>
                      <td>{asignacion.email}</td>
                      <td>{asignacion.cuestionario_titulo}</td>
                      <td>{asignacion.periodo_nombre}</td>
                      <td>
                        <button 
                          className={styles.btnDelete}
                          onClick={() => onEliminarAsignacion(asignacion.id)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsignacionesTable; 