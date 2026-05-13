  /**
   * EstudiantesTable - Componente para tabla de estudiantes en seguimiento detallado
   * 
   * Propósito:
   * - Renderiza tabla completa de estudiantes con toda su información
   * - Maneja estados de completado/pendiente con badges visuales
   * - Incluye acciones contextuales (ver respuestas)
   * - Formatea fechas y puntajes automáticamente
   * 
   * Beneficios:
   * - Separación clara de la lógica de tabla
   * - Reutilizable en otros contextos de seguimiento
   * - Formateo consistente de datos
   * - Manejo elegante de estados vacíos
   */

  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import { FaUsers, FaEye, FaEyeSlash } from 'react-icons/fa';
  import type { Estudiante } from '../types';
  import styles from '../Detalles.module.css';

  interface EstudiantesTableProps {
    estudiantes: Estudiante[];
    cuestionarioId?: number;
    formatearFecha?: (fecha: string | null) => string;
  }

  const EstudiantesTable: React.FC<EstudiantesTableProps> = ({
    estudiantes,
    cuestionarioId,
    formatearFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString() : '-'
  }) => {
    const navigate = useNavigate();

    const handleVerRespuestas = (estudianteId: number) => {
      if (cuestionarioId) {
        navigate(`/ver-respuesta/${estudianteId}/${cuestionarioId}`);
      }
    };

    const formatearPuntaje = (estudiante: Estudiante): string => {
      if (!estudiante.completado) return '-';
      return `${estudiante.puntaje_obtenido}/${estudiante.puntaje_total} (${estudiante.porcentaje}%)`;
    };

    const getBadgeClass = (completado: boolean): string => {
      return `${styles.badge} ${completado ? styles.success : styles.warning}`;
    };

    const getEstadoTexto = (completado: boolean): string => {
      return completado ? 'Completado' : 'Pendiente';
    };

    const getActionButtonClass = (completado: boolean): string => {
      return `${styles.actionButton} ${completado ? styles.info : styles.disabled}`;
    };

    if (estudiantes.length === 0) {
      return (
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h5><FaUsers size={14} /> Estudiantes</h5>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.emptyMessage}>
              Sin estudiantes asignados.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <h5><FaUsers size={14} /> Estudiantes</h5>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Puntaje</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((estudiante) => (
                  <tr key={estudiante.id}>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.identificacion}</td>
                    <td>{estudiante.email}</td>
                    <td>
                      <span className={getBadgeClass(estudiante.completado)}>
                        {getEstadoTexto(estudiante.completado)}
                      </span>
                    </td>
                    <td>
                      {formatearFecha(estudiante.fecha_respuesta)}
                    </td>
                    <td>
                      {formatearPuntaje(estudiante)}
                    </td>
                    <td>
                      {estudiante.completado ? (
                        <button
                          className={getActionButtonClass(true)}
                          onClick={() => handleVerRespuestas(estudiante.id)}
                          title="Ver respuestas"
                          type="button"
                        >
                          <FaEye size={12} /> Ver
                        </button>
                      ) : (
                        <button 
                          className={getActionButtonClass(false)} 
                          disabled 
                          title="Sin respuestas"
                          type="button"
                        >
                          <FaEyeSlash size={12} /> N/A
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  export default EstudiantesTable; 