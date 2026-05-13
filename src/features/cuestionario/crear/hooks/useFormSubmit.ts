/**
 * useFormSubmit - Custom hook para envío del formulario de crear cuestionario
 * 
 * Propósito:
 * - Maneja toda la lógica de envío del formulario
 * - Realiza validaciones completas antes del envío
 * - Procesa respuestas de la API con manejo de errores
 * - Gestiona FormData para cuestionarios con imágenes
 * - Maneja redirecciones después del éxito
 * 
 * Beneficios:
 * - Lógica de envío completamente encapsulada
 * - Validaciones centralizadas y reutilizables
 * - Manejo robusto de errores de API
 * - Separación clara de responsabilidades
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { Pregunta, FormErrors } from '../types';

export const useFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validación de puntaje
  const validarPuntaje = async (puntajeTotal: number, puntajeMaximo: number): Promise<boolean> => {
    if (puntajeTotal === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Puntaje requerido',
        text: 'Debe asignar pesos a las preguntas. El puntaje total no puede ser 0.',
      });
      return false;
    }

    if (Math.abs(puntajeTotal - puntajeMaximo) >= 0.01) {
      if (puntajeTotal > puntajeMaximo) {
        await Swal.fire({
          icon: 'error',
          title: 'No se puede crear el cuestionario',
          text: `El puntaje total (${puntajeTotal % 1 === 0 ? puntajeTotal.toFixed(0) : puntajeTotal.toFixed(2)}) excede el máximo permitido (${puntajeMaximo}). Debe ajustar los pesos de las preguntas.`,
          confirmButtonText: 'Entendido',
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'No se puede crear el cuestionario',
          text: `El puntaje total debe ser exactamente ${puntajeMaximo}. Actual: ${puntajeTotal % 1 === 0 ? puntajeTotal.toFixed(0) : puntajeTotal.toFixed(2)}. Debe ajustar los pesos de las preguntas.`,
          confirmButtonText: 'Entendido',
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }
      return false;
    }

    return true;
  };

  // Validación de campos básicos
  const validarCampos = (titulo: string, descripcion: string, programaId: string): FormErrors => {
    const errors: FormErrors = {};
    
    if (!titulo || !titulo.trim()) {
      errors.titulo = 'El título es requerido';
    }
    
    if (!descripcion || !descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }
    
    if (!programaId) {
      errors.programa = 'Debe seleccionar un programa';
    }
    
    return errors;
  };

  // Procesar respuesta de la API
  const procesarRespuesta = async (response: Response) => {
    if (!response.ok) {
      const responseText = await response.text();
      console.log('Respuesta del servidor (texto):', responseText);
      
      try {
        const data = JSON.parse(responseText);
        throw new Error(data.debug_message || data.error || `Error HTTP: ${response.status}`);
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw new Error('La respuesta del servidor no es un JSON válido');
        } else {
          throw parseError;
        }
      }
    }

    const data = await response.json();

    if (data.success) {
      console.log('Cuestionario creado exitosamente');
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Cuestionario creado correctamente',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'OK'
      });

      if (data.cuestionario_id) {
        navigate(`/ver/${data.cuestionario_id}`);
      } else {
        navigate('/dashboard');
      }
    } else {
      throw new Error(data.debug_message || data.error || 'Error al crear el cuestionario');
    }
  };

  // Crear FormData para cuestionarios con imágenes
  const crearFormData = (
    titulo: string,
    descripcion: string,
    programaId: string,
    preguntas: Pregunta[],
    usuarioId: number
  ): FormData => {
    const formData = new FormData();
    formData.append('titulo', titulo.trim());
    formData.append('descripcion', descripcion.trim());
    formData.append('programa_id', programaId.toString());

    preguntas.forEach((pregunta, pIndex) => {
      formData.append(`preguntas[${pIndex}][texto]`, pregunta.texto);
      formData.append(`preguntas[${pIndex}][peso]`, pregunta.peso.toString());
      formData.append(`preguntas[${pIndex}][correcta]`, pregunta.correcta !== null ? pregunta.correcta.toString() : '');
      
      if (pregunta.imagen) {
        formData.append(`preguntas[${pIndex}][imagen]`, pregunta.imagen);
      }

      pregunta.opciones.forEach((opcion, oIndex) => {
        formData.append(`preguntas[${pIndex}][opciones][${oIndex}][texto]`, opcion.texto);
        
        if (opcion.imagen) {
          formData.append(`preguntas[${pIndex}][opciones][${oIndex}][imagen]`, opcion.imagen);
        }
      });
    });

    return formData;
  };

  // Crear JSON para cuestionarios sin imágenes
  const crearPreguntasJSON = (preguntas: Pregunta[]) => {
    return preguntas.map(p => ({
      texto: p.texto,
      peso: p.peso,
      correcta: p.correcta,
      opciones: p.opciones.map(o => ({
        texto: o.texto
      }))
    }));
  };

  // Función principal de envío
  const submitForm = async (
    titulo: string,
    descripcion: string,
    programaId: string,
    preguntas: Pregunta[],
    puntajeTotal: number,
    puntajeMaximo: number,
    tieneImagenes: boolean,
    setFormErrors: (errors: FormErrors) => void
  ) => {
    try {
      setLoading(true);

      // Validación de campos básicos
      const errors = validarCampos(titulo, descripcion, programaId);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        await Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: 'Por favor, complete todos los campos requeridos',
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        return;
      }

      setFormErrors({});

      // Validación de puntaje
      const puntajeValido = await validarPuntaje(puntajeTotal, puntajeMaximo);
      if (!puntajeValido) {
        return;
      }

      // Verificar autenticación
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      if (!usuario.id) {
        throw new Error('Debe iniciar sesión para crear un cuestionario');
      }

      const apiUrl = 'http://localhost/cuestionario-api/api/crearCuestionario_api.php';

      if (tieneImagenes) {
        console.log('Enviando formulario con imágenes usando FormData');
        const formData = crearFormData(titulo, descripcion, programaId, preguntas, usuario.id);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        
        await procesarRespuesta(response);
      } else {
        console.log('Enviando formulario sin imágenes usando JSON');
        const preguntasJSON = crearPreguntasJSON(preguntas);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            titulo,
            descripcion,
            preguntas: preguntasJSON,
            programa_id: programaId || null,
          }),
        });

        await procesarRespuesta(response);
      }
    } catch (err: any) {
      console.error('Error completo:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      if (err.message.includes('iniciar sesión')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitForm,
    validarPuntaje,
    validarCampos,
    procesarRespuesta
  };
}; 