import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RealizarCuestionario.module.css';
import PageTransition from '../../../components/PageTransition';
import { useTimer } from './hooks/useTimer';
import { useCuestionarioNavigation } from './hooks/useCuestionarioNavigation';
import { useCuestionarioData } from './hooks/useCuestionarioData';
import CuestionarioHeader from './components/CuestionarioHeader';
import ProgressSection from './components/ProgressSection';
import PreguntaCard from './components/PreguntaCard';
import NavigationActions from './components/NavigationActions';
import CuestionarioSidebar from './components/CuestionarioSidebar';



const RealizarCuestionario: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  // Obtener el ID desde useParams()
  const cuestionarioId = params.id;

  // Hook de datos del cuestionario
  const {
    cuestionario,
    preguntas,
    respuestas,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    getImageUrl,
    isSubmitting
  } = useCuestionarioData({ cuestionarioId });

  // Hook de navegación
  const {
    paginaActual,
    totalPaginas,
    preguntasActuales,
    preguntasRespondidas,
    porcentajeCompletado,
    cambiarPagina,
    irSiguiente,
    irAnterior,
    isPreguntaBloqueada,
    isFirstPage,
    isLastPage,
    canNavigateNext,
    canNavigatePrevious
  } = useCuestionarioNavigation({
    preguntas,
    respuestas,
    preguntasPorPagina: 1
  });

  // Hook del temporizador
  const {
    tiempoRestante,
    tiempoTotalCuestionario,
    formatearTiempo,
    getTimerClass,
    getTimerProgressStyle,
    iniciarTimer,
    resetTimer
  } = useTimer({
    preguntas,
    cuestionario,
    isLoading,
    onTimeUp: handleSubmit
  });

  // Inicializar el temporizador cuando se cargan las preguntas
  useEffect(() => {
    if (preguntas.length > 0 && cuestionario) {
      iniciarTimer();
    }
  }, [preguntas, cuestionario, iniciarTimer]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className={styles.loading}>
          <h2>Cargando cuestionario...</h2>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            className={styles.btnVolver}
            onClick={() => navigate('/dashboard')}
          >
            Volver al Dashboard
          </button>
        </div>
      </PageTransition>
    );
  }

  if (!cuestionario) {
    return (
      <PageTransition>
        <div className={styles.error}>
          <h2>Cuestionario no encontrado</h2>
          <button onClick={() => navigate('/dashboard')} className={styles.btnVolver}>
            Volver al Dashboard
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={styles.realizarCuestionarioContainer}>
        <div className={styles.mainContent}>
          <div className={styles.headerSection}>
            <CuestionarioHeader cuestionario={cuestionario} />
          </div>
          
          <div className={`${styles.sidebar} ${styles.sidebarMobile}`}>
            <CuestionarioSidebar
              preguntas={preguntas}
              respuestas={respuestas}
              paginaActual={paginaActual}
              preguntasRespondidas={preguntasRespondidas}
              isPreguntaBloqueada={isPreguntaBloqueada}
              onNavigate={cambiarPagina}
            />
          </div>

          <div className={styles.progressSection}>
            <ProgressSection
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              tiempoRestante={tiempoRestante}
              formatearTiempo={formatearTiempo}
              getTimerClass={getTimerClass}
              getTimerProgressStyle={getTimerProgressStyle}
            />
          </div>

          <div className={styles.questionSection}>
            {preguntasActuales.map((pregunta) => (
              <PreguntaCard
                key={pregunta.id}
                pregunta={pregunta}
                respuestas={respuestas}
                paginaActual={paginaActual}
                onResponseChange={handleChange}
                getImageUrl={getImageUrl}
              />
            ))}
          </div>

          <div className={styles.actionsSection}>
            <NavigationActions
              isFirstPage={isFirstPage}
              isLastPage={isLastPage}
              canNavigatePrevious={canNavigatePrevious}
              canNavigateNext={canNavigateNext}
              preguntasRespondidas={preguntasRespondidas}
              totalPreguntas={preguntas.length}
              isSubmitting={isSubmitting}
              onPrevious={irAnterior}
              onNext={irSiguiente}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className={`${styles.sidebar} ${styles.sidebarDesktop}`}>
          <CuestionarioSidebar
            preguntas={preguntas}
            respuestas={respuestas}
            paginaActual={paginaActual}
            preguntasRespondidas={preguntasRespondidas}
            isPreguntaBloqueada={isPreguntaBloqueada}
            onNavigate={cambiarPagina}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default RealizarCuestionario;