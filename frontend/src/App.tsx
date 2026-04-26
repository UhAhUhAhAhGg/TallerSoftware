// filepath: src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdoptanteProfilePage from './pages/AdoptanteProfilePage';
import RefugioProfilePage from './pages/RefugioProfilePage';
import RefugioDashboard from './pages/RefugioDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pantalla de inicio */}
        <Route path="/" element={<HomePage />} />

        {/* Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Completar perfiles */}
        <Route path="/completar-perfil/adoptante" element={<AdoptanteProfilePage />} />
        <Route path="/completar-perfil/refugio" element={<RefugioProfilePage />} />

        {/* Dashboards */}
        <Route
          path="/dashboard/adoptante"
          element={
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
              <h1>🐾 Dashboard Adoptante</h1>
              <p>Perfil completado exitosamente</p>
              <button
                onClick={() => window.location.href = '/'}
                style={{ marginTop: '20px', padding: '10px 24px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}
              >
                🏠 Volver al inicio
              </button>
            </div>
          }
        />
        <Route path="/dashboard/refugio" element={<RefugioDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;