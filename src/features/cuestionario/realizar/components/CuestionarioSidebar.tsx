import React from 'react';
import { FaCheck, FaCircle, FaLock } from 'react-icons/fa';
import styles from '../RealizarCuestionario.module.css';
import type { Pregunta, RespuestaUsuario } from '../../../../types/cuestionario.types';

interface CuestionarioSidebarProps {
  preguntas: Pregunta[];
  respuestas: RespuestaUsuario;
  paginaActual: number;
  preguntasRespondidas: number;
  isPreguntaBloqueada: (numeroPregunta: number) => boolean;
  onNavigate: (pagina: number) => void;
}

const CuestionarioSidebar: React.FC<CuestionarioSidebarProps> = ({
  preguntas,
  respuestas,
  paginaActual,
  preguntasRespondidas,
  isPreguntaBloqueada,
  onNavigate
}) => {
  const getIcono = (preguntaId: number, isRespondida: boolean, isBloqueada: boolean) => {
    if (isRespondida) {
      return <FaCheck className={styles.miniMapaCheck} />;
    } else if (isBloqueada) {
      return <FaLock className={styles.miniMapaLock} />;
    } else {
      return <FaCircle className={styles.miniMapaCircle} />;
    }
  };

  const getTitulo = (index: number, isBloqueada: boolean) => {
    if (isBloqueada) {
      return `Pregunta ${index + 1} - Bloqueada (responde las anteriores primero)`;
    } else {
      return `Ir a pregunta ${index + 1}`;
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>
          <span className={styles.tituloCompleto}>Navegación del Cuestionario</span>
          <span className={styles.tituloCorto}>Navegación</span>
        </h3>
        {/* <div className={styles.totalRespuestas}>
          <span className={styles.respuestasCount}>{preguntasRespondidas}</span>
          <span className={styles.respuestasTotal}>de {preguntas.length} respondidas</span>
        </div> */}
      </div>
      
      <div className={styles.miniMapa}>
        {preguntas.map((pregunta, index) => {
          const isRespondida = respuestas.hasOwnProperty(pregunta.id);
          const isActual = index + 1 === paginaActual;
          const isBloqueada = isPreguntaBloqueada(index + 1);
          
          return (
            <button
              key={pregunta.id}
              onClick={() => onNavigate(index + 1)}
              className={`${styles.miniMapaItem} ${isActual ? styles.miniMapaActual : ''} ${isRespondida ? styles.miniMapaRespondida : ''} ${isBloqueada ? styles.miniMapaBloqueada : ''}`}
              title={getTitulo(index, isBloqueada)}
              disabled={isBloqueada}
            >
              <span className={styles.miniMapaNumero}>{index + 1}</span>
              {getIcono(pregunta.id, isRespondida, isBloqueada)}
            </button>
          );
        })}
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.leyenda}>
          <div className={styles.leyendaItem}>
            <FaCircle className={styles.leyendaIcono} />
            <span>Disponible</span>
          </div>
          <div className={styles.leyendaItem}>
            <FaCheck className={styles.leyendaIconoCheck} />
            <span>Respondida</span>
          </div>
          <div className={styles.leyendaItem}>
            <FaLock className={styles.leyendaIconoLock} />
            <span>Bloqueada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuestionarioSidebar; 