import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import useAuth from '../../hooks/useAuth';
import { getUserDisplayName } from '../../utils/userDisplay';
import styles from './Principal.module.css';

const preguntasIniciales = [
  {
    id: 1,
    pregunta: '¿Cuál es el paso más importante antes de comenzar un quiz?',
    opciones: ['Leer el material de estudio', 'Salir sin estudiar', 'Responder rápido sin leer'],
    correcta: 'Leer el material de estudio'
  },
  {
    id: 2,
    pregunta: '¿Por qué es importante revisar las respuestas al final?',
    opciones: ['Para confirmar lo que aprendiste', 'Para copiar de un compañero', 'Para terminar rápido'],
    correcta: 'Para confirmar lo que aprendiste'
  },
  {
    id: 3,
    pregunta: '¿Qué deberías hacer después de ver tu resultado?',
    opciones: ['Repasar los temas con errores', 'Olvidar el resultado', 'No estudiar más'],
    correcta: 'Repasar los temas con errores'
  }
];

const Principal = () => {
  const { user, isLoading } = useAuth();
  const [view, setView] = useState<'info' | 'quiz' | 'result'>('info');
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [resultado, setResultado] = useState<{ aciertos: number; total: number } | null>(null);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <PageTransition>
        <div className={styles.dashboardContainer}>
          <div style={{
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #e67e22',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p>Cargando...</p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        </div>
      </PageTransition>
    );
  }

  const handleSeleccionRespuesta = (preguntaId: number, opcion: string) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: opcion }));
  };

  const iniciarQuiz = () => {
    setRespuestas({});
    setResultado(null);
    setView('quiz');
  };

  const enviarQuiz = () => {
    const total = preguntasIniciales.length;
    const aciertos = preguntasIniciales.reduce((sum, item) => {
      return sum + (respuestas[item.id] === item.correcta ? 1 : 0);
    }, 0);

    setResultado({ aciertos, total });
    setView('result');
    setRespuestas({});
  };

  const reiniciarQuiz = () => {
    setRespuestas({});
    setResultado(null);
    setView('quiz');
  };

  const volverInformacion = () => {
    setView('info');
    setResultado(null);
    setRespuestas({});
  };

  const nombreUsuario = getUserDisplayName(user);

  return (
    <PageTransition>
      <div className={styles.dashboardContainer}>
        <section className={styles.welcomeSection}>
          <h1>Bienvenido{nombreUsuario ? `, ${nombreUsuario}` : ''}.</h1>
          <p>
            En esta plataforma encontrarás una vista de estudio con contenido clave y un quiz para medir tu destreza.
            Después de cada quiz, tus respuestas se reinician para que puedas practicar de nuevo y comparar tu progreso.
          </p>
        </section>

        {view === 'info' && (
          <section className={styles.infoGrid}>
            <article className={styles.infoCard}>
              <h2>Material de estudio</h2>
              <p>
                Lee el contenido recomendado antes de iniciar el quiz. Aquí puedes encontrar consejos, ejemplos y ejercicios que te ayudarán a preparar mejor tus respuestas.
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
                El quiz evalúa lo que estudiaste con preguntas directas. Al finalizar, verás tu resultado y las respuestas se eliminarán para comenzar de nuevo con una nueva ronda.
              </p>
              <ul>
                <li>3 preguntas por quiz</li>
                <li>Respuestas reiniciadas al terminar</li>
                <li>Tu resultado es inmediato</li>
              </ul>
            </article>

            <article className={styles.infoCardAction}>
              <h2>Listo para practicar</h2>
              <p>Haz clic en el botón para comenzar el quiz y poner a prueba lo que estudiaste.</p>
              <button className={styles.primaryBtn} onClick={iniciarQuiz}>
                Iniciar quiz
              </button>
            </article>
          </section>
        )}

        {view === 'quiz' && (
          <section className={styles.quizCard}>
            <h2>Quiz de práctica</h2>
            <p>Selecciona la mejor respuesta para cada pregunta.</p>

            {preguntasIniciales.map((pregunta) => (
              <div key={pregunta.id} className={styles.questionBlock}>
                <p className={styles.questionText}>{pregunta.id}. {pregunta.pregunta}</p>
                <div className={styles.optionsGrid}>
                  {pregunta.opciones.map((opcion) => {
                    const selected = respuestas[pregunta.id] === opcion;
                    return (
                      <button
                        key={opcion}
                        type="button"
                        className={`${styles.optionButton} ${selected ? styles.optionSelected : ''}`}
                        onClick={() => handleSeleccionRespuesta(pregunta.id, opcion)}
                      >
                        {opcion}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className={styles.buttonGroup}>
              <button className={styles.secondaryBtn} onClick={volverInformacion}>
                Volver a información
              </button>
              <button className={styles.primaryBtn} onClick={enviarQuiz} disabled={Object.keys(respuestas).length !== preguntasIniciales.length}>
                Enviar respuestas
              </button>
            </div>
          </section>
        )}

        {view === 'result' && resultado && (
          <section className={styles.resultCard}>
            <h2>Resultado del quiz</h2>
            <p>Tu puntaje final se ha calculado y las respuestas se han eliminado.</p>
            <div className={styles.resultSummary}>
              <span className={styles.resultValue}>{resultado.aciertos}</span>
              <span>de</span>
              <span className={styles.resultValue}>{resultado.total}</span>
            </div>
            <p className={styles.resultText}>
              Este resultado te ayuda a medir tu destreza y conocimiento. Si quieres, puedes intentarlo nuevamente.
            </p>

            <div className={styles.buttonGroup}>
              <button className={styles.secondaryBtn} onClick={volverInformacion}>
                Volver a estudiar
              </button>
              <button className={styles.primaryBtn} onClick={reiniciarQuiz}>
                Repetir quiz
              </button>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
};

export default Principal;
