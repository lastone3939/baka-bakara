create table if not exists public.challenge_players (
  install_id text primary key,
  current_attempt_id text not null,
  attempt_number integer not null default 1,
  bankroll bigint not null default 1000000,
  max_bankroll bigint not null default 1000000,
  rounds integer not null default 0,
  status text not null default 'playing',
  clear_count integer not null default 0,
  best_clear_rounds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_rounds (
  id bigint generated always as identity primary key,
  install_id text not null references public.challenge_players(install_id) on delete cascade,
  attempt_id text not null,
  attempt_number integer not null,
  round_number integer not null,
  winner text not null check (winner in ('P', 'B', 'T')),
  player_total integer not null,
  banker_total integer not null,
  net bigint not null,
  bankroll_after bigint not null,
  bets jsonb not null default '{}'::jsonb,
  outcomes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists challenge_rounds_install_attempt_idx
  on public.challenge_rounds (install_id, attempt_id, round_number);

grant usage on schema public to anon;
grant select, insert, update on public.challenge_players to anon;
grant select, insert on public.challenge_rounds to anon;
grant usage, select on sequence public.challenge_rounds_id_seq to anon;

alter table public.challenge_players enable row level security;
alter table public.challenge_rounds enable row level security;

drop policy if exists "anon can upsert challenge players" on public.challenge_players;
drop policy if exists "anon can insert challenge players" on public.challenge_players;
drop policy if exists "anon can update challenge players" on public.challenge_players;
drop policy if exists "anon can read challenge players" on public.challenge_players;
drop policy if exists "anon can insert challenge rounds" on public.challenge_rounds;

create policy "anon can insert challenge players"
  on public.challenge_players
  for insert
  to anon
  with check (true);

create policy "anon can update challenge players"
  on public.challenge_players
  for update
  to anon
  using (true)
  with check (true);

create policy "anon can read challenge players"
  on public.challenge_players
  for select
  to anon
  using (true);

create policy "anon can insert challenge rounds"
  on public.challenge_rounds
  for insert
  to anon
  with check (true);
