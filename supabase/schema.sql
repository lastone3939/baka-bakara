create table if not exists public.challenge_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  official_attempts_used integer not null default 0,
  official_clears integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_players (
  install_id text primary key,
  auth_user_id uuid references auth.users(id) on delete set null,
  current_attempt_id text not null,
  attempt_number integer not null default 1,
  bankroll bigint not null default 1000000,
  max_bankroll bigint not null default 1000000,
  rounds integer not null default 0,
  status text not null default 'playing',
  clear_count integer not null default 0,
  best_clear_rounds integer,
  official_attempts_used integer not null default 0,
  official_clears integer not null default 0,
  current_attempt_official boolean not null default false,
  active_sport text not null default 'baccarat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_rounds (
  id bigint generated always as identity primary key,
  install_id text not null references public.challenge_players(install_id) on delete cascade,
  attempt_id text not null,
  attempt_number integer not null,
  round_number integer not null,
  sport text not null default 'baccarat',
  winner text not null,
  player_total integer,
  banker_total integer,
  net bigint not null,
  bankroll_after bigint not null,
  bets jsonb not null default '{}'::jsonb,
  outcomes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.challenge_players add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
alter table public.challenge_players add column if not exists official_attempts_used integer not null default 0;
alter table public.challenge_players add column if not exists official_clears integer not null default 0;
alter table public.challenge_players add column if not exists current_attempt_official boolean not null default false;
alter table public.challenge_players add column if not exists active_sport text not null default 'baccarat';

alter table public.challenge_rounds add column if not exists sport text not null default 'baccarat';
alter table public.challenge_rounds alter column player_total drop not null;
alter table public.challenge_rounds alter column banker_total drop not null;
alter table public.challenge_rounds drop constraint if exists challenge_rounds_winner_check;

create index if not exists challenge_rounds_install_attempt_idx
  on public.challenge_rounds (install_id, attempt_id, round_number);

create index if not exists challenge_players_auth_user_idx
  on public.challenge_players (auth_user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.challenge_profiles to authenticated;
grant select, insert, update on public.challenge_players to anon, authenticated;
grant select, insert on public.challenge_rounds to anon, authenticated;
grant usage, select on sequence public.challenge_rounds_id_seq to anon, authenticated;

alter table public.challenge_profiles enable row level security;
alter table public.challenge_players enable row level security;
alter table public.challenge_rounds enable row level security;

drop policy if exists "users can read own challenge profile" on public.challenge_profiles;
drop policy if exists "users can insert own challenge profile" on public.challenge_profiles;
drop policy if exists "users can update own challenge profile" on public.challenge_profiles;
drop policy if exists "anon can insert challenge players" on public.challenge_players;
drop policy if exists "anon can update challenge players" on public.challenge_players;
drop policy if exists "anon can read challenge players" on public.challenge_players;
drop policy if exists "anon can insert challenge rounds" on public.challenge_rounds;

create policy "users can read own challenge profile"
  on public.challenge_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert own challenge profile"
  on public.challenge_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own challenge profile"
  on public.challenge_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "anon can insert challenge players"
  on public.challenge_players
  for insert
  to anon, authenticated
  with check (true);

create policy "anon can update challenge players"
  on public.challenge_players
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon can read challenge players"
  on public.challenge_players
  for select
  to anon, authenticated
  using (true);

create policy "anon can insert challenge rounds"
  on public.challenge_rounds
  for insert
  to anon, authenticated
  with check (true);
