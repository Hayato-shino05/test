-- 0003_create_messages.sql - Community chat messages table and RLS

-- Table definition
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users (id) on delete set null,
  text text not null check (char_length(text) > 0),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Policy: anyone (even anon) can read
create policy "messages_select_public" on public.messages
  for select using (true);

-- Policy: authenticated user can insert with their uid or null (anon)
create policy "messages_insert_auth" on public.messages
  for insert with check (
    auth.role() = 'authenticated' and (sender_id is null or sender_id = auth.uid())
  );

-- Policy: only creator can delete/update their own message
-- Policy: owner can UPDATE
create policy "messages_owner_update" on public.messages
  for update using (auth.uid() = sender_id);

-- Policy: owner can DELETE
create policy "messages_owner_delete" on public.messages
  for delete using (auth.uid() = sender_id);
