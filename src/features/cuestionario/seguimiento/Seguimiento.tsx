import React from 'react';
import styles from './Seguimiento.module.css';
import { useSeguimientoData } from './hooks/useSeguimientoData';
import HeaderSection from './components/HeaderSection';
import ResumenGeneral from './components/ResumenGeneral';
import SeguimientoTable from './components/SeguimientoTable';
import Alert from './components/Alert';

const Seguimiento: React.FC = () => {
  const { cuestionarios, estadisticas, error, loading, goToDetalle } = useSeguimientoData();

  return (
    <div className={styles.container}>
      <HeaderSection />
      <ResumenGeneral estadisticas={estadisticas} />
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <h5>Cuestionarios</h5>
        </div>
        <div className={styles.cardBody}>
          {loading ? (
            <Alert message="Cargando..." type="info" />
          ) : error ? (
            <Alert message={error} type="error" />
          ) : cuestionarios.length === 0 ? (
            <Alert message="Sin cuestionarios disponibles." type="info" />
          ) : (
            <SeguimientoTable cuestionarios={cuestionarios} onDetalle={goToDetalle} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Seguimiento;
