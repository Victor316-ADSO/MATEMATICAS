/**
 * EstudiantesSelector - Componente para seleccionar estudiantes en asignaciones
 * 
 * Propósito:
 * - Permite seleccionar múltiples estudiantes para asignar a cuestionarios
 * - Incluye filtro de búsqueda por nombre, email o programa
 * - Maneja selección individual y "seleccionar todos"
 * - Proporciona feedback cuando no hay estudiantes disponibles
 * 
 * Beneficios:
 * - Separación clara de la lógica de selección de estudiantes
 * - Filtrado integrado para facilitar la búsqueda
 * - Interfaz intuitiva con checkboxes y selección múltiple
 * - Reutilizable en otras partes que necesiten seleccionar estudiantes
 */

import React from 'react';
import styles from '../Asignacion.module.css';

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  identificacion: string;
  programa_nombre: string;
}

interface EstudiantesSelectorProps {
  estudiantes: Estudiante[];
  selectedEstudiantes: number[];
  filtroEstudiante: string;
  seleccionarTodos: boolean;
  onFiltroChange: (value: string) => void;
  onToggleSeleccionarTodos: () => void;
  onEstudianteCheckboxChange: (id: number) => void;
  filteredEstudiantes: Estudiante[];
}

const EstudiantesSelector: React.FC<EstudiantesSelectorProps> = ({
  estudiantes,
  selectedEstudiantes,
  filtroEstudiante,
  seleccionarTodos,
  onFiltroChange,
  onToggleSeleccionarTodos,
  onEstudianteCheckboxChange,
  filteredEstudiantes
}) => {
  return (
    <div className={styles.formColumn}>
      <div className={styles.innerCard}>
        <div className={styles.innerCardHeader}>
          <h6>Estudiantes</h6>
        </div>
        <div className={styles.innerCardBody}>
          {estudiantes.length === 0 ? (
            <div className={styles.alertWarning}>
              <p>Sin estudiantes.</p>
              <p>Importe estudiantes.</p>
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label>Estudiantes:</label>
              <div className={styles.searchBox}>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className={styles.formControl}
                  value={filtroEstudiante}
                  onChange={(e) => onFiltroChange(e.target.value)}
                />
                <button 
                  type="button" 
                  className={styles.btnOutline}
                  onClick={onToggleSeleccionarTodos}
                >
                  {seleccionarTodos ? 'Ninguno' : 'Todos'}
                </button>
              </div>
              <div className={styles.estudiantesContainer}>
                {filteredEstudiantes.map(estudiante => (
                  <div key={estudiante.id} className={styles.estudianteItem}>
                    <input 
                      type="checkbox" 
                      id={`estudiante_${estudiante.id}`}
                      checked={selectedEstudiantes.includes(estudiante.id)}
                      onChange={() => onEstudianteCheckboxChange(estudiante.id)}
                      className={styles.checkbox}
                    />
                    <label htmlFor={`estudiante_${estudiante.id}`}>
                      {estudiante.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstudiantesSelector; 