import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { navigateWithLoading } from '../../utils/navigation';
import { fetchApi } from '../../config/api';
import './login.css';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

type ProgramaOption = { codigo: string; nombre: string };

const str = (v: unknown): string =>
  v === null || v === undefined ? '' : String(v).trim();

/** Alinea filas del API (varios esquemas posibles en BD) a codigo + nombre. */
const normalizarPrograma = (fila: Record<string, unknown>): ProgramaOption | null => {
  const codigo =
    str(fila.codigo) ||
    str(fila.EvalDCod_Prog) ||
    str(fila.codi_prog) ||
    str(fila.Codigo) ||
    str(fila.CODIGO);
  const nombre =
    str(fila.nombre) ||
    str(fila.EvalDNomb_Prog) ||
    str(fila.nomb_prog) ||
    str(fila.Nombre) ||
    str(fila.NOMBRE) ||
    codigo;
  if (!codigo) return null;
  return { codigo, nombre: nombre || codigo };
};

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cuestionarioId = searchParams.get('id');
  const [programa, setPrograma] = useState<string>('');
  const [identificacion, setIdentificacion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [programas, setProgramas] = useState<ProgramaOption[]>([]);
  const [cargandoProgramas, setCargandoProgramas] = useState(true);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    let cancelado = false;

    const cargarProgramas = async () => {
      setCargandoProgramas(true);
      try {
        const data = await fetchApi('/api/programas');
        if (cancelado) return;

        const raw: unknown[] = Array.isArray(data?.data?.programas)
          ? data.data.programas
          : [];

        const mapa = new Map<string, ProgramaOption>();
        for (const item of raw) {
          if (item && typeof item === 'object') {
            const n = normalizarPrograma(item as Record<string, unknown>);
            if (n && !mapa.has(n.codigo)) mapa.set(n.codigo, n);
          }
        }
        const lista = [...mapa.values()].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        setProgramas(lista);

        if (lista.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Programas',
            text:
              data?.message ||
              'No hay programas disponibles en la base de datos. Revisa la conexión o los datos.',
          });
        }
      } catch (e) {
        if (!cancelado) {
          console.error('Error al cargar programas:', e);
          Swal.fire({
            icon: 'error',
            title: 'No se pudieron cargar los programas',
            text: 'Comprueba que la API esté en marcha (XAMPP) y la URL en src/config/api.ts.',
          });
        }
      } finally {
        if (!cancelado) setCargandoProgramas(false);
      }
    };

    void cargarProgramas();
    return () => {
      cancelado = true;
    };
  }, []);

  // Redirigir si ya hay sesión (RutaPublica también redirige; esto cubre el caso en pantalla)
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (cuestionarioId) {
      navigate(`/realizar-cuestionario/${cuestionarioId}`, { replace: true });
    } else {
      navigate('/principal', { replace: true });
    }
  }, [isAuthenticated, authLoading, cuestionarioId, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Intentando iniciar sesión con:', { programa, identificacion });
      
      await login(
        programa.trim(),
        identificacion.trim(),
        cuestionarioId ? `/realizar-cuestionario/${cuestionarioId}` : undefined
      );
      
      if (!cuestionarioId) {
        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Inicio de sesión exitoso',
          timer: 2000,
          showConfirmButton: false,
        });
        navigateWithLoading('/principal');
      }
    } catch (err) {
      console.error('Error completo durante login:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="principalRoot">
      <div className="mainAnimatedContainer">
        <main className="principalContent">
          <section className="loginContentArea">
            <div className="contentCard">
              <div className="sidebarCardHeader">
                <div className="logoWrapper">
                  <img src={logo} alt="Logo" className="authLogo" />
                </div>
              </div>
              <div className="sidebarCardBody">
                <form className="loginForm" onSubmit={handleSubmit}>
                  <div className="formGroup">
                    <label className="formLabel" htmlFor="programa-select">
                      Programa
                    </label>
                    <select
                      id="programa-select"
                      className="formControl"
                      value={programa}
                      onChange={(e) => setPrograma(e.target.value)}
                      required
                      disabled={isLoading || cargandoProgramas || programas.length === 0}
                    >
                      <option value="">
                        {cargandoProgramas
                          ? 'Cargando programas...'
                          : programas.length === 0
                            ? 'Sin programas en la base de datos'
                            : 'Seleccione un programa'}
                      </option>
                      {programas.map((p) => (
                        <option key={p.codigo} value={p.codigo}>
                          {p.nombre} ({p.codigo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="formGroup">
                    <label className="formLabel">Identificación</label>
                    <input
                      type="text"
                      className="formControl"
                      value={identificacion}
                      onChange={(e) => setIdentificacion(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Número de identificación"
                    />
                  </div>
                  <button type="submit" className="crearBtn submitBtn" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                </form>
                <div className="linkContainer">
                  <p>
                    ¿No tienes cuenta?{' '}
                    <a href="/registro" className="linkText">
                      Regístrate aquí
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Login;