/**
 * PuntajeWidget - Componente para el widget flotante de puntaje en crear cuestionario
 * 
 * Propósito:
 * - Muestra el puntaje total actual y máximo en un botón flotante
 * - Calcula y visualiza el estado del puntaje (perfecto, excedido, medio, bajo)
 * - Despliega detalles completos del puntaje al hacer clic
 * - Proporciona feedback visual en tiempo real sobre el progreso del puntaje
 * 
 * Beneficios:
 * - Separación clara de la lógica de cálculo de puntajes
 * - Widget interactivo y atractivo visualmente
 * - Reutilizable en otras partes que necesiten mostrar puntajes
 * - Fácil de mantener y testear independientemente
 */

import React from 'react';
import styles from '../CrearCuestionario.module.css';

interface Programa {
  id: number;
  nombre: string;
  nivel_nombre: string;
  campus_nombre: string;
  nivel_puntaje_maximo?: number;
}

interface PuntajeWidgetProps {
  puntajeTotal: number;
  puntajeMaximo: number;
  programaSeleccionado: Programa | undefined;
  mostrarDetallePuntaje: boolean;
  onToggleDetalle: () => void;
  onCerrarDetalle: () => void;
}

const PuntajeWidget: React.FC<PuntajeWidgetProps> = ({
  puntajeTotal,
  puntajeMaximo,
  programaSeleccionado,
  mostrarDetallePuntaje,
  onToggleDetalle,
  onCerrarDetalle
}) => {
  // Calcular porcentaje y estado del puntaje
  const porcentajePuntaje = (puntajeTotal / puntajeMaximo) * 100;
  const estadoPuntaje = puntajeTotal === puntajeMaximo ? 'perfecto' : 
                       puntajeTotal > puntajeMaximo ? 'excedido' : 
                       puntajeTotal >= puntajeMaximo * 0.5 ? 'medio' : 'bajo';

  return (
    <div className={styles.puntajeFlotante}>
      <div 
        className={`${styles.puntajeCircle} ${styles[estadoPuntaje]}`}
        onClick={onToggleDetalle}
      >
        <span className={styles.puntajeNumero}>
          {puntajeTotal % 1 === 0 ? puntajeTotal.toFixed(0) : puntajeTotal.toFixed(1)}
        </span>
        <span className={styles.puntajeMax}>Máx: {puntajeMaximo}</span>
      </div>
      
      {mostrarDetallePuntaje && (
        <div className={styles.puntajeDetalle}>
          <div className={styles.puntajeDetalleHeader}>
            <h4>Detalles del Puntaje</h4>
            <button
              type="button"
              onClick={onCerrarDetalle}
              className={styles.cerrarDetalle}
            >
              ×
            </button>
          </div>
          <div className={styles.puntajeInfo}>
            <div className={styles.puntajeItem}>
              <span className={styles.label}>Actual:</span>
              <span className={styles.valor}>
                {puntajeTotal % 1 === 0 ? puntajeTotal.toFixed(0) : puntajeTotal.toFixed(1)}
              </span>
            </div>
            <div className={styles.puntajeItem}>
              <span className={styles.label}>Máximo:</span>
              <span className={styles.valor}>{puntajeMaximo}</span>
            </div>
            <div className={styles.puntajeItem}>
              <span className={styles.label}>Porcentaje:</span>
              <span className={styles.valor}>{porcentajePuntaje.toFixed(1)}%</span>
            </div>
            <div className={styles.puntajeItem}>
              <span className={styles.label}>Estado:</span>
              <span className={`${styles.estado} ${styles[estadoPuntaje]}`}>
                {estadoPuntaje === 'excedido' ? 'Excedido' :
                 estadoPuntaje === 'perfecto' ? 'Perfecto' :
                 estadoPuntaje === 'medio' ? 'Parcial' : 'Bajo'}
              </span>
            </div>
            {programaSeleccionado && (
              <div className={styles.programaInfo}>
                <small>Programa: {programaSeleccionado.nivel_nombre}</small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuntajeWidget; 