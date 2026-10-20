-- CREI · Amplía Eventos importantes a cinco recordatorios Push.
-- Migración aditiva: no elimina eventos, participantes, dispositivos ni avisos enviados.

begin;

alter table public.eventos_importantes_recordatorios
  drop constraint if exists eventos_importantes_recordatorios_minutes_before_check;

alter table public.eventos_importantes_recordatorios
  add constraint eventos_importantes_recordatorios_minutes_before_check
  check (minutes_before in (1440, 60, 30, 15, 5)) not valid;

alter table public.eventos_importantes_recordatorios
  validate constraint eventos_importantes_recordatorios_minutes_before_check;

insert into public.eventos_importantes_recordatorios as target (
  evento_importante_id,
  usuario_id,
  minutes_before,
  scheduled_for,
  status,
  attempts,
  claimed_at,
  sent_at,
  last_error,
  updated_at
)
select
  event.id,
  participant.usuario_id,
  reminder.minutes_before,
  event.start_at - make_interval(mins => reminder.minutes_before),
  'pending',
  0,
  null,
  null,
  null,
  now()
from public.eventos_importantes as event
join public.eventos_importantes_participantes as participant
  on participant.evento_importante_id = event.id
cross join (values (1440), (60), (30), (15), (5)) as reminder(minutes_before)
where event.status = 'active'
  and event.start_at > now()
  and event.start_at - make_interval(mins => reminder.minutes_before) > now()
on conflict (evento_importante_id, usuario_id, minutes_before)
do update set
  scheduled_for = excluded.scheduled_for,
  status = case
    when target.status = 'sent' and target.last_error is null then 'sent'
    else 'pending'
  end,
  attempts = case
    when target.status = 'sent' and target.last_error is null then target.attempts
    else 0
  end,
  claimed_at = null,
  sent_at = case
    when target.status = 'sent' and target.last_error is null then target.sent_at
    else null
  end,
  last_error = null,
  updated_at = now();

commit;
