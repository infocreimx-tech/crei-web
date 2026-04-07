-- ==============================================================================
-- 1. Tabla de perfiles_pacientes (portal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.perfiles_pacientes (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT,
    apellidos TEXT,
    telefono TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.perfiles_pacientes ENABLE ROW LEVEL SECURITY;

-- Leer: Cada paciente puede ver en la BD solo sus propios datos
CREATE POLICY "Pacientes pueden leer su propio perfil" 
ON public.perfiles_pacientes 
FOR SELECT 
USING (auth.uid() = id);

-- Actualizar: Cada paciente puede cambiar sus datos si lo requiere
CREATE POLICY "Pacientes pueden actualizar su propio perfil" 
ON public.perfiles_pacientes 
FOR UPDATE 
USING (auth.uid() = id);

-- ==============================================================================
-- 3. Trigger para crear automáticamente el perfil tras el registro
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_perfil() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles_pacientes (id, email, nombre, apellidos, telefono)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'nombre', 
    new.raw_user_meta_data->>'apellidos',
    new.raw_user_meta_data->>'telefono'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_perfil();
