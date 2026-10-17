-- Retira la dirección física de los registros históricos de valoración.
-- Las citas conservan su modalidad sin almacenar el domicilio del consultorio.

update public.citas_valoracion
set ubicacion = 'Presencial'
where modalidad = 'presencial'
  and ubicacion is distinct from 'Presencial';
