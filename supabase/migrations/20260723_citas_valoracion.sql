-- CREI · Agenda pública de citas de valoración
-- Cada cita dura exactamente una hora.
-- Migración aditiva e idempotente: no elimina tablas ni registros.

begin;

create extension if not exists pgcrypto;

create table if not exists public.citas_valoracion (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 80),
  email text not null check (char_length(email) <= 120),
  telefono text not null check (char_length(telefono) between 8 and 30),
  inicio timestamptz not null,
  fin timestamptz not null,
  zona_horaria text not null default 'America/Mexico_City',
  modalidad text not null check (modalidad in ('presencial', 'videollamada')),
  ubicacion text not null,
  motivo text check (motivo is null or char_length(motivo) <= 1000),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmada', 'completada', 'cancelada')),
  consentimiento_privacidad boolean not null
    check (consentimiento_privacidad = true),
  notas_internas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint citas_valoracion_duracion_una_hora
    check (fin = inicio + interval '1 hour')
);

-- Mantiene la migración compatible si la tabla se creó antes de agregar la ubicación.
alter table public.citas_valoracion
  add column if not exists ubicacion text;

update public.citas_valoracion
set ubicacion = case
  when modalidad = 'presencial'
    then 'Sacramento 521, Insurgentes San Borja, Benito Juárez, 03100 Ciudad de México, CDMX'
  else 'Videollamada'
end
where ubicacion is null;

alter table public.citas_valoracion
  alter column ubicacion set not null;

create index if not exists citas_valoracion_inicio_idx
  on public.citas_valoracion (inicio);

create index if not exists citas_valoracion_estado_idx
  on public.citas_valoracion (estado);

-- Evita dos valoraciones activas en el mismo horario.
create unique index if not exists citas_valoracion_horario_activo_uidx
  on public.citas_valoracion (inicio)
  where estado in ('pendiente', 'confirmada');

create or replace function public.crei_prepare_cita_valoracion()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.fin := new.inicio + interval '1 hour';
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists citas_valoracion_prepare on public.citas_valoracion;
create trigger citas_valoracion_prepare
before insert or update on public.citas_valoracion
for each row execute function public.crei_prepare_cita_valoracion();

-- La web guarda mediante una ruta del servidor con service_role.
-- No se permite consultar ni insertar datos personales directamente desde el navegador.
alter table public.citas_valoracion enable row level security;
revoke all on table public.citas_valoracion from anon, authenticated;

comment on table public.citas_valoracion is
  'Solicitudes públicas de valoración clínica CREI con duración fija de una hora.';
comment on column public.citas_valoracion.inicio is
  'Inicio absoluto de la cita; la interfaz usa America/Mexico_City.';
comment on column public.citas_valoracion.fin is
  'Calculado automáticamente como inicio + una hora.';

commit;
