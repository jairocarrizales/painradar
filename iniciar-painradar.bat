@echo off
chcp 65001 >nul
cd /d "%~dp0"
title PainRadar
echo ================================================
echo   PainRadar - iniciando...
echo   Se abrira solo en el navegador en unos segundos.
echo   (Para apagarlo: cierra esta ventana)
echo ================================================
echo.

rem Abre el navegador en http://localhost:3000 tras 6 segundos (en segundo plano)
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 6; Start-Process 'http://localhost:3000'"

rem Arranca el servidor (se queda corriendo en esta ventana)
call npm run dev
pause
