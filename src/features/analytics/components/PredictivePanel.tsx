import styles from '../Analytics.module.css';
import type { AnalisisMatematico } from '../types';

interface Props {
  prediccion: AnalisisMatematico['prediccion'];
}

const riesgoClass: Record<string, string> = {
  bajo: styles.riskLow,
  medio: styles.riskMed,
  alto: styles.riskHigh,
};

const PredictivePanel = ({ prediccion }: Props) => (
  <div className={styles.predictPanel}>
    <h5>Módulo predictivo</h5>
    <div className={styles.predictGrid}>
      <div>
        <span>Crecimiento futuro estimado</span>
        <strong>{prediccion.crecimiento_futuro_estimado} usuarios</strong>
      </div>
      <div>
        <span>Riesgo de abandono</span>
        <strong className={riesgoClass[prediccion.riesgo_abandono] || ''}>
          {prediccion.riesgo_abandono.toUpperCase()}
        </strong>
      </div>
      <div>
        <span>Meses de estabilización</span>
        <strong>
          {prediccion.meses_estabilizacion.length
            ? prediccion.meses_estabilizacion.join(', ')
            : 'Ninguno detectado'}
        </strong>
      </div>
      <div>
        <span>Momentos de saturación</span>
        <strong>
          {prediccion.meses_saturacion_estimados.length
            ? `Mes ${prediccion.meses_saturacion_estimados.join(', ')}`
            : 'No proyectados'}
        </strong>
      </div>
    </div>
    <ul className={styles.projectionList}>
      {prediccion.proyeccion.map((p) => (
        <li key={p.mes}>
          Mes {p.mes}: ~{p.usuarios_proyectados} usuarios — {p.tendencia}
          {p.tendencia_modelo && p.tendencia_modelo !== p.tendencia && (
            <span className={styles.projectionHint}> (U&apos; del modelo: {p.tendencia_modelo.replace(/_/g, ' ')})</span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default PredictivePanel;
