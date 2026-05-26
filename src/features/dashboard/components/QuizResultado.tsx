import type { DetalleResultadoQuiz } from '../hooks/useQuizAdopcion';
import styles from './QuizResultado.module.css';

interface Props {
  aciertos: number;
  total: number;
  detalle: DetalleResultadoQuiz[];
  diasParaRepetir: number;
  puedeRepetir: boolean;
  onVolverEstudiar: () => void;
  onRepetir: () => void;
  onVolverInicio: () => void;
}

const QuizResultado = ({
  aciertos,
  total,
  detalle,
  diasParaRepetir,
  puedeRepetir,
  onVolverEstudiar,
  onRepetir,
  onVolverInicio,
}: Props) => {
  const porcentaje = total > 0 ? Math.round((aciertos / total) * 100) : 0;

  return (
    <section className={styles.resultRoot}>
      <h2>Resultado del quiz</h2>
      <p className={styles.subtitle}>
        Tus respuestas fueron guardadas. Revisa la retroalimentación de cada pregunta.
        {!puedeRepetir && diasParaRepetir > 0 && (
          <> Podrás repetir el quiz en {diasParaRepetir} día(s).</>
        )}
      </p>

      <div className={styles.scoreBox}>
        <span className={styles.scoreValue}>{aciertos}</span>
        <span className={styles.scoreSep}>de</span>
        <span className={styles.scoreValue}>{total}</span>
        <span className={styles.scorePct}>({porcentaje}%)</span>
      </div>

      <div className={styles.feedbackList}>
        {detalle.map((p, index) => (
          <article
            key={p.id_pregunta}
            className={`${styles.feedbackItem} ${p.es_correcta ? styles.feedbackOk : styles.feedbackFail}`}
          >
            <div className={styles.feedbackHeader}>
              <span className={styles.qNum}>Pregunta {index + 1}</span>
              <span className={p.es_correcta ? styles.badgeOk : styles.badgeFail}>
                {p.es_correcta ? 'Correcta' : 'Incorrecta'}
              </span>
            </div>
            <p className={styles.qText}>{p.pregunta}</p>
            {!p.es_correcta && p.respuesta_usuario && (
              <p className={styles.userAnswer}>
                <strong>Tu respuesta:</strong> {p.respuesta_usuario}
              </p>
            )}
            {!p.es_correcta && (
              <p className={styles.correctAnswer}>
                <strong>Respuesta correcta:</strong> {p.respuesta_correcta}
              </p>
            )}
            <p className={styles.retro}>
              <strong>Retroalimentación:</strong> {p.retroalimentacion}
            </p>
          </article>
        ))}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryBtn} onClick={onVolverInicio}>
          Volver al inicio
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={onVolverEstudiar}>
          Volver a estudiar
        </button>
        {puedeRepetir ? (
          <button type="button" className={styles.primaryBtn} onClick={onRepetir}>
            Repetir quiz
          </button>
        ) : (
          <button type="button" className={styles.primaryBtn} disabled title="Disponible tras el período de espera">
            Repetir en {diasParaRepetir} día(s)
          </button>
        )}
      </div>
    </section>
  );
};

export default QuizResultado;
