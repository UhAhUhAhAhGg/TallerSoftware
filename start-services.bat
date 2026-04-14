@echo off
REM Script para levantar todos los servicios en Windows (alternativa a concurrently)
REM Este script abre múltiples ventanas PowerShell para cada servicio

echo Iniciando servicios...
echo.

REM Terminal 1: Backend Auth Service
start powershell -NoExit -Command "cd backend/auth-service; npm run dev; Read-Host 'Presiona Enter para cerrar'"

REM Esperar un segundo antes de abrir la siguiente terminal
timeout /t 1 /nobreak

REM Terminal 2: Frontend
start powershell -NoExit -Command "cd frontend; npm run dev; Read-Host 'Presiona Enter para cerrar'"

echo.
echo Todos los servicios se estan iniciando...
echo - Backend (Auth Service): http://localhost:3001
echo - Frontend (React + Vite): http://localhost:5173
echo.
pause
