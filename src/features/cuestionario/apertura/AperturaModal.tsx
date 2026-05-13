import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import styles from './AperturaModal.module.css';
import useAuth from '../../../hooks/useAuth';

interface Cuestionario {
  id: number;
  cuestionario_id: number;
  titulo: string;
  descripcion: string;
  programa_nombre: string;
}

interface Periodo {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface AperturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuestionarioId?: number;
  cuestionarioTitulo?: string;
  onSuccess?: () => void;
}

const AperturaModal = ({ isOpen, onClose, cuestionarioId, cuestionarioTitulo, onSuccess }: AperturaModalProps) => {
  const { user } = useAuth();
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      cargarPeriodos();
    }
  }, [isOpen, user?.id]);

  const cargarPeriodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/cuestionario-api/api/apertura_api.php?usuario_id=${user?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          accion: 'cargar_datos',
          usuario_id: user?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const datos = await response.json();

      if (datos.success) {
        setPeriodos(datos.periodos || []);
      } else {
        throw new Error(datos.error || 'Error al cargar los datos');
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al cargar los datos'
      });
    } finally {
      setLoading(false);
    }
  };

  const crearApertura = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!periodoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor selecciona un periodo'
      });
      return;
    }

    if (!cuestionarioId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar la información del cuestionario'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost/cuestionario-api/api/apertura_api.php?usuario_id=${user?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          accion: 'crear_apertura',
          cuestionario_id: cuestionarioId,
          periodo_id: periodoSeleccionado,
          usuario_id: user?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const datos = await response.json();

      if (datos.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Apertura creada correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        
        setPeriodoSeleccionado('');
        onSuccess?.();
        onClose();
      } else {
        throw new Error(datos.error || 'Error al crear la apertura');
      }
    } catch (error) {
      console.error('Error al crear apertura:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al crear la apertura'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Abrir Cuestionario
          </h3>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.spinner}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <p>Cargando...</p>
            </div>
          ) : (
            <form onSubmit={crearApertura}>
              <div className={styles.formGroup}>
                <label>Cuestionario Seleccionado</label>
                {cuestionarioId ? (
                  <div className={styles.cuestionarioInfo}>
                    <div className={styles.cuestionarioCard}>
                      <h4>{cuestionarioTitulo || 'Cuestionario'}</h4>
                      <span className={styles.cuestionarioId}>ID: {cuestionarioId}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.loadingCuestionario}>
                    <span>Cargando información del cuestionario...</span>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="periodo_id">Período</label>
                <select 
                  id="periodo_id" 
                  value={periodoSeleccionado}
                  onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                  required
                  className={styles.selectField}
                >
                  <option value="">Seleccionar período</option>
                  {periodos.map((periodo) => (
                    <option key={periodo.id} value={periodo.id}>
                      {periodo.nombre} ({formatearFecha(periodo.fecha_inicio)} - {formatearFecha(periodo.fecha_fin)})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  onClick={onClose}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading || !cuestionarioId}
                >
                  {loading ? 'Creando...' : 'Crear Apertura'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AperturaModal; 