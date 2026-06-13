#!/bin/bash
# PainRadar — modo RED LOCAL en Mac (doble clic). Equivalente a iniciar-en-red.bat.
cd "$(dirname "$0")"
echo "================================================"
echo "  PainRadar - modo RED LOCAL (produccion)"
echo "  - Mas estable para usarlo desde otros equipos."
echo "  - Primero compila (~1 min), luego arranca."
echo "================================================"
echo

npm run build || { echo; echo "Hubo un error al compilar. Revisa el mensaje de arriba."; read -p "Pulsa Enter para cerrar..."; exit 1; }

# Muestra la IP de esta Mac para abrirla desde otros equipos
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
echo
echo "Servidor listo. Desde otros equipos de tu red, abre:  http://$IP:3000"
echo

npm run start
