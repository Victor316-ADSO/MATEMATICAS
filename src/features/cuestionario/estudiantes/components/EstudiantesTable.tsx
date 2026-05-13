/**
 * EstudiantesTable - Componente para la tabla de estudiantes
 *
 * Propósito:
 * - Renderiza la tabla de estudiantes con acción de eliminar
 * - Muestra mensaje si no hay estudiantes
 *
 * Beneficios:
 * - Separación clara de la lógica de tabla
 * - Reutilizable en otras vistas
 * - Feedback visual inmediato
 */

import React from 'react';
import { FaUserGraduate } from 'react-icons/fa';
import type { Estudiante } from '../types';
import styles from '../estudiante.module.css';

interface EstudiantesTableProps {
  estudiantes: Estudiante[];
  onEliminar: (id: number) => void;
}

const EstudiantesTable: React.FC<EstudiantesTableProps> = ({ estudiantes, onEliminar }) => {
  if (estudiantes.length === 0) {
    return (
      <div className={styles.alertWarning}>
        <p>Sin estudiantes registrados.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableResponsive}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>ID</th>
            <th>Programa</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map(estudiante => (
            <tr key={estudiante.id}>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.email}</td>
              <td>{estudiante.identificacion}</td>
              <td>{estudiante.programa_nombre}</td>
              <td>
                <button
                  className={styles.btnDelete}
                  onClick={() => onEliminar(estudiante.id)}
                  title="Eliminar"
                  type="button"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstudiantesTable; 