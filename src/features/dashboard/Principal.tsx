import { useEffect, useState } from 'react';
import PageTransition from '../../components/PageTransition';
import useAuth from '../../hooks/useAuth';
import styles from './Principal.module.css';
import MaterialEstudio from './components/MaterialEstudio';
import QuizResultado from './components/QuizResultado';
import {
  useQuizAdopcion,
  setQuizResultOwner,
  getQuizResultOwner,
  type ResultadoQuizApi,
} from './hooks/useQuizAdopcion';

const Principal = () => {
  const { user, isLoading: authLoading } = useAuth();
  const idenPers =
    user?.iden_pers != null ? String(user.iden_pers) : user?.identificacion != null ? String(user.identificacion) : null;

  const {
    estado,
    preguntas,
    loadingEstado,
    loadingPreguntas,
    enviando,
    error,
    cargarPreguntas,
    cargarUltimoResultado,
    enviarQuiz,
  } = useQuizAdopcion(idenPers);

  const [view, setView] = useState<'info' | 'study' | 'quiz' | 'result'>('info');
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [resultadoApi, setResultadoApi] = useState<ResultadoQuizApi | null>(null);
  const [iniciandoQuiz, setIniciandoQuiz] = useState(false);
  const [cargandoUltimo, setCargandoUltimo] = useState(false);

  useEffect(() => {
    setView('info');
    setIndiceActual(0);
    setRespuestas({});
    setResultadoApi(null);
  }, [idenPers]);

  useEffect(() => {
    if (!idenPers || view !== 'result' || !resultadoApi) {
      return;
    }
    const owner = getQuizResultOwner();
    if (owner && owner !== idenPers) {
      setResultadoApi(null);
      setView('info');
    }
  }, [idenPers, view, resultadoApi]);

  if (authLoading || loadingEstado) {
    return (
      <PageTransition>
        <div className={styles.dashboardContainer}>
          <div className={styles.loadingBox}>
            <div className={styles.spinner} />
            <p>Cargando...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const preguntaActual = preguntas[indiceActual];
  const totalPreguntas = preguntas.length;
  const esUltimaPregunta = indiceActual === totalPreguntas - 1;
  const respuestaActual = preguntaActual ? respuestas[preguntaActual.id] : undefined;
  const puedeAvanzar = Boolean(respuestaActual);
  const progreso = totalPreguntas > 0 ? Math.round(((indiceActual + 1) / totalPreguntas) * 100) : 0;

  const handleSeleccionRespuesta = (preguntaId: number, opcion: string) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: opcion }));
  };

  const iniciarQuiz = async () => {
    if (!estado?.puede_iniciar || !idenPers) return;
    setIniciandoQuiz(true);
    const list = await cargarPreguntas();
    setIniciandoQuiz(false);
    if (list.length === 0) return;
    setRespuestas({});
    setIndiceActual(0);
    setResultadoApi(null);
    setView('quiz');
  };

  const avanzarPregunta = async () => {
    if (!preguntaActual || !puedeAvanzar || !idenPers) return;

    if (!esUltimaPregunta) {
      setIndiceActual((i) => i + 1);
      return;
    }

    const resultado = await enviarQuiz(respuestas);
    if (resultado) {
      setQuizResultOwner(idenPers);
      setResultadoApi(resultado);
      setRespuestas({});
      setView('result');
    }
  };

  const verUltimoResultado = async () => {
    if (!idenPers) return;
    setCargandoUltimo(true);
    const resultado = await cargarUltimoResultado();
    setCargandoUltimo(false);
    if (resultado) {
      setQuizResultOwner(idenPers);
      setResultadoApi(resultado);
      setView('result');
    }
  };

  const volverInformacion = () => {
    setView('info');
    setIndiceActual(0);
    setRespuestas({});
    setResultadoApi(null);
  };

  const handleMaterialClick = () => {
    setView('study');
  };

  const puedeRepetir = estado?.puede_iniciar ?? true;
  const tieneUltimoIntento = Boolean(estado?.ultimo_intento);

  return (
    <PageTransition>
      <div className={styles.dashboardContainer}>
        <section className={styles.welcomeSection}>
          <p>
            Estudia el modelo de adopción tecnológico U(t) con cálculo diferencial y luego realiza el quiz para
            comprobar lo aprendido. Puedes repetir el quiz cada {estado?.cooldown_dias ?? 5} días.
          </p>
          {idenPers && (
            <p className={styles.userHint}>
              Sesión: documento <strong>{idenPers}</strong>
            </p>
          )}
        </section>

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {view === 'info' && (
          <section className={styles.infoGrid}>
            <article className={styles.infoCard}>
              <button type="button" className={styles.cardHeaderButton} onClick={handleMaterialClick}>
                Material de estudio
              </button>
              <p>
                Lee el contenido recomendado antes de iniciar el quiz. Aquí puedes encontrar consejos, ejemplos y
                ejercicios que te ayudarán a preparar mejor tus respuestas.
              </p>
              <ul>
                <li>Resumen de los conceptos clave</li>
                <li>Consejos prácticos para recordar la información</li>
                <li>Ejemplos paso a paso</li>
              </ul>
            </article>

            <article className={styles.infoCard}>
              <h2>Cómo funciona el quiz</h2>
              <p>
                Una pregunta por pantalla, sin volver atrás. Al terminar, tus respuestas se guardan en el servidor
                vinculadas a tu usuario y verás tu resultado con retroalimentación.
              </p>
              <ul>
                <li>10 preguntas sobre adopción tecnológica y U(t)</li>
                <li>Una pregunta a la vez — no puedes retroceder</li>
                <li>Repetición disponible cada {estado?.cooldown_dias ?? 5} días</li>
              </ul>
              {estado?.ultimo_intento && !estado.puede_iniciar && (
                <p className={styles.cooldownNotice}>
                  Tu último intento: {estado.ultimo_intento.aciertos}/{estado.ultimo_intento.total} aciertos.
                  Podrás repetir en {estado.dias_restantes} día(s).
                </p>
              )}
            </article>

            <article className={styles.infoCardAction}>
              <h2>Listo para practicar</h2>
              <p>
                {puedeRepetir
                  ? 'Haz clic para comenzar el quiz. Una vez iniciado no podrás volver a esta pantalla hasta terminar.'
                  : `Debes esperar ${estado?.dias_restantes ?? 0} día(s) más para un nuevo intento.`}
              </p>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.primaryBtn}
                  onClick={iniciarQuiz}
                  disabled={!puedeRepetir || iniciandoQuiz || loadingPreguntas}
                >
                  {iniciandoQuiz || loadingPreguntas ? 'Cargando preguntas...' : 'Iniciar quiz'}
                </button>
                {tieneUltimoIntento && (
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={verUltimoResultado}
                    disabled={cargandoUltimo}
                  >
                    {cargandoUltimo ? 'Cargando...' : 'Ver mi último resultado'}
                  </button>
                )}
              </div>
            </article>
          </section>
        )}

        {view === 'study' && <MaterialEstudio onVolver={volverInformacion} />}

        {view === 'quiz' && preguntaActual && (
          <section className={styles.quizCard}>
            <div className={styles.quizProgressHeader}>
              <span>
                Pregunta {indiceActual + 1} de {totalPreguntas}
              </span>
              <span>{progreso}%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${progreso}%` }} />
            </div>

            <h2>Quiz — Adopción tecnológica U(t)</h2>
            <p className={styles.quizHint}>
              Elige la mejor opción. No puedes volver a preguntas anteriores.
            </p>

            <div className={styles.questionBlock}>
              <p className={styles.questionText}>
                {preguntaActual.orden}. {preguntaActual.pregunta}
              </p>
              <div className={styles.optionsGrid}>
                {preguntaActual.opciones.map((opcion, idx) => {
                  const selected = respuestaActual === opcion.texto;
                  const letra = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={opcion.id}
                      type="button"
                      className={`${styles.optionButton} ${selected ? styles.optionSelected : ''}`}
                      onClick={() => handleSeleccionRespuesta(preguntaActual.id, opcion.texto)}
                    >
                      <strong>{letra})</strong> {opcion.texto}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={styles.primaryBtn}
                onClick={avanzarPregunta}
                disabled={!puedeAvanzar || enviando}
              >
                {enviando ? 'Enviando...' : esUltimaPregunta ? 'Enviar respuestas' : 'Siguiente'}
              </button>
            </div>
          </section>
        )}

        {view === 'result' && resultadoApi && idenPers && getQuizResultOwner() === idenPers && (
          <QuizResultado
            aciertos={resultadoApi.aciertos}
            total={resultadoApi.total}
            detalle={resultadoApi.detalle}
            diasParaRepetir={puedeRepetir ? 0 : (estado?.dias_restantes ?? resultadoApi.proximo_intento_en_dias)}
            puedeRepetir={puedeRepetir}
            onVolverEstudiar={() => {
              setView('study');
              setResultadoApi(null);
            }}
            onRepetir={async () => {
              if (!puedeRepetir) return;
              await iniciarQuiz();
            }}
            onVolverInicio={volverInformacion}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Principal;
