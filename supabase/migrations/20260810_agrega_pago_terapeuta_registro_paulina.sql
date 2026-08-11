-- Agrega información de pago y terapeuta al registro privado de Paulina.
-- Conserva los registros históricos asignándoles valores explícitos.

alter table public.registro_pacientes_paulina
  add column if not exists quien_pago text,
  add column if not exists fecha_pago date,
  add column if not exists monto_acordado numeric(12, 2),
  add column if not exists monto_pagado numeric(12, 2),
  add column if not exists forma_pago text,
  add column if not exists terapeuta_atencion text;

update public.registro_pacientes_paulina
set
  quien_pago = coalesce(nullif(btrim(quien_pago), ''), 'No especificado'),
  fecha_pago = coalesce(fecha_pago, created_at::date),
  monto_acordado = coalesce(monto_acordado, 0),
  monto_pagado = coalesce(monto_pagado, 0),
  forma_pago = coalesce(nullif(btrim(forma_pago), ''), 'otro'),
  terapeuta_atencion = coalesce(
    nullif(btrim(terapeuta_atencion), ''),
    nullif(btrim(terapeuta_username), ''),
    'No especificado'
  )
where
  quien_pago is null or btrim(quien_pago) = '' or
  fecha_pago is null or
  monto_acordado is null or
  monto_pagado is null or
  forma_pago is null or btrim(forma_pago) = '' or
  terapeuta_atencion is null or btrim(terapeuta_atencion) = '';

alter table public.registro_pacientes_paulina
  alter column quien_pago set not null,
  alter column fecha_pago set not null,
  alter column monto_acordado set not null,
  alter column monto_pagado set not null,
  alter column forma_pago set not null,
  alter column terapeuta_atencion set not null;

alter table public.registro_pacientes_paulina
  drop constraint if exists registro_pacientes_paulina_quien_pago_check,
  drop constraint if exists registro_pacientes_paulina_monto_acordado_check,
  drop constraint if exists registro_pacientes_paulina_monto_pagado_check,
  drop constraint if exists registro_pacientes_paulina_forma_pago_check,
  drop constraint if exists registro_pacientes_paulina_terapeuta_atencion_check;

alter table public.registro_pacientes_paulina
  add constraint registro_pacientes_paulina_quien_pago_check
    check (char_length(btrim(quien_pago)) between 2 and 120),
  add constraint registro_pacientes_paulina_monto_acordado_check
    check (monto_acordado >= 0 and monto_acordado <= 99999999.99),
  add constraint registro_pacientes_paulina_monto_pagado_check
    check (monto_pagado >= 0 and monto_pagado <= 99999999.99),
  add constraint registro_pacientes_paulina_forma_pago_check
    check (forma_pago in ('efectivo', 'transferencia', 'tarjeta', 'deposito', 'otro')),
  add constraint registro_pacientes_paulina_terapeuta_atencion_check
    check (char_length(btrim(terapeuta_atencion)) between 2 and 120);

comment on column public.registro_pacientes_paulina.quien_pago is
  'Nombre de la persona que realizó el pago.';

comment on column public.registro_pacientes_paulina.fecha_pago is
  'Fecha en la que se realizó o registró el pago.';

comment on column public.registro_pacientes_paulina.monto_acordado is
  'Monto acordado en pesos mexicanos para el registro.';

comment on column public.registro_pacientes_paulina.monto_pagado is
  'Cantidad efectivamente pagada en pesos mexicanos.';

comment on column public.registro_pacientes_paulina.forma_pago is
  'Forma de pago: efectivo, transferencia, tarjeta, depósito u otro.';

comment on column public.registro_pacientes_paulina.terapeuta_atencion is
  'Nombre del terapeuta seleccionado al registrar al paciente.';
