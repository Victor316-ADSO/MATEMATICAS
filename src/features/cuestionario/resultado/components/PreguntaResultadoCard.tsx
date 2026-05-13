/**
 * PreguntaResultadoCard - Componente para mostrar una pregunta individual en el resultado
 *
 * Propósito:
 * - Renderiza el texto, imagen, respuesta del usuario y correcta
 * - Muestra feedback visual de correcto/incorrecto
 *
 * Beneficios:
 * - Reutilizable para cualquier revisión de cuestionario
 * - Separación clara de la lógica de pregunta
 * - Fácil de testear y mantener
 */

import React from 'react';
import styles from '../Resultado.module.css';
import type { ResultadoDetalle } from '../types';

interface PreguntaResultadoCardProps {
  detalle: ResultadoDetalle;
  index: number;
  getImageUrl: (tipo: 'pregunta' | 'opcion', id: number) => string;
}

const PreguntaResultadoCard: React.FC<PreguntaResultadoCardProps> = ({ detalle, index, getImageUrl }) => (
  <div className={`${styles.preguntaCard} ${detalle.usuario_correcto ? styles.preguntaCardCorrect : styles.preguntaCardIncorrect}`}>
    <div className={`${styles.preguntaHeader} ${detalle.usuario_correcto ? styles.preguntaHeaderCorrect : styles.preguntaHeaderIncorrect}`}>
      <h4 className={styles.preguntaTitle}>Pregunta {index + 1}</h4>
      <div className={styles.preguntaInfo}>
        <span className={styles.preguntaBadge}>Valor: {Number(detalle.peso_pregunta).toFixed(2)} puntos</span>
        <span className={styles.preguntaBadge}>{detalle.usuario_correcto ? 'Correcta ✓' : 'Incorrecta ✗'}</span>
      </div>
    </div>
    <div className={styles.preguntaContent}>
      <p className={styles.preguntaTexto}>{detalle.texto_pregunta}</p>
      {detalle.imagen_pregunta && (
        <div>
          <img
            src={getImageUrl('pregunta', detalle.pregunta_id)}
            alt="Imagen de la pregunta"
            className={styles.imagen}
          />
        </div>
      )}
      <div className={styles.respuestasGrid}>
        <div className={`${styles.respuestaCard} ${detalle.usuario_correcto ? styles.respuestaCorrect : styles.respuestaIncorrect}`}>
          <span className={`${styles.respuestaLabel} ${detalle.usuario_correcto ? styles.respuestaLabelCorrect : styles.respuestaLabelIncorrect}`}>
            Tu respuesta:
          </span>
          <p className={styles.respuestaTexto}>{detalle.respuesta_usuario}</p>
          {detalle.imagen_respuesta_usuario && (
            <div>
              <img
                src={getImageUrl('opcion', detalle.opcion_seleccionada_id)}
                alt="Imagen de tu respuesta"
                className={styles.imagenOpcion}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default PreguntaResultadoCard; 