-- 0005_create_media.sql
-- Create media table and RLS policies

-- Extension for uuid
create extension if not exists "uuid-ossp";

-- Table
create table if not exists public.media (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('image','audio','video')),
  path text not null unique,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

comment on table public.media is 'Stores uploaded media files (images, audio, video) hosted in Supabase Storage bucket `media`';

-- RLS
alter table public.media enable row level security;

-- Allow anyone (including anon) to read media metadata
create policy "Public read media" on public.media for select using (true);

-- Allow authenticated user to insert & manage own rows
create policy "User can insert own media" on public.media for insert with check (auth.role() = 'authenticated' and owner_id = auth.uid());

create policy "User owns media to update" on public.media for update using (owner_id = auth.uid());

create policy "User owns media to delete" on public.media for delete using (owner_id = auth.uid());
