import { useState, FormEvent } from 'react';
import useAdminAuth from '../../../hooks/useAdminAuth';
import '../../auth/login.css';
import logo from '../../../assets/logo.png';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch {
      /* Swal en contexto */
    } finally {
      setLoading(false);
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
                <h3>Analytics Matemático</h3>
              </div>
              <div className="sidebarCardBody">
                <form className="loginForm" onSubmit={handleSubmit}>
                  <div className="formGroup">
                    <label className="formLabel" htmlFor="admin-email">
                      Correo administrativo
                    </label>
                    <input
                      id="admin-email"
                      type="email"
                      className="formControl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="admin@ejemplo.com"
                      autoComplete="username"
                    />
                  </div>
                  <div className="formGroup">
                    <label className="formLabel" htmlFor="admin-password">
                      Contraseña
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      className="formControl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Contraseña"
                      autoComplete="current-password"
                    />
                  </div>
                  <button type="submit" className="crearBtn submitBtn" disabled={loading}>
                    {loading ? 'Verificando…' : 'Ingresar al panel'}
                  </button>
                </form>
                <div className="linkContainer">
                  <p>
                    Acceso restringido. Los administradores se crean en la base de datos.
                  </p>
                  <p style={{ marginTop: '0.75rem' }}>
                    <a href="/login" className="linkText">
                      Volver al portal de usuarios
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

export default AdminLogin;
