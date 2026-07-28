-- Registro privado de pacientes para Paulina.
-- La web accede exclusivamente desde una ruta de servidor protegida.

create extension if not exists pgcrypto;

create table if not exists public.registro_pacientes_paulina (
  id uuid primary key default gen_random_uuid(),
  terapeuta_id bigint not null,
  terapeuta_username text not null,
  nombre text not null,
  ciudad text not null,
  telefono text not null,
  sexo text not null,
  dia date not null,
  hora time without time zone not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.registro_pacientes_paulina
  drop constraint if exists registro_pacientes_paulina_nombre_check,
  drop constraint if exists registro_pacientes_paulina_ciudad_check,
  drop constraint if exists registro_pacientes_paulina_telefono_check,
  drop constraint if exists registro_pacientes_paulina_sexo_check,
  drop constraint if exists registro_pacientes_paulina_hora_check,
  drop constraint if exists registro_pacientes_paulina_username_check;

alter table public.registro_pacientes_paulina
  add constraint registro_pacientes_paulina_nombre_check
    check (char_length(btrim(nombre)) between 2 and 120),
  add constraint registro_pacientes_paulina_ciudad_check
    check (char_length(btrim(ciudad)) between 2 and 100),
  add constraint registro_pacientes_paulina_telefono_check
    check (char_length(btrim(telefono)) between 8 and 30),
  add constraint registro_pacientes_paulina_sexo_check
    check (sexo in ('hombre', 'mujer')),
  add constraint registro_pacientes_paulina_hora_check
    check (hora >= time '00:00' and hora < time '24:00'),
  add constraint registro_pacientes_paulina_username_check
    check (lower(btrim(terapeuta_username)) = 'paulina');

create index if not exists registro_pacientes_paulina_terapeuta_fecha_idx
  on public.registro_pacientes_paulina (terapeuta_id, created_at desc);

create or replace function public.set_registro_pacientes_paulina_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_registro_pacientes_paulina_updated_at()
  from public;
grant execute on function public.set_registro_pacientes_paulina_updated_at()
  to service_role;

drop trigger if exists registro_pacientes_paulina_updated_at
  on public.registro_pacientes_paulina;

create trigger registro_pacientes_paulina_updated_at
before update on public.registro_pacientes_paulina
for each row
execute function public.set_registro_pacientes_paulina_updated_at();

alter table public.registro_pacientes_paulina enable row level security;

revoke all on table public.registro_pacientes_paulina from anon, authenticated;
grant all on table public.registro_pacientes_paulina to service_role;

comment on table public.registro_pacientes_paulina is
  'Registro privado y básico de pacientes, visible únicamente para Paulina mediante la API protegida del portal.';
