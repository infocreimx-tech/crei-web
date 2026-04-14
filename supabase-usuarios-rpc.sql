-- ══════════════════════════════════════════════════════════════════
-- CREI · Funciones RPC corregidas para gestión de usuarios
-- Ejecutar en Supabase → SQL Editor  (sustituye las anteriores)
-- ══════════════════════════════════════════════════════════════════

-- 1. LISTAR usuarios (sin columna created_at que puede no existir)
CREATE OR REPLACE FUNCTION list_usuarios()
RETURNS TABLE(
  id INTEGER,
  username TEXT,
  role TEXT,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
    SELECT u.id, u.username, u.role, u.is_active
    FROM usuarios u
    ORDER BY u.id ASC;
END;
$$;

-- 2. CREAR usuario
CREATE OR REPLACE FUNCTION create_usuario(
  p_username TEXT,
  p_password_hash TEXT,
  p_role TEXT,
  p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id INTEGER;
BEGIN
  INSERT INTO usuarios (username, password_hash, role, is_active)
  VALUES (p_username, p_password_hash, p_role, p_is_active)
  RETURNING id INTO new_id;

  RETURN json_build_object('success', true, 'id', new_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 3. ACTUALIZAR usuario
CREATE OR REPLACE FUNCTION update_usuario(
  p_id INTEGER,
  p_password_hash TEXT DEFAULT NULL,
  p_role TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE usuarios SET
    password_hash = COALESCE(p_password_hash, password_hash),
    role          = COALESCE(p_role, role),
    is_active     = COALESCE(p_is_active, is_active)
  WHERE id = p_id;

  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 4. ELIMINAR usuario
CREATE OR REPLACE FUNCTION delete_usuario(p_id INTEGER)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM usuarios WHERE id = p_id;
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Permisos para la clave anon
GRANT EXECUTE ON FUNCTION list_usuarios   TO anon;
GRANT EXECUTE ON FUNCTION create_usuario  TO anon;
GRANT EXECUTE ON FUNCTION update_usuario  TO anon;
GRANT EXECUTE ON FUNCTION delete_usuario  TO anon;
