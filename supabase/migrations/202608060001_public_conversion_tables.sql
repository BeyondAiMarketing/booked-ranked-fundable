-- Server-only storage for public conversion forms and strategy-call bookings.
create schema if not exists private;

create or replace function private.normalize_public_email(value text)
returns text language sql immutable strict set search_path = pg_catalog
as $$ select nullif(lower(btrim(value)), ''); $$;

create or replace function private.normalize_public_phone(value text)
returns text language plpgsql immutable strict set search_path = pg_catalog
as $$
declare digits text := regexp_replace(value, '[^0-9]', '', 'g');
begin
  if digits = '' then return null; end if;
  if length(digits) = 10 then return '1' || digits; end if;
  return digits;
end;
$$;

create or replace function private.normalize_public_website(value text)
returns text language plpgsql immutable strict set search_path = pg_catalog
as $$
declare normalized text := lower(btrim(value));
begin
  normalized := regexp_replace(normalized, '^https?://', '', 'i');
  normalized := regexp_replace(normalized, '^www\.', '', 'i');
  normalized := split_part(normalized, '/', 1);
  normalized := split_part(normalized, '?', 1);
  normalized := split_part(normalized, '#', 1);
  normalized := split_part(normalized, ':', 1);
  return nullif(btrim(normalized), '');
end;
$$;

create table if not exists public.public_leads (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  business_name text not null,
  email text,
  phone text,
  website text,
  normalized_email text,
  normalized_phone text,
  normalized_website text,
  service_area text,
  niche text not null,
  source text not null,
  status text not null default 'new_lead',
  notes jsonb not null default '{}'::jsonb,
  submission_count integer not null default 1 check (submission_count >= 1),
  first_submitted_at timestamptz not null default now(),
  last_submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists public_leads_normalized_email_key on public.public_leads (normalized_email) where normalized_email is not null;
create unique index if not exists public_leads_normalized_phone_key on public.public_leads (normalized_phone) where normalized_phone is not null;
create unique index if not exists public_leads_normalized_website_key on public.public_leads (normalized_website) where normalized_website is not null;
create index if not exists public_leads_created_at_idx on public.public_leads (created_at desc);

create table if not exists public.public_lead_submissions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.public_leads(id) on delete cascade,
  was_duplicate boolean not null,
  matched_on text[] not null default '{}',
  source text not null,
  niche text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists public_lead_submissions_lead_time_idx on public.public_lead_submissions (lead_id, created_at desc);

create table if not exists public.strategy_call_bookings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.public_leads(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  duration_minutes integer not null default 30 check (duration_minutes between 15 and 180),
  timezone text not null default 'America/Los_Angeles',
  contact_name text not null,
  business_name text not null,
  email text not null,
  phone text,
  normalized_email text not null,
  normalized_phone text,
  niche text not null,
  status text not null default 'confirmed' check (status in ('held', 'confirmed', 'cancelled', 'completed', 'no_show')),
  source text not null default 'book_demo_modal',
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

alter table public.strategy_call_bookings drop constraint if exists strategy_call_bookings_no_overlap;
alter table public.strategy_call_bookings add constraint strategy_call_bookings_no_overlap
exclude using gist (tstzrange(starts_at, ends_at, '[)') with &&)
where (status in ('held', 'confirmed'));
create index if not exists strategy_call_bookings_starts_at_idx on public.strategy_call_bookings (starts_at);

alter table public.public_leads enable row level security;
alter table public.public_lead_submissions enable row level security;
alter table public.strategy_call_bookings enable row level security;
revoke all on table public.public_leads from anon, authenticated;
revoke all on table public.public_lead_submissions from anon, authenticated;
revoke all on table public.strategy_call_bookings from anon, authenticated;
