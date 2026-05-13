/**
 * BasicInfoForm - Componente para la información básica del cuestionario
 * 
 * Propósito:
 * - Maneja los campos básicos del cuestionario (título, descripción, programa)
 * - Incluye validación en tiempo real y manejo de errores
 * - Proporciona dropdown de programas con información detallada
 * - Separación clara de la lógica de formulario básico
 * 
 * Beneficios:
 * - Reutilizable en otras partes que necesiten formulario básico
 * - Validación centralizada y consistente
 * - Fácil de mantener y testear independientemente
 * - Interfaz limpia y organizada
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

interface BasicInfoFormProps {
  titulo: string;
  descripcion: string;
  programaId: string;
  programas: Programa[];
  formErrors: {[key: string]: string};
  onTituloChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescripcionChange: (value: string) => void;
  onProgramaChange: (value: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  titulo,
  descripcion,
  programaId,
  programas,
  formErrors,
  onTituloChange,
  onDescripcionChange,
  onProgramaChange
}) => {
  return (
    <div className={styles.basicInfo}>
      <div className={styles.formGroup}>
        <label>Título *</label>
        <input
          type="text"
          value={titulo}
          onChange={onTituloChange}
          required
          className={`${styles.formControl} ${formErrors.titulo ? styles.error : ''}`}
          placeholder="Título del cuestionario *"
        />
        {formErrors.titulo && (
          <div className={styles.errorText}>{formErrors.titulo}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Descripción *</label>
        <textarea
          value={descripcion}
          onChange={(e) => onDescripcionChange(e.target.value)}
          required
          className={styles.formControl}
          placeholder="Descripción del cuestionario *"
          rows={2}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Programa *</label>
        <select
          value={programaId}
          onChange={(e) => onProgramaChange(e.target.value)}
          className={styles.formControl}
          required
        >
          <option value="">Seleccione un programa</option>
          {programas.map((programa) => (
            <option key={programa.id} value={programa.id}>
              {programa.nombre} - {programa.nivel_nombre} - {programa.campus_nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BasicInfoForm; 