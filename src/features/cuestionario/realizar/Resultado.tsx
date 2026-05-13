import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PageTransition from '../../../components/PageTransition';
import useAuth from '../../../hooks/useAuth';
import { API_ENDPOINTS, fetchApi } from '../../../config/api';
import styles from './Resultado.module.css';
import { FaTrophy, FaClipboardList, FaHome, FaPrint, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

interface ResultadoDetalle {
  pregunta_id: number;
  texto_pregunta: string;
  orden_pregunta: number;
  peso_pregunta: number;
  imagen_pregunta?: string;
  opcion_seleccionada_id: number;
  respuesta_usuario: string;
  imagen_respuesta_usuario?: string;
  usuario_correcto: boolean;
  respuesta_correcta: string;
  imagen_respuesta_correcta?: string;
}

interface ResultadoData {
  cuestionario_id: number;
  titulo: string;
  descripcion: string;
  creador_nombre: string;
  programa_nombre: string;
  nivel_nombre: string;
  campus_nombre: string;
  estudiante_id: number;
  total_respondidas: number;
  total_preguntas: number;
  respuestas_correctas: number;
  puntaje_total: number;
  puntaje_obtenido: number;
  porcentaje: number;
  fecha_completado: string;
  detalles: ResultadoDetalle[];
}

const Resultado: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const cuestionarioId = params.id;
  const [resultado, setResultado] = useState<ResultadoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarResultado = async () => {
      console.log('🔍 Iniciando carga de resultado...');
      console.log('📋 Parámetros:', { cuestionarioId, isAuthenticated, userRole: user?.rol });
      
      if (!cuestionarioId || isNaN(Number(cuestionarioId))) {
        console.error('❌ ID de cuestionario no válido:', cuestionarioId);
        setError('ID de cuestionario no válido');
        setIsLoading(false);
        return;
      }

      // Verificar autenticación
      if (!isAuthenticated || user?.rol !== 'estudiante') {
        console.log('🚫 Usuario no autorizado, redirigiendo...', { isAuthenticated, rol: user?.rol });
        navigate('https://www.uninunez.edu.co/');
        return;
      }

      try {
        const url = `${API_ENDPOINTS.resultado(cuestionarioId)}`;
        console.log('🌐 Llamando a API:', url);
        
        const data = await fetchApi(url, {
          credentials: 'include'
        });

        console.log('📨 Respuesta de la API:', data);

        if (!data || data.error) {
          console.error('❌ Error en respuesta:', data?.error);
          throw new Error(data?.error || 'Error al cargar los resultados');
        }

        console.log('✅ Datos cargados correctamente');
        setResultado(data);
      } catch (err) {
        console.error('💥 Error en catch:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los resultados';
        setError(errorMessage);
      } finally {
        console.log('🏁 Finalizando carga...');
        setIsLoading(false);
      }
    };

    cargarResultado();
  }, [cuestionarioId, isAuthenticated, user?.rol, navigate]);

  const getImageUrl = (tipo: 'pregunta' | 'opcion', id: number) => {
    return `http://localhost/cuestionario-api/api/obtenerImagen_api.php?tipo=${tipo}&id=${id}`;
  };

  const getPorcentajeColor = (porcentaje: number): string => {
    if (porcentaje >= 70) return 'success';
    if (porcentaje >= 50) return 'warning';
    return 'danger';
  };

  const getPorcentajeTexto = (porcentaje: number): string => {
    if (porcentaje >= 70) return '¡Excelente trabajo! Has aprobado el cuestionario.';
    if (porcentaje >= 50) return 'Buen intento. Puedes mejorar revisando las respuestas.';
    return 'Necesitas estudiar más el tema. Revisa las respuestas.';
  };

  const getPorcentajeIcono = (porcentaje: number) => {
    if (porcentaje >= 70) return <FaCheckCircle />;
    if (porcentaje >= 50) return <FaExclamationTriangle />;
    return <FaTimesCircle />;
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleVolverDashboard = () => {
    navigate('/usuario');
  };

  const handleCerrar = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión de estudiante',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await fetchApi('/cuestionario-api/api/logoutEstudiantes_api.php', {
          method: 'POST',
          credentials: 'include'
        });
        navigate('https://www.uninunez.edu.co/');
      } catch (err) {
        console.error('Error al cerrar sesión:', err);
        navigate('https://www.uninunez.edu.co/');
      }
    }
  };

  if (isLoading) {
    console.log('🔄 Estado: LOADING');
    return (
      <PageTransition>
        <div className={styles.loading}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <h2>Cargando resultados...</h2>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    console.log('❌ Estado: ERROR -', error);
    return (
      <PageTransition>
        <div className={styles.error}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}><FaExclamationTriangle /></div>
            <h2 className={styles.errorTitle}>Error</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className={styles.btnPrimary}
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!resultado) {
    console.log('📭 Estado: SIN RESULTADO');
    return (
      <PageTransition>
        <div className={styles.error}>
          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>Resultados no encontrados</h2>
            <p className={styles.errorMessage}>No se encontraron resultados para este cuestionario.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className={styles.btnPrimary}
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  console.log('✅ Estado: RENDERIZANDO RESULTADO', resultado);
  return (
    <PageTransition>
      <div className={styles.resultadoContainer}>
        {/* Encabezado para impresión */}
        <div className={styles.printHeader}>
          <h2>Sistema de Cuestionarios - Resultados</h2>
          <p>Fecha de impresión: {new Date().toLocaleDateString('es-ES')} {new Date().toLocaleTimeString('es-ES')}</p>
        </div>

        {/* Navbar */}
        <nav className={styles.navbar}>
          <div className={styles.navbarContent}>
            <h1 className={styles.navbarTitle}>Resultados del Cuestionario</h1>
            <div className={styles.navbarButtons}>
              <button 
                onClick={handleVolverDashboard}
                className={styles.btnDashboard}
              >
                <FaHome /> Dashboard
              </button>
              <button 
                onClick={handleCerrar}
                className={styles.btnSalir}
              >
                ← Salir
              </button>
            </div>
          </div>
        </nav>

        <div className={styles.mainContainer}>
          <div>
            {/* Resultado General */}
            <div className={styles.card}>
              <div className={styles.header}>
                <h2 className={styles.headerTitle}>
                  <FaTrophy className={styles.headerIcon} /> Resultado del Cuestionario
                </h2>
                <h3 className={styles.headerSubtitle}>{resultado.titulo}</h3>
              </div>
              
                             <div className={styles.cardBody}>
                 <div className={styles.infoGrid}>
                   <div>
                     <div className={styles.infoItem}>
                       <span className={styles.infoLabel}>Resuelto por:</span> {user?.nombre}
                     </div>
                     <div className={styles.infoItem}>
                       <span className={styles.infoLabel}>Programa:</span> {resultado.programa_nombre} - {resultado.nivel_nombre}
                     </div>
                     <div className={styles.infoItem}>
                       <span className={styles.infoLabel}>Campus:</span> {resultado.campus_nombre}
                     </div>
                   </div>
                   <div>
                     <div className={styles.infoItem}>
                       <span className={styles.infoLabel}>Creado por:</span> Docente {resultado.creador_nombre}
                     </div>
                     <div className={styles.infoItem}>
                       <span className={styles.infoLabel}>Completado el:</span> {new Date(resultado.fecha_completado).toLocaleString('es-ES')}
                     </div>
                   </div>
                 </div>

                                 {/* Estadísticas */}
                 <div className={styles.statsGrid}>
                   <div className={`${styles.statCard} ${styles.statCardPrimary}`}>
                     <h4 className={styles.statTitle}>Puntaje</h4>
                     <p className={styles.statValue}>{Number(resultado.puntaje_obtenido).toFixed(2)}/{Number(resultado.puntaje_total).toFixed(2)}</p>
                   </div>
                   
                   <div className={`${styles.statCard} ${styles[`statCard${getPorcentajeColor(resultado.porcentaje).charAt(0).toUpperCase() + getPorcentajeColor(resultado.porcentaje).slice(1)}`]}`}>
                     <h4 className={styles.statTitle}>Porcentaje</h4>
                     <p className={styles.statValue}>{resultado.porcentaje}%</p>
                   </div>
                   
                   <div className={`${styles.statCard} ${styles.statCardInfo}`}>
                    <h4 className={styles.statTitle}>Preguntas</h4>
                    <p className={styles.statValue}>{resultado.total_respondidas}</p>
                   </div>
                 </div>

                                 {/* Mensaje de resultado */}
                 <div className={styles[`alert${getPorcentajeColor(resultado.porcentaje).charAt(0).toUpperCase() + getPorcentajeColor(resultado.porcentaje).slice(1)}`]}>
                   <span className={styles.alertIcon}>{getPorcentajeIcono(resultado.porcentaje)}</span>
                   {getPorcentajeTexto(resultado.porcentaje)}
                 </div>
              </div>
            </div>

            {/* Detalles de Respuestas */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3><FaClipboardList className={styles.cardHeaderIcon} /> Revisión de Respuestas</h3>
              </div>
              
                             <div className={styles.cardBody}>
                 {resultado.detalles.map((detalle, index) => (
                   <div 
                     key={detalle.pregunta_id} 
                    className={styles.preguntaCard}
                   >
                    <div className={styles.preguntaHeader}>
                       <h4 className={styles.preguntaTitle}>Pregunta {index + 1}</h4>
                       <div className={styles.preguntaInfo}>
                         <span className={styles.preguntaBadge}>
                           Valor: {Number(detalle.peso_pregunta).toFixed(2)} puntos
                         </span>
                       </div>
                     </div>
                    
                                         <div className={styles.preguntaContent}>
                       <p className={styles.preguntaTexto}>{detalle.texto_pregunta}</p>
                       
                       {detalle.imagen_pregunta && (
                         <div>
                           <img 
                             src={getImageUrl('pregunta', detalle.pregunta_id)}
                             alt="Imagen de la pregunta"
                             className={styles.imagen}
                           />
                         </div>
                       )}

                                             <div className={styles.respuestasGrid}>
                        <div className={styles.respuestaCard}>
                          <span className={styles.respuestaLabel}>
                             Tu respuesta:
                           </span>
                           <p className={styles.respuestaTexto}>{detalle.respuesta_usuario}</p>
                           
                           {detalle.imagen_respuesta_usuario && (
                             <div>
                               <img 
                                 src={getImageUrl('opcion', detalle.opcion_seleccionada_id)}
                                 alt="Imagen de tu respuesta"
                                 className={styles.imagenOpcion}
                               />
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className={styles.actionsContainer}>
              <button 
                onClick={handleVolverDashboard}
                className={styles.btnPrimary}
              >
                <FaHome className={styles.btnIcon} /> VOLVER AL DASHBOARD
              </button>
              <button 
                onClick={handleImprimir}
                className={styles.btnSuccess}
              >
                <FaPrint className={styles.btnIcon} /> Imprimir / Guardar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Resultado;
