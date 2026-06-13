-- PainRadar initial schema
-- Run this when switching DATA_MODE from "mock" to "live".
-- All tables are owner-scoped with RLS enabled.

-- ─── profiles (extends auth.users) ───
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "own profile (select)" on public.profiles
  for select using (auth.uid() = id);
create policy "own profile (update)" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── searches ───
create table if not exists public.searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  niche text not null,
  filters jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending','ingesting','analyzing','done','error')),
  opportunity_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.searches enable row level security;
create policy "own searches" on public.searches
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists searches_user_idx on public.searches(user_id, created_at desc);

-- ─── sources (raw collected complaints) ───
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  search_id uuid not null references public.searches(id) on delete cascade,
  platform text not null check (platform in ('reddit','youtube')),
  url text not null,
  author text not null,
  text text not null,
  score int not null default 0,
  context text,
  created_at timestamptz not null default now()
);
alter table public.sources enable row level security;
create policy "own sources" on public.sources
  for all using (
    exists (select 1 from public.searches s
            where s.id = search_id and s.user_id = auth.uid())
  );
create index if not exists sources_search_idx on public.sources(search_id);

-- ─── opportunities (analyzed + ranked) ───
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  search_id uuid not null references public.searches(id) on delete cascade,
  title text not null,
  problem_summary text not null,
  pain int not null check (pain between 0 and 100),
  frequency int not null check (frequency between 0 and 100),
  market_gap int not null check (market_gap between 0 and 100),
  overall int not null check (overall between 0 and 100),
  app_idea jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.opportunities enable row level security;
create policy "own opportunities" on public.opportunities
  for all using (
    exists (select 1 from public.searches s
            where s.id = search_id and s.user_id = auth.uid())
  );
create index if not exists opportunities_search_idx
  on public.opportunities(search_id, overall desc);

-- ─── opportunity_citations ───
create table if not exists public.opportunity_citations (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  text text not null,
  url text not null,
  platform text not null check (platform in ('reddit','youtube')),
  author text not null,
  context text
);
alter table public.opportunity_citations enable row level security;
create policy "own citations" on public.opportunity_citations
  for all using (
    exists (
      select 1 from public.opportunities o
      join public.searches s on s.id = o.search_id
      where o.id = opportunity_id and s.user_id = auth.uid()
    )
  );
create index if not exists citations_opp_idx
  on public.opportunity_citations(opportunity_id);

-- ─── favorites ───
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);
alter table public.favorites enable row level security;
create policy "own favorites" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── events (funnel instrumentation) ───
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "insert own events" on public.events
  for insert with check (auth.uid() = user_id or user_id is null);
create policy "read own events" on public.events
  for select using (auth.uid() = user_id);
