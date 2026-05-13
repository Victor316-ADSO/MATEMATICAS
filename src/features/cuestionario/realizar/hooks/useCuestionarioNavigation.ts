import { useState, useMemo, useCallback } from 'react';
import type { Pregunta, RespuestaUsuario } from '../../../../types/cuestionario.types';

interface UseCuestionarioNavigationProps {
  preguntas: Pregunta[];
  respuestas: RespuestaUsuario;
  preguntasPorPagina?: number;
}

interface UseCuestionarioNavigationReturn {
  // Estados
  paginaActual: number;
  
  // Datos calculados
  totalPaginas: number;
  indiceInicio: number;
  indiceFin: number;
  preguntasActuales: Pregunta[];
  preguntasRespondidas: number;
  porcentajeCompletado: number;
  
  // Funciones de navegación
  cambiarPagina: (pagina: number) => void;
  irSiguiente: () => void;
  irAnterior: () => void;
  isPreguntaBloqueada: (numeroPregunta: number) => boolean;
  
  // Funciones de estado
  isFirstPage: boolean;
  isLastPage: boolean;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
}

export const useCuestionarioNavigation = ({
  preguntas,
  respuestas,
  preguntasPorPagina = 1
}: UseCuestionarioNavigationProps): UseCuestionarioNavigationReturn => {
  
  const [paginaActual, setPaginaActual] = useState(1);

  // Datos calculados con useMemo para optimizar rendimiento
  const navigationData = useMemo(() => {
    const totalPaginas = Math.ceil(preguntas.length / preguntasPorPagina);
    const indiceInicio = (paginaActual - 1) * preguntasPorPagina;
    const indiceFin = indiceInicio + preguntasPorPagina;
    const preguntasActuales = preguntas.slice(indiceInicio, indiceFin);
    const preguntasRespondidas = Object.keys(respuestas).length;
    const porcentajeCompletado = Math.round((preguntasRespondidas / preguntas.length) * 100);

    return {
      totalPaginas,
      indiceInicio,
      indiceFin,
      preguntasActuales,
      preguntasRespondidas,
      porcentajeCompletado
    };
  }, [preguntas, paginaActual, preguntasPorPagina, respuestas]);

  // Función para determinar si una pregunta está bloqueada
  const isPreguntaBloqueada = useCallback((numeroPregunta: number): boolean => {
    // La primera pregunta siempre está desbloqueada
    if (numeroPregunta === 1) return false;
    
    // Si la pregunta ya está respondida, no está bloqueada
    const preguntaId = preguntas[numeroPregunta - 1]?.id;
    if (respuestas.hasOwnProperty(preguntaId)) return false;
    
    // Verificar si la pregunta anterior está respondida
    const preguntaAnteriorId = preguntas[numeroPregunta - 2]?.id;
    return !respuestas.hasOwnProperty(preguntaAnteriorId);
  }, [preguntas, respuestas]);

  // Función principal de navegación
  const cambiarPagina = useCallback((pagina: number) => {
    // Validar límites
    if (pagina < 1 || pagina > navigationData.totalPaginas) {
      return;
    }

    // No permitir navegación a preguntas bloqueadas
    if (isPreguntaBloqueada(pagina)) {
      return;
    }

    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigationData.totalPaginas, isPreguntaBloqueada]);

  // Funciones de navegación convenientes
  const irSiguiente = useCallback(() => {
    cambiarPagina(paginaActual + 1);
  }, [paginaActual, cambiarPagina]);

  const irAnterior = useCallback(() => {
    cambiarPagina(paginaActual - 1);
  }, [paginaActual, cambiarPagina]);

  // Estados de navegación
  const navigationStates = useMemo(() => {
    const isFirstPage = paginaActual === 1;
    const isLastPage = paginaActual === navigationData.totalPaginas;
    const canNavigatePrevious = !isFirstPage;
    const canNavigateNext = !isLastPage && !isPreguntaBloqueada(paginaActual + 1);

    return {
      isFirstPage,
      isLastPage,
      canNavigatePrevious,
      canNavigateNext
    };
  }, [paginaActual, navigationData.totalPaginas, isPreguntaBloqueada]);

  return {
    // Estados
    paginaActual,
    
    // Datos calculados
    ...navigationData,
    
    // Funciones
    cambiarPagina,
    irSiguiente,
    irAnterior,
    isPreguntaBloqueada,
    
    // Estados de navegación
    ...navigationStates
  };
}; 