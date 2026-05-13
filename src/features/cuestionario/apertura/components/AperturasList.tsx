/**
 * AperturasList - Componente para mostrar la lista/tabla de aperturas existentes
 * 
 * Propósito:
 * - Muestra todas las aperturas de cuestionarios en formato tabla
 * - Incluye información detallada: título, programa, periodo, fechas
 * - Proporciona acciones para cada apertura (asignar, eliminar)
 * - Maneja el estado vacío cuando no hay aperturas
 * 
 * Beneficios:
 * - Separación clara de la lógica de visualización de aperturas
 * - Reutilizable en otras partes que necesiten listar aperturas
 * - Fácil de mantener y testear independientemente
 * - Acciones centralizadas y consistentes para cada apertura
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Apertura.module.css';
import EmptyAperturas from './EmptyAperturas';

interface Apertura {
  id: number;
  titulo: string;
  descripcion: string;
  programa_nombre: string;
  periodo_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface AperturasListProps {
  aperturas: Apertura[];
  onEliminarApertura: (aperturaId: number) => void;
  formatearFecha: (fecha: string) => string;
}

const AperturasList: React.FC<AperturasListProps> = ({
  aperturas,
  onEliminarApertura,
  formatearFecha
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.listCard}>
      <div className={styles.cardHeader}>
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          Cuestionarios Abiertos
        </h3>
      </div>
      <div className={styles.cardBody}>
        {aperturas.length === 0 ? (
          <EmptyAperturas />
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cuestionario</th>
                  <th>Programa</th>
                  <th>Periodo</th>
                  <th>Fechas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {aperturas.map((apertura) => (
                  <tr key={apertura.id}>
                    <td>{apertura.titulo}</td>
                    <td>{apertura.programa_nombre}</td>
                    <td>{apertura.periodo_nombre}</td>
                    <td>{formatearFecha(apertura.fecha_inicio)} - {formatearFecha(apertura.fecha_fin)}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.assignButton}
                          onClick={() => navigate(`/asignacion/${apertura.id}`)}
                          title="Asignar a estudiantes"
                        >
                          <i className="fas fa-user-plus"></i>
                        </button>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => onEliminarApertura(apertura.id)}
                          title="Eliminar apertura"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AperturasList; 