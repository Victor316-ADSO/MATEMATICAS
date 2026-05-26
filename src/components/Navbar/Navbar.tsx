import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaUserShield, FaFlask } from 'react-icons/fa';
import styles from './Navbar.module.css';
import useAuth from '../../hooks/useAuth';
import { getUserDisplayName } from '../../utils/userDisplay';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.rol === 'admin';
  const isTester = user?.rol === 'tester';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <img src={logo} alt="Logo" className={styles.brandLogo} />
          <div>
            <h1>Sistema de Cuestionarios</h1>
            <h2>Universidad Rafael Núñez - Colombia</h2>
          </div>
        </div>

        <div className={styles.userSection}>
          {isAdmin && (
            <button 
              className={styles.roleButton} 
              onClick={() => navigate('/admin')}
              title="Panel de Administrador"
            >
              <FaUserShield />
              <span>Admin</span>
            </button>
          )}
          
          {isTester && (
            <button 
              className={styles.roleButton} 
              onClick={() => navigate('/tester')}
              title="Panel de Tester"
            >
              <FaFlask />
              <span>Tester</span>
            </button>
          )}

          <div className={styles.userInfo}>
            <FaUser className={styles.userIcon} />
            <span className={styles.userName}>
              Bienvenido, {getUserDisplayName(user) || 'Usuario'}
            </span>
          </div>

          <button 
            onClick={handleLogout} 
            className={styles.logoutButton}
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 