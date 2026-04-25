// filepath: src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdoptanteProfilePage from './pages/AdoptanteProfilePage';
import RefugioProfilePage from './pages/RefugioProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/completar-perfil/adoptante" element={<AdoptanteProfilePage />} />
        <Route path="/completar-perfil/refugio" element={<RefugioProfilePage />} />
        {/* Dashboard routes - placeholder */}
        <Route path="/dashboard/adoptante" element={<div style={{ padding: '40px', textAlign: 'center' }}><h1>🐾 Dashboard Adoptante</h1><p>Perfil completado exitosamente</p></div>} />
        <Route path="/dashboard/refugio" element={<div style={{ padding: '40px', textAlign: 'center' }}><h1>🏠 Dashboard Refugio</h1><p>Perfil completado exitosamente</p></div>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
