# PainRadar 🎯

**Radar de oportunidades de app.** Usa un **agente Claude local** (tu propia suscripción, sin
API key) para buscar quejas reales de usuarios en múltiples fuentes e idiomas y convertirlas en
**ideas de app validadas y rankeadas**, cada una respaldada por citas reales con enlace a la fuente.

> 🧍 Herramienta **personal, local, de un solo usuario**. Sin login. Tus datos se quedan en tu
> máquina (SQLite). Pensada para que **tú** descubras tu próxima app, no para venderse como SaaS
> (ver [Legalidad](#-es-permitido-usarlo-con-tu-cuenta-personal-legalidad)).

---

## Tabla de contenido

- [Qué hace](#-qué-hace)
- [Características](#-características)
- [Motor de IA: 2 modos](#-motor-de-ia-2-modos)
- [Inicio rápido](#-inicio-rápido)
- [Usar tu suscripción de Claude (sin API key)](#-usar-tu-suscripción-de-claude-sin-api-key)
- [Configuración (.env)](#-configuración-env)
- [Arquitectura](#-arquitectura)
- [API interna](#-api-interna)
- [Persistencia (SQLite)](#-persistencia-sqlite)
- [Cómo se calcula la puntuación](#-cómo-se-calcula-la-puntuación)
- [Comandos](#-comandos)
- [Stack](#-stack)
- [Legalidad: uso personal](#-es-permitido-usarlo-con-tu-cuenta-personal-legalidad)

---

## ✨ Qué hace

1. Eliges un **nicho** (lo escribes o lo exploras en el **catálogo**: salud, amor, dinero y más).
2. Eliges el **idioma** de búsqueda y las **fuentes** donde buscar.
3. Un **agente Claude** busca en la web quejas reales de usuarios de las regiones de ese idioma.
4. Obtienes un **dashboard** con oportunidades **rankeadas por dolor × frecuencia × hueco de
   mercado**; cada una incluye: cita textual real + enlace a la fuente, resumen del problema,
   scores, y una **idea de app sugerida**.
5. Si buscas en un idioma distinto al español, cada resultado se muestra en su **idioma original
   y traducido al español** (en pantalla y en el PDF).
6. Guardas favoritos y **exportas a PDF**.

---

## 🧩 Características

| Característica | Detalle |
|---------------|---------|
| **Multi-idioma** | Español, Inglés, Portugués, Francés, Italiano, Alemán. Cada idioma orienta la búsqueda a las **regiones** donde se habla (inglés → EE.UU./UK/Canadá/Australia/Irlanda; español → España + LatAm; etc.). |
| **Resultados bilingües** | Si el idioma ≠ español, cada texto (título, resumen, idea, citas) aparece en el original **y traducido al español** debajo (🇪🇸). |
| **Fuentes seleccionables** | Reddit, YouTube, Trustpilot, Google Play, App Store, G2, Capterra, TrustRadius, Product Hunt, AppSumo. El agente busca solo en las que elijas. |
| **Catálogo de nichos** | Salud, Amor y relaciones, Dinero y finanzas, Productividad, Fitness, Educación, Hogar, Viajes — cada uno con **nicho → subnicho → micronicho**. |
| **Cronómetro** | Muestra el tiempo que tarda la búsqueda en vivo; al terminar indica la duración (o "desde caché"). |
| **Detener / Reanudar / Descartar** | Durante una búsqueda puedes **detenerla** (cancela el agente también en el servidor, ahorrando cuota). Luego puedes **reanudarla** (se ejecuta de nuevo) o **descartarla**. *(Una IA-agente no se puede congelar a mitad y continuar; "detener" cancela la corrida.)* |
| **Caché + Refrescar** | Cada búsqueda (por nicho + idioma + fuentes + recencia) se cachea; reabrir es instantáneo. Botón **Refrescar** la vuelve a ejecutar. |
| **Historial** | Página dedicada con **buscador por nicho** y **filtro por idioma** para reabrir cualquier búsqueda guardada con un clic. En el inicio se muestran las recientes con enlace "Ver todo". |
| **Favoritos** | Guarda oportunidades; persisten localmente. |
| **Export PDF** | PDF bilingüe con todas las oportunidades, citas y enlaces. |
| **Sin login** | App local de un usuario; entras directo a la búsqueda. |
| **Diseño** | Design system **Neobrutalism** (bordes gruesos, sombras duras, colores saturados). |

---

## 🔌 Motor de IA: 2 modos

| Modo | Qué usa | Llave | Coste |
|------|---------|-------|-------|
| `claude-agent` | **Agente Claude local** con tu suscripción (recomendado) | `CLAUDE_CODE_OAUTH_TOKEN` | Cuota de tu plan |
| `mock` | Datos de demostración bilingües (deterministas) | Ninguna | — |

**No tienes que elegir el modo a mano:** si pones tu `CLAUDE_CODE_OAUTH_TOKEN` en `.env.local`,
la app usa el **agente** automáticamente; si no hay token, usa **mock** (demo). El agente usa sus
herramientas **WebSearch / WebFetch** para investigar él mismo — **no necesitas llaves de Reddit,
YouTube ni de ninguna fuente**. Si el agente falla o devuelve vacío, cae a `mock` para no romperse.

> Para forzar un modo puedes poner `AI_PROVIDER=claude-agent` o `AI_PROVIDER=mock` en `.env.local`.

---

## 🚀 Inicio rápido

```bash
npm install                     # instala dependencias (incluye next)
cp .env.example .env.local      # crea tu config — 'mock' funciona sin ninguna llave
npm run dev                     # arranca en http://localhost:3000
```

Abre **http://localhost:3000** — entra directo a la búsqueda. Elige idioma y fuentes, escribe un
nicho (o explóralo en el catálogo) y pulsa **Buscar**.

> En modo `mock` los resultados son instantáneos y de demostración. Para resultados reales, usa
> el modo agente 👇.

### 📦 Tras clonar el repo (en otra PC o carpeta)

Al clonar, Git **no** incluye estas 3 cosas (es a propósito) y por eso debes prepararlas **una vez**:

| No viene al clonar | Por qué | Qué hacer |
|--------------------|---------|-----------|
| `node_modules/` | Pesa cientos de MB | `npm install` |
| `.env.local` (tu token) | Es secreto/privado | Copiar de otra carpeta o crearlo (ver abajo) |
| `data/painradar.db` | Son tus datos locales | Se crea solo al usar la app (empieza vacío) |

Pasos:

```bash
cd painradar
npm install                     # 1) dependencias

# 2) tu config con el token:
#    a) copiar la de otra carpeta:
copy "C:\ruta\al\otro\painradar\.env.local" .env.local      # (PowerShell: Copy-Item ...)
#    b) o crearla desde cero:
cp .env.example .env.local      # y luego pega tu token (ver SETUP-AGENT.md)

npm run dev                     # 3) correr
```

> Si el puerto 3000 está ocupado por otra copia, la terminal usará 3001 (abre esa URL), o cierra
> la otra primero. Cada carpeta tiene su propia base de datos (favoritos/historial independientes).

> El repo incluye un `.npmrc` con `legacy-peer-deps=true`, así que `npm install` funciona sin flags.

### 🌐 Usar desde otros equipos de tu red local

Solo un equipo corre el servidor; los demás (otra PC, Mac, celular en la misma WiFi) lo abren
en el navegador con la **IP del equipo servidor**: `http://TU-IP:3000`. Todos comparten la
**misma base de datos** (favoritos/historial) porque hay un solo servidor.

- **Recomendado:** en el equipo servidor usa **`iniciar-en-red.bat`** (Windows) o
  **`iniciar-en-red.command`** (Mac) — modo producción. Es lo
  más estable para varios equipos y **no necesitas configurar ninguna IP**.
- Si prefieres el **modo desarrollo** en red, pon **tu** IP local en tu `.env.local`:
  `LAN_IP=192.168.x.x` (la ves con `ipconfig` en Windows o `ifconfig` en Mac/Linux).
- El **firewall** puede pedir permitir Node.js la primera vez → acéptalo (red privada).
- Es para tu red local; **no lo expongas a internet** (no tiene login).

---

## 🔑 Usar tu suscripción de Claude (sin API key)

El modo `claude-agent` corre un agente en **tu máquina** con **tu suscripción** de Claude.

1. Instala Claude Code e inicia sesión:
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude          # abre el navegador para iniciar sesión
   ```
2. Genera un token de larga duración:
   ```bash
   claude setup-token
   ```
3. Pégalo en `.env.local` (con solo esto, la app ya usa el agente):
   ```env
   CLAUDE_CODE_OAUTH_TOKEN=<pega-el-token>
   ```
4. `npm run dev` y busca. La **primera** búsqueda de cada combinación tarda un par de minutos
   (el agente lee hilos reales); luego queda en caché y es instantánea.

Más detalle en **[SETUP-AGENT.md](SETUP-AGENT.md)**.

---

## ⚙️ Configuración (.env)

Copia `.env.example` a `.env.local`. Lo único necesario es tu token (y solo si quieres el agente).

| Variable | Por defecto | Para qué |
|----------|-------------|----------|
| `CLAUDE_CODE_OAUTH_TOKEN` | — | Tu token de suscripción. Con esto puesto, la app usa el agente. |
| `AI_PROVIDER` | auto | Opcional: `claude-agent` o `mock` para forzar un modo. |
| `PAINRADAR_AGENT_MODEL` | `sonnet` | Modelo del agente (`opus` / `sonnet` / `haiku`) |
| `PAINRADAR_AGENT_MAX_TURNS` | `30` | Máximo de vueltas del agente |
| `PAINRADAR_AGENT_TIMEOUT_MS` | `420000` | Tiempo límite del agente (ms) |
| `PAINRADAR_DATA_DIR` | `./data` | Carpeta de la base de datos SQLite |

> `.env.local`, `node_modules/`, `.next/` y `data/` están en `.gitignore` y **no** se suben.

---

## 🏗️ Arquitectura

Organización **feature-first**:

```
src/
├── app/
│   ├── (main)/                 # Dashboard + favoritos (layout sin login)
│   │   ├── dashboard/          # Pantalla de búsqueda + resultados
│   │   └── favorites/          # Oportunidades guardadas
│   ├── api/
│   │   ├── radar/              # Ejecuta/cachea una búsqueda
│   │   ├── favorites/          # Guardar/listar/quitar favoritos
│   │   ├── history/            # Historial de búsquedas
│   │   └── export/             # Genera el PDF
│   ├── layout.tsx              # lang="es", fuentes, metadata
│   └── page.tsx                # Redirige / → /dashboard
├── features/
│   ├── search/                 # options (idiomas/fuentes), catálogo de nichos, buscador, historial
│   ├── ingestion/              # datos mock bilingües (fallback / demo)
│   ├── analysis/               # analyze (agente o mock) + claude-agent (agente local)
│   ├── opportunities/          # dashboard, tarjeta bilingüe, citas, estado vacío, cronómetro
│   ├── favorites/              # store (Zustand) + botón
│   └── export/                 # botón + documento PDF (@react-pdf)
└── shared/
    ├── components/ui/          # Button, Card, Input, Tag, ScoreBar (Neobrutalism)
    ├── lib/                    # db.ts (SQLite), utils.ts (provider switch)
    └── types/domain.ts         # Esquemas Zod: Opportunity, Citation, SearchFilters…
```

**Flujo de una búsqueda:** `dashboard` → `ResultsView` llama a `GET /api/radar` →
`runSearch()` (pipeline) → `analyze()` → en modo agente, `analyzeWithClaudeAgent()` busca en la
web y rankea (o `mock` como fallback) → se cachea en SQLite → se renderiza.

---

## 🛰️ API interna

| Ruta | Método | Función |
|------|--------|---------|
| `/api/radar?niche=&recency=&lang=&sources=&refresh=` | GET | Ejecuta (o sirve de caché) una búsqueda. `refresh=1` ignora la caché. |
| `/api/favorites` | GET / POST / DELETE | Listar / alternar (`{opportunity}`) / quitar (`?id=`) favoritos |
| `/api/history` | GET | Búsquedas recientes |
| `/api/export` | POST | Genera el PDF a partir de `{niche, opportunities}` |

---

## 💾 Persistencia (SQLite)

Sin base de datos externa: todo vive en **`./data/painradar.db`** (`node:sqlite`, sin compilación
nativa). Tablas:

- **`favorites`** — oportunidades guardadas.
- **`search_cache`** — resultados por `clave = nicho|recencia|idioma|fuentes`; también alimenta el
  **historial** (ordenado por fecha).

Borra `data/painradar.db` para reiniciar; respáldalo para conservar tus ideas guardadas.

---

## 📊 Cómo se calcula la puntuación

Cada oportunidad recibe **3 puntuaciones de 0 a 100** (equivalen a una escala de 0 a 10 ×10:
`76/100 = 7.6/10`). En modo agente, es el propio **Claude** quien las asigna leyendo las quejas
reales que encuentra.

| Métrica | Peso | Qué mide | Qué la sube |
|---------|------|----------|-------------|
| **Dolor** | 45% | Qué tan frustrados/molestos están los usuarios (intensidad de la emoción negativa). | Lenguaje fuerte: “lo odio”, “es una pesadilla”, “me rendí”. |
| **Frecuencia** | 35% | Cuánta gente distinta menciona el mismo problema (qué tan extendido y recurrente es). | El mismo dolor repetido por muchas personas en muchos hilos/videos/reseñas. |
| **Hueco de mercado** | 20% | Qué tan SIN resolver está hoy (el espacio libre / la oportunidad). | “No existe nada que haga esto” o que las soluciones actuales son malas. |

**Puntuación global (overall):** combinación ponderada (el dolor pesa más porque es la mejor señal):

```
global = Dolor × 0.45  +  Frecuencia × 0.35  +  Hueco × 0.20
```

Ejemplo: Dolor 90, Frecuencia 80, Hueco 60 → `90×0.45 + 80×0.35 + 60×0.20 = 80.5 ≈ 81/100`.

**El ranking (#1, #2, #3…):** las oportunidades se ordenan de **mayor a menor** puntuación global.
La **#1** es el problema más doloroso, frecuente y menos resuelto — lo que más vale la pena construir.

> En la app: enlace **“¿cómo se calcula?”** en los resultados, o el pie → página `/metodologia`.

---

## 🧰 Comandos

```bash
npm run dev        # servidor de desarrollo (http://localhost:3000)
npm run build      # build de producción
npm run start      # servidor de producción
npm run typecheck  # verificación de tipos (tsc)
npm run lint       # ESLint
```

---

## 🧱 Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 3.4** — design system Neobrutalism
- **@anthropic-ai/claude-agent-sdk** — motor de análisis local
- **node:sqlite** — persistencia local
- **Zod** (validación) · **Zustand** (estado) · **@react-pdf/renderer** (PDF) · **lucide-react** (iconos)

---

## ⚖️ ¿Es permitido usarlo con tu cuenta personal? (legalidad)

### 1) Sí — está permitido para uso personal

La página oficial **[Legal and compliance — Claude Code](https://code.claude.com/docs/en/legal-and-compliance)**,
en la sección *“Authentication and credential use”*, dice textualmente:

> **“OAuth authentication is intended exclusively for purchasers of Claude Free, Pro, Max, Team, and Enterprise subscription plans and is designed to support ordinary use of Claude Code and other native Anthropic applications.”**

Y en *“Acceptable use”*:

> **“Advertised usage limits for Pro and Max plans assume ordinary, individual usage of Claude Code and the Agent SDK.”**

El artículo **[Use the Claude Agent SDK with your Claude plan](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)**
confirma que el crédito mensual del Agent SDK cubre expresamente:

> **“Third-party apps that authenticate with your Claude subscription through the Agent SDK.”**

PainRadar es justo eso: una **app de terceros (la tuya)** que se autentica con **tu** suscripción
a través del Agent SDK → **uso ordinario e individual = permitido** ✅. Además, desde el **15 de junio
de 2026**, ese uso *“no longer counts toward your Claude plan's usage limits”* (tiene un crédito
mensual aparte para Pro/Max).

**⚠️ La línea roja (lo que NO se puede):**

> **“Anthropic does not permit third-party developers to offer Claude.ai login or to route requests through Free, Pro, or Max plan credentials on behalf of their users.”**

Es decir: no puedes hacer un servicio donde **otras personas** inicien sesión con su Claude y tu
servidor use **las suscripciones de ellos**. Para eso se usa la **API de pago** (Commercial Terms).
*(No es asesoría legal; los términos pueden cambiar — lee las fuentes.)*

### 2) ¿Cómo se llama esta forma de usar la IA?

No tiene un solo nombre, pero se describe con estos términos:

- **App “local-first” agéntica** — corre en tu máquina, no en un servidor en la nube.
- Construida sobre el **Claude Agent SDK** (el framework oficial).
- **“BYO subscription” / “bring-your-own-account”** — trae tu propia cuenta (variante de *BYOK*, bring-your-own-key).
- **Single-tenant / self-hosted / on-device** — un solo usuario, auto-alojado, orquestación del agente del lado del cliente.

En una frase: *PainRadar es una **app local-first de un solo usuario, agéntica, construida sobre el
Claude Agent SDK con autenticación por suscripción (BYO-subscription)**.*

**Fuentes:**
[Legal and compliance — Claude Code](https://code.claude.com/docs/en/legal-and-compliance) ·
[Use the Claude Agent SDK with your Claude plan](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan) ·
[Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan) ·
[Consumer Terms](https://www.anthropic.com/legal/consumer-terms) ·
[Usage Policy](https://www.anthropic.com/legal/aup)
