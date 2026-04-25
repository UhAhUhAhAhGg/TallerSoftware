// filepath: src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './AdminDashboard.css';

interface Refugio {
  id_refug: number;
  nom_refug: string;
  dir_refug: string;
  telf_refug: string;
  corr_refug: string;
  licencia_refug: string;
  est_verif_refug: string;
  nom_usuario: string;
  appell_usuario: string;
  corr_usuario: string;
  fenac_usuario: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefugio, setSelectedRefugio] = useState<Refugio | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const verificarRol = () => {
      const rol = localStorage.getItem('rol');
      if (rol !== 'administrador') {
        navigate('/login');
      }
    };
    verificarRol();
    cargarSolicitudes();
  }, [navigate]);

  const cargarSolicitudes = async () => {
    try {
      const response = await api.get('/refugios/admin/solicitudes');
      if (response.data.success) {
        setRefugios(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id_refug: number) => {
    setActionLoading(true);
    try {
      await api.patch(`/refugios/admin/refugio/${id_refug}/estado`, {
        estado: 'aprobado'
      });
      cargarSolicitudes();
      setSelectedRefugio(null);
    } catch (error) {
      console.error('Error al aprobar:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRechazar = async (id_refug: number) => {
    setActionLoading(true);
    try {
      await api.patch(`/refugios/admin/refugio/${id_refug}/estado`, {
        estado: 'rechazado'
      });
      cargarSolicitudes();
      setSelectedRefugio(null);
    } catch (error) {
      console.error('Error al rechazar:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>⚙️ Panel de Administrador</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      <main className="admin-main">
        <section className="solicitudes-section">
          <h2>📋 Solicitudes de Refugios Pendientes</h2>
          
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : refugios.length === 0 ? (
            <div className="empty-state">
              <p>No hay solicitudes pendientes en este momento.</p>
            </div>
          ) : (
            <div className="refugios-grid">
              {refugios.map((refugio) => (
                <div 
                  key={refugio.id_refug} 
                  className="refugio-card"
                  onClick={() => setSelectedRefugio(refugio)}
                >
                  <h3>{refugio.nom_refug}</h3>
                  <p className="refugio-email">{refugio.corr_refug}</p>
                  <p className="refugio-licencia">Licencia: {refugio.licencia_refug}</p>
                  <span className="status-badge pendiente">Pendiente</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal de detalle */}
      {selectedRefugio && (
        <div className="modal-overlay" onClick={() => setSelectedRefugio(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles del Refugio</h2>
            
            <div className="detalle-item">
              <label>Nombre:</label>
              <span>{selectedRefugio.nom_refug}</span>
            </div>
            
            <div className="detalle-item">
              <label>Dirección:</label>
              <span>{selectedRefugio.dir_refug}</span>
            </div>
            
            <div className="detalle-item">
              <label>Teléfono:</label>
              <span>{selectedRefugio.telf_refug}</span>
            </div>
            
            <div className="detalle-item">
              <label>Correo:</label>
              <span>{selectedRefugio.corr_refug}</span>
            </div>
            
            <div className="detalle-item">
              <label>Licencia:</label>
              <span>{selectedRefugio.licencia_refug}</span>
            </div>
            
            <div className="detalle-item">
              <label>Responsable:</label>
              <span>{selectedRefugio.nom_usuario} {selectedRefugio.appell_usuario}</span>
            </div>
            
            <div className="detalle-item">
              <label>Correo responsable:</label>
              <span>{selectedRefugio.corr_usuario}</span>
            </div>

            <div className="modal-actions">
              <button 
                className="approve-button"
                onClick={() => handleAprobar(selectedRefugio.id_refug)}
                disabled={actionLoading}
              >
                ✓ Aprobar
              </button>
              <button 
                className="reject-button"
                onClick={() => handleRechazar(selectedRefugio.id_refug)}
                disabled={actionLoading}
              >
                ✗ Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}