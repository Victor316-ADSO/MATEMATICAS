/**
 * usePreguntas - Custom hook para gestión completa de preguntas
 * 
 * Propósito:
 * - Maneja todas las operaciones CRUD de preguntas
 * - Gestiona opciones dentro de cada pregunta
 * - Maneja subida y validación de imágenes
 * - Proporciona funciones de drag & drop
 * - Calcula puntajes totales automáticamente
 * 
 * Beneficios:
 * - Lógica compleja de preguntas completamente encapsulada
 * - Hook altamente reutilizable
 * - Validación de imágenes centralizada
 * - Estados y operaciones optimizadas
 */

import { useState } from 'react';
import Swal from 'sweetalert2';
import type { Pregunta, Opcion } from '../types';

export const usePreguntas = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  // Función para validar archivos de imagen
  const validarImagen = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'El archivo debe ser una imagen (JPEG, PNG o GIF)', 'error');
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Error', 'La imagen no debe exceder 2MB', 'error');
      return false;
    }
    return true;
  };

  // CRUD de preguntas
  const agregarPregunta = () => {
    const nuevaPregunta: Pregunta = {
      texto: '',
      opciones: [
        { texto: '', imagen: null },
        { texto: '', imagen: null },
        { texto: '', imagen: null },
        { texto: '', imagen: null }
      ],
      correcta: null,
      peso: 0,
      imagen: null
    };
    setPreguntas(prev => [...prev, nuevaPregunta]);
  };

  const eliminarPregunta = (index: number) => {
    setPreguntas(prev => {
      const nuevas = [...prev];
      nuevas.splice(index, 1);
      return nuevas;
    });
  };

  const actualizarPregunta = (index: number, campo: string, valor: any) => {
    setPreguntas(prev => {
      const nuevas = [...prev];
      (nuevas[index] as any)[campo] = valor;
      return nuevas;
    });
  };

  const actualizarPeso = (index: number, valor: string) => {
    setPreguntas(prev => {
      const nuevas = [...prev];
      const pesoNumerico = parseFloat(valor);
      nuevas[index].peso = isNaN(pesoNumerico) || valor === '' ? 0 : Math.max(0.01, pesoNumerico);
      return nuevas;
    });
  };

  // Gestión de opciones
  const actualizarOpcion = (pIndex: number, oIndex: number, valor: string) => {
    setPreguntas(prev => {
      const nuevas = [...prev];
      nuevas[pIndex].opciones[oIndex].texto = valor;
      return nuevas;
    });
  };

  const agregarOpcion = (pIndex: number) => {
    setPreguntas(prev => {
      const nuevas = [...prev];
      nuevas[pIndex].opciones.push({ texto: '', imagen: null });
      return nuevas;
    });
  };

  const eliminarOpcion = (pIndex: number, oIndex: number) => {
    setPreguntas(prev => {
      const nuevas = [...prev];
      if (nuevas[pIndex].opciones.length > 2) {
        nuevas[pIndex].opciones.splice(oIndex, 1);
        // Ajustar índice de respuesta correcta si es necesario
        if (nuevas[pIndex].correcta === oIndex) {
          nuevas[pIndex].correcta = null;
        } else if (nuevas[pIndex].correcta !== null && nuevas[pIndex].correcta > oIndex) {
          nuevas[pIndex].correcta = nuevas[pIndex].correcta - 1;
        }
        return nuevas;
      } else {
        Swal.fire('Aviso', 'Debe haber al menos 2 opciones por pregunta', 'info');
        return prev;
      }
    });
  };

  // Gestión de imágenes
  const manejarImagenPregunta = (index: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (validarImagen(file)) {
        setPreguntas(prev => {
          const nuevas = [...prev];
          nuevas[index].imagen = file;
          return nuevas;
        });
      }
    }
  };

  const manejarImagenOpcion = (pIndex: number, oIndex: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (validarImagen(file)) {
        setPreguntas(prev => {
          const nuevas = [...prev];
          nuevas[pIndex].opciones[oIndex].imagen = file;
          return nuevas;
        });
      }
    }
  };

  const eliminarImagenOpcion = (pIndex: number, oIndex: number) => {
    setPreguntas(prev => {
      const nuevas = [...prev];
      nuevas[pIndex].opciones[oIndex].imagen = null;
      return nuevas;
    });
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, type: 'pregunta' | 'opcion', pIndex: number, oIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (type === 'pregunta') {
      manejarImagenPregunta(pIndex, files);
    } else if (type === 'opcion' && oIndex !== undefined) {
      manejarImagenOpcion(pIndex, oIndex, files);
    }
  };

  // Calcular puntaje total
  const calcularPuntajeTotal = (): number => {
    return preguntas.reduce((total, pregunta) => total + (pregunta.peso || 0), 0);
  };

  // Verificar si hay imágenes en el cuestionario
  const tieneImagenes = (): boolean => {
    return preguntas.some(p => 
      p.imagen !== null || p.opciones.some(o => o.imagen !== null)
    );
  };

  // Inicializar con una pregunta por defecto
  const inicializar = () => {
    if (preguntas.length === 0) {
      agregarPregunta();
    }
  };

  return {
    preguntas,
    setPreguntas,
    
    // CRUD Preguntas
    agregarPregunta,
    eliminarPregunta,
    actualizarPregunta,
    actualizarPeso,
    
    // CRUD Opciones
    actualizarOpcion,
    agregarOpcion,
    eliminarOpcion,
    
    // Gestión de Imágenes
    manejarImagenPregunta,
    manejarImagenOpcion,
    eliminarImagenOpcion,
    
    // Drag & Drop
    handleDragOver,
    handleDrop,
    
    // Utilidades
    calcularPuntajeTotal,
    tieneImagenes,
    inicializar,
    validarImagen
  };
}; 