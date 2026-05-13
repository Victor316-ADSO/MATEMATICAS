/**
 * useEstudiantesForm - Custom hook para formulario de estudiante
 *
 * Propósito:
 * - Maneja el estado y validación del formulario de estudiante
 * - Proporciona funciones para actualizar campos y limpiar el formulario
 * - Encapsula la lógica de validación y errores
 *
 * Beneficios:
 * - Lógica de formulario separada y reutilizable
 * - Hook testeable independientemente
 * - Validación centralizada
 * - Fácil de usar en cualquier formulario de estudiante
 */

import { useState } from 'react';
import type { EstudianteForm } from '../types';

export const useEstudiantesForm = (initialState: EstudianteForm = { nombre: '', email: '', identificacion: '', programaId: '' }) => {
  const [form, setForm] = useState<EstudianteForm>(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!form.email.trim()) newErrors.email = 'El email es requerido';
    if (!form.identificacion.trim()) newErrors.identificacion = 'La identificación es requerida';
    if (!form.programaId) newErrors.programaId = 'El programa es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialState);
    setErrors({});
  };

  return {
    form,
    setForm,
    errors,
    setErrors,
    handleChange,
    validate,
    resetForm
  };
}; 