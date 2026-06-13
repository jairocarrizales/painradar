# BUSINESS_LOGIC.md - PainRadar

> Generado por SaaS Factory | Fecha: 2026-06-13

## 1. Problema de Negocio

**Dolor:** Los makers de apps iOS (indie hackers) pierden mucho tiempo rastreando
manualmente Reddit y YouTube buscando quejas reales de usuarios en EE.UU. — software
que odian, apps que les fallan, o problemas que nadie ha resuelto todavia — para detectar
oportunidades de apps que valga la pena construir. Hoy es 100% manual, lento y dependiente
de la suerte al scrollear. El problema central es el **descubrimiento de oportunidades
validadas por la voz real del usuario**.

**Costo actual:** Se pierden **varios dias a la semana** en investigacion manual, con el
agravante de que al final puedes **no encontrar nada util** (peor que no buscar). El riesgo
mayor: enfocarte en un problema que **no es el mas importante**, construir la app y que **a
nadie le importe** -> meses de trabajo + cuota de Apple Developer ($99/ano) tirados a la
basura. El costo real no es solo el tiempo: es **construir sobre la idea equivocada**.

## 2. Solucion

**Propuesta de valor:** "Un radar de oportunidades que rastrea Reddit y YouTube para
encontrar quejas reales de usuarios en EE.UU. y las convierte en ideas de apps validadas
para makers de iOS."

**Flujo principal (Happy Path):**
1. El maker **elige un nicho** (o keyword / subreddit) -> rastreo **bajo demanda**
2. El sistema **recolecta quejas reales** de Reddit + YouTube (posts, comentarios,
   transcripciones) de usuarios en EE.UU.
3. La **IA analiza, agrupa y rankea** los problemas por: intensidad del dolor, frecuencia
   (cuanta gente lo menciona) y hueco de mercado (si existe o no app que lo resuelva)
4. El maker ve un **dashboard** con las TOP oportunidades; por cada una: cita textual real
   del usuario + link directo a la fuente + problema resumido + scores + **idea de app
   sugerida por la IA**. Guarda favoritas y exporta a PDF.

## 3. Usuario Objetivo

**Rol principal:** El **indie hacker en solitario** — sabe construir (codigo o no-code/IA),
ya lanzo 1-2 apps, busca su proximo proyecto que SI pegue. Le sobra capacidad de construir,
le falta saber QUE construir.

**Rol secundario:** El **aspirante a maker** — quiere lanzar su primera app pero esta
paralizado porque no tiene una idea validada. Necesita que le digan "construye esto, hay
demanda real".

**Contexto:** Negocio vendido como **SaaS** a estos makers. El cliente valora evidencia
real de demanda por encima de corazonadas, y quiere reducir drasticamente el riesgo de
construir una app que nadie quiere.

## 4. Arquitectura de Datos

**Input:**
- Nicho / keyword / subreddit elegido por el maker (texto o seleccion)
- Quejas de Reddit: posts y comentarios (Reddit API)
- Quejas de YouTube: comentarios y transcripciones de videos (YouTube Data API)
- (Opcional) Filtros: idioma (en-US), antiguedad (ultimo mes/ano), minimo de upvotes

**Output:**
- Dashboard de oportunidades rankeadas
- Por cada oportunidad:
  - Cita textual real del usuario (la queja en sus palabras) + link directo a la fuente
  - Problema resumido por la IA
  - Scores: dolor / frecuencia / hueco de mercado
  - Idea de app sugerida por la IA
- Coleccion de favoritas guardadas (por usuario)
- Exportar oportunidades a PDF

**Storage (Supabase tables sugeridas):**
- `profiles`: usuario/maker (extiende auth.users)
- `searches`: cada busqueda bajo demanda (nicho/keyword, filtros, estado, fecha, user_id)
- `sources`: items crudos recolectados (plataforma reddit/youtube, url, autor, texto,
  upvotes/likes, fecha, search_id)
- `opportunities`: oportunidad analizada (problema resumido, scores dolor/frecuencia/hueco,
  idea de app sugerida, search_id)
- `opportunity_citations`: citas textuales que respaldan una oportunidad (texto, url fuente,
  opportunity_id, source_id)
- `favorites`: oportunidades guardadas por el maker (user_id, opportunity_id)
- `exports`: registro de PDFs generados (opcional; user_id, payload, fecha)
- `events`: instrumentacion de funnel (signup, search_run, opportunity_saved, pdf_exported)

## 5. KPI de Exito

**Metrica principal (Calidad del hallazgo):** Entregar al menos **10 oportunidades reales
y rankeadas** por cada busqueda, cada una respaldada por **citas textuales** de usuarios y
con link verificable a la fuente.

**Metrica secundaria (Velocidad):** Reducir la busqueda de una idea validada de **varios
dias a menos de 10 minutos**.

## 6. Especificacion Tecnica (Para el Agente)

### Features a Implementar (Feature-First)
```
src/features/
├── auth/            # Autenticacion Email/Password (Supabase)
├── search/          # Iniciar busqueda bajo demanda: elegir nicho/keyword/subreddit + filtros
├── ingestion/       # Recolectores Reddit API + YouTube API -> tabla sources
├── analysis/        # Pipeline IA: agrupar, resumir, rankear (dolor/frecuencia/hueco) + idea de app
├── opportunities/   # Dashboard: lista rankeada, detalle con citas + link a fuente
├── favorites/       # Guardar/gestionar oportunidades favoritas
└── export/          # Generar y descargar PDF de oportunidades
```

### Diseno Visual
- **Design System:** Neobrutalism (bordes negros gruesos, colores planos saturados,
  sombras duras). Encaja con audiencia indie-hacker / build-in-public: audaz y memorable.

### Stack Confirmado
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4 + shadcn/ui
- **Backend:** Supabase (Auth + Database + Storage + RLS)
- **AI Engine (principal):** Claude Agent SDK LOCAL (`AI_PROVIDER=claude-agent`) con la
  suscripcion Claude del propio usuario — sin API key. El agente web-busca Reddit/YouTube
  el mismo (WebSearch/WebFetch), rankea y devuelve JSON. Fallback a mock si falla.
- **AI Engine (alterno):** Vercel AI SDK v5 + OpenRouter (`AI_PROVIDER=openrouter`, de pago).
- **Modo demo:** `AI_PROVIDER=mock` (default, datos deterministas, sin llaves).
- **Validacion:** Zod
- **State:** Zustand (si necesario)
- **PDF:** generacion server-side (@react-pdf/renderer)
- **MCPs:** Next.js DevTools + Playwright + Supabase

### Decision de Arquitectura: motor agente local-first (2026-06-13)
- PainRadar corre LOCAL en la maquina del usuario e invoca un agente Claude autenticado con
  la suscripcion del propio usuario (`CLAUDE_CODE_OAUTH_TOKEN` / login de Claude Code).
- **Por que local:** los Terminos de Anthropic NO permiten un SaaS hospedado multi-inquilino
  que use suscripciones de OTROS usuarios para inferencia de backend (eso va por API de pago).
  Para uso PERSONAL del propio usuario, con su propia suscripcion, es 100% valido.
- **Implicacion a futuro:** si se ofrece como SaaS a terceros, el camino sancionado es la API
  de pago (OpenRouter/Anthropic), no las suscripciones de los clientes. Ver `SETUP-AGENT.md`.

### Decision: single-user local, sin login, SQLite (2026-06-13)
- Al ser una herramienta personal que SIEMPRE corre en la maquina del usuario, se ELIMINO la
  autenticacion (sin login/signup/sesion/rutas protegidas). El dashboard es de acceso directo.
- Persistencia LOCAL con SQLite (`node:sqlite`, sin compilacion nativa) en `./data/painradar.db`:
  - `favorites`: oportunidades guardadas.
  - `search_cache`: resultados por (nicho, recency) — una corrida del agente (~2-4 min) se
    cachea, asi reabrir un nicho es instantaneo; `?refresh=1` fuerza re-correr.
- Supabase queda como opcion futura (si algun dia es multi-usuario hospedado); por ahora no se usa.

### Proximos Pasos
1. [ ] Setup proyecto base
2. [ ] Configurar Supabase
3. [ ] Implementar Auth (Email/Password)
4. [ ] Feature: search (iniciar busqueda bajo demanda)
5. [ ] Feature: ingestion (Reddit + YouTube)
6. [ ] Feature: analysis (pipeline IA rankeo + idea de app)
7. [ ] Feature: opportunities (dashboard + detalle con citas/links)
8. [ ] Feature: favorites
9. [ ] Feature: export (PDF)
10. [ ] Testing E2E (Playwright)
11. [ ] Deploy Vercel

### Notas tecnicas / riesgos a vigilar
- **Reddit API:** limites de rate y terminos de uso; requiere OAuth de app. Considerar
  cache de resultados por busqueda.
- **YouTube Data API:** cuota diaria limitada; las transcripciones pueden requerir un
  proveedor aparte. Priorizar comentarios primero, transcripciones como mejora.
- **Costo-IA:** el analisis puede procesar mucho texto -> aplicar cost-optimizer (modelo mas
  barato que cumpla, presupuesto de tokens, batching) para proteger el margen del SaaS.
- **Calidad del ranking:** definir bien el scoring de dolor/frecuencia/hueco; es el corazon
  del KPI principal. Iterar con outcomes una vez en produccion.
- **Compliance:** procesa contenido publico de terceros + datos de usuarios -> revisar
  privacidad/terminos antes de deploy (skill compliance).
