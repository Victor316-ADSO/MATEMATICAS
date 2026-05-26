import { Navigate, Outlet } from 'react-router-dom';
import useAdminAuth from '../hooks/useAdminAuth';

const RutaAdminPublica = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f172a',
        }}
      />
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/analytics" replace />;
  }

  return <Outlet />;
};

export default RutaAdminPublica;
