/**
 * FormActions - Componente para los botones de acción del formulario
 * 
 * Propósito:
 * - Contiene los botones principales de acción (Guardar, Cancelar)
 * - Maneja el estado habilitado/deshabilitado según validaciones
 * - Proporciona feedback visual sobre el estado del formulario
 * - Incluye navegación de cancelar hacia el dashboard
 * 
 * Beneficios:
 * - Separación clara de la lógica de acciones del formulario
 * - Reutilizable en otros formularios que necesiten acciones similares
 * - Validación visual integrada
 * - Consistencia en botones de acción
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CrearCuestionario.module.css';

interface FormActionsProps {
  puntajeTotal: number;
  puntajeMaximo: number;
  onSubmit: (e: React.FormEvent) => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  puntajeTotal,
  puntajeMaximo,
  onSubmit
}) => {
  const navigate = useNavigate();
  
  // El botón solo estará habilitado si el puntaje es perfecto (tolerancia a decimales)
  const isDisabled = Math.abs(puntajeTotal - puntajeMaximo) >= 0.01;
  
  const getTooltipText = () => {
    if (Math.abs(puntajeTotal - puntajeMaximo) >= 0.01) {
      if (puntajeTotal > puntajeMaximo) {
        return `No puedes guardar: Puntaje excedido (${puntajeTotal % 1 === 0 ? puntajeTotal.toFixed(0) : puntajeTotal.toFixed(2)}/${puntajeMaximo})`;
      } else {
        return `No puedes guardar: Puntaje insuficiente (${puntajeTotal % 1 === 0 ? puntajeTotal.toFixed(0) : puntajeTotal.toFixed(2)}/${puntajeMaximo})`;
      }
    }
    return 'Puntaje correcto - Listo para crear';
  };

  return (
    <div className={styles.formActions}>
      <button 
        type="submit" 
        className={`${styles.btnSubmit} ${!isDisabled ? styles.btnWarning : styles.btnDisabled}`}
        disabled={isDisabled}
        onClick={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        title={getTooltipText()}
      >
        <i className="fas fa-save"></i> Guardar Cuestionario
      </button>
      {/* Mensaje visual eliminado según solicitud del usuario */}
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className={styles.btnCancel}
      >
        <i className="fas fa-times"></i> Cancelar
      </button>
    </div>
  );
};

export default FormActions; 