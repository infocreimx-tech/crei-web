-- ══════════════════════════════════════════════════════════════════
-- CREI · Función RPC para inicio de sesión (SHA-256)
-- ══════════════════════════════════════════════════════════════════

-- Habilitar pgcrypto si no está habilitado
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION login_user(p_username TEXT, p_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
    v_password_hash TEXT;
BEGIN
    -- Hashear la contraseña recibida para comparar
    v_password_hash := encode(digest(p_password, 'sha256'), 'hex');

    SELECT id, username, role, is_active
    INTO user_record
    FROM usuarios
    WHERE (LOWER(username) = LOWER(p_username)) 
      AND (password_hash = v_password_hash);

    IF user_record.id IS NOT NULL THEN
        IF NOT user_record.is_active THEN
            RETURN json_build_object('success', false, 'error', 'Cuenta inactiva');
        END IF;
        
        RETURN json_build_object(
            'success', true, 
            'user', json_build_object(
                'id', user_record.id, 
                'username', user_record.username, 
                'role', user_record.role
            )
        );
    ELSE
        RETURN json_build_object('success', false, 'error', 'Usuario o contraseña incorrectos');
    END IF;
END;
$$;

-- Permisos
GRANT EXECUTE ON FUNCTION login_user TO anon;
GRANT EXECUTE ON FUNCTION login_user TO authenticated;
