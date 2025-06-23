-- Migration: create public storage buckets for media, audio, video assets

-- Insert buckets (public)
insert into storage.buckets (id, name, public)
values
  ('media', 'media', true),
  ('audio', 'audio', true),
  ('video', 'video', true)
  on conflict (id) do nothing;

-- Row Level Security policies for public read / authenticated write
-- Apply to newly created objects rows

create policy "Public read objects" on storage.objects
for select using (true);

create policy "Authenticated upload" on storage.objects
for insert with check (auth.role() = 'authenticated');
