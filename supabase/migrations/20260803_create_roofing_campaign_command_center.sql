-- Roofing campaign command center schema.
create table if not exists public.roofing_campaign_leads (
  id uuid primary key default gen_random_uuid(),
  playbook_lead_id uuid references public.roofing_playbook_leads(id) on delete set null,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  website text,
  city text,
  state text,
  source text not null default 'roofing_playbook',
  campaign_key text not null default 'roofing_ai_growth_playbook',
  stage text not null default 'new' check (stage in ('new','playbook_sent','demo_watched','audit_ready','email_ready','appointment','closed_won','closed_lost')),
  next_action text,
  assigned_agent text,
  audit_score numeric check (audit_score is null or (audit_score >= 0 and audit_score <= 100)),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_key, email)
);

create table if not exists public.roofing_campaign_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.roofing_campaign_leads(id) on delete cascade,
  event_type text not null,
  event_label text not null,
  event_detail text,
  event_data jsonb not null default '{}'::jsonb,
  idempotency_key text unique,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.roofing_campaign_audits (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.roofing_campaign_leads(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','running','ready','failed','approved','archived')),
  score numeric check (score is null or (score >= 0 and score <= 100)),
  findings jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  raw_result jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roofing_campaign_email_drafts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.roofing_campaign_leads(id) on delete cascade,
  audit_id uuid references public.roofing_campaign_audits(id) on delete set null,
  subject text not null,
  body_text text not null,
  body_html text,
  status text not null default 'draft' check (status in ('draft','pending_approval','approved','rejected','sent','failed')),
  provider_message_id text,
  approved_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists roofing_campaign_leads_stage_idx on public.roofing_campaign_leads(stage);
create index if not exists roofing_campaign_leads_created_at_idx on public.roofing_campaign_leads(created_at desc);
create index if not exists roofing_campaign_events_lead_time_idx on public.roofing_campaign_events(lead_id, occurred_at desc);
create index if not exists roofing_campaign_audits_lead_time_idx on public.roofing_campaign_audits(lead_id, created_at desc);
create index if not exists roofing_campaign_email_drafts_lead_time_idx on public.roofing_campaign_email_drafts(lead_id, created_at desc);

alter table public.roofing_campaign_leads enable row level security;
alter table public.roofing_campaign_events enable row level security;
alter table public.roofing_campaign_audits enable row level security;
alter table public.roofing_campaign_email_drafts enable row level security;

create or replace function public.set_roofing_campaign_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists roofing_campaign_leads_updated_at on public.roofing_campaign_leads;
create trigger roofing_campaign_leads_updated_at before update on public.roofing_campaign_leads for each row execute function public.set_roofing_campaign_updated_at();

drop trigger if exists roofing_campaign_audits_updated_at on public.roofing_campaign_audits;
create trigger roofing_campaign_audits_updated_at before update on public.roofing_campaign_audits for each row execute function public.set_roofing_campaign_updated_at();

drop trigger if exists roofing_campaign_email_drafts_updated_at on public.roofing_campaign_email_drafts;
create trigger roofing_campaign_email_drafts_updated_at before update on public.roofing_campaign_email_drafts for each row execute function public.set_roofing_campaign_updated_at();
