# 🚀 GUÍA DE PUERTOS - Proyecto de Microservicios

## 📍 Puertos Actuales (Por Defecto)

```
┌──────────────────────────────┐
│     BACKEND (Express)        │
│     Puerto: 3001             │
│     URL: http://localhost:3001
│                              │
│ Archivo: backend/auth-       │
│          service/.env        │
└──────────────────────────────┘

         ↕ (Comunicación)

┌──────────────────────────────┐
│    FRONTEND (React + Vite)   │
│     Puerto: 5173             │
│     URL: http://localhost:5173
│                              │
│ Archivo: frontend/           │
│          vite.config.ts      │
└──────────────────────────────┘
```

---

## ✏️ Cambiar Puertos

### **Opción 1: Cambiar Puerto del Backend**

Edita: `backend/auth-service/.env`

```env
PORT=3001     ← Cambia este número
```

Ejemplo: Cambiar a puerto 4000
```env
PORT=4000
```

### **Opción 2: Cambiar Puerto del Frontend**

Edita: `frontend/vite.config.ts`

```typescript
server: {
  port: 5173,   ← Cambia este número
  // ...
}
```

Ejemplo: Cambiar a puerto 3000
```typescript
server: {
  port: 3000,
  // ...
}
```

---

## 📋 Puertos Recomendados

| Servicio | Puerto Recomendado | Estado |
|----------|-------------------|--------|
| Backend Auth | 3001 | ✅ Usando |
| Backend Users | 3002 | 📋 Para agregar |
| Backend Products | 3003 | 📋 Para agregar |
| Frontend | 5173 | ✅ Usando |

---

## 🔌 Cómo Se Conectan

El **frontend hace requests al backend**:

```javascript
// Frontend (React)
const API_URL = 'http://localhost:3001/api';  // Apunta al backend

fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

**Si cambias el puerto del backend, debes actualizar aussi:**
```javascript
const API_URL = 'http://localhost:4000/api';  // Nuevo puerto
```

---

## ✅ Verificar Que Están en Puertos Diferentes

### **Terminal 1 - Backend**
```bash
npm run dev:backend
```
Deberías ver:
```
🚀 Port:        3001    ← AQUÍ
```

### **Terminal 2 - Frontend**
```bash
npm run dev:frontend
```
Deberías ver:
```
➜  Local:   http://localhost:5173/    ← AQUÍ (diferente)
```

Si ambos usan **puertos diferentes** → ✅ Está correcto

---

## 🚨 Problemas Comunes

### ❌ "Puerto 3001 ya en uso"
Cambia en `backend/auth-service/.env`:
```env
PORT=4000
```

### ❌ "Puerto 5173 ya en uso"
Cambia en `frontend/vite.config.ts`:
```typescript
port: 5174
```

### ❌ "Frontend no puede conectar backend"
Verifica que el frontend use la URL correcta:
```javascript
const API_URL = 'http://localhost:3001/api';  // Mismo puerto que backend
```

---

## 📚 Archivo de Referencia Rápida

Ver `.env.ports` para recordar qué puerto usa cada servicio.

---

## 🎯 Resumen

**Backend:** Puerto 3001 (edita en `.env`)  
**Frontend:** Puerto 5173 (edita en `vite.config.ts`)  
**Están en puertos DIFERENTES** ✅
