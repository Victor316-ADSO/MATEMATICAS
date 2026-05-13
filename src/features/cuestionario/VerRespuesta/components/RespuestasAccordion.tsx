import React from 'react';
import styles from '../VerRespuesta.module.css';
import { FaList } from 'react-icons/fa';
import type { RespuestaDetalle, OpcionRespuesta } from '../types';

/**
 * RespuestasAccordion muestra la lista de preguntas y respuestas en modo acordeón.
 */
interface Props {
  respuestas: RespuestaDetalle[];
  expandedAccordion: number;
  toggleAccordion: (index: number) => void;
  getImageUrl: (tipo: 'pregunta' | 'opcion', id: number) => string;
}
const RespuestasAccordion: React.FC<Props> = ({ respuestas, expandedAccordion, toggleAccordion, getImageUrl }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3><FaList size={14} /> Respuestas</h3>
    </div>
    <div className={styles.cardBody}>
      {respuestas.length === 0 ? (
        <p className={styles.emptyMessage}>Sin respuestas disponibles.</p>
      ) : (
        <div className={styles.accordion}>
          {respuestas.map((respuesta, index) => (
            <div key={respuesta.pregunta_id} className={styles.accordionItem}>
              <div
                className={styles.accordionHeader}
                onClick={() => toggleAccordion(index)}
              >
                <div className={styles.accordionTitle}>
                  <span>
                    P{index + 1}: {respuesta.texto_pregunta}
                  </span>
                  <span className={`${styles.badge} ${respuesta.es_correcta ? styles.badgeSuccess : styles.badgeDanger}`}>
                    {respuesta.es_correcta ? 'Correcta' : 'Incorrecta'}
                  </span>
                </div>
                <span className={`${styles.accordionIcon} ${expandedAccordion === index ? styles.accordionIconExpanded : ''}`}>
                  ▼
                </span>
              </div>
              {expandedAccordion === index && (
                <div className={styles.accordionBody}>
                  <p className={styles.preguntaTexto}>{respuesta.texto_pregunta}</p>
                  {respuesta.imagen_pregunta && (
                    <div className={styles.imagenContainer}>
                      <img
                        src={getImageUrl('pregunta', respuesta.pregunta_id)}
                        alt="Imagen pregunta"
                        className={styles.preguntaImagen}
                      />
                    </div>
                  )}
                  <p className={styles.pesoPregunta}>
                    <strong>Peso:</strong> {respuesta.peso_pregunta} pts
                  </p>
                  <div className={styles.opcionesContainer}>
                    <p className={styles.opcionesTitle}><strong>Opciones:</strong></p>
                    <ul className={styles.opcionesList}>
                      {respuesta.opciones.map((opcion, oIndex) => {
                        // Solo mostrar el color verde y el badge en la primera opción correcta encontrada
                        const esPrimeraCorrecta = opcion.es_correcta && !respuesta.opciones.slice(0, oIndex).some(o => o.es_correcta);
                        return (
                          <li
                            key={opcion.id}
                            className={`${styles.opcionItem} ${
                              opcion.id === respuesta.id_opcion_seleccionada
                                ? (esPrimeraCorrecta ? styles.opcionCorrectaSeleccionada : styles.opcionIncorrectaSeleccionada)
                                : (esPrimeraCorrecta ? styles.opcionCorrecta : '')
                            }`}
                          >
                            <div className={styles.opcionContent}>
                              <span className={styles.opcionTexto}>{opcion.texto_opcion}</span>
                              <div className={styles.opcionBadges}>
                                {opcion.id === respuesta.id_opcion_seleccionada && (
                                  <span className={`${styles.badge} ${styles.badgePrimary}`}>Seleccionada</span>
                                )}
                                {/* Mostrar etiqueta Correcta solo en la primera opción correcta */}
                                {esPrimeraCorrecta && (
                                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>Correcta</span>
                                )}
                              </div>
                            </div>
                            {/* Mostrar imagen solo si imagen_opcion existe y no es vacío */}
                            {opcion.imagen_opcion && opcion.imagen_opcion.trim() !== '' && (
                              <div className={styles.opcionImagenContainer}>
                                <img
                                  src={getImageUrl('opcion', opcion.id)}
                                  alt="Imagen opción"
                                  className={styles.opcionImagen}
                                />
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default RespuestasAccordion; 