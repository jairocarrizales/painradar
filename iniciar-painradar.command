#!/bin/bash
# PainRadar — iniciar en Mac (doble clic). Equivalente a iniciar-painradar.bat de Windows.
cd "$(dirname "$0")"
echo "================================================"
echo "  PainRadar - iniciando..."
echo "  Se abrira solo en el navegador en unos segundos."
echo "  (Para apagarlo: cierra esta ventana o pulsa Ctrl+C)"
echo "================================================"
echo

# Abre el navegador en http://localhost:3000 tras 6 segundos (en segundo plano)
( sleep 6; open "http://localhost:3000" ) &

# Arranca el servidor (se queda corriendo en esta ventana)
npm run dev
