import { useCallback, useEffect, useRef, useState } from 'react';
import { API_ENDPOINTS, fetchApi } from '../../../config/api';

export interface OpcionQuiz {
  id: number;
  texto: string;
}

export interface PreguntaQuizApi {
  id: number;
  orden: number;
  pregunta: string;
  opciones: OpcionQuiz[];
}

export interface QuizEstado {
  puede_iniciar: boolean;
  dias_restantes: number;
  cooldown_dias: number;
  ultimo_intento: {
    fecha: string;
    aciertos: number;
    total: number;
  } | null;
}

export interface DetalleResultadoQuiz {
  id_pregunta: number;
  pregunta: string;
  respuesta_usuario: string;
  respuesta_correcta: string;
  es_correcta: boolean;
  retroalimentacion: string;
}

export interface ResultadoQuizApi {
  aciertos: number;
  total: number;
  porcentaje: number;
  detalle: DetalleResultadoQuiz[];
  proximo_intento_en_dias: number;
}

const QUIZ_OWNER_KEY = 'quiz_adopcion_owner';

/** Guarda en sesión qué usuario completó el último resultado mostrado en pantalla. */
export function setQuizResultOwner(idenPers: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(QUIZ_OWNER_KEY, idenPers);
  }
}

export function clearQuizSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(QUIZ_OWNER_KEY);
  }
}

export function getQuizResultOwner(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return sessionStorage.getItem(QUIZ_OWNER_KEY);
}

export const useQuizAdopcion = (idenPers?: string | null) => {
  const [estado, setEstado] = useState<QuizEstado | null>(null);
  const [preguntas, setPreguntas] = useState<PreguntaQuizApi[]>([]);
  const [loadingEstado, setLoadingEstado] = useState(true);
  const [loadingPreguntas, setLoadingPreguntas] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ownerRef = useRef<string | null>(null);

  const resetLocal = useCallback(() => {
    setEstado(null);
    setPreguntas([]);
    setError(null);
  }, []);

  const cargarEstado = useCallback(async () => {
    if (!idenPers) {
      resetLocal();
      setLoadingEstado(false);
      return;
    }

    setLoadingEstado(true);
    setError(null);
    try {
      const res = await fetchApi(API_ENDPOINTS.direct.quizAdopcion.estado);
      if (!res?.success) {
        throw new Error(res?.message || res?.error || 'No se pudo cargar el estado del quiz');
      }
      setEstado(res.data as QuizEstado);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cargar estado';
      setError(msg);
      setEstado(null);
    } finally {
      setLoadingEstado(false);
    }
  }, [idenPers, resetLocal]);

  const cargarPreguntas = useCallback(async () => {
    if (!idenPers) {
      return [];
    }

    setLoadingPreguntas(true);
    setError(null);
    try {
      const res = await fetchApi(API_ENDPOINTS.direct.quizAdopcion.preguntas);
      if (!res?.success) {
        throw new Error(res?.message || res?.error || 'No se pudieron cargar las preguntas');
      }
      const list = (res.data?.preguntas ?? []) as PreguntaQuizApi[];
      setPreguntas(list);
      return list;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cargar preguntas';
      setError(msg);
      setPreguntas([]);
      return [];
    } finally {
      setLoadingPreguntas(false);
    }
  }, [idenPers]);

  const cargarUltimoResultado = useCallback(async (): Promise<ResultadoQuizApi | null> => {
    if (!idenPers) {
      return null;
    }

    setError(null);
    try {
      const res = await fetchApi(API_ENDPOINTS.direct.quizAdopcion.ultimoResultado);
      if (!res?.success) {
        throw new Error(res?.message || res?.error || 'No se pudo cargar tu último resultado');
      }

      const intento = res.data?.intento;
      const detalle = (res.data?.detalle ?? []) as DetalleResultadoQuiz[];

      if (!intento || detalle.length === 0) {
        return null;
      }

      const intentoPersona = String(intento.id_persona ?? '');
      if (intentoPersona !== idenPers) {
        throw new Error('El resultado no corresponde al usuario actual');
      }

      return {
        aciertos: Number(res.data?.aciertos ?? 0),
        total: Number(res.data?.total ?? 0),
        porcentaje: Number(res.data?.porcentaje ?? 0),
        detalle,
        proximo_intento_en_dias: estado?.dias_restantes ?? 0,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cargar resultado';
      setError(msg);
      return null;
    }
  }, [idenPers, estado?.dias_restantes]);

  const enviarQuiz = useCallback(
    async (respuestas: Record<number, string>): Promise<ResultadoQuizApi | null> => {
      if (!idenPers) {
        return null;
      }

      setEnviando(true);
      setError(null);
      try {
        const payload = {
          respuestas: Object.entries(respuestas).map(([id, texto]) => ({
            id_pregunta: Number(id),
            texto,
          })),
        };
        const res = await fetchApi(API_ENDPOINTS.direct.quizAdopcion.enviar, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (!res?.success) {
          throw new Error(res?.message || res?.error || 'No se pudo enviar el quiz');
        }
        setQuizResultOwner(idenPers);
        await cargarEstado();
        return res.data as ResultadoQuizApi;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error al enviar';
        setError(msg);
        return null;
      } finally {
        setEnviando(false);
      }
    },
    [idenPers, cargarEstado]
  );

  useEffect(() => {
    if (ownerRef.current !== idenPers) {
      ownerRef.current = idenPers ?? null;
      resetLocal();
      clearQuizSession();
      if (idenPers) {
        void cargarEstado();
      } else {
        setLoadingEstado(false);
      }
    }
  }, [idenPers, cargarEstado, resetLocal]);

  return {
    estado,
    preguntas,
    loadingEstado,
    loadingPreguntas,
    enviando,
    error,
    setError,
    cargarEstado,
    cargarPreguntas,
    cargarUltimoResultado,
    enviarQuiz,
  };
};
