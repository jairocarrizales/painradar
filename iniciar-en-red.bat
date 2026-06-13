@echo off
chcp 65001 >nul
cd /d "%~dp0"
title PainRadar (red local)
echo ================================================
echo   PainRadar - modo RED LOCAL (produccion)
echo   - Mas estable para usarlo desde otros equipos.
echo   - Primero compila (puede tardar ~1 min), luego arranca.
echo   Desde otro equipo de tu red, abre:  http://TU-IP:3000
echo   (cierra esta ventana para apagar)
echo ================================================
echo.

call npm run build
if errorlevel 1 (
  echo.
  echo Hubo un error al compilar. Revisa el mensaje de arriba.
  pause
  exit /b 1
)

echo.
echo Servidor listo. Abrelo desde otros equipos con la IP de esta maquina.
call npm run start
pause
