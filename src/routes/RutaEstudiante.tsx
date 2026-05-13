import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RutaEstudiante = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const { id } = useParams();

  // Si está cargando, mostrar nada
  if (isLoading) {
    return null;
  }

  // Si es la ruta /realizar-cuestionario/:id, permitir acceso sin autenticación
  if (location.pathname.startsWith('/realizar-cuestionario/')) {
    return <Outlet />;
  }

  // Si no está autenticado, redirigir a linksystem con el ID
  if (!isAuthenticated) {
    return <Navigate to={`/linksystem?id=${id}`} replace />;
  }

  // Si está autenticado pero no es estudiante, redirigir a login
  if (user?.rol !== 'estudiante') {
    return <Navigate to="/linksystem" replace />;
  }

  // Si es estudiante autenticado, permitir acceso
  return <Outlet />;
};

export default RutaEstudiante; 