import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Autenticación usuarios
import Login from './features/auth/Login';
import Registro from './features/auth/Registro';
import RutaPrivada from './routes/RutaPrivada';
import RutaPublica from './routes/RutaPublica';

// Autenticación administradores Analytics
import AdminLogin from './features/admin/auth/AdminLogin';
import RutaAdminPrivada from './routes/RutaAdminPrivada';
import RutaAdminPublica from './routes/RutaAdminPublica';

// Layout
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminLayout from './components/Layout/AdminLayout';

// Dashboard
import PrincipalPage from './features/dashboard/PrincipalPage';
import Analytics from './features/analytics/Analytics';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* Portal de usuarios (egresados) */}
            <Route element={<RutaPublica />}>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
            </Route>

            <Route element={<RutaPrivada />}>
              <Route element={<DashboardLayout />}>
                <Route path="/principal" element={<PrincipalPage />} />
                <Route path="/dashboard" element={<PrincipalPage />} />
              </Route>
            </Route>

            {/* Panel administrativo Analytics (login separado, sin registro) */}
            <Route element={<RutaAdminPublica />}>
              <Route path="/admin/login" element={<AdminLogin />} />
            </Route>

            <Route element={<RutaAdminPrivada />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/analytics" replace />} />
                <Route path="/admin/analytics" element={<Analytics />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/analytics" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;