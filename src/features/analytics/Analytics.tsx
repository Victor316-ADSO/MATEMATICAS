import PageTransition from '../../components/PageTransition';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import StatCards from './components/StatCards';
import AlertsPanel from './components/AlertsPanel';
import MathPanel from './components/MathPanel';
import PredictivePanel from './components/PredictivePanel';
import AnalyticsCharts from './components/AnalyticsCharts';
import styles from './Analytics.module.css';
import { FaChartLine, FaSync } from 'react-icons/fa';

const Analytics = () => {
  const { data, loading, error, reload } = useAnalyticsData();

  if (loading) {
    return (
      <PageTransition>
        <div className={styles.loadingWrap}>
          <div className="spinner-border text-primary" role="status" />
          <p>Cargando Analytics Matemático…</p>
        </div>
      </PageTransition>
    );
  }

  if (error || !data) {
    return (
      <PageTransition>
        <div className={styles.errorWrap}>
          <p>{error || 'Sin datos disponibles'}</p>
          <button type="button" className="btn btn-primary" onClick={reload}>
            Reintentar
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={styles.analyticsPage}>
        <header className={styles.header}>
          <div>
            <h1>
              <FaChartLine /> Analytics Matemático
            </h1>
            <p>
              Análisis de adopción tecnológica en la plataforma educativa de quizzes mediante
              cálculo diferencial y criterio de la segunda derivada.
            </p>
          </div>
          <button type="button" className={styles.refreshBtn} onClick={reload}>
            <FaSync /> Actualizar
          </button>
        </header>

        <StatCards tarjetas={data.tarjetas} />

        <div className="row g-4 mt-1">
          <div className="col-12 col-lg-5">
            <AlertsPanel alertas={data.matematico.alertas} />
          </div>
          <div className="col-12 col-lg-7">
            <MathPanel matematico={data.matematico} />
          </div>
        </div>

        <div className="mt-4">
          <AnalyticsCharts graficas={data.graficas} curva={data.matematico.curva} />
        </div>

        <div className="mt-4">
          <PredictivePanel prediccion={data.matematico.prediccion} />
        </div>
      </div>
    </PageTransition>
  );
};

export default Analytics;
