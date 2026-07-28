-- Promueve de forma idempotente a Paulina como administradora del portal.

update public.usuarios
set role = 'admin'
where lower(btrim(username)) = 'paulina'
  and role is distinct from 'admin';
