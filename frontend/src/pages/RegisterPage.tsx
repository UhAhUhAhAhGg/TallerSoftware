// filepath: src/pages/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    confirmar_contrasena: '',
    rol: '' as 'adoptante' | 'refugio' | '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password: string) => {
    setPasswordRequirements({
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'contrasena') {
      validatePassword(value);
    }
    
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.correo.trim()) newErrors.correo = 'El correo es requerido';
    if (!formData.rol) newErrors.rol = 'Debes seleccionar un tipo de cuenta';

    // Validar contraseña
    if (!passwordRequirements.length) {
      newErrors.contrasena = 'La contraseña debe tener al menos 12 caracteres';
    } else if (!passwordRequirements.uppercase) {
      newErrors.contrasena = 'La contraseña debe tener al menos una mayúscula';
    } else if (!passwordRequirements.number) {
      newErrors.contrasena = 'La contraseña debe tener al menos un número';
    } else if (!passwordRequirements.special) {
      newErrors.contrasena = 'La contraseña debe tener al menos un carácter especial';
    }

    if (formData.contrasena !== formData.confirmar_contrasena) {
      newErrors.confirmar_contrasena = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.register({
        correo: formData.correo,
        contrasena: formData.contrasena,
        confirmar_contrasena: formData.confirmar_contrasena,
        rol: formData.rol as 'adoptante' | 'refugio',
        nombre: formData.nombre,
        apellido: formData.apellido,
      });

      if (response.success) {
        // Guardar token y rol en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('rol', response.data.rol);
        localStorage.setItem('userId', response.data.id_usuario);

        // Redirigir según el rol
        if (formData.rol === 'adoptante') {
          navigate('/completar-perfil/adoptante');
        } else {
          navigate('/completar-perfil/refugio');
        }
      }
    } catch (error: any) {
      setErrors({ general: error.response?.data?.mensaje || 'Error al registrar usuario' });
    } finally {
      setLoading(false);
    }
  };

  const allPasswordRequirementsMet = 
    passwordRequirements.length && 
    passwordRequirements.uppercase && 
    passwordRequirements.number && 
    passwordRequirements.special;

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Crear Cuenta</h1>
        <p className="register-subtitle">Únete a nuestra plataforma de adopción</p>

        {errors.general && <div className="error-banner">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className={errors.nombre ? 'error' : ''}
              />
              {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                className={errors.apellido ? 'error' : ''}
              />
              {errors.apellido && <span className="error-text">{errors.apellido}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={errors.correo ? 'error' : ''}
            />
            {errors.correo && <span className="error-text">{errors.correo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rol">Tipo de cuenta</label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className={errors.rol ? 'error' : ''}
            >
              <option value="">Selecciona una opción</option>
              <option value="adoptante">🐾 Adoptante</option>
              <option value="refugio">🏠 Refugio</option>
            </select>
            {errors.rol && <span className="error-text">{errors.rol}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Mínimo 12 caracteres"
              className={errors.contrasena ? 'error' : ''}
            />
            <div className="password-requirements">
              <span className={passwordRequirements.length ? 'met' : ''}>
                {passwordRequirements.length ? '✓' : '○'} Mínimo 12 caracteres
              </span>
              <span className={passwordRequirements.uppercase ? 'met' : ''}>
                {passwordRequirements.uppercase ? '✓' : '○'} Una mayúscula
              </span>
              <span className={passwordRequirements.number ? 'met' : ''}>
                {passwordRequirements.number ? '✓' : '○'} Un número
              </span>
              <span className={passwordRequirements.special ? 'met' : ''}>
                {passwordRequirements.special ? '✓' : '○'} Un carácter especial
              </span>
            </div>
            {errors.contrasena && <span className="error-text">{errors.contrasena}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmar_contrasena">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmar_contrasena"
              name="confirmar_contrasena"
              value={formData.confirmar_contrasena}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className={errors.confirmar_contrasena ? 'error' : ''}
            />
            {errors.confirmar_contrasena && <span className="error-text">{errors.confirmar_contrasena}</span>}
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={loading || !allPasswordRequirementsMet}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
}