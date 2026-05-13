import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './Linksystem.module.css';
import PageTransition from '../../../components/PageTransition';
import useAuth from '../../../hooks/useAuth';

const Linksystem = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cuestionarioId = searchParams.get('id');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Si el usuario ya está autenticado como estudiante, redirigir automáticamente
    if (isAuthenticated && user?.rol === 'estudiante') {
      window.location.href = '/usuario';
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginResponse = await fetch('http://localhost/cuestionario-api/api/linksystem_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          documento,
          id: cuestionarioId
        })
      });

      const loginData = await loginResponse.json();

      if (!loginData.success) {
        setError(loginData.error || 'Error al iniciar sesión');
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: loginData.error || 'Error al iniciar sesión',
        });
        return;
      }

      // Si el login fue exitoso, mostrar mensaje y redirigir
      const mensaje = loginData.ya_completado 
        ? `Bienvenido(a) ${loginData.estudiante.nombre}. Ya has completado este cuestionario, pero puedes acceder a tu dashboard.`
        : `Bienvenido(a) ${loginData.estudiante.nombre}`;

      await Swal.fire({
        icon: 'success',
        title: '¡Acceso concedido!',
        text: mensaje,
        timer: 2000,
        showConfirmButton: false
      });

      // Actualizar el contexto de autenticación y redirigir al dashboard de usuario
      // Recargar la página para actualizar el contexto de autenticación
      window.location.href = '/usuario';

    } catch (error: any) {
      setError('No se pudo conectar con el servidor. Verifica tu conexión o contacta soporte.');
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: error?.message || 'No se pudo conectar con el servidor. Por favor, intenta de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !cuestionarioId) {
    return (
      <PageTransition>
        <div className={styles.principalRoot}>
          <div className={styles.mainAnimatedContainer}>
            <main className={styles.principalContent}>
              <section className={styles.principalContentArea}>
                <div className={styles.contentCard}>
                  <div className={styles.sidebarCardHeader}>
                    <h3>Link Inválido</h3>
                  </div>
                  <div className={styles.sidebarCardBody}>
                    <p>{error}</p>
                    <p className={styles.helpText}>
                      Si recibiste este link por correo, por favor verifica que la URL esté completa o contacta a tu docente.
                    </p>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={styles.principalRoot}>
        <div className={styles.mainAnimatedContainer}>
          <main className={styles.principalContent}>
            <section className={styles.principalContentArea}>
              <div className={styles.contentCard}>
                <div className={styles.sidebarCardHeader}>
                  <h3>Acceso Estudiantes</h3>
                </div>
                <div className={styles.sidebarCardBody}>
                  <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Correo Electrónico Institucional</label>
                      <input
                        type="email"
                        className={styles.formControl}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="ejemplo@email.com"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Documento de Identidad</label>
                      <input
                        type="text"
                        className={styles.formControl}
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="Ingresa tu número de documento"
                      />
                    </div>

                    {error && (
                      <div className={styles.errorMessage}>
                        <i className="fas fa-exclamation-circle"></i> {error}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className={`${styles.crearBtn} ${styles.submitBtn}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Validando...' : 'Acceder al Dashboard'}
                    </button>
                  </form>
                  
                  <div className={styles.linkContainer}>
                    <p className={styles.helpText}>
                      Ingresa tus credenciales para acceder a tu dashboard de cuestionarios.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Linksystem; 