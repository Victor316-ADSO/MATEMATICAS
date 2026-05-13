import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RutaPublica = () => {
  const { isAuthenticated, user } = useAuth();

  // Si no está autenticado, permitir acceso a rutas públicas
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Si está autenticado, redirigir según el rol
  if (user?.rol === 'docente') {
    return <Navigate to="/principal" replace />;
  }

  if (user?.rol === 'estudiante') {
    return <Navigate to="/linksystem" replace />;
  }

  // Si el rol no está definido, redirigir a login
  return <Navigate to="/login" replace />;
};

export default RutaPublica;

