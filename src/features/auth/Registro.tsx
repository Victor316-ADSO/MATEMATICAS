import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { navigateWithLoading } from '../../utils/navigation';
import { fetchApi } from '../../config/api';
import './registro.css';
import logo from '../../assets/logo.png';

type ProgramaOption = { codigo: string; nombre: string };

const TIPOS_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'RC', label: 'Registro civil' },
  { value: 'MS', label: 'Menor sin identificación' },
  { value: 'CD', label: 'Carné diplomático' },
  { value: 'SC', label: 'Salvoconducto' },
  { value: 'PE', label: 'Permiso especial' },
  { value: 'PT', label: 'Permiso por protección temporal' },
] as const;

const str = (v: unknown): string =>
  v === null || v === undefined ? '' : String(v).trim();

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

const Registro = () => {
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [programaCodigo, setProgramaCodigo] = useState('');
  const [programas, setProgramas] = useState<ProgramaOption[]>([]);
  const [cargandoProgramas, setCargandoProgramas] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let cancelado = false;

    const cargarProgramas = async () => {
      setCargandoProgramas(true);
      try {
        const data = await fetchApi('/api/programas');
        if (cancelado) return;

        const raw: unknown[] = Array.isArray(data?.data?.programas) ? data.data.programas : [];
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
      } catch (e) {
        if (!cancelado) {
          console.error('Error al cargar programas:', e);
          Swal.fire({
            icon: 'error',
            title: 'No se pudieron cargar los programas',
            text: 'Comprueba que la API esté activa y la URL en src/config/api.ts.',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoDocumento) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccione el tipo de documento.',
      });
      return;
    }

    if (!programaCodigo) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccione un programa.',
      });
      return;
    }

    setEnviando(true);
    try {
      const data = await fetchApi('/api/auth/registro', {
        method: 'POST',
        body: JSON.stringify({
          tipo_documento: tipoDocumento,
          identificacion,
          programa: programaCodigo,
        }),
      });

      if (data && data.success) {
        await Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text:
            data.message ||
            'Inicie sesión con el mismo programa y número de documento que registró.',
          timer: 2800,
          showConfirmButton: true,
        });
        navigateWithLoading('/login');
      } else {
        const msg =
          data?.message ||
          (typeof data?.error === 'string' ? data.error : null) ||
          'Error al registrar';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: msg,
        });
      }
    } catch (err) {
      console.error('Error completo:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo contactar al servidor.',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="principalRoot">
      <div className="mainAnimatedContainer">
        <div className="principalContent">
          <div className="registroContentArea">
            <div className="contentCard">
              <div className="sidebarCardHeader">
                <div className="logoWrapper">
                  <img src={logo} alt="Logo" className="authLogo" />
                </div>
              </div>
              <div className="sidebarCardBody">
                <form onSubmit={handleSubmit} className="loginForm">
                  <div className="formGroup">
                    <label htmlFor="tipo_documento" className="formLabel">
                      Tipo de documento
                    </label>
                    <select
                      className="formControl"
                      id="tipo_documento"
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                      required
                      disabled={enviando}
                    >
                      <option value="">Seleccione…</option>
                      {TIPOS_DOCUMENTO.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="formGroup">
                    <label htmlFor="identificacion" className="formLabel">
                      Número de documento
                    </label>
                    <input
                      type="text"
                      className="formControl"
                      id="identificacion"
                      value={identificacion}
                      onChange={(e) => setIdentificacion(e.target.value)}
                      required
                      disabled={enviando}
                      placeholder="Sin puntos ni espacios, igual que en inicio de sesión"
                    />
                  </div>
                  <div className="formGroup">
                    <label htmlFor="programa" className="formLabel">
                      Programa
                    </label>
                    <select
                      className="formControl"
                      id="programa"
                      value={programaCodigo}
                      onChange={(e) => setProgramaCodigo(e.target.value)}
                      required
                      disabled={enviando || cargandoProgramas || programas.length === 0}
                    >
                      <option value="">
                        {cargandoProgramas
                          ? 'Cargando programas...'
                          : programas.length === 0
                            ? 'Sin programas disponibles'
                            : 'Selecciona un programa'}
                      </option>
                      {programas.map((p) => (
                        <option key={p.codigo} value={p.codigo}>
                          {p.nombre} ({p.codigo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="buttonContainer">
                    <button
                      type="button"
                      className="crearBtn backBtn"
                      onClick={() => window.history.back()}
                      disabled={enviando}
                    >
                      Atrás
                    </button>
                    <button type="submit" className="crearBtn submitBtn" disabled={enviando}>
                      {enviando ? 'Registrando...' : 'Registrarse'}
                    </button>
                  </div>
                </form>

                <div className="linkContainer">
                  <p>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="linkText">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
