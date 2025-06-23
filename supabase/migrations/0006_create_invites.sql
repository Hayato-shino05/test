-- migrate:up
create table if not exists public.invites (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  accepted boolean default false
);

alter table public.invites enable row level security;

create policy "Invites are public read" on public.invites
for select using (true);

create policy "Authenticated can create invite" on public.invites
for insert with check (auth.uid() = user_id);

-- migrate:down
DROP TABLE IF EXISTS public.invites;
