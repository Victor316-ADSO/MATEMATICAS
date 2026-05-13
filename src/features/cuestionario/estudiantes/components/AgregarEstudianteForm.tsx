/**
 * AgregarEstudianteForm - Componente para el formulario de agregar estudiante
 *
 * Propósito:
 * - Renderiza el formulario de agregar estudiante con validación
 * - Utiliza el custom hook useEstudiantesForm para el manejo de estado y validación
 * - Permite enviar el formulario y limpiar campos
 *
 * Beneficios:
 * - Separación clara de la lógica de formulario
 * - Reutilizable en otras vistas
 * - Validación centralizada y feedback visual
 */

import React from 'react';
import { FaSave, FaUserPlus } from 'react-icons/fa';
import { useEstudiantesForm } from '../hooks/useEstudiantesForm';
import type { Programa, EstudianteForm } from '../types';
import styles from '../estudiante.module.css';

interface AgregarEstudianteFormProps {
  programas: Programa[];
  onSubmit: (form: EstudianteForm, reset: () => void) => void;
}

const AgregarEstudianteForm: React.FC<AgregarEstudianteFormProps> = ({ programas, onSubmit }) => {
  const { form, errors, handleChange, validate, resetForm } = useEstudiantesForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form, resetForm);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h5><FaUserPlus /> Agregar</h5>
      </div>
      <div className={styles.cardBody}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.formGroup}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className={styles.formControl}
              value={form.nombre}
              onChange={handleChange}
              required
            />
            {errors.nombre && <div className={styles.errorText}>{errors.nombre}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formControl}
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className={styles.errorText}>{errors.email}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="identificacion">ID:</label>
            <input
              type="text"
              id="identificacion"
              name="identificacion"
              className={styles.formControl}
              value={form.identificacion}
              onChange={handleChange}
              required
            />
            {errors.identificacion && <div className={styles.errorText}>{errors.identificacion}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="programaId">Programa:</label>
            <select
              id="programaId"
              name="programaId"
              className={styles.formControl}
              value={form.programaId}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione --</option>
              {programas.map(programa => (
                <option key={programa.id} value={programa.id}>{programa.nombre}</option>
              ))}
            </select>
            {errors.programaId && <div className={styles.errorText}>{errors.programaId}</div>}
          </div>
          <button type="submit" className={styles.btnLarge}>
            <FaSave /> Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarEstudianteForm; 