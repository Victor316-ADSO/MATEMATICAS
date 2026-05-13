/**
 * useRespuestasForm - Custom hook para manejar respuestas del usuario
 *
 * Propósito:
 * - Maneja el estado de las respuestas seleccionadas
 * - Proporciona funciones para actualizar respuestas y validarlas
 * - Encapsula la lógica de validación y helpers
 *
 * Beneficios:
 * - Lógica de respuestas separada y reutilizable
 * - Hook testeable independientemente
 * - Validación centralizada
 * - Fácil de usar en cualquier formulario de cuestionario
 */

import { useState } from 'react';
import type { RespuestasUsuario, Pregunta } from '../types';

export const useRespuestasForm = (preguntas: Pregunta[]) => {
  const [respuestas, setRespuestas] = useState<RespuestasUsuario>({});

  const handleChange = (preguntaId: number, opcionId: number) => {
    setRespuestas(prev => ({ ...prev, [preguntaId]: opcionId }));
  };

  const preguntasRespondidas = Object.keys(respuestas).length;
  const totalPreguntas = preguntas.length;
  const porcentajeCompletado = totalPreguntas > 0 ? Math.round((preguntasRespondidas / totalPreguntas) * 100) : 0;

  const validarRespuestas = () => preguntasRespondidas === totalPreguntas;

  return {
    respuestas,
    setRespuestas,
    handleChange,
    preguntasRespondidas,
    totalPreguntas,
    porcentajeCompletado,
    validarRespuestas
  };
}; 