// filepath: src/pages/RefugioProfilePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './RefugioProfilePage.css';

export default function RefugioProfilePage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nom_refug: '',
    dir_refug: '',
    telf_refug: '',
    corr_refug: '',
    licencia_refug: '',
    descripcion: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom_refug.trim()) newErrors.nom_refug = 'El nombre del refugio es requerido';
    if (!formData.dir_refug.trim()) newErrors.dir_refug = 'La dirección es requerida';
    if (!formData.telf_refug.trim()) newErrors.telf_refug = 'El teléfono es requerido';
    if (!formData.corr_refug.trim()) newErrors.corr_refug = 'El correo es requerido';
    if (!formData.licencia_refug.trim()) newErrors.licencia_refug = 'El número de licencia es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/refugios/datos', formData);

      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (error: any) {
      setErrors({ general: error.response?.data?.mensaje || 'Error al guardar datos' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>¡Datos Enviados!</h2>
            <p>Tu refugio está pendiente de validación por un administrador.</p>
            <p className="info-text">Recibirás una notificación cuando tu perfil sea aprobado.</p>
            <button 
              className="home-button"
              onClick={() => navigate('/dashboard/refugio')}
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>🏠 Completa tu Perfil de Refugio</h1>
          <p>Ingresa los datos de tu organización</p>
        </div>

        {errors.general && <div className="error-banner">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom_refug">Nombre del Refugio *</label>
            <input
              type="text"
              id="nom_refug"
              name="nom_refug"
              value={formData.nom_refug}
              onChange={handleChange}
              placeholder="Nombre de tu organización"
              className={errors.nom_refug ? 'error' : ''}
            />
            {errors.nom_refug && <span className="error-text">{errors.nom_refug}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dir_refug">Dirección *</label>
            <input
              type="text"
              id="dir_refug"
              name="dir_refug"
              value={formData.dir_refug}
              onChange={handleChange}
              placeholder="Dirección completa"
              className={errors.dir_refug ? 'error' : ''}
            />
            {errors.dir_refug && <span className="error-text">{errors.dir_refug}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telf_refug">Teléfono *</label>
              <input
                type="text"
                id="telf_refug"
                name="telf_refug"
                value={formData.telf_refug}
                onChange={handleChange}
                placeholder="Número de contacto"
                className={errors.telf_refug ? 'error' : ''}
              />
              {errors.telf_refug && <span className="error-text">{errors.telf_refug}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="corr_refug">Correo del Refugio *</label>
              <input
                type="email"
                id="corr_refug"
                name="corr_refug"
                value={formData.corr_refug}
                onChange={handleChange}
                placeholder="correo@refugio.com"
                className={errors.corr_refug ? 'error' : ''}
              />
              {errors.corr_refug && <span className="error-text">{errors.corr_refug}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="licencia_refug">Número de Licencia *</label>
            <input
              type="text"
              id="licencia_refug"
              name="licencia_refug"
              value={formData.licencia_refug}
              onChange={handleChange}
              placeholder="Licencia o registro oficial"
              className={errors.licencia_refug ? 'error' : ''}
            />
            {errors.licencia_refug && <span className="error-text">{errors.licencia_refug}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción (opcional)</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Cuéntanos sobre tu refugio..."
              rows={4}
            />
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Enviando...' : '📤 Enviar Solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
}