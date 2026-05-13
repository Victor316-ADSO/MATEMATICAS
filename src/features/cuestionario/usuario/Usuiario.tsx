import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './Usuario.module.css';
import PageTransition from '../../../components/PageTransition';
import CuestionarioEstudianteCard from './components/CuestionarioEstudianteCard';
import TabsEstudiante from './components/TabsEstudiante';
import EmptyStateEstudiante from './components/EmptyStateEstudiante';

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

const Usuario = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [estudianteNombre, setEstudianteNombre] = useState('');
  const [cuestionarios, setCuestionarios] = useState<{
    disponibles: CuestionarioEstudiante[];
    completados: CuestionarioEstudiante[];
    programados: CuestionarioEstudiante[];
    expirados: CuestionarioEstudiante[];
    cerrados: CuestionarioEstudiante[];
  }>({
    disponibles: [],
    completados: [],
    programados: [],
    expirados: [],
    cerrados: []
  });
  const [activeTab, setActiveTab] = useState('disponibles');

  useEffect(() => {
    // Verificar sesión al cargar el componente
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const response = await fetch('http://localhost/cuestionario-api/api/verificar_sesion.php', {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (!data.success || !data.autenticado) {
        // Si no hay sesión activa, redirigir al linksystem
        navigate('/linksystem');
        return;
      }

      // Si la sesión es válida pero no es estudiante, redirigir al linksystem
      if (data.usuario.rol !== 'estudiante') {
        navigate('/linksystem');
        return;
      }

      // Guardar el nombre del estudiante
      setEstudianteNombre(data.usuario.nombre || 'Estudiante');

      // Si todo está bien, cargar los cuestionarios
      cargarCuestionarios();
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      navigate('/linksystem');
    }
  };

  const cargarCuestionarios = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost/cuestionario-api/api/estudiante_dashboard_api.php', {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al cargar cuestionarios');
      }

      setCuestionarios(data.cuestionarios);

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al cargar cuestionarios'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCerrarSesion = async () => {
    try {
      await fetch('http://localhost/cuestionario-api/api/logoutEstudiantes_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'logout'
        })
      });
      
      navigate('/linksystem');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      navigate('/linksystem');
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando cuestionarios...</p>
        </div>
      );
    }

    const cuestionariosTab = cuestionarios[activeTab as keyof typeof cuestionarios] || [];

    if (cuestionariosTab.length === 0) {
      return <EmptyStateEstudiante tipo={activeTab as any} />;
    }

    return (
      <div className={styles.cuestionariosGrid}>
        {cuestionariosTab.map((cuestionario) => (
          <CuestionarioEstudianteCard
            key={cuestionario.cuestionario_id}
            cuestionario={cuestionario}
          />
        ))}
      </div>
    );
  };

  // Si está cargando, mostrar loading
  if (isLoading && cuestionarios.disponibles.length === 0 && cuestionarios.completados.length === 0) {
    return (
      <PageTransition>
        <div className={styles.principalRoot}>
          <div className={styles.mainAnimatedContainer}>
            <div className={styles.loadingContainer}>
              <i className="fas fa-spinner fa-spin"></i>
              <p>Cargando...</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const counts = {
    disponibles: cuestionarios.disponibles.length,
    completados: cuestionarios.completados.length,
    programados: cuestionarios.programados.length,
    expirados: cuestionarios.expirados.length,
    cerrados: cuestionarios.cerrados.length
  };

  return (
    <PageTransition>
      <div className={styles.dashboardContainer}>
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1>Dashboard de Estudiante</h1>
              <h2>Bienvenido, {estudianteNombre || 'Cargando...'}</h2>
            </div>
            <button 
              onClick={handleCerrarSesion}
              className={styles.logoutButton}
            >
              <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className={styles.dashboardContent}>
          <div className={styles.contentCard}>
            {/* Pestañas */}
            <TabsEstudiante
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={counts}
            />

            {/* Contenido de las pestañas */}
            <div className={styles.tabContent}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Usuario;
