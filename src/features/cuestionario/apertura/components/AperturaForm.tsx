/**
 * AperturaForm - Componente para crear nuevas aperturas de cuestionarios
 * 
 * Propósito:
 * - Formulario para seleccionar cuestionario y periodo
 * - Valida que ambos campos estén seleccionados antes del envío
 * - Maneja el envío de datos a la API para crear apertura
 * - Proporciona feedback visual durante el proceso de creación
 * 
 * Beneficios:
 * - Separación clara de la lógica del formulario
 * - Reutilizable en otras partes que necesiten crear aperturas
 * - Validación centralizada y consistente
 * - Fácil de testear y mantener independientemente
 */

import React from 'react';
import styles from '../Apertura.module.css';

interface Cuestionario {
  id: number;
  cuestionario_id: number;
  titulo: string;
  descripcion: string;
  programa_nombre: string;
}

interface Periodo {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface AperturaFormProps {
  cuestionarios: Cuestionario[];
  periodos: Periodo[];
  cuestionarioSeleccionado: string;
  periodoSeleccionado: string;
  onCuestionarioChange: (value: string) => void;
  onPeriodoChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  formatearFecha: (fecha: string) => string;
}

const AperturaForm: React.FC<AperturaFormProps> = ({
  cuestionarios,
  periodos,
  cuestionarioSeleccionado,
  periodoSeleccionado,
  onCuestionarioChange,
  onPeriodoChange,
  onSubmit,
  formatearFecha
}) => {
  return (
    <div className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Programar Apertura
        </h3>
      </div>
      <div className={styles.cardBody}>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="cuestionario_id">Cuestionario</label>
            <select 
              id="cuestionario_id" 
              value={cuestionarioSeleccionado}
              onChange={(e) => onCuestionarioChange(e.target.value)}
              required
              className={styles.selectField}
            >
              <option value="">Seleccionar cuestionario</option>
              {cuestionarios.map((cuestionario) => (
                <option key={cuestionario.id} value={cuestionario.id}>
                  {cuestionario.titulo} - {cuestionario.programa_nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="periodo_id">Periodo</label>
            <select 
              id="periodo_id" 
              value={periodoSeleccionado}
              onChange={(e) => onPeriodoChange(e.target.value)}
              required
              className={styles.selectField}
            >
              <option value="">Seleccionar periodo</option>
              {periodos.map((periodo) => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nombre} ({formatearFecha(periodo.fecha_inicio)} - {formatearFecha(periodo.fecha_fin)})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Abrir Cuestionario
          </button>
        </form>
      </div>
    </div>
  );
};

export default AperturaForm; 