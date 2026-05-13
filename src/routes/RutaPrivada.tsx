import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoadingSpinner = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #e67e22',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
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

const RutaPrivada = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Eliminado useEffect problemático que causaba loop de redirección



  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Docente / admin / tester
  if (user?.rol === 'docente' || user?.rol === 'admin' || user?.rol === 'tester') {
    return <Outlet />;
  }

  // Egresado: el JWT de verify solo trae iden_pers y codi_prog (sin rol en el token)
  if (user?.iden_pers != null && String(user.iden_pers).length > 0) {
    return <Outlet />;
  }

  // Estudiante u otros roles con sesión válida: mismo panel (no existe /linksystem en la app)
  if (user?.rol === 'estudiante') {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default RutaPrivada;
