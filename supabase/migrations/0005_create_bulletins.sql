-- migrate:up
-- tạo bảng bulletins
create table if not exists public.bulletins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  like_count integer default 0 not null,
  created_at timestamp with time zone default now()
);

-- enable RLS
alter table public.bulletins enable row level security;

-- policy: mọi user được đọc
create policy "Bulletins can be read by everyone" on public.bulletins
for select using (true);

-- policy: chỉ user đăng nhập mới insert
create policy "Authenticated can post" on public.bulletins
for insert with check (auth.uid() = user_id);

-- migrate:down
DROP TABLE IF EXISTS public.bulletins;
