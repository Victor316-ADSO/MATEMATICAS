/**
 * AlertMessage - Componente para mostrar notificaciones y alertas
 * 
 * Propósito:
 * - Muestra mensajes de éxito, error y advertencia de forma consistente
 * - Maneja el auto-cierre de mensajes después de un tiempo determinado
 * - Proporciona botón de cierre manual para el usuario
 * - Reutilizable en toda la aplicación para feedback al usuario
 * 
 * Beneficios:
 * - Centraliza el diseño y comportamiento de alertas
 * - Evita duplicación de código para mostrar mensajes
 * - Mantiene consistencia visual en todas las notificaciones
 * - Fácil de personalizar y extender para nuevos tipos de alerta
 */

import React from 'react';
import styles from '../Apertura.module.css';

interface AlertMessageProps {
  mensaje: {
    texto: string;
    tipo: 'success' | 'danger' | 'warning' | '';
  };
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ mensaje, onClose }) => {
  if (!mensaje.texto) return null;

  return (
    <div className={`${styles.alert} ${styles[`alert${mensaje.tipo.charAt(0).toUpperCase() + mensaje.tipo.slice(1)}`]}`}>
      {mensaje.texto}
      <button 
        className={styles.closeButton} 
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default AlertMessage; 