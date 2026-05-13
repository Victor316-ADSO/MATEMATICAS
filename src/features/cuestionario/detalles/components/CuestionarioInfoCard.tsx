/**
 * CuestionarioInfoCard - Componente para información del cuestionario en detalle
 * 
 * Propósito:
 * - Muestra información completa del cuestionario de manera organizada
 * - Incluye título, descripción, programa, período y fechas
 * - Integra la sección de progreso con estadísticas
 * - Proporciona una vista consolidada y atractiva
 * 
 * Beneficios:
 * - Separación clara de la información vs estadísticas
 * - Reutilizable en otros contextos de detalle
 * - Diseño consistente y profesional
 * - Fácil de mantener y actualizar
 */

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import ProgressSection from './ProgressSection';
import type { Cuestionario, ProgressInfo } from '../types';
import styles from '../Detalles.module.css';

interface CuestionarioInfoCardProps {
  cuestionario: Cuestionario;
  progressInfo: ProgressInfo;
}

const CuestionarioInfoCard: React.FC<CuestionarioInfoCardProps> = ({
  cuestionario,
  progressInfo
}) => {
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className={styles.mainCard}>
      <div className={styles.cardHeader}>
        <h5><FaInfoCircle size={14} /> Información</h5>
      </div>
      <div className={styles.cardBody}>
        <h4>{cuestionario.titulo}</h4>
        <p className={styles.description}>{cuestionario.descripcion}</p>
        
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <strong>Programa:</strong> {cuestionario.programa_nombre}
          </div>
          <div className={styles.infoItem}>
            <strong>Periodo:</strong> {cuestionario.periodo_nombre}
          </div>
          <div className={styles.infoItem}>
            <strong>Fechas:</strong> {formatearFecha(cuestionario.fecha_inicio)} - {formatearFecha(cuestionario.fecha_fin)}
          </div>
        </div>

        <ProgressSection progressInfo={progressInfo} />
      </div>
    </div>
  );
};

export default CuestionarioInfoCard; 