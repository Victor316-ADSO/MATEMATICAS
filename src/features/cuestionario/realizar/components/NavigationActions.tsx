import React from 'react';
import styles from '../RealizarCuestionario.module.css';

interface NavigationActionsProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  canNavigatePrevious: boolean;
  canNavigateNext: boolean;
  preguntasRespondidas: number;
  totalPreguntas: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => Promise<void>;
}

const NavigationActions: React.FC<NavigationActionsProps> = ({
  isFirstPage,
  isLastPage,
  canNavigatePrevious,
  canNavigateNext,
  preguntasRespondidas,
  totalPreguntas,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}) => {
  const todasRespondidas = preguntasRespondidas >= totalPreguntas;

  return (
    <div className={styles.actions}>
      <button 
        onClick={onPrevious}
        disabled={!canNavigatePrevious}
        className={styles.btnPaginacion}
      >
        Anterior
      </button>
      
      {isLastPage ? (
        <button 
          onClick={onSubmit}
          disabled={!todasRespondidas || isSubmitting}
          className={`${styles.btnEnviar} ${(!todasRespondidas || isSubmitting) ? styles.btnDisabled : ''}`}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Cuestionario'}
        </button>
      ) : (
        <button 
          onClick={onNext}
          disabled={!canNavigateNext}
          className={styles.btnPaginacion}
        >
          Siguiente
        </button>
      )}
    </div>
  );
};

export default NavigationActions; 