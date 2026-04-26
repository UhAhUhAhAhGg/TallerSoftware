import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './RefugioDashboard.css';

export default function RefugioDashboard() {
  const navigate = useNavigate();
  
  const [estadoRefugio, setEstadoRefugio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [datosRefugio, setDatosRefugio] = useState<any>(null);

  useEffect(() => {
    verificarEstado();
  }, []);

  const verificarEstado = async () => {
    try {
      // Verificar el estado del usuario
      const estUsuario = localStorage.getItem('est_usuario');
      setEstadoRefugio(estUsuario);

      // Si está activo, obtener los datos del refugio
      if (estUsuario === 'activo') {
        const response = await api.get('/refugios/datos');
        if (response.data.success && response.data.data) {
          setDatosRefugio(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error al verificar estado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Loading
  if (loading) {
    return (
      <div className="refugio-dashboard-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  // Estado pendiente - mensaje de espera
  if (estadoRefugio === 'pendiente') {
    return (
      <div className="refugio-dashboard-container">
        <header className="refugio-dashboard-header">
          <h1>🏠 Dashboard Refugio</h1>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </header>

        <main className="refugio-dashboard-main">
          <div className="estado-card pendiente">
            <div className="estado-icon">⏳</div>
            <h2>Solicitud en Espera</h2>
            <p>Tu solicitud de registro como refugio está pendiente de validación por un administrador.</p>
            <p className="info-text">Recibirás una notificación cuando tu perfil sea aprobado.</p>
            
            {datosRefugio && (
              <div className="datos-enviados">
                <h3>Datos enviados:</h3>
                <p><strong>Nombre:</strong> {datosRefugio.nom_refug}</p>
                <p><strong>Dirección:</strong> {datosRefugio.dir_refug}</p>
                <p><strong>Teléfono:</strong> {datosRefugio.telf_refug}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Estado activo - mostrar todas las opciones del refugio
  if (estadoRefugio === 'activo') {
    return (
      <div className="refugio-dashboard-container">
        <header className="refugio-dashboard-header">
          <h1>🏠 Dashboard Refugio</h1>
          <div className="header-info">
            <span className="bienvenido">¡Bienvenido, {datosRefugio?.nom_refug || 'Refugio'}!</span>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </header>

        <main className="refugio-dashboard-main">
          <div className="estado-card aprobado">
            <div className="estado-icon">✓</div>
            <h2>¡Tu refugio está aprobado!</h2>
            <p>Ya puedes acceder a todas las funcionalidades como refugio.</p>
          </div>

          <div className="opciones-grid">
            <div className="opcion-card" onClick={() => navigate('/refugio/mascotas')}>
              <div className="opcion-icon">🐕</div>
              <h3>Gestionar Mascotas</h3>
              <p>Publicar, editar y eliminar mascotas en adopción</p>
            </div>

            <div className="opcion-card" onClick={() => navigate('/refugio/adopciones')}>
              <div className="opcion-icon">📋</div>
              <h3>Adopciones</h3>
              <p>Ver solicitudes de adopción de tus mascotas</p>
            </div>

            <div className="opcion-card" onClick={() => navigate('/completar-perfil/refugio')}>
              <div className="opcion-icon">👤</div>
              <h3>Mi Perfil</h3>
              <p>Actualizar información de tu refugio</p>
            </div>

            <div className="opcion-card" onClick={() => navigate('/completar-perfil/refugio')}>
              <div className="opcion-icon">🔔</div>
              <h3>Notificaciones</h3>
              <p>Ver notificaciones y mensajes</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Estado rechazado - mensaje de rechazo (aunque esto no debería verse aquí
  // ya que al rechazar se convierte en adoptante)
  if (estadoRefugio === 'rechazado') {
    return (
      <div className="refugio-dashboard-container">
        <header className="refugio-dashboard-header">
          <h1>🏠 Dashboard Refugio</h1>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </header>

        <main className="refugio-dashboard-main">
          <div className="estado-card rechazado">
            <div className="estado-icon">✗</div>
            <h2>Tu Solicitud fue Rechazada</h2>
            <p>Tu solicitud de registro como refugio fue rechazada.</p>
            <p className="info-text">Revisa tus datos o comunícate con el administrador para más información.</p>
          </div>
        </main>
      </div>
    );
  }

  // Por defecto, redirigir a completar perfil
  return (
    <div className="refugio-dashboard-container">
      <header className="refugio-dashboard-header">
        <h1>🏠 Dashboard Refugio</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      <main className="refugio-dashboard-main">
        <div className="estado-card">
          <h2>Completa tu perfil</h2>
          <p>Debes completar los datos de tu refugio para continuar.</p>
          <button 
            className="primary-button"
            onClick={() => navigate('/completar-perfil/refugio')}
          >
            Completar Perfil
          </button>
        </div>
      </main>
    </div>
  );
}