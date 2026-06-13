# Cómo usar PainRadar cada día

No necesitas a Claude (esta sesión) para usar la app. Solo necesitas **arrancar el
servidor** en tu máquina. Aquí está todo en español y paso a paso.

---

## 1) Activar la IA — UNA SOLA VEZ

Para que la IA (el agente que busca en la web) funcione **sin depender de la sesión de
Claude Code**, necesitas pegar tu llave personal una vez:

1. Abre una terminal (PowerShell) en la carpeta del proyecto.
2. Escribe y ejecuta:
   ```
   claude setup-token
   ```
   Inicia sesión si te lo pide y **copia el token** que aparece.
3. Abre el archivo **`.env.local`** (en la carpeta del proyecto) y pega el token:
   ```
   CLAUDE_CODE_OAUTH_TOKEN=aqui-va-tu-token
   ```
   Con solo esa línea, la app ya usa el agente automáticamente.
4. Guarda el archivo. **Listo, esto no se vuelve a hacer.**

> 💡 Si ya tienes Claude Code instalado y con sesión iniciada en tu máquina, puede que
> funcione sin el token. Pero pegarlo es lo más seguro y garantiza que la IA esté lista
> siempre.

---

## 2) Iniciar PainRadar cada día

**La forma fácil:** haz **doble clic** en el archivo de inicio:
- **Windows:** `iniciar-painradar.bat`
- **Mac:** `iniciar-painradar.command` (la 1ª vez: clic derecho → **Abrir**, para saltar el aviso de seguridad)

- Se abre una ventana (el servidor) — **no la cierres mientras uses la app**.
- A los ~6 segundos se abre solo tu navegador en **http://localhost:3000**.

**La forma manual** (si prefieres): abre una terminal en la carpeta y escribe:
```
npm run dev
```
Luego abre tu navegador en **http://localhost:3000**.

---

## 3) Apagarlo

Cuando termines, **cierra la ventana negra** (o pulsa `Ctrl + C` en ella). La app deja de
correr. Tus favoritos y búsquedas quedan guardados para la próxima vez.

---

## Preguntas rápidas

- **¿Necesito internet?** Sí, para que la IA busque en la web.
- **¿La primera búsqueda tarda?** Sí, un par de minutos por nicho/idioma — el agente lee
  hilos reales. Después queda en caché y es instantánea (botón **Refrescar** para rehacerla).
- **¿Dónde se guardan mis cosas?** En `data/painradar.db` (favoritos, caché e historial).
  Respáldalo si no quieres perderlos.
- **¿Quiero probar sin gastar cuota de IA?** Cambia en `.env.local` a `AI_PROVIDER=mock`
  (datos de demostración, instantáneo).
- **¿La IA no responde y salen datos raros/demo?** Revisa que el token esté bien pegado en
  `.env.local` y que tengas internet. Si el agente falla, la app muestra datos de demo.
