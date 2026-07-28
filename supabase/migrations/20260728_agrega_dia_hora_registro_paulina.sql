-- Agrega día y hora al registro de pacientes de Paulina.
-- Puede ejecutarse en una tabla ya creada.

alter table public.registro_pacientes_paulina
  add column if not exists dia date,
  add column if not exists hora time without time zone;

-- Estos valores sólo cubren posibles registros anteriores.
-- Los nuevos registros siempre reciben día y hora desde el formulario.
update public.registro_pacientes_paulina
set
  dia = coalesce(dia, created_at::date),
  hora = coalesce(hora, created_at::time)
where dia is null or hora is null;

alter table public.registro_pacientes_paulina
  alter column dia set not null,
  alter column hora set not null;

alter table public.registro_pacientes_paulina
  drop constraint if exists registro_pacientes_paulina_hora_check;

alter table public.registro_pacientes_paulina
  add constraint registro_pacientes_paulina_hora_check
    check (hora >= time '00:00' and hora < time '24:00');

comment on column public.registro_pacientes_paulina.dia is
  'Día asignado al registro del paciente.';

comment on column public.registro_pacientes_paulina.hora is
  'Hora asignada al registro del paciente, sin conversión de zona horaria.';
