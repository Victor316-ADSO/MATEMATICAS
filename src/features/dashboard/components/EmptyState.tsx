/**
 * EmptyState - Componente para mostrar estados vacíos contextualmente
 * 
 * Propósito:
 * - Muestra mensajes apropiados cuando no hay datos que mostrar
 * - Maneja diferentes tipos de estados vacíos ("mis" y "abiertos")
 * - Incluye acciones contextuales (ej: botón "Crear primer cuestionario")
 * - Mejora la experiencia del usuario con mensajes informativos
 * 
 * Beneficios:
 * - Centraliza el manejo de estados vacíos
 * - Proporciona feedback claro al usuario sobre por qué no ve contenido
 * - Reutilizable en otros componentes que necesiten mostrar estados vacíos
 * - Fácil de personalizar para diferentes contextos
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Principal.module.css';

interface EmptyStateProps {
  tipo: 'mis' | 'abiertos';
}

const EmptyState: React.FC<EmptyStateProps> = ({ tipo }) => {
  const navigate = useNavigate();

  const renderMisCuestionariosEmpty = () => (
    <div className={styles.emptyMessage}>
      <p>No has creado ningún cuestionario aún.</p>
      <button 
        onClick={() => navigate('/crear-cuestionario')} 
        className={styles.crearBtn}
        style={{ maxWidth: '250px', margin: '1rem auto 0' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Crear mi primer cuestionario
      </button>
    </div>
  );

  const renderAbiertosEmpty = () => (
    <div className={styles.emptyMessage}>
      <p>No hay cuestionarios abiertos.</p>
    </div>
  );

  return tipo === 'mis' ? renderMisCuestionariosEmpty() : renderAbiertosEmpty();
};

export default EmptyState; 