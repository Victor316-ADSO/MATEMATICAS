import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import styles from '../Analytics.module.css';
import type { AnalyticsDashboardData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#334155', font: { weight: 600 as const } } },
  },
  scales: {
    x: {
      ticks: { color: '#64748b', maxRotation: 45, minRotation: 0 },
      grid: { color: 'rgba(226, 232, 240, 0.9)' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#64748b' },
      grid: { color: 'rgba(226, 232, 240, 0.9)' },
    },
  },
};

interface Props {
  graficas: AnalyticsDashboardData['graficas'];
  curva: AnalyticsDashboardData['matematico']['curva'];
}

const AnalyticsCharts = ({ graficas, curva }: Props) => {
  const growthData = {
    labels: graficas.crecimiento_usuarios.labels,
    datasets: [
      {
        label: graficas.crecimiento_usuarios.datasets[0]?.label || 'Activos',
        data: graficas.crecimiento_usuarios.datasets[0]?.data || [],
        borderColor: '#0f172a',
        backgroundColor: 'rgba(15, 23, 42, 0.08)',
        fill: true,
        tension: 0.35,
      },
      {
        label: graficas.crecimiento_usuarios.datasets[1]?.label || 'U(t)',
        data: graficas.crecimiento_usuarios.datasets[1]?.data || [],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.08)',
        borderDash: [6, 4],
        tension: 0.35,
      },
    ],
  };

  const concavityData = {
    labels: graficas.concavidad.labels.map(String),
    datasets: [
      {
        label: "U''(t) — concavidad",
        data: graficas.concavidad.data,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.12)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const weeklyData = {
    labels: graficas.comparacion_semanal.labels,
    datasets: [
      {
        label: 'Activos',
        data: graficas.comparacion_semanal.activos,
        backgroundColor: '#0f172a',
      },
      {
        label: 'Quizzes',
        data: graficas.comparacion_semanal.quizzes,
        backgroundColor: '#f97316',
      },
    ],
  };

  const activeVsQuiz = {
    labels: graficas.activos_vs_quizzes.labels,
    datasets: [
      {
        label: 'Activos',
        data: graficas.activos_vs_quizzes.activos,
        borderColor: '#0f172a',
        backgroundColor: 'rgba(15, 23, 42, 0.06)',
        tension: 0.3,
      },
      {
        label: 'Quizzes',
        data: graficas.activos_vs_quizzes.quizzes,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.08)',
        tension: 0.3,
      },
    ],
  };

  const predictionData = {
    labels: graficas.prediccion.labels,
    datasets: [
      {
        label: 'Proyección U(t)',
        data: graficas.prediccion.data,
        borderColor: '#ea580c',
        backgroundColor: 'rgba(249, 115, 22, 0.15)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const modelCurve = {
    labels: curva.map((c) => String(c.t)),
    datasets: [
      {
        label: 'U(t) completa',
        data: curva.map((c) => c.u),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className={`row g-4 ${styles.chartsGrid}`}>
      <div className="col-12 col-xl-8">
        <div className={styles.chartCard}>
          <h6>Crecimiento de usuarios (real vs modelo)</h6>
          <div className={styles.chartBox}>
            <Line data={growthData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-4">
        <div className={styles.chartCard}>
          <h6>Concavidad U&apos;&apos;(t)</h6>
          <div className={styles.chartBox}>
            <Line data={concavityData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className={styles.chartCard}>
          <h6>Comparación semanal (promedio diario)</h6>
          <div className={styles.chartBox}>
            <Bar data={weeklyData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className={styles.chartCard}>
          <h6>Activos vs quizzes</h6>
          <div className={styles.chartBox}>
            <Line data={activeVsQuiz} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className={styles.chartCard}>
          <h6>Predicción de crecimiento</h6>
          <div className={styles.chartBox}>
            <Line data={predictionData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className={styles.chartCard}>
          <h6>Curva polinómica U(t)</h6>
          <div className={styles.chartBox}>
            <Line data={modelCurve} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
