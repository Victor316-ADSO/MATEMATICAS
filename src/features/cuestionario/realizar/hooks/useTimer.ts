import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import type { EstadoTimer, Pregunta, Cuestionario } from '../../../../types/cuestionario.types';

interface UseTimerProps {
  preguntas: Pregunta[];
  cuestionario: Cuestionario | null;
  isLoading: boolean;
  onTimeUp: () => void;
}

interface UseTimerReturn {
  tiempoRestante: number;
  tiempoTotalCuestionario: number;
  formatearTiempo: (segundos: number) => string;
  getTimerClass: (styles: any) => string;
  getTimerProgressStyle: () => { clipPath: string };
  iniciarTimer: () => void;
  resetTimer: () => void;
}

const TIEMPO_POR_PREGUNTA = 50; // segundos por pregunta

export const useTimer = ({
  preguntas,
  cuestionario,
  isLoading,
  onTimeUp
}: UseTimerProps): UseTimerReturn => {
  // Estados del temporizador
  const tiempoTotalCuestionario = preguntas.length * TIEMPO_POR_PREGUNTA;
  const [tiempoRestante, setTiempoRestante] = useState(tiempoTotalCuestionario);
  const [tiempoInicio, setTiempoInicio] = useState(0);
  const [estadoTimerAnterior, setEstadoTimerAnterior] = useState<EstadoTimer>('normal');
  const [alertaMinutoMostrada, setAlertaMinutoMostrada] = useState(false);

  // Función para obtener el estado del timer
  const getEstadoTimer = useCallback((tiempoRestante: number): EstadoTimer => {
    const porcentajeRestante = (tiempoRestante / tiempoTotalCuestionario) * 100;
    
    if (porcentajeRestante <= 25) {
      return 'danger';
    } else if (porcentajeRestante <= 50) {
      return 'warning';
    } else {
      return 'normal';
    }
  }, [tiempoTotalCuestionario]);

  // Función para mostrar alertas discretas
  const mostrarAlertaDiscreta = useCallback((estado: Exclude<EstadoTimer, 'normal'>) => {
    if (estado === 'warning') {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: '⏰ Tiempo: Mitad del cuestionario',
        text: 'Te queda la mitad del tiempo disponible',
        toast: true,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        customClass: {
          popup: 'swal-warning-toast'
        }
      });
    } else if (estado === 'danger') {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: '🚨 Tiempo crítico: Últimos minutos',
        text: 'Apúrate, te queda poco tiempo',
        toast: true,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        customClass: {
          popup: 'swal-danger-toast'
        }
      });
    }
  }, []);

  // Formatear tiempo en formato MM:SS
  const formatearTiempo = useCallback((segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`;
  }, []);

  // Determinar la clase del temporizador según el tiempo restante
  const getTimerClass = useCallback((styles: any): string => {
    const porcentajeRestante = (tiempoRestante / tiempoTotalCuestionario) * 100;
    
    if (porcentajeRestante <= 25) {
      return `${styles.timer} ${styles.timerDanger}`;
    } else if (porcentajeRestante <= 50) {
      return `${styles.timer} ${styles.timerWarning}`;
    } else {
      return styles.timer;
    }
  }, [tiempoRestante, tiempoTotalCuestionario]);

  // Calcular el estilo CSS para el clip-path del temporizador
  const getTimerProgressStyle = useCallback(() => {
    const porcentajeTranscurrido = ((tiempoTotalCuestionario - tiempoRestante) / tiempoTotalCuestionario) * 100;
    
    let clipPath = '';
    
    if (porcentajeTranscurrido <= 0) {
      clipPath = 'polygon(50% 50%, 50% 0%, 50% 0%, 50% 0%)';
    } else if (porcentajeTranscurrido >= 100) {
      clipPath = 'circle(50% at 50% 50%)';
    } else {
      const puntos = [];
      puntos.push('50% 50%');
      puntos.push('50% 0%');
      
      const angulo = (porcentajeTranscurrido / 100) * 360;
      const pasos = 36;
      const pasosPorcentaje = Math.ceil((angulo / 360) * pasos);
      
      for (let i = 1; i <= pasosPorcentaje; i++) {
        const a = (i / pasos) * 2 * Math.PI;
        const x = 50 + 50 * Math.sin(a);
        const y = 50 - 50 * Math.cos(a);
        puntos.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
      }
      
      clipPath = `polygon(${puntos.join(', ')})`;
    }
    
    return { clipPath };
  }, [tiempoRestante, tiempoTotalCuestionario]);

  // Función para iniciar el temporizador
  const iniciarTimer = useCallback(() => {
    const tiempoTotal = preguntas.length * TIEMPO_POR_PREGUNTA;
    setTiempoRestante(tiempoTotal);
    setTiempoInicio(Date.now());
    setEstadoTimerAnterior('normal');
    setAlertaMinutoMostrada(false);
  }, [preguntas.length]);

  // Función para resetear el temporizador
  const resetTimer = useCallback(() => {
    setTiempoRestante(tiempoTotalCuestionario);
    setTiempoInicio(0);
    setEstadoTimerAnterior('normal');
    setAlertaMinutoMostrada(false);
  }, [tiempoTotalCuestionario]);

  // UseEffect principal del temporizador
  useEffect(() => {
    if (isLoading || !cuestionario || tiempoInicio === 0) return;
    
    const timer = setInterval(() => {
      const tiempoActual = Date.now();
      const tiempoTranscurrido = Math.floor((tiempoActual - tiempoInicio) / 1000);
      const nuevoTiempoRestante = Math.max(0, tiempoTotalCuestionario - tiempoTranscurrido);
      
      // Detectar cambios de estado del timer
      const estadoActual = getEstadoTimer(nuevoTiempoRestante);
      
      // Mostrar alerta discreta si cambia de estado
      if (estadoActual !== estadoTimerAnterior) {
        if (estadoActual === 'warning' && estadoTimerAnterior === 'normal') {
          mostrarAlertaDiscreta('warning');
        } else if (estadoActual === 'danger' && estadoTimerAnterior === 'warning') {
          mostrarAlertaDiscreta('danger');
        }
        setEstadoTimerAnterior(estadoActual);
      }

      // Alerta especial cuando queda exactamente 1 minuto
      if (nuevoTiempoRestante <= 60 && nuevoTiempoRestante > 55 && !alertaMinutoMostrada) {
        setAlertaMinutoMostrada(true);
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: '🚨 ¡Último minuto!',
          text: 'Solo te queda 1 minuto para terminar',
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
          customClass: {
            popup: 'swal-final-warning'
          }
        });
      }
      
      setTiempoRestante(nuevoTiempoRestante);
      
      // Si se acaba el tiempo, enviar automáticamente
      if (nuevoTiempoRestante <= 0) {
        clearInterval(timer);
        
        // Mostrar alerta final antes de enviar
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: '⏰ Tiempo agotado',
          text: 'El tiempo ha terminado. Enviando tu cuestionario...',
          toast: false,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          allowOutsideClick: false,
          customClass: {
            popup: 'swal-time-up'
          }
        }).then(() => {
          onTimeUp();
        });
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [
    isLoading,
    cuestionario,
    tiempoInicio,
    tiempoTotalCuestionario,
    estadoTimerAnterior,
    alertaMinutoMostrada,
    getEstadoTimer,
    mostrarAlertaDiscreta,
    onTimeUp
  ]);

  // Actualizar el tiempo total cuando cambian las preguntas
  useEffect(() => {
    const nuevoTiempoTotal = preguntas.length * TIEMPO_POR_PREGUNTA;
    if (tiempoInicio === 0) {
      setTiempoRestante(nuevoTiempoTotal);
    }
  }, [preguntas.length, tiempoInicio]);

  return {
    tiempoRestante,
    tiempoTotalCuestionario,
    formatearTiempo,
    getTimerClass,
    getTimerProgressStyle,
    iniciarTimer,
    resetTimer
  };
}; 