import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Autenticación
import Login from './features/auth/Login';
import Registro from './features/auth/Registro';
import RutaPrivada from './routes/RutaPrivada';
import RutaPublica from './routes/RutaPublica';

// Layout
import DashboardLayout from './components/Layout/DashboardLayout';

// Dashboard
import Principal from './features/dashboard/Principal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route element={<RutaPublica />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Route>

          {/* Rutas Privadas */}
          <Route element={<RutaPrivada />}>
            <Route element={<DashboardLayout />}>
              <Route path="/principal" element={<Principal />} />
              <Route path="/dashboard" element={<Principal />} />
            </Route>
          </Route>

          {/* Redirecciones */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;