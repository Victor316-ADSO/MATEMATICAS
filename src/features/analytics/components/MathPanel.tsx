import styles from '../Analytics.module.css';
import type { AnalisisMatematico } from '../types';

interface Props {
  matematico: AnalisisMatematico;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n);

const fmtLabel = (key: string) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const MathPanel = ({ matematico }: Props) => {
  const a = matematico.analisis_actual;

  return (
    <div className={styles.mathPanel}>
      <header className={styles.mathPanelHeader}>
        <h5>Análisis matemático — adopción U(t)</h5>
      </header>

      <section className={styles.mathFormulasRow} aria-label="Ecuaciones del modelo">
        <div className={styles.formulaCard}>
          <span className={styles.formulaLabel}>U(t)</span>
          <code>{matematico.funcion}</code>
        </div>
        <div className={styles.formulaCard}>
          <span className={styles.formulaLabel}>U&apos;(t)</span>
          <code>{matematico.derivada}</code>
        </div>
        <div className={styles.formulaCard}>
          <span className={styles.formulaLabel}>U&apos;&apos;(t)</span>
          <code>{matematico.segunda_derivada}</code>
        </div>
      </section>

      {matematico.t_actual_nota && (
        <p className={styles.mathNote}>{matematico.t_actual_nota}</p>
      )}

      <section className={styles.mathMetricsPrimary} aria-label="Variables en t actual">
        <div className={styles.metricCard}>
          <span>t actual (modelo, semanas)</span>
          <strong>{fmt(matematico.t_actual)}</strong>
        </div>
        <div className={styles.metricCard}>
          <span>Activos reales (ref.)</span>
          <strong>
            {matematico.usuarios_reales_referencia != null
              ? fmt(matematico.usuarios_reales_referencia)
              : '—'}
          </strong>
        </div>
        <div className={styles.metricCard}>
          <span>U(t) en t</span>
          <strong>{fmt(a.u)}</strong>
        </div>
      </section>

      <section className={styles.mathMetricsDeriv} aria-label="Derivadas en t actual">
        <div className={styles.metricCard}>
          <span>U&apos;(t) — velocidad</span>
          <strong className={a.u_prime >= 0 ? styles.up : styles.down}>{fmt(a.u_prime)}</strong>
        </div>
        <div className={styles.metricCard}>
          <span>U&apos;&apos;(t) — aceleración</span>
          <strong className={a.u_double_prime >= 0 ? styles.up : styles.down}>
            {fmt(a.u_double_prime)}
          </strong>
        </div>
      </section>

      <section className={styles.mathStatusRow} aria-label="Clasificación del modelo">
        <div className={styles.statusChip}>
          <span>Clasificación (U&apos;&apos;)</span>
          <strong>{fmtLabel(a.acceleration)}</strong>
        </div>
        <div className={styles.statusChip}>
          <span>Tendencia (U&apos;)</span>
          <strong>{fmtLabel(a.growth_rate)}</strong>
        </div>
      </section>

      {matematico.puntos_criticos.length > 0 && (
        <section className={styles.criticalPoints}>
          <h6>Puntos críticos detectados</h6>
          <ul>
            {matematico.puntos_criticos.slice(0, 4).map((p) => (
              <li key={p.t}>
                <span className={styles.criticalT}>t = {fmt(p.t)}</span>
                <span className={styles.criticalTipo}>{fmtLabel(p.tipo)}</span>
                <span className={styles.criticalU}>U = {fmt(p.u)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default MathPanel;
