/**
 * CuestionarioCard - Componente modular para mostrar tarjetas de cuestionarios
 * 
 * Propósito:
 * - Renderiza una tarjeta individual de cuestionario con toda su información
 * - Maneja dos tipos: "mis" cuestionarios y cuestionarios "abiertos"
 * - Incluye todas las acciones específicas para cada tipo (ver, apertura, copiar, etc.)
 * - Reutilizable en toda la aplicación donde se necesiten mostrar cuestionarios
 * 
 * Beneficios:
 * - Separa la lógica de renderizado de tarjetas del componente principal
 * - Permite diferentes layouts según el tipo de cuestionario
 * - Fácil de mantener y testear independientemente
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Principal.module.css';

interface Cuestionario {
  id: number;
  titulo: string;
  descripcion: string;
  usuario_creador: number;
  id_asignacion?: number;
  periodo_nombre?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  apertura_id?: number;
  creador_nombre?: string;
  programa_nombre?: string;
  cuestionario_id?: number;
}

interface CuestionarioCardProps {
  cuestionario: Cuestionario;
  tipo: 'mis' | 'abiertos';
  onAperturaClick?: (id: number, titulo: string) => void;
  onCerrarApertura?: (aperturaId: number, titulo: string) => void;
}

const CuestionarioCard: React.FC<CuestionarioCardProps> = ({
  cuestionario,
  tipo,
  onAperturaClick,
  onCerrarApertura
}) => {
  const navigate = useNavigate();

  const isAvailable = (fechaInicio?: string | null, fechaFin?: string | null) => {
    const now = new Date();
    const start = fechaInicio ? new Date(fechaInicio) : null;
    const end = fechaFin ? new Date(fechaFin) : null;

    if (start && now < start) {
      return {
        available: false,
        status: 'programado',
        message: `Disponible a partir de: ${start.toLocaleDateString()} ${start.toLocaleTimeString()}`,
      };
    }

    if (end && now > end) {
      return {
        available: false,
        status: 'expirado',
        message: `Expiró el: ${end.toLocaleDateString()} ${end.toLocaleTimeString()}`,
      };
    }

    return {
      available: true,
      status: 'disponible',
      message: start && end 
        ? `Disponible hasta: ${end.toLocaleDateString()} ${end.toLocaleTimeString()}`
        : 'Disponible',
    };
  };

  const renderMisCuestionarios = () => (
    <div className={styles.cuestionarioCard}>
      <h4>{cuestionario.titulo || 'Sin título'}</h4>
      <p>{cuestionario.descripcion || 'Sin descripción'}</p>
      <small>ID: {cuestionario.id}</small>
      <div className={styles.cuestionarioActions}>
        <button
          onClick={() => navigate(`/ver/${cuestionario.id}`)}
          className={styles.verBtn}
        >
          Ver
        </button>
        <button 
          onClick={() => onAperturaClick?.(cuestionario.id, cuestionario.titulo)}
          className={styles.aperturaBtn}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Apertura
        </button>
      </div>
    </div>
  );

  const renderCuestionariosAbiertos = () => {
    return (
      <div className={styles.cuestionarioCard}>
        <h4>{cuestionario.titulo || 'Sin título'}</h4>
        <p>{cuestionario.descripcion || 'Sin descripción'}</p>
        
        <div className={styles.cuestionarioInfo}>
          <div className={styles.infoItem}>
            <i className="fas fa-user"></i> Creado por: {cuestionario.creador_nombre || 'Desconocido'}
          </div>
          <div className={styles.infoItem}>
            <i className="fas fa-graduation-cap"></i> Programa: {cuestionario.programa_nombre || 'No especificado'}
          </div>
        </div>

        <div className={styles.periodoInfo}>
          <span className={styles.periodoTag}>Periodo: {cuestionario.periodo_nombre || 'No especificado'}</span>
          <div className={styles.fechasContainer}>
            <span className={styles.fechaTag}>
              <i className="fas fa-calendar-day"></i> Desde: {cuestionario.fecha_inicio ? new Date(cuestionario.fecha_inicio).toLocaleDateString() : 'No especificado'}
            </span>
            <span className={styles.fechaTag}>
              <i className="fas fa-calendar-check"></i> Hasta: {cuestionario.fecha_fin ? new Date(cuestionario.fecha_fin).toLocaleDateString() : 'No especificado'}
            </span>
          </div>
        </div>
        
        <div className={styles.cuestionarioActions}>
          <button
            onClick={() => navigate(`/ver/${cuestionario.cuestionario_id || cuestionario.id}`)}
            className={styles.verBtn}
          >
            <i className="fas fa-eye"></i> Ver
          </button>
          <button
            className={styles.gestionarBtn}
            onClick={() => navigate(`/asignacion/${cuestionario.cuestionario_id || cuestionario.id}`)}
          >
            <i className="fas fa-users"></i> Asignaciones
          </button>
          <button
            className={styles.cerrarBtn}
            onClick={() => onCerrarApertura?.(cuestionario.apertura_id || cuestionario.id, cuestionario.titulo || 'Este cuestionario')}
          >
            <i className="fas fa-times-circle"></i> Cerrar
          </button>
        </div>
      </div>
    );
  };

  return tipo === 'mis' ? renderMisCuestionarios() : renderCuestionariosAbiertos();
};

export default CuestionarioCard; 