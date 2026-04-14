# Script PowerShell para levantar todos los servicios en Windows
# Uso: ./start-services.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Iniciando Microservicios" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Validar que estamos en la carpeta correcta
if (-not (Test-Path "backend/auth-service/package.json")) {
    Write-Host "Error: No estás en la carpeta raíz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "[1/2] Iniciando Backend (Auth Service)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList {
    cd "backend/auth-service"
    npm run dev
} -NoNewWindow:$false

Start-Sleep -Seconds 2

Write-Host "[2/2] Iniciando Frontend (React + Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList {
    cd "frontend"
    npm run dev
} -NoNewWindow:$false

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Servicios iniciados:" -ForegroundColor Green
Write-Host "  • Backend (Auth): http://localhost:3001" -ForegroundColor Cyan
Write-Host "  • Frontend (Vite): http://localhost:5173" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Green
