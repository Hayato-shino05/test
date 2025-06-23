-- Migration: initial schema for Happy-Birthday-Website
-- Run with `supabase db reset` or via CI pipeline.

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Table: users (reference Supabase auth users)
-- This is just a view to auth.users; no table creation needed here.

-- Table: birthdays
create table if not exists public.birthdays (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  dob date not null,
  message text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Table: messages (text wishes)
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references auth.users(id) on delete set null,
  birthday_id uuid references public.birthdays(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

-- Table: media (generic images/videos stored in Supabase Storage)
create table if not exists public.media (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete set null,
  type text check (type in ('image','video')) not null,
  path text not null unique,
  tags text[],
  created_at timestamptz not null default now()
);

-- Table: audio_messages (voice greetings)
create table if not exists public.audio_messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references auth.users(id) on delete set null,
  birthday_id uuid references public.birthdays(id) on delete cascade,
  audio_url text not null unique,
  created_at timestamptz not null default now()
);

-- Table: video_messages (video greetings)
create table if not exists public.video_messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references auth.users(id) on delete set null,
  birthday_id uuid references public.birthdays(id) on delete cascade,
  video_url text not null unique,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.birthdays enable row level security;
alter table public.messages enable row level security;
alter table public.media enable row level security;
alter table public.audio_messages enable row level security;
alter table public.video_messages enable row level security;

-- Policies: allow authenticated users to read all, insert own rows
create policy "allow select for authenticated" on public.birthdays
  for select using (auth.role() = 'authenticated');
create policy "allow insert own" on public.birthdays
  for insert with check (auth.role() = 'authenticated');

create policy "allow select for authenticated" on public.messages
  for select using (auth.role() = 'authenticated');
create policy "allow insert own" on public.messages
  for insert with check (auth.role() = 'authenticated');

create policy "allow select for authenticated" on public.media
  for select using (auth.role() = 'authenticated');
create policy "allow insert own" on public.media
  for insert with check (auth.role() = 'authenticated');

create policy "allow select for authenticated" on public.audio_messages
  for select using (auth.role() = 'authenticated');
create policy "allow insert own" on public.audio_messages
  for insert with check (auth.role() = 'authenticated');

create policy "allow select for authenticated" on public.video_messages
  for select using (auth.role() = 'authenticated');
create policy "allow insert own" on public.video_messages
  for insert with check (auth.role() = 'authenticated');

-- End of migration
