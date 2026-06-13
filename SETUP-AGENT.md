# Running PainRadar on YOUR Claude subscription (no API key)

PainRadar can run its analysis through an **autonomous Claude agent on your own
machine**, authenticated with **your own Claude Pro/Max subscription** — no API
key. The agent web-searches the chosen sources itself, so you need **no Reddit,
YouTube or any other source keys** either.

> ⚖️ **Important — personal use only.** Using your Claude subscription this way is
> fine for **you, on your own machine**. Anthropic's Terms do **not** allow a
> hosted, multi-tenant SaaS to run inference on other people's subscriptions — for
> that you'd use the paid API. This setup is for running PainRadar for yourself.

## One-time setup

1. **Install Claude Code and log in** with your subscription:
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude            # opens a browser, log in to your Claude account
   ```

2. **Generate a long-lived subscription token:**
   ```bash
   claude setup-token
   ```
   Copy the token it prints.

3. **Configure PainRadar.** Create `.env.local` (copy from `.env.example`) — with just
   the token, the app uses the agent automatically:
   ```env
   CLAUDE_CODE_OAUTH_TOKEN=<paste the token from step 2>
   ```

4. **Run it:**
   ```bash
   npm run dev
   ```
   Open the app (no login — it's your machine), type a niche, hit **Run radar**.
   The agent searches the web and returns ranked opportunities backed by real
   quotes. The first sweep for a niche takes a couple of minutes — it actually
   reads threads before answering — then it's **cached in SQLite**, so re-opening
   that niche is instant. Use **refresh** to re-run.

## Notes

- **Quota:** runs draw from your subscription's Agent SDK allowance, not API
  credits. Heavy use is bounded by your plan, not a per-token bill.
- **Model:** defaults to `sonnet` (good balance for web research). Override with
  `PAINRADAR_AGENT_MODEL=opus` for deeper analysis or `haiku` for speed.
- **It only uses web tools.** The agent is locked to `WebSearch`/`WebFetch`
  (`permissionMode: dontAsk`) and never loads this project's `CLAUDE.md`
  (`settingSources: []`), so it stays a focused research agent.
- **Fallback:** if the agent errors or returns nothing, PainRadar falls back to
  mock data so the app never hard-fails.
- **No login, local storage:** there's no account system — it's your machine.
  Favorites and cached search results live in `./data/painradar.db` (SQLite).
  Delete that file to reset; back it up to keep your saved ideas.
- **Switch back to demo data** anytime with `AI_PROVIDER=mock`.
