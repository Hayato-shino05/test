-- 0004_create_birthdays_and_related.sql
-- Tables: birthdays, audio_messages, video_messages, gifts
-- Adds birthday_id to messages table

-- Enable pgcrypto for UUID generation if not already
create extension if not exists pgcrypto;

-- Birthdays
create table if not exists public.birthdays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dob date not null,
  message text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamp with time zone default now()
);

alter table public.birthdays enable row level security;

-- Anyone can read birthdays
create policy "birthdays_select_public" on public.birthdays
  for select using (true);

-- Authenticated users can insert their own birthday records
create policy "birthdays_insert_auth" on public.birthdays
  for insert with check (auth.role() = 'authenticated');

-- Owner can UPDATE birthday
create policy "birthdays_owner_update" on public.birthdays
  for update using (auth.uid() = created_by);

-- Owner can DELETE birthday
create policy "birthdays_owner_delete" on public.birthdays
  for delete using (auth.uid() = created_by);

-- Extend messages table: add birthday_id column
alter table public.messages
  add column if not exists birthday_id uuid references public.birthdays(id) on delete cascade;

-- Audio Messages
create table if not exists public.audio_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete set null,
  birthday_id uuid references public.birthdays(id) on delete cascade,
  audio_url text not null,
  created_at timestamp with time zone default now()
);

alter table public.audio_messages enable row level security;

create policy "audio_messages_select_public" on public.audio_messages
  for select using (true);

create policy "audio_messages_insert_auth" on public.audio_messages
  for insert with check (auth.role() = 'authenticated');

-- Owner can UPDATE audio message
create policy "audio_messages_owner_update" on public.audio_messages
  for update using (auth.uid() = sender_id);

-- Owner can DELETE audio message
create policy "audio_messages_owner_delete" on public.audio_messages
  for delete using (auth.uid() = sender_id);

-- Video Messages
create table if not exists public.video_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete set null,
  birthday_id uuid references public.birthdays(id) on delete cascade,
  video_url text not null,
  created_at timestamp with time zone default now()
);

alter table public.video_messages enable row level security;

create policy "video_messages_select_public" on public.video_messages
  for select using (true);

create policy "video_messages_insert_auth" on public.video_messages
  for insert with check (auth.role() = 'authenticated');

-- Owner can UPDATE video message
create policy "video_messages_owner_update" on public.video_messages
  for update using (auth.uid() = sender_id);

-- Owner can DELETE video message
create policy "video_messages_owner_delete" on public.video_messages
  for delete using (auth.uid() = sender_id);

-- Gifts
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete set null,
  birthday_id uuid references public.birthdays(id) on delete cascade,
  emoji text not null,
  created_at timestamp with time zone default now()
);

alter table public.gifts enable row level security;

create policy "gifts_select_public" on public.gifts
  for select using (true);

create policy "gifts_insert_auth" on public.gifts
  for insert with check (auth.role() = 'authenticated');

create policy "gifts_owner_delete" on public.gifts
  for delete using (auth.uid() = sender_id);
