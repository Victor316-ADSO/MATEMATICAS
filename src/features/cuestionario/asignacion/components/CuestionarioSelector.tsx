/**
 * CuestionarioSelector - Componente para seleccionar cuestionarios en asignaciones
 * 
 * Propósito:
 * - Permite seleccionar un cuestionario de una lista de aperturas disponibles
 * - Muestra detalles del cuestionario seleccionado (título, periodo, programa)
 * - Maneja estados vacíos cuando no hay cuestionarios disponibles
 * - Proporciona feedback visual sobre la selección actual
 * 
 * Beneficios:
 * - Separación clara de la lógica de selección de cuestionarios
 * - Reutilizable en otras partes que necesiten seleccionar cuestionarios
 * - Validación y feedback integrados
 * - Interfaz intuitiva y responsive
 */

import React from 'react';
import styles from '../Asignacion.module.css';

interface Apertura {
  id: number;
  titulo: string;
  descripcion: string;
  periodo_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  programa_nombre: string;
}

interface CuestionarioSelectorProps {
  aperturas: Apertura[];
  selectedApertura: string;
  onAperturaChange: (value: string) => void;
  getSelectedAperturaDetails: () => Apertura | null;
}

const CuestionarioSelector: React.FC<CuestionarioSelectorProps> = ({
  aperturas,
  selectedApertura,
  onAperturaChange,
  getSelectedAperturaDetails
}) => {
  return (
    <div className={styles.formColumn}>
      <div className={styles.innerCard}>
        <div className={styles.innerCardHeader}>
          <h6>Cuestionarios</h6>
        </div>
        <div className={styles.innerCardBody}>
          {aperturas.length === 0 ? (
            <p className={styles.emptyMessage}>Sin cuestionarios.</p>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="apertura_id">Cuestionario:</label>
                <select 
                  id="apertura_id" 
                  className={styles.formControl}
                  value={selectedApertura}
                  onChange={(e) => onAperturaChange(e.target.value)}
                  required
                >
                  <option value="">-- Seleccione --</option>
                  {aperturas.map(apertura => (
                    <option key={apertura.id} value={apertura.id}>
                      {apertura.titulo} ({apertura.periodo_nombre})
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.cuestionarioDetalles}>
                {getSelectedAperturaDetails() ? (
                  <div className={styles.alertInfo}>
                    <strong>{getSelectedAperturaDetails()?.titulo}</strong>
                    <p>{getSelectedAperturaDetails()?.periodo_nombre} - {getSelectedAperturaDetails()?.programa_nombre}</p>
                  </div>
                ) : (
                  <p className={styles.emptyMessage}>Seleccione cuestionario.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuestionarioSelector; 