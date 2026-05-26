import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoadingSpinner = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    }}
  >
    <div
      style={{
        width: '50px',
        height: '50px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #e67e22',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

const RutaPublica = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  if (user?.rol === 'docente') {
    return <Navigate to="/principal" replace />;
  }

  if (user?.rol === 'estudiante') {
    const cuestionarioId = new URLSearchParams(window.location.search).get('id');
    if (cuestionarioId) {
      return <Navigate to={`/realizar-cuestionario/${cuestionarioId}`} replace />;
    }
    return <Navigate to="/principal" replace />;
  }

  // Egresados: el JWT trae iden_pers / codi_prog sin campo rol
  if (user?.iden_pers != null && String(user.iden_pers).length > 0) {
    return <Navigate to="/principal" replace />;
  }

  return <Outlet />;
};

export default RutaPublica;
