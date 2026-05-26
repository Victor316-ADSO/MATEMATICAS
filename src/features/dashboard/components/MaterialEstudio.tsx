import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  FORMULAS,
  FASES_ADOPCION,
  TABLA_REFERENCIA,
  POR_QUE_GRADO_4,
  HERRAMIENTAS_PYTHON,
  generarCurvaAdopcion,
  U,
} from './materialEstudioData';
import styles from './MaterialEstudio.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  onVolver: () => void;
}

const MaterialEstudio = ({ onVolver }: Props) => {
  const curva = generarCurvaAdopcion(8, 50);
  const chartData = {
    labels: curva.map((p) => `t=${p.t}`),
    datasets: [
      {
        label: 'U(t) — usuarios activos',
        data: curva.map((p) => p.u),
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30, 64, 175, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Curva de adopción tecnológica U(t)' },
    },
    scales: {
      x: { title: { display: true, text: 't (meses)' } },
      y: { title: { display: true, text: 'Usuarios U(t)' }, beginAtZero: true },
    },
  };

  return (
    <section className={styles.studyRoot}>
      <header className={styles.studyHeader}>
        <h2>Material de estudio</h2>
        <p className={styles.lead}>
          Adopción tecnológica de la plataforma educativa de quizzes, modelada con cálculo diferencial
          y el criterio de la segunda derivada.
        </p>
      </header>

      <article className={styles.block}>
        <h3>1. Análisis técnico del modelo polinómico</h3>
        <p>
          La función que modela el volumen de usuarios activos en el tiempo es un <strong>polinomio de
          cuarto grado</strong> (n = 4):
        </p>
        <div className={styles.formulaBox}>
          <span>U(t) = −2t⁴ + 32t³ − 180t² + 432t + 100</span>
        </div>
        <h4>¿Por qué una función de cuarto grado?</h4>
        <ul className={styles.bulletList}>
          {POR_QUE_GRADO_4.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className={styles.formulaRow}>
          <code>{FORMULAS.uPrime}</code>
          <code>{FORMULAS.uDoublePrime}</code>
        </div>
      </article>

      <article className={styles.block}>
        <h3>2. Comportamiento dinámico: velocidad vs. aceleración</h3>
        <p>
          La <strong>primera derivada U&apos;(t)</strong> mide la velocidad de cambio; la{' '}
          <strong>segunda derivada U&apos;&apos;(t)</strong> mide la aceleración (concavidad del
          crecimiento).
        </p>
        <div className={styles.fasesGrid}>
          {FASES_ADOPCION.map((fase) => (
            <div key={fase.id} className={`${styles.faseCard} ${styles[fase.color]}`}>
              <h4>{fase.titulo}</h4>
              <span className={styles.faseIntervalo}>{fase.intervalo}</span>
              <p>
                <strong>Matemáticas:</strong> {fase.matematicas}
              </p>
              <p>
                <strong>Ingeniería:</strong> {fase.ingenieria}
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className={styles.block}>
        <h3>Gráfica del modelo U(t)</h3>
        <p className={styles.chartHint}>
          Puntos de referencia: meseta en <strong>t ≈ 3</strong> (U ≈ {Math.round(U(3))}), pico en{' '}
          <strong>t = 6</strong> (U ≈ {Math.round(U(6))}).
        </p>
        <div className={styles.chartWrap}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </article>

      <article className={styles.block}>
        <h3>3. Automatización computacional (referencia Python)</h3>
        <p>Prototipo con librerías usadas en ciencia de datos e ingeniería de software:</p>
        <div className={styles.toolsGrid}>
          {HERRAMIENTAS_PYTHON.map((h) => (
            <div key={h.lib} className={styles.toolCard}>
              <strong>{h.lib}</strong>
              <span>{h.rol}</span>
            </div>
          ))}
        </div>
      </article>

      <article className={styles.block}>
        <h3>Resumen: fórmulas clave para el quiz</h3>
        <div className={styles.tableWrap}>
          <table className={styles.refTable}>
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Expresión</th>
                <th>Resultado</th>
                <th>Interpretación en la app</th>
              </tr>
            </thead>
            <tbody>
              {TABLA_REFERENCIA.map((row) => (
                <tr key={`${row.concepto}-${row.expresion}`}>
                  <td>{row.concepto}</td>
                  <td>
                    <code>{row.expresion}</code>
                  </td>
                  <td>{row.resultado}</td>
                  <td>{row.interpretacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className={styles.footerActions}>
        <button type="button" className={styles.secondaryBtn} onClick={onVolver}>
          Volver a información
        </button>
      </div>
    </section>
  );
};

export default MaterialEstudio;
