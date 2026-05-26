import { FaUsers, FaUserCheck, FaClipboardCheck, FaClock, FaChartLine, FaRedo } from 'react-icons/fa';
import styles from '../Analytics.module.css';
import type { TarjetasResumen } from '../types';

interface Props {
  tarjetas: TarjetasResumen;
}

const StatCards = ({ tarjetas }: Props) => (
  <div className={`row g-3 ${styles.statRow}`}>
    <div className="col-12 col-sm-6 col-xl-3">
      <div className={`${styles.statCard} ${styles.statPrimary}`}>
        <FaUsers />
        <div>
          <span>Usuarios registrados</span>
          <strong>{tarjetas.usuarios_registrados}</strong>
        </div>
      </div>
    </div>
    <div className="col-12 col-sm-6 col-xl-3">
      <div className={`${styles.statCard} ${styles.statInfo}`}>
        <FaUserCheck />
        <div>
          <span>Usuarios activos (30d)</span>
          <strong>{tarjetas.usuarios_activos}</strong>
        </div>
      </div>
    </div>
    <div className="col-12 col-sm-6 col-xl-3">
      <div className={`${styles.statCard} ${styles.statSuccess}`}>
        <FaClipboardCheck />
        <div>
          <span>Quizzes completados</span>
          <strong>{tarjetas.quizzes_completados}</strong>
        </div>
      </div>
    </div>
    <div className="col-12 col-sm-6 col-xl-3">
      <div className={`${styles.statCard} ${styles.statWarning}`}>
        <FaClock />
        <div>
          <span>Tiempo promedio estudio</span>
          <strong>{tarjetas.tiempo_promedio_estudio} min</strong>
        </div>
      </div>
    </div>
    <div className="col-12 col-md-4">
      <div className={styles.miniCard}>
        <FaChartLine />
        <div>
          <small>Crecimiento semanal</small>
          <strong className={tarjetas.crecimiento_semanal_pct >= 0 ? styles.up : styles.down}>
            {tarjetas.crecimiento_semanal_pct}%
          </strong>
        </div>
      </div>
    </div>
    <div className="col-12 col-md-4">
      <div className={styles.miniCard}>
        <FaChartLine />
        <div>
          <small>Crecimiento mensual</small>
          <strong className={tarjetas.crecimiento_mensual_pct >= 0 ? styles.up : styles.down}>
            {tarjetas.crecimiento_mensual_pct}%
          </strong>
        </div>
      </div>
    </div>
    <div className="col-12 col-md-4">
      <div className={styles.miniCard}>
        <FaRedo />
        <div>
          <small>Tasa de retención</small>
          <strong>{tarjetas.tasa_retencion_pct}%</strong>
          <span className={styles.badge}>{tarjetas.tendencia}</span>
        </div>
      </div>
    </div>
  </div>
);

export default StatCards;
