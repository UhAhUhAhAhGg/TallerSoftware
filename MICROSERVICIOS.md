# 🏗️ Arquitectura de Microservicios - Mejores Prácticas

## Estructura Recomendada

```
proyecto/
│
├── backend/
│   ├── auth-service/          # Servicio de Autenticación
│   │   ├── src/
│   │   │   ├── index.js       # Punto de entrada
│   │   │   ├── controllers/   # Lógica de negocio
│   │   │   ├── routes/        # Definición de rutas
│   │   │   ├── middlewares/   # Middlewares personalizados
│   │   │   ├── models/        # Esquemas/tipos de datos
│   │   │   └── utils/         # Funciones auxiliares
│   │   ├── .env
│   │   └── package.json
│   │
│   ├── users-service/         # (Para agregar después)
│   │   ├── src/
│   │   ├── .env
│   │   └── package.json
│   │
│   └── shared/                # (OPCIONAL) Código compartido
│       ├── constants.js
│       ├── validators.js
│       └── error-handlers.js
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas de la app
│   │   ├── services/          # Llamadas a APIs
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Funciones auxiliares
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── package.json               # Raíz (controla todos los servicios)
├── SETUP.md                   # Esta guía
└── start-services.bat         # Script para Windows
```

---

## 📝 Estructura de un Servicio (Auth Service)

### Backend/auth-service/src/controllers/auth.controller.js

```javascript
// Lógica de negocio para autenticación
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    
    // Lógica de autenticación
    // const user = await User.findByEmail(email);
    // const isValid = await bcrypt.compare(password, user.password);
    
    // Respuesta
    res.json({ token: 'jwt-token-aqui', user: { email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginController };
```

### Backend/auth-service/src/routes/auth.routes.js

```javascript
const express = require('express');
const { loginController } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);

module.exports = router;
```

### Frontend/src/services/api.ts

```typescript
// Servicio para comunicar con el backend
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api'
  : '/api';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  
  register: async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return res.json();
  }
};
```

---

## 🔄 Flujo de Comunicación Frontend ↔ Backend

```
┌─────────────┐
│   React     │
│  (5173)     │
└──────┬──────┘
       │
       │ fetch('http://localhost:3001/api/auth/login')
       │
       │ POST JSON
       ▼
┌─────────────────┐
│  Express Server │
│  (3001)         │
│  ├─ Routes      │
│  ├─ Controllers │
│  └─ Logic       │
└──────┬──────────┘
       │
       │ Response JSON
       ▼
    React (actualiza UI)
```

---

## 🚀 Agregar Nuevos Servicios

### 1. Crear estructura del nuevo servicio

```bash
# Desde la carpeta proyecto:
mkdir -p backend/users-service/src/{controllers,routes}
```

### 2. Crear package.json del nuevo servicio

```bash
cd backend/users-service
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
```

### 3. Actualizar el package.json raíz

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:auth\" \"npm run dev:users\" \"npm run dev:frontend\"",
    "dev:auth": "cd backend/auth-service && npm run dev",
    "dev:users": "cd backend/users-service && npm run dev",
    "dev:frontend": "cd frontend && npm run dev"
  }
}
```

---

## 🔐 Variables de Entorno

### backend/auth-service/.env
```
PORT=3001
NODE_ENV=development
DB_URL=mongodb://localhost/auth
JWT_SECRET=tu-secreto-aqui
```

### backend/users-service/.env
```
PORT=3002
NODE_ENV=development
DB_URL=mongodb://localhost/users
AUTH_SERVICE_URL=http://localhost:3001
```

### frontend/.env.local (Vite)
```
VITE_API_URL=http://localhost:3001/api
```

---

## 🛡️ CORS (Comunicación Frontend-Backend)

En tu backend (Express), asegúrate de habilitar CORS:

```javascript
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173'    // Tu frontend local
    : 'https://tu-dominio.com',
  credentials: true
}));

app.use(express.json());
```

---

## 🔁 Flujo de Trabajo Diario

```bash
# 1. Primera vez: instalar todo
npm run install:all

# 2. Iniciar desarrollo (con un comando)
npm run dev

# 3. Esto abre:
#    ✓ Backend Auth (3001) - desarrollo con nodemon
#    ✓ Frontend React (5173) - hot reload con Vite
#    → Todos los logs en UNA terminal

# 4. Editar código en VSCode
# 5. Los cambios se recargan automáticamente
# 6. Ctrl+C para detener todo
```

---

## 🎯 Ventajas de Esta Arquitectura

| Aspecto | Beneficio |
|--------|-----------|
| **Escalabilidad** | Agregar servicios sin afectar los existentes |
| **Desarrollo Paralelo** | Múltiples personas en diferentes servicios |
| **Independencia** | Cada servicio tiene sus dependencias |
| **Facilidad de Deploy** | Cada servicio se despliega por separado |
| **Debugging** | Aislar problemas por servicio |

---

## 📚 Próximas Lecturas

- **Express.js Guide**: https://expressjs.com/es/
- **REST API Best Practices**: https://restfulapi.net/
- **TypeScript in React**: https://react-typescript-cheatsheet.netlify.app/
- **Vite Documentation**: https://vitejs.dev/guide/
