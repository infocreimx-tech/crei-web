-- Asigna al usuario ADMIN el nivel máximo de permisos del portal.

update public.usuarios
set role = 'superadmin'
where lower(btrim(username)) = 'admin'
  and role is distinct from 'superadmin';
