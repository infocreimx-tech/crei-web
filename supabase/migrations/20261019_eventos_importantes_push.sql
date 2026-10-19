-- CREI · Eventos importantes y recordatorios Push
-- Fecha: 2026-10-19
--
-- Migración ADITIVA e IDEMPOTENTE.
-- Crea una base funcional completamente separada para Zoom y eventos internos.
-- No consulta, altera, elimina ni agrega columnas a public.calendario.
-- Tampoco modifica appointments, citas_valoracion, mc_calendario_terapeutas
-- ni push_subscriptions.

begin;

create extension if not exists pgcrypto;

-- 1. Agenda independiente de Eventos importantes.
create table if not exists public.eventos_importantes (
  id uuid primary key default gen_random_uuid(),
  event_kind text not null
    check (event_kind in ('zoom_meeting', 'internal_event')),
  title text not null,
  description text,
  meeting_url text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'America/Mexico_City',
  location text,
  status text not null default 'active'
    check (status in ('active', 'cancelled', 'completed')),
  cancel_reason text,
  created_by_user_id bigint not null
    references public.usuarios(id) on delete restrict,
  cancelled_at timestamptz,
  cancelled_by_user_id bigint
    references public.usuarios(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint eventos_importantes_time_check check (end_at > start_at),
  constraint eventos_importantes_zoom_url_check check (
    event_kind <> 'zoom_meeting'
    or meeting_url ~* '^https://([a-z0-9-]+\.)*zoom\.us/'
  ),
  constraint eventos_importantes_cancel_reason_check check (
    status <> 'cancelled'
    or char_length(btrim(coalesce(cancel_reason, ''))) >= 5
  )
);

create index if not exists eventos_importantes_start_idx
  on public.eventos_importantes (start_at);
create index if not exists eventos_importantes_creator_idx
  on public.eventos_importantes (created_by_user_id, start_at);
create index if not exists eventos_importantes_status_idx
  on public.eventos_importantes (status, start_at);

-- 2. Perfiles participantes, separados de pacientes y valoraciones.
create table if not exists public.eventos_importantes_participantes (
  evento_importante_id uuid not null
    references public.eventos_importantes(id) on delete cascade,
  usuario_id bigint not null
    references public.usuarios(id) on delete cascade,
  participant_role text not null default 'attendee'
    check (participant_role in ('organizer', 'attendee')),
  created_at timestamptz not null default now(),
  primary key (evento_importante_id, usuario_id)
);

create index if not exists eventos_importantes_participante_usuario_idx
  on public.eventos_importantes_participantes (usuario_id, evento_importante_id);

-- 3. Cola exclusiva para avisos de 30, 15 y 5 minutos.
create table if not exists public.eventos_importantes_recordatorios (
  id uuid primary key default gen_random_uuid(),
  evento_importante_id uuid not null
    references public.eventos_importantes(id) on delete cascade,
  usuario_id bigint not null
    references public.usuarios(id) on delete cascade,
  minutes_before smallint not null check (minutes_before in (30, 15, 5)),
  scheduled_for timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  attempts smallint not null default 0,
  claimed_at timestamptz,
  sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (evento_importante_id, usuario_id, minutes_before)
);

create index if not exists eventos_importantes_recordatorio_pending_idx
  on public.eventos_importantes_recordatorios (scheduled_for)
  where status = 'pending';
create index if not exists eventos_importantes_recordatorio_usuario_idx
  on public.eventos_importantes_recordatorios (usuario_id, scheduled_for);

-- 4. Dispositivos Push exclusivos de Eventos importantes.
create table if not exists public.eventos_importantes_suscripciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id bigint not null
    references public.usuarios(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  keys_auth text not null,
  keys_p256dh text not null,
  active boolean not null default true,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists eventos_importantes_suscripcion_usuario_idx
  on public.eventos_importantes_suscripciones (usuario_id)
  where active = true;

-- Las APIs del servidor usan la service role. No se habilita acceso directo
-- desde el navegador a ninguna de estas tablas.
alter table public.eventos_importantes enable row level security;
alter table public.eventos_importantes_participantes enable row level security;
alter table public.eventos_importantes_recordatorios enable row level security;
alter table public.eventos_importantes_suscripciones enable row level security;

commit;
