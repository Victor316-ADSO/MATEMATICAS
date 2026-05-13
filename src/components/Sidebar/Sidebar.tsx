import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { 
  FaBook, 
  FaHome
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? styles.active : '';
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <FaBook className={styles.logoIcon} />
        <span>Quiz System</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Inicio</h3>
          <Link to="/dashboard" className={`${styles.link} ${isActive('/dashboard')}`}>
            <FaHome />
            <span>Inicio</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 