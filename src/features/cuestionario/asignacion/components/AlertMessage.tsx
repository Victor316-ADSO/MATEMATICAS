/**
 * AlertMessage - Componente para mostrar notificaciones y alertas en Asignacion
 * 
 * Propósito:
 * - Muestra mensajes de éxito, error y advertencia de forma consistente
 * - Maneja el cierre manual de mensajes por parte del usuario
 * - Proporciona feedback visual claro durante operaciones de asignación
 * - Reutilizable en toda la aplicación para feedback al usuario
 * 
 * Beneficios:
 * - Centraliza el diseño y comportamiento de alertas
 * - Evita duplicación de código para mostrar mensajes
 * - Mantiene consistencia visual en todas las notificaciones
 * - Fácil de personalizar y extender para nuevos tipos de alerta
 */

import React from 'react';
import styles from '../Asignacion.module.css';

interface AlertMessageProps {
  mensaje: {
    texto: string;
    tipo: 'success' | 'danger' | 'warning';
  } | null;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ mensaje, onClose }) => {
  if (!mensaje) return null;

  return (
    <div className={`${styles.alert} ${styles[`alert${mensaje.tipo}`]}`}>
      {mensaje.texto}
      <button onClick={onClose} className={styles.closeBtn}>×</button>
    </div>
  );
};

export default AlertMessage; 