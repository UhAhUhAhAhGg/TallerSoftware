# ✅ VERIFICACIÓN COMPLETA - Backend y Frontend Funcionando

## 🚀 Paso 1: Instala Dependencias (Primera vez)

```bash
npm run install:all
```

Esto instala paquetes en:
- Raíz del proyecto
- `backend/auth-service`
- `frontend`

---

## 🎯 Paso 2: Ejecuta TODO con UN comando

```bash
npm run dev
```

Deberías ver en la terminal:

```
╔════════════════════════════════════════╗
║        Auth Service Running            ║
╠════════════════════════════════════════╣
║  🚀 Port:        3001                  ║
║  📍 Environment: development           ║
║  🔗 URL:         http://localhost:3001 ║
║  ✅ Health:      /health                ║
╚════════════════════════════════════════╝

  VITE v8.0.4  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Si ves esto → Backend y Frontend están levantados**

---

## ✔️ Paso 3: Verifica que Funcione Correctamente

### **Test 1: Backend Raíz**

Abre en el navegador:
```
http://localhost:3001/
```

**Deberías ver:**
```json
{
  "service": "Auth Service API",
  "version": "1.0.0",
  "status": "running",
  "description": "Microservicio de autenticación",
  "endpoints": {
    "health": "GET /health",
    "login": "POST /api/auth/login",
    "register": "POST /api/auth/register",
    "logout": "POST /api/auth/logout",
    "getCurrentUser": "GET /api/auth/me"
  },
  "timestamp": "2026-04-14T...",
  "environment": "development",
  "port": 3001
}
```

✅ **Si ves esto → Backend funciona correctamente**

---

### **Test 2: Backend Health**

```
http://localhost:3001/health
```

**Deberías ver:**
```json
{
  "status": "ok",
  "service": "auth-service",
  "timestamp": "2026-04-14T...",
  "environment": "development"
}
```

✅ **Si ves esto → Backend health check OK**

---

### **Test 3: Frontend**

```
http://localhost:5173/
```

**Deberías ver:**
- La página de React
- Logo de React/Vite
- Sin errores en la consola (F12)

✅ **Si ves esto → Frontend funciona correctamente**

---

### **Test 4: Abre DevTools (F12) en Frontend**

Presiona `F12` → Pestaña **Console**

**Deberías ver:**
- ✅ Sin errores rojos
- ✅ Sin warnings en rojo

Si ves errores CORS o de conexión:
→ Significa que frontend no puede conectar backend
→ Revisa que `http://localhost:3001` sea accesible

---

## 🧪 Test 5: Prueba un Endpoint con Postman

### **Register (POST)**

```
URL: http://localhost:3001/api/auth/register
Method: POST
Content-Type: application/json

Body:
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Respuesta Esperada (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1234567890,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

✅ **Si ves esto → Backend está guardando datos correctamente**

---

### **Login (POST)**

```
URL: http://localhost:3001/api/auth/login
Method: POST
Content-Type: application/json

Body:
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Respuesta Esperada (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": 1234567890,
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "jwt-token-aqui"
}
```

✅ **Si ves esto → Autenticación funciona**

---

## 📋 Checklist de Verificación Completa

| # | Test | URL/Action | Esperado | Estado |
|---|------|-----------|----------|--------|
| 1 | Backend Raíz | http://localhost:3001/ | JSON info | ✅ |
| 2 | Health Check | http://localhost:3001/health | {"status":"ok"} | ✅ |
| 3 | Frontend | http://localhost:5173/ | React page | ✅ |
| 4 | Console (F12) | DevTools | Sin errores | ✅ |
| 5 | Register | POST /api/auth/register | 201 Created | ✅ |
| 6 | Login | POST /api/auth/login | 200 OK | ✅ |

Si TODO está en ✅ → **Tu proyecto funciona perfectamente**

---

## 🚨 Si Algo Falla

### ❌ Backend muestra 404

Asegúrate que edites los archivos en:
- `backend/auth-service/src/index.js` ✓
- `backend/auth-service/src/controllers/auth.controller.js` ✓
- `backend/auth-service/src/routes/auth.routes.js` ✓

### ❌ Frontend no carga

Verifica `frontend/vite.config.ts`:
```typescript
server: {
  port: 5173,
}
```

### ❌ CORS Error

Asegúrate que `.env` tenga:
```
CORS_ORIGIN=http://localhost:5173
```

### ❌ "npm: command not found"

Instala Node.js desde https://nodejs.org/

---

## 💡 Resumen Rápido

```bash
# Primera vez
npm run install:all

# Todos los días
npm run dev

# Luego abre en navegador
http://localhost:3001/        ← Backend
http://localhost:5173/        ← Frontend
```

**¡Eso es todo! El proyecto debe funcionar correctamente.** ✅
