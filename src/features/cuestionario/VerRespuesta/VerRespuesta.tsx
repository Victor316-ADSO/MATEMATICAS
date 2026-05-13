import React from 'react';
import PageTransition from '../../../components/PageTransition';
import { useVerRespuestaData } from './hooks/useVerRespuestaData';
import HeaderSection from './components/HeaderSection';
import InfoCard from './components/InfoCard';
import ResumenPuntaje from './components/ResumenPuntaje';
import RespuestasAccordion from './components/RespuestasAccordion';
import Alert from './components/Alert';
import Loading from './components/Loading';
import styles from './VerRespuesta.module.css';

const VerRespuesta: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    expandedAccordion,
    handleVolver,
    toggleAccordion,
    getImageUrl,
    getPorcentajeColor
  } = useVerRespuestaData();

  if (isLoading) {
    return (
      <PageTransition>
        <Loading />
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <Alert message={error} type="error" onVolver={handleVolver} />
      </PageTransition>
    );
  }

  if (!data) {
    return (
      <PageTransition>
        <Alert message="No se encontraron respuestas para este estudiante." type="info" onVolver={handleVolver} />
      </PageTransition>
    );
  }

  const { estudiante, cuestionario, estadisticas, respuestas } = data;

  return (
    <PageTransition>
      <div className={styles.verRespuestaContainer}>
        <HeaderSection onVolver={handleVolver} usuario={estudiante.nombre} />
        <div className={styles.mainContainer}>
          <InfoCard estudiante={estudiante} cuestionario={cuestionario} estadisticas={estadisticas}>
            <ResumenPuntaje estadisticas={estadisticas} getPorcentajeColor={getPorcentajeColor} />
          </InfoCard>
          <RespuestasAccordion
            respuestas={respuestas}
            expandedAccordion={expandedAccordion}
            toggleAccordion={toggleAccordion}
            getImageUrl={getImageUrl}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default VerRespuesta;
