import styles from '../Analytics.module.css';
import type { AlertaInteligente } from '../types';

interface Props {
  alertas: AlertaInteligente[];
}

const nivelClass: Record<string, string> = {
  success: styles.alertSuccess,
  warning: styles.alertWarning,
  danger: styles.alertDanger,
  info: styles.alertInfo,
  primary: styles.alertPrimary,
  secondary: styles.alertSecondary,
};

const AlertsPanel = ({ alertas }: Props) => (
  <div className={styles.alertsPanel}>
    <h5>Alertas inteligentes (criterio U&apos;&apos;)</h5>
    <div className={styles.alertsList}>
      {alertas.map((a, i) => (
        <div key={`${a.tipo}-${i}`} className={`${styles.alertItem} ${nivelClass[a.nivel] || styles.alertInfo}`}>
          <p>{a.mensaje}</p>
          <small>{a.criterio}</small>
        </div>
      ))}
    </div>
  </div>
);

export default AlertsPanel;
