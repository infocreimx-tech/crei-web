-- CREI · Expediente como fuente única de pacientes del calendario
-- Fecha: 2026-07-13
-- Migración aditiva e idempotente: no elimina tablas ni registros.

begin;

create extension if not exists pgcrypto;

-- 1. Completar la tabla de expediente sin recrearla.
alter table public.expediente
  add column if not exists therapist_user_id uuid references auth.users(id) on delete set null,
  add column if not exists activo boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists expediente_therapist_user_id_idx
  on public.expediente (therapist_user_id);
create index if not exists expediente_nombre_completo_idx
  on public.expediente (lower(nombre_completo));
create index if not exists expediente_activo_idx
  on public.expediente (activo) where activo = true;

-- 2. Relación explícita entre una cita y el expediente del paciente.
alter table public.calendario
  add column if not exists expediente_id uuid,
  add column if not exists therapist_user_id uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

-- Algunas instalaciones legacy definieron el UUID sin default.
alter table public.calendario alter column id set default gen_random_uuid();

-- patient_id pertenecía a la tabla legacy "pacientes". Se conserva para el
-- histórico, pero deja de ser obligatorio porque expediente_id lo reemplaza.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'calendario' and column_name = 'patient_id'
  ) then
    alter table public.calendario alter column patient_id drop not null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'calendario_expediente_id_fkey'
      and conrelid = 'public.calendario'::regclass
  ) then
    alter table public.calendario
      add constraint calendario_expediente_id_fkey
      foreign key (expediente_id)
      references public.expediente(id)
      on update cascade
      on delete restrict
      not valid;
  end if;
end $$;

create index if not exists calendario_expediente_id_idx
  on public.calendario (expediente_id);
create index if not exists calendario_therapist_user_id_idx
  on public.calendario (therapist_user_id);
create index if not exists calendario_start_at_idx
  on public.calendario (start_at);

-- 3. Intentar relacionar citas anteriores por nombre, sin modificar las que no coincidan.
--    Se usa SQL dinámico para que la migración siga funcionando si la tabla legacy
--    "pacientes" no existe o tiene una estructura diferente.
do $$
begin
  if to_regclass('public.pacientes') is not null
     and exists (select 1 from information_schema.columns where table_schema='public' and table_name='pacientes' and column_name='id')
     and exists (select 1 from information_schema.columns where table_schema='public' and table_name='pacientes' and column_name='nombre')
     and exists (select 1 from information_schema.columns where table_schema='public' and table_name='pacientes' and column_name='apellido')
     and exists (select 1 from information_schema.columns where table_schema='public' and table_name='calendario' and column_name='patient_id') then
    execute $sql$
      update public.calendario c
      set expediente_id = e.id
      from public.pacientes p
      join public.expediente e
        on lower(trim(e.nombre_completo)) = lower(trim(concat_ws(' ', p.nombre, p.apellido)))
      where c.expediente_id is null
        and c.patient_id::text = p.id::text
    $sql$;
  end if;
end $$;

-- 4. Funciones auxiliares y auditoría.
create or replace function public.crei_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
      or coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin';
$$;

create or replace function public.crei_set_clinical_audit_fields()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := now();
  if new.therapist_user_id is null then
    new.therapist_user_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists expediente_set_audit_fields on public.expediente;
create trigger expediente_set_audit_fields
before insert or update on public.expediente
for each row execute function public.crei_set_clinical_audit_fields();

drop trigger if exists calendario_set_audit_fields on public.calendario;
create trigger calendario_set_audit_fields
before insert or update on public.calendario
for each row execute function public.crei_set_clinical_audit_fields();

-- 5. Regla central: desde esta migración no se puede crear una cita sin expediente.
create or replace function public.crei_require_expediente_for_appointment()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  expediente_activo boolean;
  expediente_owner uuid;
begin
  if new.expediente_id is null then
    raise exception using
      errcode = '23502',
      message = 'Primero debes crear el expediente del paciente antes de agendar una cita.';
  end if;

  select activo, therapist_user_id
    into expediente_activo, expediente_owner
  from public.expediente
  where id = new.expediente_id;

  if not found then
    raise exception using errcode = '23503', message = 'El expediente seleccionado no existe.';
  end if;

  if not expediente_activo then
    raise exception using errcode = '23514', message = 'No se pueden agendar citas para un expediente inactivo.';
  end if;

  if not public.crei_is_admin()
     and expediente_owner is not null
     and expediente_owner <> auth.uid() then
    raise exception using errcode = '42501', message = 'El expediente pertenece a otro terapeuta.';
  end if;

  new.therapist_user_id := coalesce(new.therapist_user_id, auth.uid());
  return new;
end;
$$;

drop trigger if exists calendario_require_expediente on public.calendario;
create trigger calendario_require_expediente
before insert or update of expediente_id on public.calendario
for each row execute function public.crei_require_expediente_for_appointment();

-- 6. RLS. Se retiran políticas permisivas anteriores y se crean políticas por propietario.
alter table public.expediente enable row level security;
alter table public.calendario enable row level security;

do $$
declare policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public' and tablename in ('expediente', 'calendario')
  loop
    execute format('drop policy if exists %I on %I.%I', policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end $$;

create policy expediente_select_own_or_admin
on public.expediente for select to authenticated
using (
  public.crei_is_admin()
  or therapist_user_id = auth.uid()
  or therapist_user_id is null
);

create policy expediente_insert_own_or_admin
on public.expediente for insert to authenticated
with check (public.crei_is_admin() or therapist_user_id = auth.uid());

create policy expediente_update_own_or_admin
on public.expediente for update to authenticated
using (public.crei_is_admin() or therapist_user_id = auth.uid() or therapist_user_id is null)
with check (public.crei_is_admin() or therapist_user_id = auth.uid());

create policy expediente_delete_own_or_admin
on public.expediente for delete to authenticated
using (public.crei_is_admin() or therapist_user_id = auth.uid());

create policy calendario_select_from_visible_expediente
on public.calendario for select to authenticated
using (
  public.crei_is_admin()
  or therapist_user_id = auth.uid()
  or exists (
    select 1 from public.expediente e
    where e.id = calendario.expediente_id
      and (e.therapist_user_id = auth.uid() or e.therapist_user_id is null)
  )
);

create policy calendario_insert_from_own_expediente
on public.calendario for insert to authenticated
with check (
  public.crei_is_admin()
  or (
    therapist_user_id = auth.uid()
    and exists (
      select 1 from public.expediente e
      where e.id = calendario.expediente_id
        and (e.therapist_user_id = auth.uid() or e.therapist_user_id is null)
    )
  )
);

create policy calendario_update_own_or_admin
on public.calendario for update to authenticated
using (public.crei_is_admin() or therapist_user_id = auth.uid())
with check (public.crei_is_admin() or therapist_user_id = auth.uid());

create policy calendario_delete_own_or_admin
on public.calendario for delete to authenticated
using (public.crei_is_admin() or therapist_user_id = auth.uid());

-- Los registros históricos que no pudieron relacionarse siguen disponibles para
-- revisión, pero la llave se valida solo después de completar el backfill manual.
-- Cuando expediente_id ya no tenga nulos, ejecutar:
--   alter table public.calendario validate constraint calendario_expediente_id_fkey;
--   alter table public.calendario alter column expediente_id set not null;

commit;
