CREATE OR REPLACE FUNCTION public.check_email_exists(correo text)
RETURNS boolean AS $$
DECLARE
  exists_flag boolean;
BEGIN
  -- Permite verificar si el correo existe en la tabla (ignorando RLS porque es SECURITY DEFINER)
  SELECT EXISTS(SELECT 1 FROM public.perfiles_pacientes WHERE email = correo) INTO exists_flag;
  RETURN exists_flag;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
