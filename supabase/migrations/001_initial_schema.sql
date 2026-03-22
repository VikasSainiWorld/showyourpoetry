-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- profiles table (extends auth.users 1:1)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- poems table
-- ============================================================
create table public.poems (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null default 'Untitled',
  content     text not null default '',
  language    text not null default 'en',
  is_public   boolean not null default false,
  slug        text unique not null,
  tags        text[] default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index idx_poems_slug on public.poems(slug);
create index idx_poems_user_id_updated on public.poems(user_id, updated_at desc);
create index idx_poems_is_public on public.poems(is_public, created_at desc);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger poems_updated_at
  before update on public.poems
  for each row execute procedure public.set_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.poems enable row level security;

-- Profiles: anyone can read (for public poem attribution),
--           only owner can update
create policy "profiles_public_read"
  on public.profiles for select using (true);

create policy "profiles_own_update"
  on public.profiles for update using (auth.uid() = id);

-- Poems: owner can do everything; public can read public poems
create policy "poems_owner_all"
  on public.poems for all using (auth.uid() = user_id);

create policy "poems_public_read"
  on public.poems for select using (is_public = true);
