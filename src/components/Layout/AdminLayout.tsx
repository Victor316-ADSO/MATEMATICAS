import { Outlet } from 'react-router-dom';
import { FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import useAdminAuth from '../../hooks/useAdminAuth';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <FaChartLine />
          <span>Analytics Matemático</span>
          <small>Panel Admin</small>
        </div>
        <div className={styles.userBar}>
          <span>{admin?.nombre || admin?.email}</span>
          <button type="button" onClick={() => void logout()} className={styles.logoutBtn}>
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
