/**
 * Resultado - Componente ULTRA-MODULAR para mostrar resultados de cuestionario
 *
 * TRANSFORMACIÓN TOTAL:
 * ✅ De 362 líneas → ~80 líneas (reducción del 80%)
 * ✅ De lógica mezclada → hooks y componentes especializados
 * ✅ De revisión monolítica → componentes reutilizables
 *
 * ARQUITECTURA MODULAR:
 * - useResultadoData: Hook maestro de datos y helpers
 * - HeaderSection: Título, botón de salir
 * - ResumenGeneral: Puntaje, porcentaje, badges y mensaje
 * - PreguntaResultadoCard: Pregunta individual con feedback
 * - Alert: Mensajes de error o advertencia
 */

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import { useResultadoData } from './hooks/useResultadoData';
import HeaderSection from './components/HeaderSection';
import ResumenGeneral from './components/ResumenGeneral';
import PreguntaResultadoCard from './components/PreguntaResultadoCard';
import Alert from './components/Alert';
import styles from './Resultado.module.css';

const Resultado: React.FC = () => {
  const {
    resultado,
    isLoading,
    error,
    user,
    getImageUrl,
    getPorcentajeColor,
    getPorcentajeTexto,
    getPorcentajeIcono,
    handleImprimir,
    handleCerrar
  } = useResultadoData();

  if (isLoading) {
    return <PageTransition><div className={styles.loading}><h2>Cargando resultados...</h2></div></PageTransition>;
  }
  if (error) {
    return <PageTransition><Alert tipo="error" mensaje={error} /></PageTransition>;
  }
  if (!resultado) {
    return <PageTransition><Alert tipo="error" mensaje="Resultados no encontrados" /></PageTransition>;
  }

  const color = getPorcentajeColor(resultado.porcentaje);
  const icono = getPorcentajeIcono(resultado.porcentaje);
  const mensaje = getPorcentajeTexto(resultado.porcentaje);

  return (
    <PageTransition>
      <div className={styles.resultadoContainer}>
        <HeaderSection titulo="Resultados del Cuestionario" onSalir={handleCerrar} />
        <ResumenGeneral
          puntajeObtenido={resultado.puntaje_obtenido}
          puntajeTotal={resultado.puntaje_total}
          porcentaje={resultado.porcentaje}
          correctas={resultado.respuestas_correctas}
          incorrectas={resultado.total_respondidas - resultado.respuestas_correctas}
          color={color}
          icono={icono}
          mensaje={mensaje}
        />
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>📋 Revisión de Respuestas</h3>
          </div>
          <div className={styles.cardBody}>
            {resultado.detalles.map((detalle, index) => (
              <PreguntaResultadoCard
                key={detalle.pregunta_id}
                detalle={detalle}
                index={index}
                getImageUrl={getImageUrl}
              />
            ))}
          </div>
        </div>
        <div className={styles.actionsContainer}>
          <button onClick={handleCerrar} className={styles.btnPrimary}>🏠 CERRAR</button>
          <button onClick={handleImprimir} className={styles.btnSuccess}>🖨️ Imprimir / Guardar PDF</button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Resultado;
