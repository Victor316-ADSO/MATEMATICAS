/**
 * HeaderSection - Componente para el header de RealizarCuestionario
 *
 * Propósito:
 * - Muestra el título, metadatos del cuestionario y el timer
 * - Mantiene consistencia visual con otros headers
 * - Encapsula la lógica de navegación y temporizador
 *
 * Beneficios:
 * - Reutilizable en otras páginas
 * - Navegación y timer centralizados
 * - Fácil personalización de metadatos
 */

import React from 'react';
import styles from '../RealizarCuestionario.module.css';

interface HeaderSectionProps {
  titulo: string;
  creador: string;
  programa: string;
  nivel: string;
  tiempoRestante: number;
  formatTiempo: (segundos: number) => string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  titulo,
  creador,
  programa,
  nivel,
  tiempoRestante,
  formatTiempo
}) => (
  <div className={styles.header}>
    <div className={styles.headerInfo}>
      <h2>{titulo}</h2>
      <div className={styles.metadataItem}><strong>Docente:</strong> {creador}</div>
      <div className={styles.metadataItem}><strong>Programa:</strong> {programa}</div>
      <div className={styles.metadataItem}><strong>Nivel:</strong> {nivel}</div>
    </div>
    <div className={styles.timerCircle}>
      {formatTiempo(tiempoRestante)}
    </div>
  </div>
);

export default HeaderSection; 