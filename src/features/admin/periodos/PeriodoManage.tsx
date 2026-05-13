import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './PeriodoManage.module.css';

interface Periodo {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

const PeriodoManage = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [periodoEditar, setPeriodoEditar] = useState<Periodo | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'danger' | 'warning' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    cargarPeriodos();
  }, []);

  const abrirModalCrear = () => {
    setPeriodoEditar(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (periodo: Periodo) => {
    setPeriodoEditar(periodo);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setPeriodoEditar(null);
    formRef.current?.reset();
  };

  const cargarPeriodos = async () => {
    try {
      const usuarioJSON = localStorage.getItem('usuario');
      const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
      const usuarioId = usuario?.id || '';
      
      if (!usuarioId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.'
        });
        return;
      }
      
      const response = await fetch(`http://localhost/cuestionario-api/api/periodoManage_api.php?usuario_id=${usuarioId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error al cargar los periodos');

      const data = await response.json();
      if (data.success) {
        setPeriodos(data.periodos || []);
      } else {
        throw new Error(data.error || 'Error al cargar los periodos');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al cargar los periodos'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const usuarioJSON = localStorage.getItem('usuario');
      const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
      const usuarioId = usuario?.id || '';
      
      const response = await fetch(`http://localhost/cuestionario-api/api/periodoManage_api.php?usuario_id=${usuarioId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          action: periodoEditar ? 'edit' : 'create',
          id: periodoEditar?.id,
          nombre: formData.get('nombre'),
          fecha_inicio: formData.get('fecha_inicio'),
          fecha_fin: formData.get('fecha_fin'),
          usuario_id: usuarioId
        })
      });

      if (!response.ok) throw new Error('Error al procesar la solicitud');

      const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: data.message,
          timer: 1500,
          showConfirmButton: false
        });
        setPeriodoEditar(null);
        formRef.current?.reset();
        setModalOpen(false);
        cargarPeriodos();
      } else {
        throw new Error(data.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al procesar la solicitud'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const usuarioJSON = localStorage.getItem('usuario');
        const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
        const usuarioId = usuario?.id || '';
        
        const response = await fetch(`http://localhost/cuestionario-api/api/periodoManage_api.php?usuario_id=${usuarioId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include',
          body: JSON.stringify({
            action: 'delete',
            id: id,
            usuario_id: usuarioId
          })
        });

        const data = await response.json();
        
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: data.message,
            timer: 1500,
            showConfirmButton: false
          });
          cargarPeriodos();
        } else {
          if (data.error && data.error.includes('está siendo utilizado')) {
            Swal.fire({
              icon: 'warning',
              title: 'No se puede eliminar',
              text: 'Este periodo está en uso en asignaciones o cuestionarios.',
              confirmButtonText: 'Entendido'
            });
          } else {
            throw new Error(data.error || 'Error al eliminar el periodo');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al eliminar el periodo'
      });
    }
  };

  return (
    <div className={styles.periodoManageRoot}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2><i className="fas fa-calendar-alt"></i> Periodos</h2>
          <button 
            onClick={abrirModalCrear}
            className={styles.btnCrear}
          >
            <i className="fas fa-plus"></i>
            Crear Período
          </button>
        </div>

        {mensaje && (
          <div className={`${styles.alert} ${styles[`alert${mensaje.tipo}`]}`}>
            {mensaje.texto}
            <button onClick={() => setMensaje(null)} className={styles.closeBtn}>×</button>
          </div>
        )}

        {/* Lista de Periodos */}
        <div className={styles.listSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h5><i className="fas fa-list"></i> Periodos Existentes</h5>
            </div>
            <div className={styles.cardBody}>
              {periodos.length === 0 ? (
                <p className={styles.emptyMessage}>No hay periodos registrados.</p>
              ) : (
                <div className={styles.tableResponsive}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {periodos.map(periodo => (
                        <tr key={periodo.id}>
                          <td>{periodo.nombre}</td>
                          <td>{periodo.fecha_inicio}</td>
                          <td>{periodo.fecha_fin}</td>
                          <td>
                            <button
                              onClick={() => abrirModalEditar(periodo)}
                              className={styles.btnEdit}
                              title="Editar periodo"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(periodo.id)}
                              className={styles.btnDelete}
                              title="Eliminar periodo"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Crear/Editar Período */}
      {modalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cerrarModal();
            }
          }}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className={`fas ${periodoEditar ? 'fa-edit' : 'fa-plus'}`}></i>
                {periodoEditar ? 'Editar Período' : 'Crear Nuevo Período'}
              </h3>
              <button 
                onClick={cerrarModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                type="button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ padding: '2rem' }}>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="nombre" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    Nombre del Período *
                  </label>
                  <input
                    placeholder='Ejemplo: 2025-G'
                    maxLength={6}
                    type="text"
                    id="nombre"
                    name="nombre"
                    defaultValue={periodoEditar?.nombre || ''}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'white',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="fecha_inicio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    id="fecha_inicio"
                    name="fecha_inicio"
                    defaultValue={periodoEditar?.fecha_inicio || ''}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'white',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="fecha_fin" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    id="fecha_fin"
                    name="fecha_fin"
                    defaultValue={periodoEditar?.fecha_fin || ''}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'white',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'flex-end',
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button 
                    type="button" 
                    onClick={cerrarModal}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: '100px',
                      background: '#f3f4f6',
                      color: '#374151'
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: '100px',
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        {periodoEditar ? ' Actualizando...' : ' Creando...'}
                      </>
                    ) : (
                      <>
                        <i className={`fas ${periodoEditar ? 'fa-save' : 'fa-plus'}`}></i>
                        {periodoEditar ? ' Actualizar' : ' Crear'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodoManage; 