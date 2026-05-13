import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaTimes, FaUser, FaGraduationCap, FaCalendarAlt, FaCalendarDay, FaCalendarCheck } from 'react-icons/fa';
import styles from '../Usuario.module.css';

interface CuestionarioEstudiante {
  cuestionario_id: number;
  titulo: string;
  descripcion: string;
  creador_nombre: string;
  programa_nombre: string;
  periodo_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: number;
  asignacion_id: number;
  estado: 'disponible' | 'completado' | 'programado' | 'expirado' | 'cerrado';
}

interface CuestionarioEstudianteCardProps {
  cuestionario: CuestionarioEstudiante;
}

const CuestionarioEstudianteCard: React.FC<CuestionarioEstudianteCardProps> = ({
  cuestionario
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return {
          className: styles.estadoDisponible,
          icon: 'fas fa-check-circle',
          text: 'Disponible',
          action: 'Ir al cuestionario'
        };
      case 'completado':
        return {
          className: styles.estadoCompletado,
          icon: 'fas fa-check-double',
          text: 'Completado',
          action: 'Ver Resultado'
        };
      case 'programado':
        return {
          className: styles.estadoProgramado,
          icon: 'fas fa-clock',
          text: 'Programado',
          action: 'Próximamente'
        };
      case 'expirado':
        return {
          className: styles.estadoExpirado,
          icon: 'fas fa-times-circle',
          text: 'Expirado',
          action: 'No disponible'
        };
      case 'cerrado':
        return {
          className: styles.estadoCerrado,
          icon: 'fas fa-lock',
          text: 'Cerrado',
          action: 'No disponible'
        };
      default:
        return {
          className: styles.estadoDesconocido,
          icon: 'fas fa-question-circle',
          text: 'Desconocido',
          action: 'No disponible'
        };
    }
  };

  const handleAction = () => {
    switch (cuestionario.estado) {
      case 'disponible':
        setShowModal(true);
        break;
      case 'completado':
        navigate(`/resultado/${cuestionario.cuestionario_id}`);
        break;
      default:
        // No hacer nada para otros estados
        break;
    }
  };

  const handleIrAlCuestionario = () => {
    setShowModal(false);
    navigate(`/realizar-cuestionario/${cuestionario.cuestionario_id}`);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
  };

  const estadoInfo = getEstadoInfo(cuestionario.estado);
  const isActionable = cuestionario.estado === 'disponible' || cuestionario.estado === 'completado';

  return (
    <>
      <div className={`${styles.cuestionarioCard} ${styles[`estado${cuestionario.estado.charAt(0).toUpperCase() + cuestionario.estado.slice(1)}`]}`}>
        <div className={styles.cardContent}>
          <div className={styles.cardMainInfo}>
            <div className={styles.cardHeader}>
              <h4>{cuestionario.titulo}</h4>
            </div>
            
            <div className={styles.cardDetails}>
              <div className={styles.cardInfo}>
                <div className={styles.infoRow}>
                  <i className="fas fa-graduation-cap"></i>
                  <span><strong>Programa:</strong> {cuestionario.programa_nombre}</span>
                </div>
              </div>

              <div className={styles.cardFechas}>
                <div className={styles.fechaItem}>
                  <i className="fas fa-calendar-alt"></i>
                  <span><strong>Fechas:</strong> {new Date(cuestionario.fecha_inicio).toLocaleDateString()} - {new Date(cuestionario.fecha_fin).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cardActions}>
            <div className={styles.periodoInfo}>
              <div className={styles.infoRow}>
                <i className="fas fa-calendar-alt"></i>
                <span><strong>Periodo:</strong> {cuestionario.periodo_nombre}</span>
              </div>
            </div>
            
            <button
              onClick={handleAction}
              className={`${styles.actionButton} ${isActionable ? styles.actionButtonActive : styles.actionButtonDisabled}`}
              disabled={!isActionable}
            >
              {cuestionario.estado === 'disponible' ? (
                <>
                  {estadoInfo.action} <FaArrowRight size={12} />
                </>
              ) : (
                <>
                  <i className={estadoInfo.icon}></i>
                  {estadoInfo.action}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de información del cuestionario */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCerrarModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Información del Cuestionario</h3>
              <button className={styles.modalCloseButton} onClick={handleCerrarModal}>
                <FaTimes size={16} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <h4>{cuestionario.titulo}</h4>
              <p className={styles.modalDescription}>
                {cuestionario.descripcion || 'Sin descripción'}
              </p>
              
              <div className={styles.modalInfo}>
                <div className={styles.modalInfoRow}>
                  <FaUser size={14} />
                  <span><strong>Docente:</strong> {cuestionario.creador_nombre}</span>
                </div>
                <div className={styles.modalInfoRow}>
                  <FaGraduationCap size={14} />
                  <span><strong>Programa:</strong> {cuestionario.programa_nombre}</span>
                </div>
                <div className={styles.modalInfoRow}>
                  <FaCalendarAlt size={14} />
                  <span><strong>Periodo:</strong> {cuestionario.periodo_nombre}</span>
                </div>
                <div className={styles.modalInfoRow}>
                  <FaCalendarAlt size={14} />
                  <span><strong>Fechas:</strong> {new Date(cuestionario.fecha_inicio).toLocaleDateString()} - {new Date(cuestionario.fecha_fin).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button className={styles.modalCancelButton} onClick={handleCerrarModal}>
                Cancelar
              </button>
              <button className={styles.modalConfirmButton} onClick={handleIrAlCuestionario}>
                Ir al cuestionario <FaArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CuestionarioEstudianteCard; 