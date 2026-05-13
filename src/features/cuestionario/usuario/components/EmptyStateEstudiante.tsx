import React from 'react';
import styles from '../Usuario.module.css';

interface EmptyStateEstudianteProps {
  tipo: 'disponibles' | 'completados' | 'programados' | 'expirados' | 'cerrados';
}

const EmptyStateEstudiante: React.FC<EmptyStateEstudianteProps> = ({ tipo }) => {
  const getEmptyStateInfo = (tipo: string) => {
    switch (tipo) {
      case 'disponibles':
        return {
          icon: 'fas fa-check-circle',
          title: 'No hay cuestionarios disponibles',
          message: 'No tienes cuestionarios disponibles para realizar en este momento.',
          color: styles.emptyDisponibles
        };
      case 'completados':
        return {
          icon: 'fas fa-check-double',
          title: 'No hay cuestionarios completados',
          message: 'Aún no has completado ningún cuestionario.',
          color: styles.emptyCompletados
        };
      case 'programados':
        return {
          icon: 'fas fa-clock',
          title: 'No hay cuestionarios programados',
          message: 'No tienes cuestionarios programados para el futuro.',
          color: styles.emptyProgramados
        };
      case 'expirados':
        return {
          icon: 'fas fa-times-circle',
          title: 'No hay cuestionarios expirados',
          message: 'No tienes cuestionarios que hayan expirado.',
          color: styles.emptyExpirados
        };
      case 'cerrados':
        return {
          icon: 'fas fa-lock',
          title: 'No hay cuestionarios cerrados',
          message: 'No tienes cuestionarios cerrados por el docente.',
          color: styles.emptyCerrados
        };
      default:
        return {
          icon: 'fas fa-question-circle',
          title: 'Sin cuestionarios',
          message: 'No hay cuestionarios en esta categoría.',
          color: styles.emptyDefault
        };
    }
  };

  const emptyInfo = getEmptyStateInfo(tipo);

  return (
    <div className={`${styles.emptyState} ${emptyInfo.color}`}>
      <div className={styles.emptyIcon}>
        <i className={emptyInfo.icon}></i>
      </div>
      <h3 className={styles.emptyTitle}>{emptyInfo.title}</h3>
      <p className={styles.emptyMessage}>{emptyInfo.message}</p>
    </div>
  );
};

export default EmptyStateEstudiante; 